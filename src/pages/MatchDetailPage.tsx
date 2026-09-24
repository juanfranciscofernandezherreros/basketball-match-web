import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMatchDetail } from "../api/matchesApi";
import type { MatchDetail, TeamStat } from "../types/match";

function display(value: string | number | null | undefined) {
  return value == null || value === "" ? "—" : String(value);
}

function scorePeriods(detail: MatchDetail) {
  const home = detail.match.result?.homePeriods ?? [];
  const away = detail.match.result?.awayPeriods ?? [];
  const size = Math.max(home.length, away.length);

  return Array.from({ length: size }, (_, index) => ({
    label: index < 4 ? `Q${index + 1}` : `OT${index - 3}`,
    home: home[index] ?? null,
    away: away[index] ?? null,
  }));
}

function groupStats(stats: TeamStat[]) {
  return stats.reduce<Record<string, TeamStat[]>>((groups, stat) => {
    const key = stat.period || "General";
    groups[key] ??= [];
    groups[key].push(stat);
    return groups;
  }, {});
}

export function MatchDetailPage() {
  const { matchId = "" } = useParams();
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getMatchDetail(matchId, controller.signal)
      .then(setDetail)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el partido",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [matchId]);

  const periods = useMemo(() => (detail ? scorePeriods(detail) : []), [detail]);
  const statsByPeriod = useMemo(
    () => (detail ? groupStats(detail.match.teamStats ?? []) : {}),
    [detail],
  );

  if (loading) {
    return (
      <main className="page">
        <div className="detail-loading">Cargando toda la información del partido…</div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="page">
        <section className="state-card state-card--error">
          <strong>No se pudo cargar el partido</strong>
          <p>{error ?? "Respuesta vacía"}</p>
          <Link className="button-link" to="/">Volver a partidos</Link>
        </section>
      </main>
    );
  }

  const match = detail.match;
  const homeTeam =
    match.fixture?.homeTeam ?? match.result?.homeTeam ?? match.summary?.homeName ?? "Local";
  const awayTeam =
    match.fixture?.awayTeam ?? match.result?.awayTeam ?? match.summary?.awayName ?? "Visitante";
  const homeScore = match.result?.homeScore ?? match.summary?.resultHome;
  const awayScore = match.result?.awayScore ?? match.summary?.resultAway;
  const competition =
    match.fixture?.competition ?? match.result?.competition ?? "Competición";
  const country = match.fixture?.country ?? match.result?.country ?? "";

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/">← Todos los partidos</Link>

      <section className="score-card">
        <div className="score-card__competition">
          <strong>{competition}</strong>
          <span>{country}</span>
        </div>

        <div className="score-board">
          <div className="score-team">
            <div className="score-team__badge">{homeTeam.slice(0, 1).toUpperCase()}</div>
            <strong>{homeTeam}</strong>
          </div>
          <div className="score-board__result">
            <span>FINAL</span>
            <strong>{display(homeScore)} : {display(awayScore)}</strong>
          </div>
          <div className="score-team">
            <div className="score-team__badge">{awayTeam.slice(0, 1).toUpperCase()}</div>
            <strong>{awayTeam}</strong>
          </div>
        </div>

        {periods.length > 0 && (
          <div className="period-grid">
            {periods.map((period) => (
              <div className="period-cell" key={period.label}>
                <span>{period.label}</span>
                <strong>{display(period.home)} - {display(period.away)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="detail-section">
        <header className="detail-section__header">
          <h2>Resumen</h2>
        </header>
        <div className="summary-grid">
          <div><span>Match ID</span><strong>{match.matchId}</strong></div>
          <div><span>Fecha</span><strong>{display(match.summary?.date ?? match.fixture?.eventTime)}</strong></div>
          <div><span>Eventos PBP</span><strong>{match.pointByPointEvents}</strong></div>
          <div><span>Proyectado</span><strong>{display(match.projectedAt)}</strong></div>
        </div>
      </section>

      <section className="detail-section">
        <header className="detail-section__header">
          <h2>Estadísticas de equipo</h2>
          <span>{match.teamStats?.length ?? 0} métricas</span>
        </header>
        {Object.keys(statsByPeriod).length === 0 ? (
          <p className="detail-empty">No hay estadísticas de equipo.</p>
        ) : (
          Object.entries(statsByPeriod).map(([period, stats]) => (
            <div className="stats-block" key={period}>
              <h3>{period}</h3>
              <div className="stats-table">
                {stats.map((stat, index) => (
                  <div className="stats-row" key={`${period}-${stat.category}-${stat.metric}-${index}`}>
                    <span>{display(stat.homeValue)}</span>
                    <div>
                      <strong>{display(stat.metric)}</strong>
                      <small>{display(stat.category)}</small>
                    </div>
                    <span>{display(stat.awayValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="detail-section">
        <header className="detail-section__header">
          <h2>Jugadores</h2>
        </header>
        <div className="players-layout">
          {(match.players ?? []).map((team) => (
            <div className="players-card" key={team.team}>
              <h3>{team.team}</h3>
              <div className="players-table-wrap">
                <table className="players-table">
                  <thead>
                    <tr>
                      <th>Jugador</th>
                      <th>MIN</th>
                      <th>PTS</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>+/-</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.players.map((player, index) => (
                      <tr key={`${player.name}-${index}`}>
                        <td>{display(player.name)}</td>
                        <td>{display(player.min)}</td>
                        <td>{display(player.pts)}</td>
                        <td>{display(player.reb)}</td>
                        <td>{display(player.ast)}</td>
                        <td>{display(player.plusMinus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <header className="detail-section__header">
          <h2>Point by point</h2>
          <span>{detail.pointByPoint.reduce((total, quarter) => total + quarter.events.length, 0)} eventos</span>
        </header>
        {detail.pointByPoint.length === 0 ? (
          <p className="detail-empty">No hay eventos point-by-point.</p>
        ) : (
          <div className="pbp-layout">
            {detail.pointByPoint.map((quarter) => (
              <div className="pbp-quarter" key={quarter.quarter}>
                <h3>{quarter.quarter}</h3>
                <div className="pbp-events">
                  {quarter.events.map((event, index) => (
                    <div className="pbp-event" key={`${quarter.quarter}-${event.sequence}-${index}`}>
                      <span className="pbp-event__sequence">{display(event.sequence)}</span>
                      <span className="pbp-event__score">
                        {display(event.homeScore)} - {display(event.awayScore)}
                      </span>
                      <span className="pbp-event__meta">
                        {event.homePointsAdded ? `+${event.homePointsAdded} local` : ""}
                        {event.awayPointsAdded ? `+${event.awayPointsAdded} visitante` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
