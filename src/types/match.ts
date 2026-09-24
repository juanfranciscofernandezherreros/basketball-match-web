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
  totalLocal?: string | null;
  firstLocal?: string | null;
  secondLocal?: string | null;
  thirdLocal?: string | null;
  fourthLocal?: string | null;
  extraLocal?: string | null;
  totalAway?: string | null;
  firstAway?: string | null;
  secondAway?: string | null;
  thirdAway?: string | null;
  fourthAway?: string | null;
  extraAway?: string | null;
}

export interface Player {
  name: string | null;
  team: string | null;
  pts: number | null;
  reb: number | null;
  ast: number | null;
  min: string | null;
  fgm: number | null;
  fga: number | null;
  twopm: number | null;
  twopa: number | null;
  threepm: number | null;
  threepa: number | null;
  ftm: number | null;
  fta: number | null;
  plusMinus: number | null;
  offensiveRebounds: number | null;
  defensiveRebounds: number | null;
  personalFouls: number | null;
  steals: number | null;
  turnovers: number | null;
  blocks: number | null;
  blocksAgainst: number | null;
  tfs: number | null;
}

export interface TeamPlayers {
  team: string;
  players: Player[];
}

export interface TeamStat {
  period: string | null;
  category: string | null;
  metric: string | null;
  homeTeam: string | null;
  homeValue: string | null;
  awayTeam: string | null;
  awayValue: string | null;
  sourceUrl: string | null;
}

export interface PointByPointEvent {
  recordType: string | null;
  quarter: string | null;
  sequence: number | null;
  homeScore: number | null;
  awayScore: number | null;
  homePointsAdded: number | null;
  awayPointsAdded: number | null;
  leaderSide: string | null;
  advantage: string | null;
  advantageDirection: string | null;
  homeIsWinning: boolean | null;
  awayIsWinning: boolean | null;
}

export interface PointByPointQuarter {
  matchId: string;
  quarter: string;
  events: PointByPointEvent[];
  projectedAt: string;
}

export interface Match {
  matchId: string;
  fixture: Fixture | null;
  result: MatchResult | null;
  summary: MatchSummary | null;
  players: TeamPlayers[];
  teamStats: TeamStat[];
  pointByPointEvents: number;
  availableSections: string[];
  projectedAt: string;
}

export interface MatchDetail {
  match: Match;
  pointByPoint: PointByPointQuarter[];
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
