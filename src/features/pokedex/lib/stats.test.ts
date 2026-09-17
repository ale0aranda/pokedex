import { describe, expect, it } from "vitest";

import { STAT_CONFIG } from "./stats";

describe("STAT_CONFIG", () => {
  it("contains all six Pokémon stats", () => {
    expect(STAT_CONFIG).toHaveLength(6);
  });

  it("contains stats in the expected display order", () => {
    expect(STAT_CONFIG.map((stat) => stat.key)).toEqual([
      "hp",
      "attack",
      "defense",
      "specialAttack",
      "specialDefense",
      "speed",
    ]);
  });

  it("contains the expected display labels", () => {
    expect(STAT_CONFIG.map((stat) => stat.label)).toEqual([
      "HP",
      "ATK",
      "DEF",
      "SP.ATK",
      "SP.DEF",
      "SPD",
    ]);
  });

  it("contains unique stat keys", () => {
    const keys = STAT_CONFIG.map((stat) => stat.key);

    expect(new Set(keys).size).toBe(keys.length);
  });
});
