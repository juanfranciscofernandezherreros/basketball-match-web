export interface Fixture {
  country: string | null;
  competition: string | null;
  eventTime: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
}

export interface MatchResult {
  sourceEventId: string | null;
  eventTime: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homePeriods: Array<number | null> | null;
  awayPeriods: Array<number | null> | null;
  country: string | null;
  competition: string | null;
}

export interface MatchSummary {
  date: string | null;
  homeName: string | null;
  homeImage: string | null;
  awayName: string | null;
  awayImage: string | null;
  resultHome: string | null;
  resultAway: string | null;
}

export interface Match {
  matchId: string;
  fixture: Fixture | null;
  result: MatchResult | null;
  summary: MatchSummary | null;
  players: unknown[];
  teamStats: unknown[];
  pointByPointEvents: number;
  availableSections: string[];
  projectedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
