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
  api/          API client + typed controllers (auth, bookings, quotations, etc.)
  components/   Reusable UI (buttons, cards, inputs, nav)
  context/      React contexts (auth, cart)
  navigation/   Custom router
  screens/      All app screens
  theme/        Design tokens
```

## API

Controllers in `src/api/` are typed against the backend OpenAPI spec. The client (`src/api/client.ts`) handles auth headers and JSON serialization. Set the backend URL in `client.ts`.

No backend calls are made yet — the app runs on mock data. Swap mock data for API calls when the backend is ready.
