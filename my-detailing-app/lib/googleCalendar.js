import { google } from "googleapis";
import { createPrivateKey } from "crypto";

// Netlify (and most serverless hosts) mangle multi-line env vars in a few
// different ways depending on how they were pasted into the dashboard:
//   - wrapped in literal quotes ("-----BEGIN...")
//   - real backslash-n escapes ("\n") that never got converted to newlines
//   - double-escaped backslashes ("\\n") from copy/pasting an already-escaped
//     value
//   - stray \r from a Windows clipboard paste
// Feeding any of these straight into OpenSSL's PEM decoder produces
// `error:1E08010C:DECODER routines::unsupported` — it never says "bad
// newlines", so this normalizes every variant before the key reaches
// google.auth.JWT.
// Logs shape metadata only — never the base64 key body — so a bad value
// can be diagnosed from function logs without exposing the secret.
function logKeyShape(label, key) {
  const lines = key.split("\n");
  console.log(
    `[googleCalendar] ${label}: length=${key.length} lines=${lines.length} ` +
      `literalEscapes=${(key.match(/\\n/g) || []).length} ` +
      `realNewlines=${(key.match(/\n/g) || []).length} ` +
      `carriageReturns=${(key.match(/\r/g) || []).length} ` +
      `startsWithQuote=${key[0] === '"' || key[0] === "'"} ` +
      `head="${key.slice(0, 27)}" tail="${key.slice(-25)}" ` +
      `lineLengths=[${lines.map((l) => l.length).join(",")}]`
  );
}

function normalizePrivateKey(rawKey) {
  let key = (rawKey || "").trim();
  logKeyShape("raw env value", key);

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  key = key
    .replace(/\\\\n/g, "\\n") // double-escaped -> single-escaped
    .replace(/\\n/g, "\n") // escaped -> real newline
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Rebuild the PEM from scratch rather than trusting whatever internal line
  // breaks survived the env var round-trip: Netlify's dashboard has been
  // observed splicing spurious blank lines into multi-line values (and even
  // splitting a line mid-base64), which OpenSSL's PEM decoder rejects with
  // the same opaque DECODER error even though every base64 character is
  // still intact. Base64 doesn't care about line length, so stripping all
  // whitespace from the body and re-wrapping at 64 chars is always safe.
  const match = key.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
  if (!match) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY is missing PEM BEGIN/END markers after normalization — " +
        "check the value in your environment variables (see lib/googleCalendar.js for the expected format)."
    );
  }
  const body = match[1].replace(/\s+/g, "");
  const rewrapped = body.match(/.{1,64}/g).join("\n");
  key = `-----BEGIN PRIVATE KEY-----\n${rewrapped}\n-----END PRIVATE KEY-----\n`;

  logKeyShape("normalized key", key);

  try {
    createPrivateKey(key);
  } catch (err) {
    throw new Error(
      `GOOGLE_PRIVATE_KEY normalized but is not a valid PEM key (${err.message}). ` +
        "The key body itself is likely corrupted (truncated, extra whitespace injected " +
        "per line, or wrong key type) — re-copy private_key fresh from the service " +
        "account's downloaded JSON and reset the Netlify env var."
    );
  }

  return key;
}

// Single Service Account client shared by /api/slots (freebusy reads) and
// /api/verify (event writes on confirmation) — one scope covers both.
export function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}
