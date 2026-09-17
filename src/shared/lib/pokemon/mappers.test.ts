import { describe, expect, it } from "vitest";

import type { PokemonDetailResponse } from "./mappers";
import { mapPokemon } from "./mappers";

function createPokemonDetail(
	overrides: Partial<PokemonDetailResponse> = {},
): PokemonDetailResponse {
	return {
		id: 25,
		name: "pikachu",
		height: 4,
		weight: 60,
		types: [
			{
				type: {
					name: "electric",
				},
			},
		],
		stats: [
			{ base_stat: 35, stat: { name: "hp" } },
			{ base_stat: 55, stat: { name: "attack" } },
			{ base_stat: 40, stat: { name: "defense" } },
			{ base_stat: 50, stat: { name: "special-attack" } },
			{ base_stat: 50, stat: { name: "special-defense" } },
			{ base_stat: 90, stat: { name: "speed" } },
		],
		...overrides,
	};
}

describe("mapPokemon", () => {
	it("maps Pokémon details into the domain model", () => {
		const result = mapPokemon(createPokemonDetail());

		expect(result).toEqual({
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
		});
	});

	it("maps multiple Pokémon types", () => {
		const result = mapPokemon(
			createPokemonDetail({
				id: 1,
				types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
			}),
		);

		expect(result.types).toEqual(["grass", "poison"]);
	});

	it("maps all six Pokémon stats", () => {
		const result = mapPokemon(createPokemonDetail());

		expect(result.hp).toBe(35);
		expect(result.attack).toBe(55);
		expect(result.defense).toBe(40);
		expect(result.specialAttack).toBe(50);
		expect(result.specialDefense).toBe(50);
		expect(result.speed).toBe(90);
	});

	it("defaults missing stats to zero", () => {
		const detail = createPokemonDetail({
			stats: [
				{ base_stat: 35, stat: { name: "hp" } },
				{ base_stat: 55, stat: { name: "attack" } },
			],
		});

		const result = mapPokemon(detail);

		expect(result.hp).toBe(35);
		expect(result.attack).toBe(55);
		expect(result.defense).toBe(0);
		expect(result.specialAttack).toBe(0);
		expect(result.specialDefense).toBe(0);
		expect(result.speed).toBe(0);
	});

	it("maps the generation from the Pokémon ID", () => {
		expect(mapPokemon(createPokemonDetail({ id: 151 })).generation).toBe(1);
		expect(mapPokemon(createPokemonDetail({ id: 152 })).generation).toBe(2);
		expect(mapPokemon(createPokemonDetail({ id: 1025 })).generation).toBe(9);
	});
});
