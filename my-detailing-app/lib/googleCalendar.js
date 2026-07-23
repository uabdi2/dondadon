import { google } from "googleapis";

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
function normalizePrivateKey(rawKey) {
  let key = (rawKey || "").trim();

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

  if (!key.includes("BEGIN PRIVATE KEY") || !key.includes("END PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY is missing PEM BEGIN/END markers after normalization — " +
        "check the value in your environment variables (see lib/googleCalendar.js for the expected format)."
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
