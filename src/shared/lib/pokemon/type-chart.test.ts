import { describe, expect, it } from "vitest";

import { getTypeEffectiveness, TYPE_CHART } from "./type-chart";

describe("TYPE_CHART", () => {
  it("contains every Pokémon type", () => {
    expect(Object.keys(TYPE_CHART)).toHaveLength(18);
  });

  it("defines weak and strong matchups for every type", () => {
    for (const type of Object.values(TYPE_CHART)) {
      expect(type).toHaveProperty("weak");
      expect(type).toHaveProperty("strong");
      expect(Array.isArray(type.weak)).toBe(true);
      expect(Array.isArray(type.strong)).toBe(true);
    }
  });
});

describe("getTypeEffectiveness", () => {
  it("returns Fire weaknesses and strengths", () => {
    expect(getTypeEffectiveness(["fire"])).toEqual({
      weak: ["water", "rock", "ground"],
      strong: ["grass", "ice", "bug", "steel"],
    });
  });

  it("returns Water weaknesses and strengths", () => {
    expect(getTypeEffectiveness(["water"])).toEqual({
      weak: ["electric", "grass"],
      strong: ["fire", "rock", "ground"],
    });
  });

  it("combines matchups for dual types", () => {
    expect(getTypeEffectiveness(["grass", "poison"])).toEqual({
      weak: ["fire", "ice", "poison", "flying", "bug", "psychic"],
      strong: ["water", "rock", "grass", "fairy"],
    });
  });

  it("removes matchups that are both weak and strong", () => {
    const result = getTypeEffectiveness(["fire", "water"]);

    expect(result.weak).toContain("water");
    expect(result.strong).toContain("fire");
  });

  it("does not mutate the type chart", () => {
    const fireBefore = {
      ...TYPE_CHART.fire,
      weak: [...TYPE_CHART.fire.weak],
      strong: [...TYPE_CHART.fire.strong],
    };

    getTypeEffectiveness(["fire", "water"]);

    expect(TYPE_CHART.fire).toEqual(fireBefore);
  });
});
