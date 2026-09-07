# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # install deps
pnpm dev           # vite dev server, http://localhost:8443 (or $PORT)
pnpm build         # production build -> dist/
pnpm preview       # preview the production build
pnpm format        # oxfmt
```

There is no test runner or linter configured in this repo (no vitest/jest/eslint). Type-check with `npx tsc --noEmit`.

The dev server proxies `/api/*` to a backend at `http://localhost:8080` (override with `BACKEND_URL`; see `vite.config.ts`'s `server.proxy`). The backend's `CORS_ALLOWED_ORIGINS` must include this app's origin — without it, browser requests fail with CORS errors even though `curl` (no `Origin` header) works fine, which is a recurring source of confusing "it works in curl but not the browser" bugs here.

## Architecture

**Not a real mobile app, not a normal web app.** This is `react-native-web`: screens are written with RN primitives (`View`, `Text`, `Pressable`, `Image`, `ScrollView`) typed via a **hand-written shim** at `src/react-native.d.ts` (not `@types/react-native` — it only declares what this codebase actually uses). The whole app renders inside one fixed `375px`-wide "phone" frame (`src/App.tsx`'s `styles.phone`) that fills a dark backdrop, i.e. always a single-column mobile layout regardless of viewport. A few things fall back to raw DOM elements where RN has no equivalent (a hidden `<input type="file">` for avatar upload in `ProfileScreen.tsx`, inline `<svg>` icons in `BottomNav.tsx`) — this is intentional and fine, not a mistake to "fix" back to RN components.

**Custom router, not react-router.** `src/navigation/router.tsx`'s `RouterProvider` keeps an in-memory stack of `{name, params}` routes (`push`/`back`/`replace`/`getParam`). It mirrors the current route into the URL hash via `history.replaceState` (not a real push-based history — browser back/forward isn't wired to it) purely so a page refresh restores the same screen instead of resetting to Home. `src/App.tsx`'s `AppContent` is a big `switch` on `router.currentRoute.name` that renders the matching screen — adding a screen means adding both a route name convention and a `case` here. `TAB_SCREENS` (Home/Explore/Services/Projects) drives which screen shows as the active bottom-nav tab; `NAV_BAR_SCREENS` (a superset, includes Profile and its settings sub-screens) drives whether the bottom nav renders at all, with no tab highlighted when the current screen isn't in `TAB_SCREENS`.

**Auth.** `src/context/AuthContext.tsx` holds the logged-in user + avatar URL and exposes `login`/`logout`/`updateUser`/`updateAvatar`. The access token is *never* persisted — it lives only in the `src/api/client.ts` module's closure (`setAccessToken`/`getAccessToken`). Only the refresh token persists, to `localStorage` under `velora_refresh_token`; `AuthProvider` uses it to silently restore a session on boot via `/api/auth/refresh`. `client.ts`'s `request()` also auto-retries once on a 401 by refreshing first (de-duped across concurrent requests via a shared in-flight promise), and calls a registered `onSessionExpired` handler (wired to `AuthContext`'s session-clearing logic) if that refresh itself fails. Login requires a 2FA email OTP (`LoginScreen` → `VerifyOtpScreen`); registration does not.

**API layer.** Each backend resource gets its own typed controller file in `src/api/` (`bookings.ts`, `quotations.ts`, `categories.ts`, `favorites.ts`, `uploads.ts`, etc.), all built on the shared `request()`/`api` helpers in `client.ts`, re-exported from the `src/api/index.ts` barrel. Request/response shapes live in `src/api/types.ts` and should match the backend's OpenAPI schema — when in doubt about a field, prefer checking the live backend's `/v3/api-docs` over assuming the local type is current (it has drifted before, e.g. `avatarUrl` was missing from `UserProfileResponse` until the backend added it).

**No aggregate endpoints for quotations or favorites-as-counts.** There's no "list all my quotations" endpoint — `MyQuotationsScreen` and the Profile stats row both fetch all bookings via `bookingsApi.list()` and then call `quotationsApi.get(bookingId)` per booking (N+1, via `Promise.allSettled`, filtering out bookings with no quotation and unsent `DRAFT` ones). Keep this pattern if extending those screens rather than inventing a client-side cache or expecting a backend list endpoint to exist.

**Theme tokens are the single source of truth for styling.** `src/theme/tokens.ts` exports `colors`, `fonts`, `fontSize`, `fontWeight`, `spacing`, `radii`, `shadows`, `statusColors`, `layout` — screens should reference these rather than hardcoding hex colors or pixel values, especially `statusColors` for any pending/approved/rejected-style badge (several screens used to duplicate these hex pairs independently; that's been consolidated).

**Data-honesty convention.** A recurring pattern in this codebase's history: several screens used to show plausible-looking but entirely fabricated data (a fake assigned professional, fake project status, fake quotation amounts) instead of an honest empty/loading state when real data wasn't available or wasn't wired up yet. When a backend field or endpoint doesn't exist for something the UI wants to show, prefer omitting it or showing a real empty state over inventing a value — this has been a repeated source of bugs reported against this app.

## Known gaps (see README.md for more)

- `DeleteAccountScreen` is a client-side no-op — there's no backend delete-account endpoint, so it shows a confirm flow but never calls the API.
- Sending a quotation and marking a booking complete are professional/admin-only backend actions with no professional-facing UI in this app, so those code paths aren't verifiable end-to-end from here.
