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
- `.htaccess`                          — denies HTTP access to `imkindo-config.php`
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

SMTP credentials live in a private file **`imkindo-config.php` inside `public_html/`**
(same folder as `enquiry.php`). Direct HTTP access to that file is blocked by
**two independent layers**:

1. **`.htaccess` deny rule** — Apache issues a `403 Forbidden` before PHP even runs.
2. **`IMK_INTERNAL` PHP guard** — even if `.htaccess` is bypassed, the config file's
   own `if (!defined('IMK_INTERNAL')) exit;` returns 403 before any credentials are
   readable.

### One-time upload (do this after the first deploy)

1. Take a copy of `/app/imkindo-config.php.example` from this repo.
2. Rename it to `imkindo-config.php`.
3. Using Hostinger File Manager or SFTP, upload it to:
   ```
   public_html/imkindo-config.php
   ```
   (same folder as `enquiry.php`)
4. Verify permissions are `600` or `640` — Hostinger's File Manager usually sets
   sane defaults automatically.

To rotate the SMTP password later, edit `imkindo-config.php` in the File Manager. No
redeploy needed.

If the config file is missing, `enquiry.php` will return `502 Unable to send enquiry`
and log a clear `[imkindo] Email FAILED` line — so you'll know immediately.

### Verifying the config file is protected

After upload, from any browser:
```
https://www.imkindo.com/imkindo-config.php
```
Must return **`403 Forbidden`**. If you see the credentials or a blank page, stop —
the guard or `.htaccess` isn't loading. Ping me and we'll debug.

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
