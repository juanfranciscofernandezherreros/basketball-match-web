import { useEffect, useMemo, useState } from "react";
import { getMatches } from "../api/matchesApi";
import { CompetitionGroup } from "../components/CompetitionGroup";
import { MatchListSkeleton } from "../components/MatchListSkeleton";
import { Pagination } from "../components/Pagination";
import type { Match, PageResponse } from "../types/match";

const PAGE_SIZE = 20;

interface MatchGroup {
  key: string;
  label: string;
  country: string;
  matches: Match[];
}

export function groupMatches(matches: Match[]): MatchGroup[] {
  const grouped = new Map<string, MatchGroup>();

  for (const match of matches) {
    const country =
      match.fixture?.country ?? match.result?.country ?? "Internacional";
    const competition =
      match.fixture?.competition ?? match.result?.competition ?? "Otros partidos";
    const key = `${country}::${competition}`;

    const current = grouped.get(key);
    if (current) {
      current.matches.push(match);
      continue;
    }

    grouped.set(key, {
      key,
      label: competition,
      country,
      matches: [match],
    });
  }

  return Array.from(grouped.values());
}

export function MatchesPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<Match> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getMatches(page, PAGE_SIZE, controller.signal)
      .then(setData)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudieron cargar los partidos",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, retryKey]);

  const groups = useMemo(() => groupMatches(data?.content ?? []), [data]);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">MATCH CENTER</span>
          <h1>Todos los partidos</h1>
          <p>Selecciona un partido para ver toda la información en una sola pantalla.</p>
        </div>
        <div className="hero__metric">
          <strong>{data?.totalElements ?? "—"}</strong>
          <span>partidos</span>
        </div>
      </section>

      <div className="date-strip" aria-label="Listado de partidos">
        <button type="button" className="date-strip__ghost" disabled>
          ‹
        </button>
        <div className="date-strip__day">
          <span>PARTIDOS</span>
          <strong>Todos</strong>
        </div>
        <button type="button" className="date-strip__ghost" disabled>
          ›
        </button>
      </div>

      {loading && <MatchListSkeleton />}

      {!loading && error && (
        <section className="state-card state-card--error">
          <strong>No se pudieron cargar los partidos</strong>
          <p>{error}</p>
          <button type="button" onClick={() => setRetryKey((current) => current + 1)}>
            Reintentar
          </button>
        </section>
      )}

      {!loading && !error && groups.length === 0 && (
        <section className="state-card">
          <strong>No hay partidos disponibles</strong>
          <p>Cuando el projector publique datos en MongoDB aparecerán aquí.</p>
        </section>
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="competition-list">
          {groups.map((group) => (
            <CompetitionGroup
              key={group.key}
              label={group.label}
              country={group.country}
              matches={group.matches}
            />
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          disabled={loading}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </main>
  );
}
