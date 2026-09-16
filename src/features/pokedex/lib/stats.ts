import type { Pokemon } from "@/shared/lib/pokemon/types";

export const STAT_CONFIG = [
	{ key: "hp", label: "HP" },
	{ key: "attack", label: "ATK" },
	{ key: "defense", label: "DEF" },
	{ key: "specialAttack", label: "SP.ATK" },
	{ key: "specialDefense", label: "SP.DEF" },
	{ key: "speed", label: "SPD" },
] as const satisfies ReadonlyArray<{
	key: keyof Pick<
		Pokemon,
		"hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed"
	>;
	label: string;
}>;
