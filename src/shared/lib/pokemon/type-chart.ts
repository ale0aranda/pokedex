import type { PokemonType } from "@/shared/lib/pokemon/types";

type TypeEffectiveness = {
	weak: PokemonType[];
	strong: PokemonType[];
};

export const TYPE_CHART: Record<PokemonType, TypeEffectiveness> = {
	normal: {
		weak: ["fighting"],
		strong: [],
	},

	fire: {
		weak: ["water", "rock", "ground"],
		strong: ["grass", "ice", "bug", "steel"],
	},

	water: {
		weak: ["electric", "grass"],
		strong: ["fire", "rock", "ground"],
	},

	electric: {
		weak: ["ground"],
		strong: ["water", "flying"],
	},

	grass: {
		weak: ["fire", "ice", "poison", "flying", "bug"],
		strong: ["water", "rock", "ground"],
	},

	ice: {
		weak: ["fire", "fighting", "rock", "steel"],
		strong: ["grass", "ground", "flying", "dragon"],
	},

	fighting: {
		weak: ["flying", "psychic", "fairy"],
		strong: ["normal", "ice", "rock", "dark", "steel"],
	},

	poison: {
		weak: ["ground", "psychic"],
		strong: ["grass", "fairy"],
	},

	ground: {
		weak: ["water", "grass", "ice"],
		strong: ["fire", "electric", "poison", "rock", "steel"],
	},

	flying: {
		weak: ["electric", "ice", "rock"],
		strong: ["grass", "fighting", "bug"],
	},

	psychic: {
		weak: ["bug", "ghost", "dark"],
		strong: ["fighting", "poison"],
	},

	bug: {
		weak: ["fire", "flying", "rock"],
		strong: ["grass", "psychic", "dark"],
	},

	rock: {
		weak: ["water", "grass", "fighting", "ground", "steel"],
		strong: ["fire", "ice", "flying", "bug"],
	},

	ghost: {
		weak: ["ghost", "dark"],
		strong: ["normal", "fighting"],
	},

	dragon: {
		weak: ["ice", "dragon", "fairy"],
		strong: ["dragon"],
	},

	dark: {
		weak: ["fighting", "bug", "fairy"],
		strong: ["ghost", "psychic"],
	},

	steel: {
		weak: ["fire", "fighting", "ground"],
		strong: ["ice", "rock", "fairy"],
	},

	fairy: {
		weak: ["poison", "steel"],
		strong: ["fighting", "dragon", "dark"],
	},
};

export function getTypeEffectiveness(types: PokemonType[]) {
	const weak = new Set<PokemonType>();
	const strong = new Set<PokemonType>();

	for (const type of types) {
		for (const weakType of TYPE_CHART[type].weak) {
			weak.add(weakType);
		}

		for (const strongType of TYPE_CHART[type].strong) {
			strong.add(strongType);
		}
	}

	for (const type of weak) {
		if (strong.has(type)) {
			weak.delete(type);
			strong.delete(type);
		}
	}

	return {
		weak: [...weak],
		strong: [...strong],
	};
}
