import { config } from '../config.js'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function tmdbFetch(path: string, params: Record<string, string> = {}) {
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
  return res.json()
}
