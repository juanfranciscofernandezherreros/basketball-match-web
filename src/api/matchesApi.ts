import type { Match, PageResponse } from "../types/match";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function getMatches(
  page: number,
  size: number,
  signal?: AbortSignal,
): Promise<PageResponse<Match>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: "projectedAt,desc",
  });

  const response = await fetch(`${API_URL}/api/v1/matches?${params.toString()}`, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los partidos (${response.status})`);
  }

  return response.json() as Promise<PageResponse<Match>>;
}
