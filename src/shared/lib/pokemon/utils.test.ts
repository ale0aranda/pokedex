import { describe, expect, it } from "vitest";

import { getGeneration, getStatTotal } from "./utils";

describe("getGeneration", () => {
	it("returns the correct generation for Pokémon IDs", () => {
		expect(getGeneration(1)).toBe(1);
		expect(getGeneration(151)).toBe(1);
		expect(getGeneration(152)).toBe(2);
		expect(getGeneration(251)).toBe(2);
		expect(getGeneration(1025)).toBe(9);
	});

	it("throws for an unknown Pokémon ID", () => {
		expect(() => getGeneration(0)).toThrow(
			"Unknown Pokémon generation for id: 0",
		);

		expect(() => getGeneration(1026)).toThrow(
			"Unknown Pokémon generation for id: 1026",
		);
	});
});

describe("getStatTotal", () => {
	it("returns the sum of all six stats", () => {
		const pokemon = {
			hp: 45,
			attack: 49,
			defense: 49,
			specialAttack: 65,
			specialDefense: 65,
			speed: 45,
		};

		expect(getStatTotal(pokemon)).toBe(318);
	});

	it("handles zero stats", () => {
		const pokemon = {
			hp: 0,
			attack: 0,
			defense: 0,
			specialAttack: 0,
			specialDefense: 0,
			speed: 0,
		};

		expect(getStatTotal(pokemon)).toBe(0);
	});
});
