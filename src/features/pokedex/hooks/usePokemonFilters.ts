import { useMemo } from "react";

import type { Pokemon } from "@/shared/lib/pokemon/types";
import type { PokemonType, SortDirection, SortKey } from "../types/pokedex";

import { filterAndSortPokemon } from "@/features/pokedex/lib/filters";

export type { SortDirection };

export function usePokemonFilters(
	pokemon: Pokemon[],
	query: string,
	typeFilter: PokemonType | "",
	sortKey: SortKey = "id",
	sortDirection: SortDirection = "asc",
	shuffleSeed = 0,
) {
	return useMemo(
		() =>
			filterAndSortPokemon(
				pokemon,
				query,
				typeFilter,
				sortKey,
				sortDirection,
				shuffleSeed,
			),
		[pokemon, query, typeFilter, sortKey, sortDirection, shuffleSeed],
	);
}
