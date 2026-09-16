import type { CSSProperties } from "react";

import { getPokemonSpriteUrl } from "@/shared/lib/pokemon/assets";
import type { Pokemon } from "@/shared/lib/pokemon/types";

type Props = {
	pokemon: Pokemon;
	onClick: () => void;
};

export function PokemonCard({ pokemon, onClick }: Props) {
	const number = String(pokemon.id).padStart(3, "0");
	const sprite = getPokemonSpriteUrl(pokemon.id);
	const primaryType = pokemon.types[0];

	const cardStyle: CSSProperties & Record<"--pk-color", string> = {
		"--pk-color": `var(--type-${primaryType})`,
	};

	return (
		<button
			type="button"
			className="block w-full cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-zinc-300 sm:flex sm:flex-col"
			style={cardStyle}
			onClick={onClick}
			aria-label={`View ${pokemon.name}`}
		>
			<div className="flex">
				<div className="w-1 shrink-0 bg-(--pk-color) sm:h-1 sm:w-auto" />

				<div className="flex shrink-0 items-center justify-center bg-zinc-100 px-3 py-2 sm:px-0 sm:py-3">
					<img
						src={sprite}
						alt={pokemon.name}
						loading="lazy"
						className="pixelated h-14 w-14 sm:h-16 sm:w-16"
					/>
				</div>

				<div className="flex flex-1 flex-col justify-center p-2.5 sm:block">
					<div className="mb-1 flex items-baseline justify-between">
						<span className="font-pokemon text-[7px] text-zinc-400">
							#{number}
						</span>

						<span className="font-pokemon text-[6px] text-zinc-500">
							<b className="text-[9px] text-(--pk-color)">{pokemon.hp}</b> HP
						</span>
					</div>

					<p className="mb-1.5 font-pokemon text-[7px] capitalize leading-[1.4] text-zinc-800">
						{pokemon.name}
					</p>

					<div className="flex flex-wrap gap-1">
						{pokemon.types.map((type) => (
							<span
								key={type}
								className="rounded px-1.5 py-0.5 font-pokemon text-[7px] font-semibold capitalize text-white"
								style={{
									background: `var(--type-${type})`,
								}}
							>
								{type}
							</span>
						))}
					</div>
				</div>
			</div>
		</button>
	);
}
