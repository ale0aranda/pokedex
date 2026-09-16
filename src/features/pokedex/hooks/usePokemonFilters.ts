import { useMemo } from "react";

import { filterAndSortPokemon } from "@/features/pokedex/lib/filters";
import type { Pokemon, PokemonType } from "@/shared/lib/pokemon/types";

import type { SortDirection, SortKey } from "../types/pokedex";

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
