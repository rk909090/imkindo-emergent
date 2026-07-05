from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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
async def create_enquiry(payload: EnquiryCreate):
    enquiry = Enquiry(**payload.model_dump())
    doc = enquiry.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    try:
        await db.enquiries.insert_one(doc)
    except Exception as exc:
        logger.exception("Failed to persist enquiry")
        raise HTTPException(status_code=500, detail="Unable to save enquiry") from exc
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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
