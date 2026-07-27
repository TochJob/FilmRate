import { config } from '../config.js'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const cache = new Map<string, { data: unknown; expiresAt: number }>()
const CACHE_TTL_MS = 1000 * 60 * 60 * 24

export async function tmdbFetchCached(path: string, params: Record<string, string> = {}) {
  const key = `${path}?${new URLSearchParams(params)}`
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) {
    return hit.data
  }

  const url = new URL(`${TMDB_BASE_URL}/${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.TMDB_API_TOKEN}`,
      Accept: 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
  return data
}
