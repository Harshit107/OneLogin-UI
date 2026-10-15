# OneLogin UI (Single Sign-On Frontend)

Modern React + TypeScript frontend for the OneLogin Identity Provider & OAuth 2.0 Authorization Server. Built with **UI UX Pro Max** design standards (dark glassmorphism, Bento grid architecture, responsive layouts, and micro-interactions).

---

## 🚀 Key Features

- **Single Source of Truth Environment Switcher**: Instant reactive toggle between `Development` (`http://localhost:5000`) and `Production` with live persistent state.
- **Strict Code-Splitting**: All top-level routes are lazily loaded with `React.lazy` and `Suspense`.
- **End-User Portal (`/`)**:
  - Email & Password Login / Registration with strength validation.
  - WhatsApp-style QR Code Companion login with 2-minute countdown timer ring and automatic polling.
- **Security & Session Center (`/profile`)**:
  - Profile details & Email verification trigger.
  - Active device sessions list with 3-tier logout (current, other devices, nuclear everywhere).
- **Admin Console (`/admin`)**:
  - Protected with `x-admin-secret`.
  - OAuth 2.0 Client application registration with one-time `client_secret` copy modal.
  - Instant token revocation & blacklist manager (`POST /oauth/revoke-token`).
- **Developer Projects Hub (`/developer/projects`)**:
  - Register new applications in the native MongoDB database.
  - Retrieve and copy API credentials.
  - Live toggles for Maintenance Mode and Email Verification requirement.
- **Interactive OAuth 2.0 Consent Screen (`/oauth/authorize`)**:
  - Handles client authorization requests, displays requested scopes, and prompts user consent.
- **OAuth Testing Sandbox (`/playground`)**:
  - Interactive simulator for Authorization Code exchange with PKCE verification (`code_verifier`).
  - Refresh token renewal simulation.
  - UserInfo inspector (`GET /oauth/userinfo`).

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Run production build
npm run build
```
