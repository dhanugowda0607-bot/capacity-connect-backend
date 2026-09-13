# Capacity Connect — Frontend

React + Tailwind frontend for **Capacity Connect**, the MoES/IMD digital
capacity-building & LMS portal — built to match the stack and phase order in
the team's build guide (Part 2/3).

## Stack

- React 18 + Vite
- React Router v6 (role-based routing / RBAC)
- Tailwind CSS
- Recharts (Admin enrollment trend chart)

## Run it in VS Code

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Demo logins (no backend needed yet)

The app currently runs on mock data in `src/data/mockData.js` and a mock auth
context in `src/context/AuthContext.jsx`, so you can click through all three
roles before the Express/Postgres backend exists.

| Role    | Email             | Password  |
|---------|-------------------|-----------|
| Trainee | trainee@demo.in   | demo1234  |
| Trainer | trainer@demo.in   | demo1234  |
| Admin   | admin@demo.in     | demo1234  |

Signing up as a new user always lands you in `pending_verification`
(matches Phase 3 of the build guide) — sign in with one of the demo accounts
above to see an approved dashboard.

## Connecting to the real backend

Everything routes through `src/api/client.js`, which already has one function
per API route named in Part 2/3 of the build guide (`api.login`,
`api.getCourses`, `api.startAttempt`, etc.), pointed at `VITE_API_BASE_URL`
(defaults to `/api`, proxied to `http://localhost:5000` in `vite.config.js`
for local dev). As each backend phase is built:

1. Set `USE_MOCK = false` at the top of `src/api/client.js`.
2. Swap the relevant page's mock-data import for the matching `api.*` call.
3. Swap `AuthContext`'s mock login/signup for real calls to
   `api.login` / `api.signup`, and store the real JWT instead of the
   base64 mock token.

No page needs to change shape — only where its data comes from.

## Project structure

```
src/
  api/client.js          one function per backend route (Phases 1–11)
  context/AuthContext.jsx   mock auth + role, swap for real JWT later
  components/             DashboardShell (sidebar shell), ProtectedRoute (RBAC), StatCard, Pill
  data/mockData.js         seed data for demo-ability before the backend exists
  pages/
    Home.jsx                public landing page + homepage announcements
    auth/                   Login, Signup (2-step: details -> document upload)
    trainee/                dashboard, profile, courses, course detail, quiz, certificates
    trainer/                dashboard, profile, manage courses, question bank, library
    admin/                  dashboard + chart, verification queue, competency map, announcements
```

## Notes on how this maps to the problem statement

- **RBAC**: `ProtectedRoute` blocks a trainee from typing `/admin` directly in
  the URL bar — matches the Phase 2 checkpoint in the build guide.
- **Document verification**: Signup collects documents and always sets status
  to `pending_verification`; the Admin Verification Queue page shows OCR
  mismatch flags and Approve / Reject / Request re-upload actions — this is
  UI only, the real OCR/checksum logic (Tesseract.js, Verhoeff algorithm)
  belongs in the backend per Phase 3.
- **Quiz security**: `pages/trainee/Quiz.jsx` shuffles questions client-side
  *only* for demo purposes and says so in a comment — the real build must do
  random selection, shuffling, and grading entirely on the backend so a
  trainee can never see correct answers in dev tools (Phase 7).
- **Competency mapping**: `pages/admin/CompetencyMap.jsx` renders the
  subject × trainer coverage table described in Phase 10.
