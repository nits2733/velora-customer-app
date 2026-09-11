import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'velora_favorites'

export type FavoriteKind = 'project' | 'style' | 'inspiration'

let cache: Record<string, true> = {}

function keyFor(kind: FavoriteKind, id: string): string {
  return `${kind}:${id}`
}

export async function hydrateFavorites(): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  cache = raw ? JSON.parse(raw) : {}
}

export function isFavorite(kind: FavoriteKind, id: string): boolean {
  return cache[keyFor(kind, id)] === true
}

export async function toggleFavorite(kind: FavoriteKind, id: string): Promise<void> {
  const key = keyFor(kind, id)
  if (cache[key]) {
    const { [key]: _removed, ...rest } = cache
    cache = rest
  } else {
    cache = { ...cache, [key]: true }
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}
