import { GEN_RANGES, POKEAPI_URL } from "@/shared/lib/pokemon/constants";
import { mapPokemon } from "@/shared/lib/pokemon/mappers";
import type { Pokemon } from "@/shared/lib/pokemon/types";

interface PokemonListResponse {
	results: {
		name: string;
		url: string;
	}[];
}

interface PokemonDetailResponse {
	id: number;
	name: string;
	height: number;
	weight: number;
	types: {
		type: {
			name: Pokemon["types"][number];
		};
	}[];
	stats: {
		base_stat: number;
		stat: {
			name: string;
		};
	}[];
}

interface PokemonSpeciesResponse {
	evolution_chain: {
		url: string;
	};
}

interface EvolutionChainNode {
	species: {
		name: string;
		url: string;
	};
	evolves_to: EvolutionChainNode[];
}

interface EvolutionChainResponse {
	chain: EvolutionChainNode;
}

export interface Evolution {
	id: number;
	name: string;
}

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`PokeAPI request failed: ${response.status}`);
	}

	return response.json() as Promise<T>;
}

async function fetchPokemon(id: number): Promise<Pokemon> {
	const detail = await fetchJson<PokemonDetailResponse>(
		`${POKEAPI_URL}/pokemon/${id}`,
	);

	return mapPokemon(detail);
}

export async function fetchGen(gen: number): Promise<Pokemon[]> {
	const range = GEN_RANGES[gen as keyof typeof GEN_RANGES];

	if (!range) {
		throw new Error(`Unknown Pokémon generation: ${gen}`);
	}

	const [start, end] = range;

	const ids = Array.from(
		{ length: end - start + 1 },
		(_, index) => start + index,
	);

	return Promise.all(ids.map(fetchPokemon));
}

export async function getPokemonList(): Promise<Pokemon[]> {
	const { results } = await fetchJson<PokemonListResponse>(
		`${POKEAPI_URL}/pokemon?limit=1025`,
	);

	return Promise.all(
		results.map(({ url }) =>
			fetchJson<PokemonDetailResponse>(url).then(mapPokemon),
		),
	);
}

function getIdFromUrl(url: string): number {
	const parts = url.split("/").filter(Boolean);
	const id = Number(parts.at(-1));

	if (!Number.isInteger(id)) {
		throw new Error(`Invalid Pokémon species URL: ${url}`);
	}

	return id;
}

function mapEvolutionChain(
	node: EvolutionChainNode,
	result: Evolution[],
): void {
	result.push({
		id: getIdFromUrl(node.species.url),
		name: node.species.name,
	});

	for (const evolution of node.evolves_to) {
		mapEvolutionChain(evolution, result);
	}
}

export async function fetchEvolutionChain(id: number): Promise<Evolution[]> {
	const species = await fetchJson<PokemonSpeciesResponse>(
		`${POKEAPI_URL}/pokemon-species/${id}`,
	);

	const evolutionChain = await fetchJson<EvolutionChainResponse>(
		species.evolution_chain.url,
	);

	const result: Evolution[] = [];

	mapEvolutionChain(evolutionChain.chain, result);

	return result;
}
