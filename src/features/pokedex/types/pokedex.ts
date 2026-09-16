import type { PokemonType } from "@/shared/lib/pokemon/types";

import type { SORT_OPTIONS } from "@/shared/lib/pokemon/constants";

export type { PokemonType };

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type SortDirection = "asc" | "desc";
