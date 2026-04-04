# Phase 2: Custom Authentication & Email Verification

This Phase 2 implementation plan replaces the deprecated MongoDB Atlas App Services (Realm) with a robust, custom backend authentication system built directly into our Express server.

## User Review Required

> [!WARNING]
> **Email Sending Configuration**
> To use `nodemailer` for sending real verification emails, we will need an SMTP service (e.g., Gmail, SendGrid, Mailgun). For local development, we can configure an [Ethereal](https://ethereal.email/) test account or you can provide credentials in the `.env` file (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). **Please let me know if you have an SMTP provider in mind or if we should use Ethereal for testing.**

> [!IMPORTANT]
> **JWT Secret**
> A new environment variable `JWT_SECRET` will be needed in the backend `.env` file to securely sign JSON Web Tokens.

## Proposed Changes

### Backend Operations

#### 1. Dependencies
We will install necessary packages for the backend:
`npm install jsonwebtoken nodemailer`
*(Note: `bcryptjs` is already installed, and `crypto` is a built-in Node.js module).*

---

#### 2. Models
#### [MODIFY] User.js (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/backend/models/User.js)
Updates to the Mongoose schema:
- Add `verificationToken` (String) to securely store the generated token.
- Add `verificationTokenExpires` (Date) to limit token validity (e.g., 24 hours).
- Remove `realmUserId` since Realm is no longer used.

---

#### 3. Routes & Logic
#### [MODIFY] auth.js (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/backend/routes/auth.js)
We'll significantly refactor the auth routes to handle custom JWT logic and verification:
- **`/login`**:
  - Verify credentials with `bcryptjs`.
  - Check if `user.isVerified` is true. If not, return an error blocking login.
  - Generate a JWT with `jsonwebtoken` (payload: user ID, role, etc.).
  - Return the JWT and sanitized user data to the client.
- **`/register`**:
  - Check validation (age, username/email uniqueness).
  - Hash password with `bcryptjs`.
  - Generate a secure string token using `crypto.randomBytes(32).toString('hex')`.
  - Set `isVerified: false`, save token/expiration and user to DB.
  - Call the email service to send an email with the subject "Confirm your MindBloom signup". The email body will include the link: `http://localhost:<frontend_port>/confirm-email?token=<token>`.
- **`/verify-email`** (New Route):
  - Accept a `token` via POST payload or query param.
  - Find the user with matching `verificationToken` and valid expiration time.
  - Set `isVerified: true`, clear the token fields, and save.

#### [NEW] emailService.js (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/backend/utils/emailService.js)
- A helper file to configure the `nodemailer` transporter and the `sendVerificationEmail(email, token)` function to keep `auth.js` clean.

---

### Frontend Operations

#### 1. Dependencies
We'll uninstall `realm-web` from the frontend since it's no longer needed:
`npm uninstall realm-web`

---

#### 2. Context
#### [MODIFY] AuthContext.jsx (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/frontend/src/context/AuthContext.jsx)
- Adapt the context to hold the new `user` state and the authentication token.
- Functions like `login(user, token)` will store the JWT in `localStorage` and update the global state.
- Include a `logout()` function that clears `localStorage` and resets the user state.

---

#### 3. Pages / Components
#### [MODIFY] Register.jsx (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/frontend/src/pages/Register.jsx)
- Remove any `app.emailPasswordAuth.registerUser()` call.
- Make an HTTP POST request to `http://localhost:5000/api/auth/register` using standard `fetch` (or `axios`).
- Show a success message advising the user to check their email for the verification link.

#### [MODIFY] ConfirmEmail.jsx (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/frontend/src/pages/ConfirmEmail.jsx)
- Parse the `token` from the URL parameters (e.g., `useSearchParams` or standard browser methods).
- On mount/action, make an HTTP POST request to `http://localhost:5000/api/auth/verify-email` with the token.
- Display success or error states accordingly, and provide a button to proceed to Login upon success.

#### [MODIFY] Login.jsx (file:///c:/Users/adity/OneDrive/Desktop/FSDL_FINAL/MindBloom-teen-guidance-portal/frontend/src/pages/Login.jsx)
- Modify form submission to send an HTTP POST request to `http://localhost:5000/api/auth/login`.
- Extract the JWT and user data from the response, passing them into the updated `AuthContext.login` method.
- Catch unverified email errors and inform the user.

## Open Questions

1. **Email Provider:** Should I set up the code using **Ethereal Email** (a catch-all service for testing) out of the box, or do you have real SMTP credentials ready to put into `.env`?
2. **Frontend Port:** Generally Vite runs on port `5173`. I'll use `http://localhost:5173` for the verification link. Does this match your configuration? Let me know if you run the frontend on a different port.

## Verification Plan

### Automated Tests
1. Verify JWT signature generation works correctly.

### Manual Verification
1. Start backend and frontend servers.
2. Open the app, and navigate to `/register`.
3. Create a new user account.
4. Observe the backend console for the Ethereal email test link.
5. Visit the verification link (triggering ConfirmEmail on the frontend).
6. Click verify.
7. Attempt `/login`. It should permit login and store the token locally.
8. Verify checking MongoDB Compass/Atlas that the `isVerified` flag correctly updated to `true` and tokens were cleared for security.
