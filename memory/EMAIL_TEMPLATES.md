# Email Templates — Imkindo

_These are the exact texts to use when the Resend/SendGrid integration is wired in._

## Config
- **Public inbound:** connect@imkindo.com (forwards to mark@imkindo.com)
- **Sender (From):** Imkindo <connect@imkindo.com>
- **Reply-To:** connect@imkindo.com
- **Domain to verify with provider:** imkindo.com (SPF / DKIM / DMARC)

---

## 1. Internal notification email (to connect@imkindo.com on every submission)

**Subject:**
```
New Imkindo Enquiry: {interested_in}
```

**Body (plain-text or minimal HTML):**
```
New enquiry received via imkindo.com

Name:                  {name}
Company:               {company}
Position:              {position}
Email:                 {email}
Phone:                 {phone}
Country:               {country}

Interested In:         {interested_in}
Organisation Type:     {organisation_type}

Potential Venture Opportunity: {potential_venture_opportunity}   ← INTERNAL FLAG

Message:
{message}

Submitted: {submitted_at}  (UTC)
Record ID: {id}
```

The `Potential Venture Opportunity` line only appears on internal emails.
It is NEVER sent to the visitor.

---

## 2. Visitor auto-confirmation email (to the enquirer's email)

**Subject:**
```
Thanks for connecting with Imkindo
```

**Body:**
```
Thank you for reaching out to Imkindo.

We believe the greatest opportunities with artificial intelligence come
from combining new technology with real-world experience, industry
knowledge and clear commercial objectives.

Your message has been received and will be personally reviewed.

If there is an opportunity where we believe Imkindo can add value,
we'll be in touch to continue the conversation.

Best regards,

Mark Trounce
Founder
Imkindo

Human insight. Artificial intelligence. Commercial impact.
```

**Optional signature block for HTML version:**
- imk. logo (white on dark)
- Founder name in Cabinet Grotesk
- Tagline in JetBrains Mono uppercase overline

---

## Delivery rules

1. Send BOTH emails asynchronously — do not block the API response on delivery
2. On email failure: log server-side, still return 201 to the visitor (the DB record is the source of truth)
3. Rate-limit /api/enquiries to prevent abuse (e.g. 5/min per IP)
