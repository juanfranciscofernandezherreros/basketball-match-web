import type { Match } from "../types/match";

interface MatchRowProps {
  match: Match;
}

function displayDate(value: string | null | undefined) {
  if (!value) {
    return "Sin fecha";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function MatchRow({ match }: MatchRowProps) {
  const homeTeam =
    match.fixture?.homeTeam ?? match.result?.homeTeam ?? match.summary?.homeName ?? "Local";
  const awayTeam =
    match.fixture?.awayTeam ?? match.result?.awayTeam ?? match.summary?.awayName ?? "Visitante";
  const homeScore = match.result?.homeScore ?? match.summary?.resultHome ?? "-";
  const awayScore = match.result?.awayScore ?? match.summary?.resultAway ?? "-";
  const eventTime = match.fixture?.eventTime ?? match.result?.eventTime ?? match.summary?.date;
  const isFinished =
    match.result?.homeScore != null ||
    match.result?.awayScore != null ||
    match.summary?.resultHome != null ||
    match.summary?.resultAway != null;

  return (
    <article className="match-row">
      <div className="match-row__time">
        <span>{displayDate(eventTime)}</span>
        <small>{isFinished ? "FINAL" : "PROGRAMADO"}</small>
      </div>
      <div className="match-row__teams">
        <div className="team-line">
          <span className="team-line__badge" aria-hidden="true">
            {homeTeam.slice(0, 1).toUpperCase()}
          </span>
          <strong>{homeTeam}</strong>
          <span className="team-line__score">{homeScore}</span>
        </div>
        <div className="team-line">
          <span className="team-line__badge" aria-hidden="true">
            {awayTeam.slice(0, 1).toUpperCase()}
          </span>
          <strong>{awayTeam}</strong>
          <span className="team-line__score">{awayScore}</span>
        </div>
      </div>
      <div className="match-row__meta">
        <span>{match.pointByPointEvents} jugadas</span>
        <span className="match-row__arrow" aria-hidden="true">›</span>
      </div>
    </article>
  );
}
