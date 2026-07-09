from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import ssl
import time
import smtplib
import logging
from collections import deque
from threading import Lock
from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Deque, Dict
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging early so route handlers can safely reference `logger`.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Imkindo API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    company: Optional[str] = Field(default="", max_length=200)
    position: Optional[str] = Field(default="", max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=50)
    country: Optional[str] = Field(default="", max_length=100)
    interested_in: str = Field(..., max_length=200)
    organisation_type: str = Field(..., max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    # Honeypot — hidden in the UI, never visible to humans. If any bot fills it in,
    # we silently accept the request without persisting or emailing.
    website: Optional[str] = Field(default="", max_length=500)


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str = ""
    position: str = ""
    email: str
    phone: str = ""
    country: str = ""
    interested_in: str
    organisation_type: str
    message: str
    # Internal classification — flags enquiries that may align with future Imkindo ventures.
    # Not exposed in the UI. Used for reporting / opportunity tracking only.
    potential_venture_opportunity: bool = False
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Interest categories that suggest an alignment with an in-development Imkindo venture.
VENTURE_OPPORTUNITY_INTERESTS = {
    "Bespoke AI Project",
    "Strategic Partnership",
}


def _is_venture_opportunity(interested_in: str) -> bool:
    return (interested_in or "").strip() in VENTURE_OPPORTUNITY_INTERESTS


# ---------- Rate limiting (in-memory sliding window) ----------
# Single-process uvicorn worker, so an in-memory bucket is sufficient. If we ever
# scale to multiple workers this should move to Redis.
RATE_LIMIT_MAX = 5           # max submissions
RATE_LIMIT_WINDOW = 60.0     # per 60 seconds
_rate_bucket: Dict[str, Deque[float]] = {}
_rate_lock = Lock()


def _client_ip(request: Request) -> str:
    """Best-effort real client IP (respects the Kubernetes ingress X-Forwarded-For)."""
    xff = request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limit_ok(ip: str) -> bool:
    now = time.monotonic()
    with _rate_lock:
        dq = _rate_bucket.setdefault(ip, deque())
        while dq and now - dq[0] > RATE_LIMIT_WINDOW:
            dq.popleft()
        if len(dq) >= RATE_LIMIT_MAX:
            return False
        dq.append(now)
        return True


# ---------- Email (SMTP) ----------
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465") or 465)
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM_NAME = os.environ.get("SMTP_FROM_NAME", "Imkindo")
ENQUIRY_NOTIFY_TO = os.environ.get("ENQUIRY_NOTIFY_TO", SMTP_USER)


def _send_email(to_addr: str, subject: str, body: str, reply_to: Optional[str] = None) -> None:
    """Send a plain-text email via Hostinger SMTP (SSL). Synchronous — must be called
    from a BackgroundTask so it does not block the API response."""
    if not (SMTP_HOST and SMTP_USER and SMTP_PASSWORD and to_addr):
        logger.warning("SMTP not configured — skipping email to %s", to_addr)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((SMTP_FROM_NAME, SMTP_USER))
    msg["To"] = to_addr
    if reply_to:
        msg["Reply-To"] = reply_to
    msg["Message-ID"] = make_msgid(domain="imkindo.com")
    msg.set_content(body)

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=20) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Email sent to %s (subject=%s)", to_addr, subject)
    except Exception:
        logger.exception("Failed to send email to %s", to_addr)


def _send_enquiry_emails(enquiry: "Enquiry") -> None:
    """Send both the internal notification and the visitor auto-reply."""
    submitted_str = enquiry.submitted_at.strftime("%Y-%m-%d %H:%M:%S UTC") \
        if isinstance(enquiry.submitted_at, datetime) else str(enquiry.submitted_at)

    # 1. Internal notification
    internal_subject = f"New Imkindo Enquiry: {enquiry.interested_in}"
    internal_body = (
        "New enquiry received via imkindo.com\n\n"
        f"Name:                  {enquiry.name}\n"
        f"Company:               {enquiry.company or '-'}\n"
        f"Position:              {enquiry.position or '-'}\n"
        f"Email:                 {enquiry.email}\n"
        f"Phone:                 {enquiry.phone or '-'}\n"
        f"Country:               {enquiry.country or '-'}\n\n"
        f"Interested In:         {enquiry.interested_in}\n"
        f"Organisation Type:     {enquiry.organisation_type}\n\n"
        f"Potential Venture Opportunity: {enquiry.potential_venture_opportunity}   <-- INTERNAL FLAG\n\n"
        "Message:\n"
        f"{enquiry.message}\n\n"
        f"Submitted: {submitted_str}\n"
        f"Record ID: {enquiry.id}\n"
    )
    _send_email(
        to_addr=ENQUIRY_NOTIFY_TO,
        subject=internal_subject,
        body=internal_body,
        reply_to=enquiry.email,
    )

    # 2. Visitor auto-confirmation
    visitor_subject = "Thanks for connecting with Imkindo"
    visitor_body = (
        "Thank you for reaching out to Imkindo.\n\n"
        "We believe the greatest opportunities with artificial intelligence come\n"
        "from combining new technology with real-world experience, industry\n"
        "knowledge and clear commercial objectives.\n\n"
        "Your message has been received and will be personally reviewed.\n\n"
        "If there is an opportunity where we believe Imkindo can add value,\n"
        "we'll be in touch to continue the conversation.\n\n"
        "Best regards,\n\n"
        "Mark Trounce\n"
        "Founder\n"
        "Imkindo\n\n"
        "Human insight. Artificial intelligence. Commercial impact.\n"
    )
    _send_email(
        to_addr=enquiry.email,
        subject=visitor_subject,
        body=visitor_body,
        reply_to=SMTP_USER,
    )


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Imkindo API — Applied Intelligence"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    request: Request,
):
    ip = _client_ip(request)

    # 1. Honeypot — bots fill every field, humans never see this one.
    #    Silently return a plausible-looking 201 without persisting or emailing.
    if (payload.website or "").strip():
        logger.warning("Honeypot triggered from %s (name=%r)", ip, payload.name)
        return Enquiry(
            **payload.model_dump(exclude={"website"}),
            potential_venture_opportunity=False,
        )

    # 2. Per-IP rate limit — 5 real submissions per minute.
    if not _rate_limit_ok(ip):
        logger.warning("Rate limit hit for %s", ip)
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again in a minute.",
        )

    enquiry = Enquiry(
        **payload.model_dump(exclude={"website"}),
        potential_venture_opportunity=_is_venture_opportunity(payload.interested_in),
    )
    doc = enquiry.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    try:
        await db.enquiries.insert_one(doc)
    except Exception as exc:
        logger.exception("Failed to persist enquiry")
        raise HTTPException(status_code=500, detail="Unable to save enquiry") from exc

    # Fire-and-forget email delivery (does not block the API response;
    # DB record is the source of truth if SMTP fails).
    background_tasks.add_task(_send_enquiry_emails, enquiry)

    return enquiry


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(limit: int = 100):
    limit = max(1, min(limit, 500))
    docs = await db.enquiries.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get('submitted_at'), str):
            d['submitted_at'] = datetime.fromisoformat(d['submitted_at'])
    return docs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
