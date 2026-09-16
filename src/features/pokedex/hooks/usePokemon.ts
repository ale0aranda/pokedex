import { useEffect, useMemo, useState } from "react";

import { fetchGen } from "@/shared/lib/pokemon/api";
import { GEN_RANGES } from "@/shared/lib/pokemon/constants";
import type { Pokemon } from "@/shared/lib/pokemon/types";

export function usePokemon(gen: string) {
	const [cache, setCache] = useState<Record<number, Pokemon[]>>({});
	const [loadingGens, setLoadingGens] = useState<Set<number>>(new Set());

	const generations = useMemo(
		() => (gen === "" ? Object.keys(GEN_RANGES).map(Number) : [Number(gen)]),
		[gen],
	);

	useEffect(() => {
		const missing = generations.filter(
			(generation) => !cache[generation] && !loadingGens.has(generation),
		);

		if (missing.length === 0) {
			return;
		}

		setLoadingGens((previous) => new Set([...previous, ...missing]));

		for (const generation of missing) {
			fetchGen(generation)
				.then((data) => {
					setCache((previous) => ({
						...previous,
						[generation]: data,
					}));
				})
				.finally(() => {
					setLoadingGens((previous) => {
						const next = new Set(previous);
						next.delete(generation);
						return next;
					});
				});
		}
	}, [cache, generations, loadingGens]);

	const pokemon = useMemo(
		() => generations.flatMap((generation) => cache[generation] ?? []),
		[cache, generations],
	);

	const loading = generations.some((generation) => !cache[generation]);

	return {
		pokemon,
		loading,
	};
}
