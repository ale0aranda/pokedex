import { GEN_RANGES } from "./constants";
import type { Generation, Pokemon } from "./types";

export function getGeneration(id: number): Generation {
	for (const [generation, [start, end]] of Object.entries(GEN_RANGES)) {
		if (id >= start && id <= end) {
			return Number(generation) as Generation;
		}
	}

	throw new Error(`Unknown Pokémon generation for id: ${id}`);
}

export function getStatTotal(
	pokemon: Pick<
		Pokemon,
		"hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed"
	>,
): number {
	return (
		pokemon.hp +
		pokemon.attack +
		pokemon.defense +
		pokemon.specialAttack +
		pokemon.specialDefense +
		pokemon.speed
	);
}
