export const TMDB_API_KEY = "5a29358c68bb2ecb1bcc2b387dae70f7";
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE_URL = "https://image.tmdb.org/t/p";

export function posterUrl(path?: string | null, size: string = "w500") {
  return path ? `${IMG_BASE_URL}/${size}${path}` : "/placeholder.svg";
}

export function backdropUrl(path?: string | null, size: string = "w780") {
  return path ? `${IMG_BASE_URL}/${size}${path}` : "/placeholder.svg";
}

type FetchParams = Record<string, string | number | boolean | undefined>;

async function fetchJson<T>(path: string, params: FetchParams = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", (params.language as string) || "en-US");
  if (params.query) url.searchParams.set("query", String(params.query));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.include_adult !== undefined) {
    url.searchParams.set("include_adult", String(params.include_adult));
  } else {
    url.searchParams.set("include_adult", "false");
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export function fetchPath<T = any>(path: string, params: FetchParams = {}) {
  return fetchJson<T>(path, params);
}

// Lists
export function listMovies(path: string, page = 1) {
  return fetchJson<{ results: any[] }>(path.startsWith("/") ? path : `/${path}`, { page });
}
export function listTv(path: string, page = 1) {
  return fetchJson<{ results: any[] }>(path.startsWith("/") ? path : `/${path}`, { page });
}

// Details
export function getMovieDetails(id: string | number) {
  return fetchJson<any>(`/movie/${id}`);
}
export function getTvDetails(id: string | number) {
  return fetchJson<any>(`/tv/${id}`);
}

export function getMovieCredits(id: string | number) {
  return fetchJson<any>(`/movie/${id}/credits`);
}
export function getTvCredits(id: string | number) {
  return fetchJson<any>(`/tv/${id}/credits`);
}

export function getMovieVideos(id: string | number) {
  return fetchJson<{ results: any[] }>(`/movie/${id}/videos`);
}
export function getTvVideos(id: string | number) {
  return fetchJson<{ results: any[] }>(`/tv/${id}/videos`);
}

export function searchMulti(query: string, page = 1) {
  return fetchJson<{ results: any[] }>(`/search/multi`, { query, page });
}

export function getSeasonDetails(tvId: string | number, seasonNumber: number) {
  return fetchJson<any>(`/tv/${tvId}/season/${seasonNumber}`);
}
