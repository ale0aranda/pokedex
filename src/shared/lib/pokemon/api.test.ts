import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchEvolutionChain, fetchGen } from "./api";

const createPokemonResponse = (id: number) => ({
	id,
	name: `pokemon-${id}`,
	height: 10,
	weight: 100,
	types: [
		{
			type: {
				name: "normal",
			},
		},
	],
	stats: [
		{ base_stat: 50, stat: { name: "hp" } },
		{ base_stat: 50, stat: { name: "attack" } },
		{ base_stat: 50, stat: { name: "defense" } },
		{ base_stat: 50, stat: { name: "special-attack" } },
		{ base_stat: 50, stat: { name: "special-defense" } },
		{ base_stat: 50, stat: { name: "speed" } },
	],
});

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

describe("fetchGen", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches all Pokémon from a generation", async () => {
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockImplementation(async (input) => {
				const url = String(input);
				const id = Number(url.split("/").pop());

				return jsonResponse(createPokemonResponse(id));
			});

		const result = await fetchGen(1);

		expect(result).toHaveLength(151);
		expect(fetchMock).toHaveBeenCalledTimes(151);
	});

	it("maps fetched Pokémon into the domain model", async () => {
		vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
			jsonResponse(createPokemonResponse(1)),
		);

		const result = await fetchGen(1);

		expect(result[0]).toEqual({
			id: 1,
			name: "pokemon-1",
			types: ["normal"],
			hp: 50,
			attack: 50,
			defense: 50,
			specialAttack: 50,
			specialDefense: 50,
			speed: 50,
			height: 10,
			weight: 100,
			generation: 1,
		});
	});
});

describe("fetchEvolutionChain", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches and maps an evolution chain", async () => {
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockImplementation(async (input) => {
				const url = String(input);

				if (url.includes("/pokemon-species/1")) {
					return jsonResponse({
						evolution_chain: {
							url: "https://pokeapi.co/api/v2/evolution-chain/1/",
						},
					});
				}

				return jsonResponse({
					chain: {
						species: {
							name: "bulbasaur",
							url: "https://pokeapi.co/api/v2/pokemon-species/1/",
						},
						evolves_to: [
							{
								species: {
									name: "ivysaur",
									url: "https://pokeapi.co/api/v2/pokemon-species/2/",
								},
								evolves_to: [
									{
										species: {
											name: "venusaur",
											url: "https://pokeapi.co/api/v2/pokemon-species/3/",
										},
										evolves_to: [],
									},
								],
							},
						],
					},
				});
			});

		const result = await fetchEvolutionChain(1);

		expect(result).toEqual([
			{ id: 1, name: "bulbasaur" },
			{ id: 2, name: "ivysaur" },
			{ id: 3, name: "venusaur" },
		]);

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("supports branching evolution chains", async () => {
		vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
			const url = String(input);

			if (url.includes("/pokemon-species/1")) {
				return jsonResponse({
					evolution_chain: {
						url: "https://pokeapi.co/api/v2/evolution-chain/1/",
					},
				});
			}

			return jsonResponse({
				chain: {
					species: {
						name: "eevee",
						url: "https://pokeapi.co/api/v2/pokemon-species/1/",
					},
					evolves_to: [
						{
							species: {
								name: "vaporeon",
								url: "https://pokeapi.co/api/v2/pokemon-species/2/",
							},
							evolves_to: [],
						},
						{
							species: {
								name: "jolteon",
								url: "https://pokeapi.co/api/v2/pokemon-species/3/",
							},
							evolves_to: [],
						},
					],
				},
			});
		});

		const result = await fetchEvolutionChain(1);

		expect(result).toEqual([
			{ id: 1, name: "eevee" },
			{ id: 2, name: "vaporeon" },
			{ id: 3, name: "jolteon" },
		]);
	});

	it("throws when the species request fails", async () => {
		vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
			jsonResponse(null, 404),
		);

		await expect(fetchEvolutionChain(9999)).rejects.toThrow(
			"PokeAPI request failed: 404",
		);
	});
});
