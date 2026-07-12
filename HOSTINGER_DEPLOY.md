# Hostinger Deployment — Contact Form Setup

## Architecture on Hostinger (Cloud Professional)

The React frontend is built with CRA and deployed to Hostinger via the git-based CI shown
in your config screen (Root: `frontend`, Build: `yarn run build`, Output: `build`).

The contact form submits to a **same-origin PHP endpoint** (`/enquiry.php`) that runs
directly on Hostinger's Cloud PHP stack. No FastAPI backend, no external services.

```
Browser  →  https://imkindo.com/enquiry.php   (PHPMailer + smtp.hostinger.com:465)
                                              →  mark@imkindo.com          (internal)
                                              →  visitor email address     (auto-reply)
```

## Files that get deployed

Anything under `frontend/public/` is copied verbatim into `frontend/build/` by CRA,
so the following files ship to Hostinger automatically on every deploy:

- `enquiry.php`                        — the form handler
- `lib/PHPMailer/PHPMailer.php`        — PHPMailer 6.9.3
- `lib/PHPMailer/SMTP.php`
- `lib/PHPMailer/Exception.php`

## One-time Hostinger config

In Hostinger's git deploy panel → **Variabel Environment**, add:

| Key                            | Value           |
|--------------------------------|-----------------|
| `REACT_APP_ENQUIRY_ENDPOINT`   | `/enquiry.php`  |

That's it. If the env var is NOT set, the React app falls back to the FastAPI backend
URL used in the Emergent preview environment (which is what you want for local dev).

## SMTP credentials

SMTP credentials are **not** hardcoded in the deployed `enquiry.php` file. They live in
a private config file **one level above `public_html/`**, which Apache never serves
over HTTP.

### One-time upload (do this after the first deploy)

1. Copy `/app/imkindo-config.php.example` (in this repo) locally.
2. Rename to `imkindo-config.php`.
3. Using Hostinger File Manager or SFTP, upload it to:
   ```
   ~/domains/imkindo.com/imkindo-config.php
   ```
   That is the parent folder of `public_html/`. **Do not** place it inside
   `public_html/`.
4. Verify permissions are `600` or `640` (owner-readable only) — Hostinger's File
   Manager usually sets sane defaults automatically.

If the config file is missing, `enquiry.php` will return `502 Unable to send enquiry`
and log a clear "Email FAILED" line — so you'll know immediately.

To rotate the password, edit `imkindo-config.php` on the server. No redeploy needed.

## Behaviour parity with the Python backend

| Feature                          | Python (preview) | PHP (production) |
|----------------------------------|------------------|------------------|
| Sends internal email to Mark     | ✅               | ✅               |
| Sends auto-reply to visitor      | ✅               | ✅               |
| Honeypot silent drop             | ✅               | ✅               |
| Rate-limit 5/min/IP → 429        | ✅ (in-memory)   | ✅ (file-based)  |
| `potential_venture_opportunity`  | Stored in Mongo  | Included in email body |
| DB storage                       | MongoDB          | Not applicable — email is the record |

## Testing on Hostinger after first deploy

```bash
curl -X POST https://www.imkindo.com/enquiry.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","interested_in":"Media / Other","organisation_type":"Other","message":"hello"}'
```

Expected: `201` with a JSON body, and two emails delivered (one to Mark, one to you).
