export const POKEAPI_URL = "https://pokeapi.co/api/v2";

export const GEN_RANGES = {
	1: [1, 151],
	2: [152, 251],
	3: [252, 386],
	4: [387, 493],
	5: [494, 649],
	6: [650, 721],
	7: [722, 809],
	8: [810, 905],
	9: [906, 1025],
} as const;

export const ALL_TYPES = [
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
] as const;

export const SORT_OPTIONS = [
	{ value: "id", label: "Number" },
	{ value: "name", label: "Name (A-Z)" },
	{ value: "total", label: "Total stats" },
	{ value: "hp", label: "HP" },
	{ value: "attack", label: "Attack" },
	{ value: "defense", label: "Defense" },
	{ value: "specialAttack", label: "Sp. Atk" },
	{ value: "specialDefense", label: "Sp. Def" },
	{ value: "speed", label: "Speed" },
] as const;

export const MAX_BASE_STAT = 255;
