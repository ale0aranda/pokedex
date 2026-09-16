import type { ALL_TYPES, GEN_RANGES } from "./constants";

export type PokemonType = (typeof ALL_TYPES)[number];

export type Generation = keyof typeof GEN_RANGES;

export interface Pokemon {
	id: number;
	name: string;
	types: PokemonType[];

	hp: number;
	attack: number;
	defense: number;
	specialAttack: number;
	specialDefense: number;
	speed: number;

	height: number;
	weight: number;
	generation: Generation;
}
