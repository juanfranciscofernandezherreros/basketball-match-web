import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMatchDetail } from "../api/matchesApi";
import type {
  MatchDetail,
  Player,
  PointByPointEvent,
  TeamPlayers,
  TeamStat,
} from "../types/match";

function teamName(detail: MatchDetail, side: "home" | "away") {
  const match = detail.match;
  if (side === "home") {
    return match.fixture?.homeTeam ?? match.result?.homeTeam ?? match.summary?.homeName ?? "Local";
  }

  return match.fixture?.awayTeam ?? match.result?.awayTeam ?? match.summary?.awayName ?? "Visitante";
}

function score(detail: MatchDetail, side: "home" | "away") {
  const match = detail.match;
  if (side === "home") {
    return match.result?.homeScore ?? match.summary?.resultHome ?? "-";
  }

  return match.result?.awayScore ?? match.summary?.resultAway ?? "-";
}

function periodRows(detail: MatchDetail) {
  const home = detail.match.result?.homePeriods ?? [];
  const away = detail.match.result?.awayPeriods ?? [];
  const length = Math.max(home.length, away.length);

  return Array.from({ length }, (_, index) => ({
    label: index < 4 ? `Q${index + 1}` : `OT${index - 3}`,
    home: home[index] ?? "-",
    away: away[index] ?? "-",
  }));
}

function value(value: string | number | null | undefined) {
  return value == null || value === "" ? "—" : String(value);
}

function PlayerTable({ group }: { group: TeamPlayers }) {
  return (
    <div className="detail-table-wrap">
      <h3>{group.team}</h3>
      <table className="detail-table detail-table--players">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>MIN</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>3PM</th>
            <th>STL</th>
            <th>TO</th>
            <th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {group.players.map((player: Player, index) => (
            <tr key={`${player.name ?? "player"}-${index}`}>
              <td>{value(player.name)}</td>
              <td>{value(player.min)}</td>
              <td>{value(player.pts)}</td>
              <td>{value(player.reb)}</td>
              <td>{value(player.ast)}</td>
              <td>{value(player.threepm)}</td>
              <td>{value(player.steals)}</td>
              <td>{value(player.turnovers)}</td>
              <td>{value(player.plusMinus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsTable({ stats }: { stats: TeamStat[] }) {
  return (
    <div className="detail-table-wrap">
      <table className="detail-table">
        <thead>
          <tr>
            <th>Periodo</th>
            <th>Categoría</th>
            <th>Estadística</th>
            <th>Local</th>
            <th>Visitante</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={`${stat.period}-${stat.metric}-${index}`}>
              <td>{value(stat.period)}</td>
              <td>{value(stat.category)}</td>
              <td>{value(stat.metric)}</td>
              <td>{value(stat.homeValue)}</td>
              <td>{value(stat.awayValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PointByPointTable({ events }: { events: PointByPointEvent[] }) {
  return (
    <div className="detail-table-wrap">
      <table className="detail-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Marcador</th>
            <th>Local +</th>
            <th>Visitante +</th>
            <th>Líder</th>
            <th>Ventaja</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={`${event.sequence ?? index}-${index}`}>
              <td>{value(event.sequence)}</td>
              <td>
                {value(event.homeScore)} - {value(event.awayScore)}
              </td>
              <td>{value(event.homePointsAdded)}</td>
              <td>{value(event.awayPointsAdded)}</td>
              <td>{value(event.leaderSide)}</td>
              <td>{value(event.advantage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MatchDetailPage() {
  const { matchId } = useParams();
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setError("Identificador de partido no válido");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getMatchDetail(matchId, controller.signal)
      .then(setDetail)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el partido",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [matchId]);

  const periods = useMemo(() => (detail ? periodRows(detail) : []), [detail]);

  if (loading) {
    return (
      <main className="page">
        <section className="state-card">
          <strong>Cargando toda la información del partido…</strong>
        </section>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="page">
        <section className="state-card state-card--error">
          <strong>No se pudo cargar el partido</strong>
          <p>{error ?? "Respuesta vacía"}</p>
          <Link className="detail-back" to="/">Volver a partidos</Link>
        </section>
      </main>
    );
  }

  const home = teamName(detail, "home");
  const away = teamName(detail, "away");
  const match = detail.match;
  const competition = match.fixture?.competition ?? match.result?.competition ?? "Partido";
  const country = match.fixture?.country ?? match.result?.country ?? "";

  return (
    <main className="page detail-page">
      <Link className="detail-back" to="/">← Todos los partidos</Link>

      <section className="score-card">
        <div className="score-card__meta">
          <span>{country}</span>
          <strong>{competition}</strong>
        </div>
        <div className="score-card__teams">
          <div className="score-team">
            <span className="score-team__badge">{home.slice(0, 1).toUpperCase()}</span>
            <strong>{home}</strong>
          </div>
          <div className="score-card__score">
            <strong>{score(detail, "home")}</strong>
            <span>FINAL</span>
            <strong>{score(detail, "away")}</strong>
          </div>
          <div className="score-team score-team--away">
            <span className="score-team__badge">{away.slice(0, 1).toUpperCase()}</span>
            <strong>{away}</strong>
          </div>
        </div>

        {periods.length > 0 && (
          <div className="period-strip">
            {periods.map((period) => (
              <div key={period.label}>
                <span>{period.label}</span>
                <strong>{period.home} - {period.away}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="detail-section">
        <div className="detail-section__heading">
          <div>
            <span className="eyebrow">TEAM STATS</span>
            <h2>Estadísticas del partido</h2>
          </div>
          <span>{match.teamStats.length} registros</span>
        </div>
        {match.teamStats.length > 0 ? (
          <StatsTable stats={match.teamStats} />
        ) : (
          <p className="detail-empty">No hay estadísticas de equipo disponibles.</p>
        )}
      </section>

      <section className="detail-section">
        <div className="detail-section__heading">
          <div>
            <span className="eyebrow">PLAYERS</span>
            <h2>Jugadores</h2>
          </div>
        </div>
        <div className="players-grid">
          {match.players.length > 0 ? (
            match.players.map((group) => <PlayerTable key={group.team} group={group} />)
          ) : (
            <p className="detail-empty">No hay estadísticas de jugadores disponibles.</p>
          )}
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section__heading">
          <div>
            <span className="eyebrow">PLAY BY PLAY</span>
            <h2>Point by point</h2>
          </div>
          <span>{match.pointByPointEvents} eventos</span>
        </div>

        {detail.pointByPoint.length > 0 ? (
          <div className="pbp-groups">
            {detail.pointByPoint.map((quarter) => (
              <div className="pbp-quarter" key={quarter.quarter}>
                <h3>{quarter.quarter}</h3>
                <PointByPointTable events={quarter.events} />
              </div>
            ))}
          </div>
        ) : (
          <p className="detail-empty">No hay point-by-point disponible.</p>
        )}
      </section>
    </main>
  );
}
