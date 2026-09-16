import type { Pokemon } from "@/shared/lib/pokemon/types";
import { getGeneration } from "@/shared/lib/pokemon/utils";

export interface PokemonDetailResponse {
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

function getStat(stats: PokemonDetailResponse["stats"], name: string): number {
	return stats.find(({ stat }) => stat.name === name)?.base_stat ?? 0;
}

export function mapPokemon(detail: PokemonDetailResponse): Pokemon {
	return {
		id: detail.id,
		name: detail.name,
		types: detail.types.map(({ type }) => type.name),
		hp: getStat(detail.stats, "hp"),
		attack: getStat(detail.stats, "attack"),
		defense: getStat(detail.stats, "defense"),
		specialAttack: getStat(detail.stats, "special-attack"),
		specialDefense: getStat(detail.stats, "special-defense"),
		speed: getStat(detail.stats, "speed"),
		height: detail.height,
		weight: detail.weight,
		generation: getGeneration(detail.id),
	};
}
