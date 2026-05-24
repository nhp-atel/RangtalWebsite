// ── Member access config (Google sign-in + approved emails) ───────────────
//
// SETUP (one-time):
// 1. Create an OAuth Client ID:
//    https://console.cloud.google.com/apis/credentials → "Create credentials"
//    → "OAuth client ID" → Application type: "Web application".
//    Under "Authorized JavaScript origins" add every origin the site runs on,
//    e.g.  http://localhost:5180   and   https://rangtaal.com
//    Copy the generated Client ID and paste it below.
//
// 2. Put each PAID member's Google email (lowercase) in ALLOWED_EMAILS.
//
// 3. In Google Drive, share the recordings/photos folder with those SAME
//    emails ("Restricted" sharing), then paste the folder link as MEMBER_DRIVE_URL.
//    (This is the real lock — even if someone bypasses the email check on the
//     site, Drive still refuses any account the folder isn't shared with.)
//
// Until the Client ID is filled in, the login simply shows a "coming soon" note.

export const GOOGLE_CLIENT_ID = 'REPLACE_WITH_GOOGLE_CLIENT_ID.apps.googleusercontent.com'

export const MEMBER_DRIVE_URL = 'https://drive.google.com/drive/folders/REPLACE_WITH_FOLDER_ID'

export const ALLOWED_EMAILS = [
  // 'asha@example.com',
  // 'eshaan@example.com',
]

export const isMemberAccessConfigured = () =>
  !!GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('REPLACE')

export const isEmailAllowed = (email) =>
  !!email && ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase())
