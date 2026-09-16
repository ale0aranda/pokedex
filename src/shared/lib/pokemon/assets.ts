const SPRITES_URL =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function getPokemonSpriteUrl(id: number): string {
	return `${SPRITES_URL}/${id}.png`;
}

export function getPokemonArtworkUrl(id: number): string {
	return `${SPRITES_URL}/other/official-artwork/${id}.png`;
}
