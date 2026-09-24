import { describe, expect, it } from "vitest";
import { groupMatches } from "./App";
import type { Match } from "./types/match";

const baseMatch: Match = {
  matchId: "m1",
  fixture: {
    country: "Germany",
    competition: "BBL",
    eventTime: "2026-09-20T18:00:00",
    homeTeam: "Bamberg",
    awayTeam: "Bayern",
  },
  result: null,
  summary: null,
  players: [],
  teamStats: [],
  pointByPointEvents: 0,
  availableSections: [],
  projectedAt: "2026-09-24T12:00:00Z",
};

describe("groupMatches", () => {
  it("groups matches by country and competition", () => {
    const groups = groupMatches([
      baseMatch,
      { ...baseMatch, matchId: "m2" },
      {
        ...baseMatch,
        matchId: "m3",
        fixture: { ...baseMatch.fixture!, competition: "ProA" },
      },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe("BBL");
    expect(groups[0].matches).toHaveLength(2);
    expect(groups[1].label).toBe("ProA");
  });
});
