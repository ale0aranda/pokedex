import type { Pokemon, PokemonType } from "@/shared/lib/pokemon/types";
import { getStatTotal } from "@/shared/lib/pokemon/utils";

import type { SortDirection, SortKey } from "../types/pokedex";

function seededRandom(seed: number) {
	return () => {
		seed += 0x6d2b79f5;

		let value = seed;

		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
	const result = [...items];
	const random = seededRandom(seed);

	for (let index = result.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(random() * (index + 1));

		[result[index], result[randomIndex]] = [result[randomIndex], result[index]];
	}

	return result;
}

function getSortValue(pokemon: Pokemon, sortKey: SortKey): number | string {
	if (sortKey === "name") {
		return pokemon.name;
	}

	if (sortKey === "total") {
		return getStatTotal(pokemon);
	}

	return pokemon[sortKey];
}

export function filterPokemon(
	pokemon: Pokemon[],
	query: string,
	typeFilter: PokemonType | "",
): Pokemon[] {
	const normalizedQuery = query.toLowerCase().trim();

	return pokemon.filter((item) => {
		const matchesQuery =
			!normalizedQuery ||
			item.name.includes(normalizedQuery) ||
			String(item.id).includes(normalizedQuery);

		const matchesType = !typeFilter || item.types.includes(typeFilter);

		return matchesQuery && matchesType;
	});
}

export function sortPokemon(
	pokemon: Pokemon[],
	sortKey: SortKey,
	sortDirection: SortDirection,
): Pokemon[] {
	return [...pokemon].sort((a, b) => {
		const first = getSortValue(a, sortKey);
		const second = getSortValue(b, sortKey);

		const comparison =
			typeof first === "string" && typeof second === "string"
				? first.localeCompare(second)
				: Number(first) - Number(second);

		return sortDirection === "asc" ? comparison : -comparison;
	});
}

export function filterAndSortPokemon(
	pokemon: Pokemon[],
	query: string,
	typeFilter: PokemonType | "",
	sortKey: SortKey,
	sortDirection: SortDirection,
	shuffleSeed: number,
): Pokemon[] {
	const filtered = filterPokemon(pokemon, query, typeFilter);

	if (shuffleSeed !== 0) {
		return shuffleWithSeed(filtered, shuffleSeed);
	}

	return sortPokemon(filtered, sortKey, sortDirection);
}
