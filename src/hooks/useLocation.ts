import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Device location store shared by every TopBar. Flow: ask for foreground permission, read the
 * current position, reverse-geocode it to "Area, City". Runs once per app session; the user can
 * retry from the city pill (or jump to system settings if they blocked the prompt for good).
 */
export type LocationStatus = 'idle' | 'detecting' | 'ready' | 'denied' | 'blocked' | 'unavailable';

interface State {
  status: LocationStatus;
  /** Last city detected from the device. */
  city: string | null;
  /** City the user picked by hand; wins over the detected one until they switch back. */
  manual: string | null;
}

let state: State = { status: 'idle', city: null, manual: null };
let started = false;
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function formatPlace(area?: string | null, city?: string | null): string | null {
  const a = area?.trim();
  const c = city?.trim();
  if (a && c && a.toLowerCase() !== c.toLowerCase()) return `${a}, ${c}`;
  return c || a || null;
}

/** expo-location has no reverse geocoder on web, so fall back to a keyless public endpoint. */
async function reverseGeocodeWeb(latitude: number, longitude: number): Promise<string | null> {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}` +
    `&longitude=${longitude}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const body = (await res.json()) as { locality?: string; city?: string; principalSubdivision?: string };
  return formatPlace(body.locality, body.city || body.principalSubdivision);
}

async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  if (Platform.OS === 'web') return reverseGeocodeWeb(latitude, longitude);
  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  if (!place) return null;
  return formatPlace(place.district || place.subregion, place.city || place.region);
}

async function detect() {
  set({ ...state, status: 'detecting' });
  try {
    if (Platform.OS !== 'web' && !(await Location.hasServicesEnabledAsync())) {
      set({ ...state, status: 'unavailable' });
      return;
    }
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const city = await reverseGeocode(coords.latitude, coords.longitude);
    set(city ? { ...state, status: 'ready', city } : { ...state, status: 'unavailable' });
  } catch {
    set({ ...state, status: 'unavailable' });
  }
}

/** Ask for permission if we still can, then detect. Safe to call repeatedly. */
async function requestAndDetect() {
  try {
    let perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== 'granted' && perm.canAskAgain) {
      perm = await Location.requestForegroundPermissionsAsync();
    }
    if (perm.status === 'granted') {
      await detect();
    } else {
      set({ ...state, status: perm.canAskAgain ? 'denied' : 'blocked' });
    }
  } catch {
    set({ ...state, status: 'unavailable' });
  }
}

export const locationStore = {
  init() {
    if (started) return;
    started = true;
    void requestAndDetect();
  },
  /** Retry detection, or open settings when the OS will no longer show the prompt. */
  retry() {
    if (state.status === 'blocked' && Platform.OS !== 'web') {
      void Linking.openSettings();
      return;
    }
    void requestAndDetect();
  },
  /** User typed a place by hand. Wins over detection until they switch back with `useCurrent`. */
  choose(place: string) {
    const manual = place.trim();
    if (manual) set({ ...state, manual });
  },
  /** Alias of `choose`. */
  setManual(place: string) {
    locationStore.choose(place);
  },
  /** Drop the typed place and go back to the device location. */
  useCurrent() {
    set({ ...state, manual: null });
    locationStore.retry();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  snapshot: () => state,
};

export function locationLabel({ status, city, manual }: State): string {
  if (manual) return manual;
  if (city) return city;
  switch (status) {
    case 'denied':
      return 'Enable location';
    case 'blocked':
      return 'Location off';
    case 'unavailable':
      return 'Set location';
    default:
      return 'Locating…';
  }
}

export function useLocation() {
  const s = useSyncExternalStore(locationStore.subscribe, locationStore.snapshot);
  useEffect(() => {
    locationStore.init();
  }, []);
  return { ...s, label: locationLabel(s), retry: locationStore.retry };
}
