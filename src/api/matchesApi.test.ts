import { afterEach, describe, expect, it, vi } from "vitest";
import { getMatchDetail, getMatches } from "./matchesApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("matchesApi", () => {
  it("calls the paginated API with the expected sort", async () => {
    const json = vi.fn().mockResolvedValue({
      content: [],
      page: 2,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: false,
      last: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json,
    });

    vi.stubGlobal("fetch", fetchMock);

    await getMatches(2, 20);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/v1/matches?page=2&size=20&sort=projectedAt%2Cdesc",
    );
  });

  it("loads the complete match detail in one request", async () => {
    const json = vi.fn().mockResolvedValue({
      match: { matchId: "m1" },
      pointByPoint: [{ matchId: "m1", quarter: "Q1", events: [] }],
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json,
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = await getMatchDetail("m1");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/v1/matches/m1");
    expect(response.match.matchId).toBe("m1");
    expect(response.pointByPoint).toHaveLength(1);
  });

  it("throws when the API returns an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    await expect(getMatches(0, 20)).rejects.toThrow(
      "No se pudieron cargar los partidos (503)",
    );
  });
});


describe("getMatchDetail", () => {
  it("loads the complete match with one request", async () => {
    const json = vi.fn().mockResolvedValue({
      match: {
        matchId: "m1",
        fixture: null,
        result: null,
        summary: null,
        players: [],
        teamStats: [],
        pointByPointEvents: 2,
        availableSections: ["pointByPoint"],
        projectedAt: "2026-09-24T12:00:00Z"
      },
      pointByPoint: [
        {
          matchId: "m1",
          quarter: "Q1",
          events: [],
          projectedAt: "2026-09-24T12:00:00Z"
        }
      ]
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json,
    });

    vi.stubGlobal("fetch", fetchMock);

    const detail = await getMatchDetail("m1");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/v1/matches/m1");
    expect(detail.match.matchId).toBe("m1");
    expect(detail.pointByPoint).toHaveLength(1);
  });
});
