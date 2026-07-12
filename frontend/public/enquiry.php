<?php
/**
 * Imkindo enquiry endpoint — Hostinger (Cloud Professional, PHP).
 *
 * Same behaviour as the FastAPI backend used on Emergent preview:
 *   - Accepts JSON POST from the React contact form
 *   - Honeypot: silently returns 201 if the hidden `website` field is filled
 *   - Rate limit: 5 submissions / 60s / IP (file-based sliding window)
 *   - Sends TWO emails via smtp.hostinger.com:465 (SSL) using PHPMailer:
 *       (1) internal notification -> mark@imkindo.com  (Reply-To = visitor)
 *       (2) auto-confirmation      -> visitor           (Reply-To = mark@imkindo.com)
 *
 * The DB storage layer from the Python backend is intentionally not replicated here;
 * on Hostinger the email itself is the record of truth (Mark's inbox = the log).
 */

declare(strict_types=1);

/* ------------------------------------------------------------------ */
/* Config — SMTP credentials for mark@imkindo.com on Hostinger        */
/* ------------------------------------------------------------------ */
/*
 * PRODUCTION (Hostinger, recommended):
 *   Upload `imkindo-config.php` to `~/domains/imkindo.com/` (one level
 *   ABOVE `public_html/`) — that folder is never served over HTTP.
 *   See /app/HOSTINGER_DEPLOY.md for the exact template + steps.
 *
 * FALLBACK (local dev only):
 *   The hardcoded constants below are used if no config file is found.
 *   Never commit real production credentials here.
 */
$__imk_cfg_candidates = [];
if (!empty($_SERVER['DOCUMENT_ROOT'])) {
    $__imk_cfg_candidates[] = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/../imkindo-config.php';
}
$__imk_cfg_candidates[] = __DIR__ . '/../imkindo-config.php';

$__imk_cfg = [];
foreach ($__imk_cfg_candidates as $__p) {
    if (is_readable($__p)) {
        /** @var array $__imk_cfg */
        $__imk_cfg = require $__p;
        if (!is_array($__imk_cfg)) { $__imk_cfg = []; }
        break;
    }
}

define('SMTP_HOST',         $__imk_cfg['smtp_host']       ?? 'smtp.hostinger.com');
define('SMTP_PORT',         (int) ($__imk_cfg['smtp_port'] ?? 465));
define('SMTP_USER',         $__imk_cfg['smtp_user']       ?? '');
define('SMTP_PASSWORD',     $__imk_cfg['smtp_password']   ?? '');
define('SMTP_FROM_NAME',    $__imk_cfg['from_name']       ?? 'Imkindo');
define('ENQUIRY_NOTIFY_TO', $__imk_cfg['notify_to']       ?? '');

/* Interest categories that suggest an alignment with an in-development Imkindo venture. */
const VENTURE_OPPORTUNITY_INTERESTS = [
    'Bespoke AI Project',
    'Strategic Partnership',
];

/* Rate limit */
const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 60; // seconds

/* ------------------------------------------------------------------ */
/* Bootstrap                                                          */
/* ------------------------------------------------------------------ */
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';
require __DIR__ . '/lib/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* Only POST is allowed. */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['detail' => 'Method not allowed']);
    exit;
}

/* ------------------------------------------------------------------ */
/* Parse payload                                                      */
/* ------------------------------------------------------------------ */
$raw = file_get_contents('php://input') ?: '';
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    // Fall back to standard form-encoded POST (in case React changes strategy).
    $payload = $_POST;
}

function field(array $p, string $k, int $max = 5000): string
{
    $v = isset($p[$k]) ? (string) $p[$k] : '';
    $v = trim($v);
    if (function_exists('mb_strlen')) {
        if (mb_strlen($v) > $max) {
            $v = mb_substr($v, 0, $max);
        }
    } else {
        if (strlen($v) > $max) {
            $v = substr($v, 0, $max);
        }
    }
    return $v;
}

$name             = field($payload, 'name', 200);
$company          = field($payload, 'company', 200);
$position         = field($payload, 'position', 200);
$email            = field($payload, 'email', 200);
$phone            = field($payload, 'phone', 50);
$country          = field($payload, 'country', 100);
$interested_in    = field($payload, 'interested_in', 200);
$organisation_type = field($payload, 'organisation_type', 200);
$message          = field($payload, 'message', 5000);
$honeypot         = field($payload, 'website', 500);

/* ------------------------------------------------------------------ */
/* Honeypot — silently accept and drop                                */
/* ------------------------------------------------------------------ */
if ($honeypot !== '') {
    error_log(sprintf('[imkindo] Honeypot triggered from %s (name=%s)', client_ip(), $name));
    http_response_code(201);
    echo json_encode([
        'id'   => bin2hex(random_bytes(8)),
        'name' => $name,
        'ok'   => true,
    ]);
    exit;
}

/* ------------------------------------------------------------------ */
/* Validation                                                         */
/* ------------------------------------------------------------------ */
$missing = [];
if ($name === '')              { $missing[] = 'name'; }
if ($email === '')             { $missing[] = 'email'; }
if ($interested_in === '')     { $missing[] = 'interested_in'; }
if ($organisation_type === '') { $missing[] = 'organisation_type'; }
if ($message === '')           { $missing[] = 'message'; }
if ($missing) {
    http_response_code(422);
    echo json_encode(['detail' => 'Missing required fields', 'fields' => $missing]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['detail' => 'Invalid email address']);
    exit;
}

/* ------------------------------------------------------------------ */
/* Rate limit — file-based sliding window per client IP               */
/* ------------------------------------------------------------------ */
$ip = client_ip();
if (!rate_limit_ok($ip)) {
    error_log(sprintf('[imkindo] Rate limit hit for %s', $ip));
    http_response_code(429);
    echo json_encode(['detail' => 'Too many requests. Please try again in a minute.']);
    exit;
}

/* ------------------------------------------------------------------ */
/* Build record + emails                                              */
/* ------------------------------------------------------------------ */
$record_id                    = bin2hex(random_bytes(8));
$potential_venture_opportunity = in_array($interested_in, VENTURE_OPPORTUNITY_INTERESTS, true);
$submitted_at                 = gmdate('Y-m-d H:i:s') . ' UTC';

$internal_subject = "New Imkindo Enquiry: {$interested_in}";
$internal_body = implode("\n", [
    "New enquiry received via imkindo.com",
    "",
    "Name:                  {$name}",
    "Company:               " . ($company !== '' ? $company : '-'),
    "Position:              " . ($position !== '' ? $position : '-'),
    "Email:                 {$email}",
    "Phone:                 " . ($phone !== '' ? $phone : '-'),
    "Country:               " . ($country !== '' ? $country : '-'),
    "",
    "Interested In:         {$interested_in}",
    "Organisation Type:     {$organisation_type}",
    "",
    "Potential Venture Opportunity: " . ($potential_venture_opportunity ? 'True' : 'False') . '   <-- INTERNAL FLAG',
    "",
    "Message:",
    $message,
    "",
    "Submitted: {$submitted_at}",
    "Record ID: {$record_id}",
]);

$visitor_subject = 'Thanks for connecting with Imkindo';
$visitor_body = implode("\n", [
    'Thank you for reaching out to Imkindo.',
    '',
    'We believe the greatest opportunities with artificial intelligence come',
    'from combining new technology with real-world experience, industry',
    'knowledge and clear commercial objectives.',
    '',
    'Your message has been received and will be personally reviewed.',
    '',
    'If there is an opportunity where we believe Imkindo can add value,',
    "we'll be in touch to continue the conversation.",
    '',
    'Best regards,',
    '',
    'Mark Trounce',
    'Founder',
    'Imkindo',
    '',
    'Human insight. Artificial intelligence. Commercial impact.',
]);

$internal_ok = send_email(ENQUIRY_NOTIFY_TO, $internal_subject, $internal_body, $email);
$visitor_ok  = send_email($email, $visitor_subject, $visitor_body, SMTP_USER);

if (!$internal_ok) {
    // Internal delivery is critical; if it fails, tell the client so they know something is up.
    // (Auto-reply failure is silent — visitor already has their success state on the form.)
    http_response_code(502);
    echo json_encode(['detail' => 'Unable to send enquiry. Please email mark@imkindo.com directly.']);
    exit;
}

http_response_code(201);
echo json_encode([
    'id'                            => $record_id,
    'name'                          => $name,
    'email'                         => $email,
    'interested_in'                 => $interested_in,
    'organisation_type'             => $organisation_type,
    'potential_venture_opportunity' => $potential_venture_opportunity,
    'submitted_at'                  => gmdate('c'),
]);
exit;

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

function client_ip(): string
{
    // Hostinger's Cloud plans sit behind an edge proxy, so honour X-Forwarded-For.
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $first = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
        if ($first !== '') { return $first; }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limit_ok(string $ip): bool
{
    $dir = sys_get_temp_dir() . '/imkindo-rl';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    $file = $dir . '/' . sha1($ip) . '.json';

    $now = microtime(true);
    $fp  = @fopen($file, 'c+');
    if (!$fp) { return true; } // If FS is unwritable, don't block real users.

    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return true;
    }

    $contents = stream_get_contents($fp);
    $times    = $contents ? (json_decode($contents, true) ?: []) : [];
    if (!is_array($times)) { $times = []; }

    $times = array_values(array_filter($times, fn($t) => is_numeric($t) && ($now - $t) <= RATE_LIMIT_WINDOW));

    if (count($times) >= RATE_LIMIT_MAX) {
        flock($fp, LOCK_UN);
        fclose($fp);
        return false;
    }

    $times[] = $now;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($times));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

function send_email(string $to, string $subject, string $body, ?string $replyTo = null): bool
{
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // implicit SSL on 465
        $mail->Port       = SMTP_PORT;
        $mail->Timeout    = 20;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
        $mail->addAddress($to);
        if ($replyTo) { $mail->addReplyTo($replyTo); }

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        error_log(sprintf('[imkindo] Email sent to %s (subject=%s)', $to, $subject));
        return true;
    } catch (PHPMailerException $e) {
        error_log(sprintf('[imkindo] Email FAILED to %s: %s', $to, $mail->ErrorInfo));
        return false;
    } catch (\Throwable $e) {
        error_log(sprintf('[imkindo] Email FAILED to %s: %s', $to, $e->getMessage()));
        return false;
    }
}
