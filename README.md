<div align="center">

# 🏡 Velora Frontend

**Interior services, one app** — from a full home transformation to a single service booking.

![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)
![react--native--web](https://img.shields.io/badge/react--native--web-0.19-61dafb?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?logo=tailwindcss&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT_%2B_2FA-6e40c9?logo=jsonwebtokens&logoColor=white)
![status](https://img.shields.io/badge/status-active_dev-success)

[Quick Start](#-quick-start) • [Stack](#-stack) • [Project Layout](#-project-layout) • [Backend Integration](#-backend-integration) • [What's Real](#-whats-wired-to-real-data) • [Known Gaps](#-known-gaps)

</div>

---

## 📖 Overview

Velora is a React Native (web) app for booking interior design and home services. Customers can browse real professional portfolios, book a **Full Home Project** or an **Individual Service** (painting, plumbing, electrical, carpentry, false ceiling, modular kitchen), track bookings through to completion, and manage quotations — all backed by a real Spring Boot API with JWT + 2FA authentication.

The app runs as a single mobile-shaped viewport (`375px` wide) rendered via `react-native-web`, using a custom in-memory router that's synced to the URL so a page refresh lands you back where you were.

---

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:8443` (or `$PORT`). The dev server proxies `/api/*` to the backend — see [Backend Integration](#-backend-integration).

```bash
pnpm build   # → dist/
```

---

## 🧱 Stack

| | |
|---|---|
| **UI** | React 19 + `react-native-web` |
| **Bundler** | Vite 8 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 |
| **Routing** | Custom in-memory router, URL-synced (`src/navigation/router.tsx`) |
| **Auth** | JWT access + refresh tokens, 2FA email OTP |

---

## 📂 Project Layout

```
src/
  api/          Typed API client + controllers (auth, bookings, quotations, favorites, uploads, ...)
  components/   Reusable UI — buttons, cards, inputs, nav, ConfirmModal
  context/      React contexts — auth, cart
  navigation/   Custom router
  screens/      Every screen, incl. Login/Register/VerifyOtp and the StartProject wizard
  theme/        Design tokens (colors, type scale, spacing, status colors)
```

---

## 🔌 Backend Integration

The app expects the Velora backend (Spring Boot) at `http://localhost:8080` by default. `vite.config.ts`'s `server.proxy` forwards `/api/*` there — override with the `BACKEND_URL` env var if it runs elsewhere.

> **Backend setup:** the backend's `CORS_ALLOWED_ORIGINS` env var must include this app's origin (`http://localhost:8443` by default) — otherwise the browser blocks auth and other mutating requests with a CORS error, even though `curl` (no `Origin` header) would appear to work fine.

### Auth flow

Register or log in → login dispatches a 2FA email OTP → verify the OTP → real JWT pair issued. The access token lives in memory only; the refresh token persists to `localStorage` (`velora_refresh_token`) so a reload silently restores the session. A 401 triggers one automatic refresh-and-retry (`src/api/client.ts`).

---

## ✅ What's Wired to Real Data

| Area | Backed by |
|---|---|
| Explore / Services | `categoriesApi`, `portfolioApi` — real categories + portfolio search |
| Home / Projects | `bookingsApi` — real bookings, grouped Active / Upcoming / Complete |
| StartProject wizard & Checkout | `POST /api/bookings` — creates a real booking, not a fake success screen |
| My Quotations / Quotation Detail | `quotationsApi`, aggregated per-booking (no list-all endpoint exists); real accept/reject |
| Profile | Real user data, avatar upload (`/api/uploads` → Cloudinary), real Projects/Quotations/Saved counts (`favoritesApi`) |

---

## ⚠️ Known Gaps

- **Delete Account** is a client-side no-op — no backend delete-account endpoint exists, so it shows a confirmation flow but never calls the API.
- **Sending a quotation / marking a booking complete** are professional/admin-only backend actions. This app has no professional-facing UI, so those paths are code-reviewed but not verified against live data end-to-end.
