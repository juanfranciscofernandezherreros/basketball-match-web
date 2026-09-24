import type { Match } from "../types/match";
import { MatchRow } from "./MatchRow";

interface CompetitionGroupProps {
  label: string;
  country: string;
  matches: Match[];
}

export function CompetitionGroup({ label, country, matches }: CompetitionGroupProps) {
  return (
    <section className="competition-card">
      <header className="competition-card__header">
        <div>
          <strong>{label}</strong>
          <span>{country}</span>
        </div>
        <span className="competition-card__count">{matches.length}</span>
      </header>
      <div>
        {matches.map((match) => (
          <MatchRow key={match.matchId} match={match} />
        ))}
      </div>
    </section>
  );
}
