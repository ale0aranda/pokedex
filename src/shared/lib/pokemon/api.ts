import { GEN_RANGES, POKEAPI_URL } from "@/shared/lib/pokemon/constants";
import {
	mapPokemon,
	type PokemonDetailResponse,
} from "@/shared/lib/pokemon/mappers";
import type { Generation, Pokemon } from "@/shared/lib/pokemon/types";

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

const FETCH_CONCURRENCY = 10;

let activeRequests = 0;
const requestQueue: (() => void)[] = [];

async function acquireRequestSlot(): Promise<void> {
	if (activeRequests < FETCH_CONCURRENCY) {
		activeRequests += 1;
		return;
	}

	await new Promise<void>((resolve) => {
		requestQueue.push(resolve);
	});

	activeRequests += 1;
}

function releaseRequestSlot(): void {
	activeRequests -= 1;

	const next = requestQueue.shift();

	if (next) {
		next();
	}
}

async function fetchJson<T>(url: string): Promise<T> {
	await acquireRequestSlot();

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`PokeAPI request failed: ${response.status}`);
		}

		return (await response.json()) as T;
	} finally {
		releaseRequestSlot();
	}
}

async function fetchPokemon(id: number): Promise<Pokemon> {
	const detail = await fetchJson<PokemonDetailResponse>(
		`${POKEAPI_URL}/pokemon/${id}`,
	);

	return mapPokemon(detail);
}

export async function fetchGen(gen: Generation): Promise<Pokemon[]> {
	const [start, end] = GEN_RANGES[gen];

	const ids = Array.from(
		{ length: end - start + 1 },
		(_, index) => start + index,
	);

	return Promise.all(ids.map(fetchPokemon));
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
