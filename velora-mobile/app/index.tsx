// expo-router requires at least one route file to boot, but this app keeps
// its own in-memory router (src/navigation/router.tsx) and renders every
// screen directly from _layout.tsx — this route is never actually shown.
export default function Index() {
  return null
}
