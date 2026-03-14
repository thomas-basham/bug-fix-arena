import { describe, expect, it } from "vitest";
import {
  buildChallengeCatalogHref,
  buildChallengeDetailHref,
  parseChallengeCatalogUrlState,
} from "@/lib/challenges/catalog-state";

describe("challenge catalog URL state", () => {
  it("parses search params into validated catalog state", () => {
    const state = parseChallengeCatalogUrlState({
      query: "  empty state ",
      language: "TypeScript",
      difficulty: "beginner",
      label: "good first issue",
      repository: "octo-org/arena-repo",
      status: "open",
      sort: "highest-reward",
      page: "3",
    });

    expect(state).toEqual({
      filters: {
        query: "empty state",
        language: "TypeScript",
        difficulty: "beginner",
        label: "good first issue",
        repository: "octo-org/arena-repo",
        status: "open",
      },
      page: 3,
      sort: "highest-reward",
    });
  });

  it("drops invalid filters and falls back to default paging and sort", () => {
    const state = parseChallengeCatalogUrlState({
      query: "   ",
      difficulty: "expert",
      status: "closed",
      sort: "random",
      page: "0",
      language: "all",
    });

    expect(state).toEqual({
      filters: {
        query: undefined,
        language: undefined,
        difficulty: undefined,
        label: undefined,
        repository: undefined,
        status: undefined,
      },
      page: 1,
      sort: "newest",
    });
  });

  it("builds shareable catalog and detail URLs without leaking default values", () => {
    const state = parseChallengeCatalogUrlState({
      query: "empty state",
      difficulty: "beginner",
      sort: "newest",
      page: "1",
    });

    expect(buildChallengeCatalogHref(state)).toBe(
      "/challenges?query=empty+state&difficulty=beginner",
    );

    expect(
      buildChallengeCatalogHref(state, {
        page: 2,
        sort: "highest-reward",
        filters: {
          repository: "octo-org/arena-repo",
        },
      }),
    ).toBe(
      "/challenges?query=empty+state&difficulty=beginner&repository=octo-org%2Farena-repo&sort=highest-reward&page=2",
    );

    expect(buildChallengeDetailHref("arena-repo-14-fix-empty-state", state)).toBe(
      "/challenges/arena-repo-14-fix-empty-state?query=empty+state&difficulty=beginner",
    );
  });
});
