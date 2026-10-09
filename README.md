<div align="center">

# Velora Customer App

Customer-facing mobile app for home projects and individual home-service bookings.

Built with Expo, React Native, TypeScript, and Expo Router. The current app entry renders a custom in-memory router from `src/navigation/router.tsx`.

</div>

---

## 📖 Overview

Customers can browse services and inspiration, request a **Full Home Project** or an **Individual Service**, view their projects and quotations, and manage their profile. Authentication and supported customer workflows connect to the shared Spring Boot backend. The app targets native iOS and Android, with Expo web available for development.

---

## 🚀 Quick Start

```bash
npm install
npm start
```

Use the Expo CLI prompts to launch a device or emulator. For web, run `npm run web`. There is no Vite dev server or `/api` proxy in this project.

```bash
npx tsc --noEmit
```

The TypeScript check is available directly; build and platform commands are provided by Expo.

---

## 🧱 Stack

| | |
|---|---|
| **UI** | React Native 0.86 + React 19 |
| **Platform tooling** | Expo SDK 57 + Expo Router |
| **Language** | TypeScript 6 |
| **Routing** | Custom in-memory router (`src/navigation/router.tsx`), rendered by the Expo Router root layout |
| **Auth** | Backend access/refresh tokens and email OTP verification |

---

## 📂 Project Layout

```
velora-mobile/
  app/          Expo Router entry and root layout
  src/api/      Typed backend client and domain API modules
  src/context/  Authentication and app state
  src/navigation/ Custom in-memory screen router
  src/screens/  Customer screens and the StartProject flow
  src/theme/    Design tokens
```

Run commands from `velora-mobile/` (the directory containing `package.json`).

---

## 🔌 Backend Integration

The app reads `EXPO_PUBLIC_API_BASE_URL` in `app.config.ts`; it defaults to `http://localhost:8080`. Set it to a backend URL reachable from the target device. On a physical device, `localhost` refers to the device itself, so use the development machine's LAN address or a reachable deployed backend. There is no Vite proxy.

> **Backend setup for web:** add the browser origin printed by Expo to the backend's `CORS_ALLOWED_ORIGINS` (usually `http://localhost:8081`; Expo may choose another port). Native app requests are not subject to browser CORS.

### Auth flow

Register or log in → login dispatches a 2FA email OTP → verify the OTP → real JWT pair issued. The access token lives in memory only; the refresh token persists to `localStorage` (`velora_refresh_token`) so a reload silently restores the session. A 401 triggers one automatic refresh-and-retry (`src/api/client.ts`).

---

## ✅ What's Wired to Real Data

| Area | Backed by |
|---|---|
| Authentication | Backend registration/login and OTP verification through `authApi` |
| Services and portfolio | Category and portfolio API modules |
| Projects and service requests | Booking API module |
| Quotations and reviews | Quotation and review API modules |
| Profile and media | User and upload/media API modules |

The API modules are present in `src/api`; individual screens may still contain unfinished or illustrative UI. Confirm a workflow against the backend before treating it as end-to-end complete.

## ⚠️ Known Gaps

- **Delete Account** is not supported by the backend and must not be presented as completed account deletion.
- **Professional/admin workflows** such as sending a quotation and assigning or completing bookings are outside this customer app.
- The app does not include automated test or lint scripts in `package.json`; validate changes with TypeScript and platform builds, plus workflow testing against a configured backend.
