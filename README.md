# velora-app

Interior services app for Velora. React Native (web) + Vite.

## Setup

```
pnpm install
```

## Dev

```
pnpm dev
```

Runs on `http://localhost:8443` (or whatever `$PORT` is set to).

The dev server proxies `/api/*` requests to the backend (see **Backend** below), so the frontend talks to it same-origin — no CORS issues in the browser.

## Build

```
pnpm build
```

Output goes to `dist/`.

## Stack

- React 19 + react-native-web
- Vite 8
- TypeScript 5.7
- Tailwind CSS v4

## Project layout

```
src/
  api/          API client + typed controllers (auth, bookings, quotations, favorites, uploads, etc.)
  components/   Reusable UI (buttons, cards, inputs, nav, ConfirmModal)
  context/      React contexts (auth, cart)
  navigation/   Custom router (URL-synced, so refresh keeps the current screen)
  screens/      All app screens, incl. Login/Register/VerifyOtp and the StartProject wizard
  theme/        Design tokens
```

## Backend

The app expects the Velora backend (Spring Boot) running at `http://localhost:8080` by default. `vite.config.ts`'s `server.proxy` forwards it — override the target with the `BACKEND_URL` env var if it runs elsewhere.

The backend's `CORS_ALLOWED_ORIGINS` env var must include this app's origin (`http://localhost:8443` by default) for direct (non-proxied) requests and for any deployed frontend origin.

### Auth

Real JWT auth end to end: register, login (dispatches a 2FA email OTP), OTP verification, refresh-token session restore on reload, and logout. The access token lives in memory only; the refresh token persists to `localStorage` under `velora_refresh_token`. `src/api/client.ts` auto-refreshes on a 401 and retries once.

### What's wired to real data

- **Explore / Services** — real categories and portfolio search (`categoriesApi`, `portfolioApi`)
- **Home / Projects** — real bookings (`bookingsApi`), grouped by status (Active/Upcoming/Complete)
- **StartProject wizard & Checkout** — actually create bookings (`POST /api/bookings`) instead of a fake success screen
- **Quotations** (`MyQuotationsScreen`, `QuotationDetailScreen`) — aggregated per-booking (no list-all-quotations endpoint exists), real accept/reject actions
- **Profile** — real user data, avatar upload (`POST /api/uploads?purpose=AVATAR` → Cloudinary, saved via `PUT /api/users/profile`), real Projects/Quotations/Saved counts (`favoritesApi`)

### Known gaps

- `DeleteAccountScreen` is a no-op (no backend delete-account endpoint) — shows a client-side confirmation flow only, does not call the API.
- Sending a quotation and marking a booking complete are professional/admin-only backend actions — there's no professional-facing UI in this app, so those paths are code-reviewed but not screenshot-verified against live data.
