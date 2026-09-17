import { describe, expect, it } from "vitest";

import type { Pokemon } from "@/shared/lib/pokemon/types";

import { filterAndSortPokemon, filterPokemon, sortPokemon } from "./filters";

const pokemon: Pokemon[] = [
	{
		id: 25,
		name: "pikachu",
		types: ["electric"],
		hp: 35,
		attack: 55,
		defense: 40,
		specialAttack: 50,
		specialDefense: 50,
		speed: 90,
		height: 4,
		weight: 60,
		generation: 1,
	},
	{
		id: 4,
		name: "charmander",
		types: ["fire"],
		hp: 39,
		attack: 52,
		defense: 43,
		specialAttack: 60,
		specialDefense: 50,
		speed: 65,
		height: 6,
		weight: 85,
		generation: 1,
	},
	{
		id: 1,
		name: "bulbasaur",
		types: ["grass", "poison"],
		hp: 45,
		attack: 49,
		defense: 49,
		specialAttack: 65,
		specialDefense: 65,
		speed: 45,
		height: 7,
		weight: 69,
		generation: 1,
	},
];

describe("filterPokemon", () => {
	it("returns all Pokémon when there are no filters", () => {
		expect(filterPokemon(pokemon, "", "")).toEqual(pokemon);
	});

	it("filters by name", () => {
		const result = filterPokemon(pokemon, "pikachu", "");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("pikachu");
	});

	it("filters by name case-insensitively", () => {
		const result = filterPokemon(pokemon, "PIKACHU", "");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("pikachu");
	});

	it("trims the search query", () => {
		const result = filterPokemon(pokemon, "  pikachu  ", "");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("pikachu");
	});

	it("filters by Pokémon ID", () => {
		const result = filterPokemon(pokemon, "25", "");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("pikachu");
	});

	it("filters by partial ID", () => {
		const result = filterPokemon(pokemon, "2", "");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("pikachu");
	});

	it("filters by type", () => {
		const result = filterPokemon(pokemon, "", "fire");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("charmander");
	});

	it("supports Pokémon with multiple types", () => {
		const result = filterPokemon(pokemon, "", "poison");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("bulbasaur");
	});

	it("combines search and type filters", () => {
		const result = filterPokemon(pokemon, "bul", "grass");

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("bulbasaur");
	});

	it("returns an empty array when nothing matches", () => {
		expect(filterPokemon(pokemon, "mewtwo", "")).toEqual([]);
	});
});

describe("sortPokemon", () => {
	it("sorts by name ascending", () => {
		const result = sortPokemon(pokemon, "name", "asc");

		expect(result.map((item) => item.name)).toEqual([
			"bulbasaur",
			"charmander",
			"pikachu",
		]);
	});

	it("sorts by name descending", () => {
		const result = sortPokemon(pokemon, "name", "desc");

		expect(result.map((item) => item.name)).toEqual([
			"pikachu",
			"charmander",
			"bulbasaur",
		]);
	});

	it("sorts by ID ascending", () => {
		const result = sortPokemon(pokemon, "id", "asc");

		expect(result.map((item) => item.id)).toEqual([1, 4, 25]);
	});

	it("sorts by ID descending", () => {
		const result = sortPokemon(pokemon, "id", "desc");

		expect(result.map((item) => item.id)).toEqual([25, 4, 1]);
	});

	it("sorts by total stats ascending", () => {
		const result = sortPokemon(pokemon, "total", "asc");

		expect(result.map((item) => item.name)).toEqual([
			"charmander",
			"bulbasaur",
			"pikachu",
		]);
	});

	it("sorts by total stats descending", () => {
		const result = sortPokemon(pokemon, "total", "desc");

		expect(result.map((item) => item.name)).toEqual([
			"pikachu",
			"bulbasaur",
			"charmander",
		]);
	});

	it("does not mutate the original array", () => {
		const original = [...pokemon];

		sortPokemon(pokemon, "name", "asc");

		expect(pokemon).toEqual(original);
	});
});

describe("filterAndSortPokemon", () => {
	it("filters and then sorts the Pokémon", () => {
		const result = filterAndSortPokemon(pokemon, "", "", "name", "asc", 0);

		expect(result.map((item) => item.name)).toEqual([
			"bulbasaur",
			"charmander",
			"pikachu",
		]);
	});

	it("applies the filter before sorting", () => {
		const result = filterAndSortPokemon(pokemon, "", "", "id", "desc", 0);

		expect(result.map((item) => item.id)).toEqual([25, 4, 1]);
	});

	it("produces deterministic results for the same shuffle seed", () => {
		const first = filterAndSortPokemon(pokemon, "", "", "name", "asc", 42);

		const second = filterAndSortPokemon(pokemon, "", "", "name", "asc", 42);

		expect(first).toEqual(second);
	});

	it("does not shuffle when the seed is zero", () => {
		const result = filterAndSortPokemon(pokemon, "", "", "name", "asc", 0);

		expect(result.map((item) => item.name)).toEqual([
			"bulbasaur",
			"charmander",
			"pikachu",
		]);
	});
});
