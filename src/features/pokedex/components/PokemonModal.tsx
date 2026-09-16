import { useEffect, useState } from "react";

import { STAT_CONFIG } from "@/features/pokedex/lib/stats";
import { fetchEvolutionChain } from "@/shared/lib/pokemon/api";
import {
	getPokemonArtworkUrl,
	getPokemonSpriteUrl,
} from "@/shared/lib/pokemon/assets";
import { MAX_BASE_STAT } from "@/shared/lib/pokemon/constants";
import { getTypeEffectiveness } from "@/shared/lib/pokemon/type-chart";
import type { Pokemon } from "@/shared/lib/pokemon/types";

type Props = {
	pokemon: Pokemon | null;
	onClose: () => void;
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

export function PokemonModal({ pokemon, onClose }: Props) {
	const [evoChain, setEvoChain] = useState<
		Awaited<ReturnType<typeof fetchEvolutionChain>>
	>([]);
	const [evoLoading, setEvoLoading] = useState(false);

	useEffect(() => {
		if (!pokemon) {
			return;
		}

		let cancelled = false;

		setEvoChain([]);
		setEvoLoading(true);

		fetchEvolutionChain(pokemon.id)
			.then((chain) => {
				if (!cancelled) {
					setEvoChain(chain);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setEvoChain([]);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setEvoLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [pokemon]);

	useEffect(() => {
		if (!pokemon) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [pokemon, onClose]);

	if (!pokemon) {
		return null;
	}

	const number = String(pokemon.id).padStart(3, "0");
	const primaryType = pokemon.types[0];
	const typeColor = `var(--type-${primaryType})`;
	const artwork = getPokemonArtworkUrl(pokemon.id);
	const { weak, strong } = getTypeEffectiveness(pokemon.types);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
			role="presentation"
		>
			<div
				className="relative w-full overflow-hidden rounded-2xl"
				style={{
					maxWidth: "660px",
					background: `color-mix(in srgb, ${typeColor} 7%, white)`,
					border: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
					boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
				}}
				onClick={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="pokemon-modal-title"
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full font-pokemon text-[10px] text-zinc-500 transition hover:bg-zinc-200"
					style={{
						background: "rgba(255,255,255,0.85)",
						border: "0.5px solid rgba(0,0,0,0.08)",
					}}
					aria-label="Close"
				>
					✕
				</button>

				<div className="flex">
					<div
						className="relative flex shrink-0 flex-col items-center justify-center gap-2 overflow-hidden p-5"
						style={{ width: "190px" }}
					>
						<span
							className="pointer-events-none absolute select-none font-pokemon"
							style={{
								right: "-10px",
								bottom: "-16px",
								fontSize: "80px",
								color: typeColor,
								opacity: 0.08,
								lineHeight: 1,
							}}
						>
							{number}
						</span>

						<img
							src={artwork}
							alt={pokemon.name}
							className="relative h-24 w-24"
						/>

						<span
							className="font-pokemon text-[7px]"
							style={{
								color: `color-mix(in srgb, ${typeColor} 55%, transparent)`,
							}}
						>
							#{number}
						</span>

						<h2
							id="pokemon-modal-title"
							className="font-pokemon capitalize"
							style={{
								fontSize: "11px",
								color: "var(--pk-ink, #1a1a1a)",
								margin: 0,
							}}
						>
							{pokemon.name}
						</h2>

						<div className="flex gap-1.5">
							{pokemon.types.map((type) => (
								<span
									key={type}
									className="font-pokemon capitalize text-white"
									style={{
										background: `var(--type-${type})`,
										fontSize: "7px",
										padding: "3px 9px",
										borderRadius: "999px",
									}}
								>
									{type}
								</span>
							))}
						</div>

						<div className="mt-1 flex gap-3">
							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{pokemon.hp}{" "}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									hp
								</span>
							</span>

							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{(pokemon.height / 10).toFixed(1)}m{" "}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									ht
								</span>
							</span>

							<span
								className="font-pokemon text-[8px]"
								style={{ color: typeColor }}
							>
								{ROMAN[pokemon.generation]}
								<span className="text-zinc-400" style={{ fontSize: "6px" }}>
									{" "}
									gen
								</span>
							</span>
						</div>
					</div>

					<div
						className="flex min-w-0 flex-1 flex-col"
						style={{
							borderLeft: `0.5px solid color-mix(in srgb, ${typeColor} 20%, transparent)`,
						}}
					>
						<div className="p-4 pb-3">
							<p
								className="mb-2 font-pokemon text-zinc-400"
								style={{
									fontSize: "6px",
									letterSpacing: "0.1em",
								}}
							>
								BASE STATS
							</p>

							<div className="flex flex-col gap-1.5">
								{STAT_CONFIG.map(({ key, label }) => {
									const value = pokemon[key];
									const percentage = Math.round((value / MAX_BASE_STAT) * 100);

									return (
										<div key={key} className="flex items-center gap-2">
											<span
												className="font-pokemon text-zinc-400"
												style={{
													fontSize: "6px",
													width: "44px",
												}}
											>
												{label}
											</span>

											<span
												className="font-pokemon text-zinc-700"
												style={{
													fontSize: "7px",
													width: "20px",
													textAlign: "right",
												}}
											>
												{value}
											</span>

											<div
												className="flex-1 overflow-hidden rounded-full"
												style={{
													background: "rgba(0,0,0,0.07)",
												}}
											>
												<div
													className="rounded-full"
													style={{
														width: `${percentage}%`,
														height: "5px",
														background: typeColor,
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div
							style={{
								height: "0.5px",
								background: `color-mix(in srgb, ${typeColor} 15%, transparent)`,
								margin: "0 16px",
							}}
						/>

						<div className="p-4 py-3">
							<div className="mb-2">
								<p
									className="mb-1.5 font-pokemon text-zinc-400"
									style={{
										fontSize: "6px",
										letterSpacing: "0.1em",
									}}
								>
									weak against
								</p>

								<TypeList types={weak} multiplier />
							</div>

							<div>
								<p
									className="mb-1.5 font-pokemon text-zinc-400"
									style={{
										fontSize: "6px",
										letterSpacing: "0.1em",
									}}
								>
									strong against
								</p>

								<TypeList types={strong} />
							</div>
						</div>

						<div
							style={{
								height: "0.5px",
								background: `color-mix(in srgb, ${typeColor} 15%, transparent)`,
								margin: "0 16px",
							}}
						/>

						<div className="p-4 py-3">
							<p
								className="mb-2 font-pokemon text-zinc-400"
								style={{
									fontSize: "6px",
									letterSpacing: "0.1em",
								}}
							>
								EVOLUTION CHAIN
							</p>

							{evoLoading ? (
								<span
									className="font-pokemon text-zinc-400"
									style={{ fontSize: "6px" }}
								>
									loading...
								</span>
							) : evoChain.length <= 1 ? (
								<span
									className="font-pokemon text-zinc-300"
									style={{ fontSize: "6px" }}
								>
									no evolution chain
								</span>
							) : (
								<div className="flex items-center gap-2">
									{evoChain.map((evolution, index) => {
										const isActive = evolution.id === pokemon.id;
										const sprite = getPokemonSpriteUrl(evolution.id);

										return (
											<div
												key={evolution.id}
												className="flex items-center gap-2"
											>
												{index > 0 && (
													<span
														className="shrink-0 font-pokemon text-zinc-400"
														style={{
															fontSize: "7px",
														}}
													>
														→
													</span>
												)}

												<div
													className="flex flex-col items-center gap-1"
													style={{
														background: isActive
															? `color-mix(in srgb, ${typeColor} 12%, white)`
															: "transparent",
														border: isActive
															? `1px solid color-mix(in srgb, ${typeColor} 28%, transparent)`
															: "1px solid transparent",
														borderRadius: "8px",
														padding: "4px 5px",
													}}
												>
													<img
														src={sprite}
														alt={evolution.name}
														style={{
															width: "36px",
															height: "36px",
															imageRendering: "pixelated",
														}}
													/>

													<span
														className="font-pokemon capitalize"
														style={{
															fontSize: "5px",
															color: isActive ? typeColor : "#aaa",
														}}
													>
														{evolution.name}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type TypeListProps = {
	types: Pokemon["types"];
	multiplier?: boolean;
};

function TypeList({ types, multiplier = false }: TypeListProps) {
	if (types.length === 0) {
		return (
			<span className="font-pokemon text-zinc-300" style={{ fontSize: "6px" }}>
				—
			</span>
		);
	}

	return (
		<div className="flex flex-wrap gap-1">
			{types.map((type) => (
				<span
					key={type}
					className="font-pokemon capitalize text-white"
					style={{
						background: `var(--type-${type})`,
						fontSize: "6px",
						padding: "2px 7px",
						borderRadius: "999px",
					}}
				>
					{type}
					{multiplier ? " ×2" : ""}
				</span>
			))}
		</div>
	);
}
