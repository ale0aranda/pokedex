import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchGen } from "@/shared/lib/pokemon/api";
import type { Generation, Pokemon } from "@/shared/lib/pokemon/types";

import { usePokemon } from "./usePokemon";

vi.mock("@/shared/lib/pokemon/api", () => ({
	fetchGen: vi.fn(),
}));

const mockedFetchGen = vi.mocked(fetchGen);

const createPokemon = (id: number, generation: Generation = 1): Pokemon => ({
	id,
	name: `pokemon-${id}`,
	types: ["normal"],
	hp: 50,
	attack: 50,
	defense: 50,
	specialAttack: 50,
	specialDefense: 50,
	speed: 50,
	height: 10,
	weight: 100,
	generation,
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("usePokemon", () => {
	it("loads the requested generation", async () => {
		const pokemon = [createPokemon(1), createPokemon(2)];

		mockedFetchGen.mockResolvedValue(pokemon);

		const { result } = renderHook(() => usePokemon("1"));

		expect(result.current.loading).toBe(true);
		expect(result.current.pokemon).toEqual([]);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.pokemon).toEqual(pokemon);
		expect(mockedFetchGen).toHaveBeenCalledTimes(1);
		expect(mockedFetchGen).toHaveBeenCalledWith(1);
	});

	it("loads all generations when no generation is selected", async () => {
		mockedFetchGen.mockImplementation(async (generation) => [
			createPokemon(generation, generation),
		]);

		const { result } = renderHook(() => usePokemon(""));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(9);

		expect(result.current.pokemon).toHaveLength(9);
		expect(result.current.pokemon.map((pokemon) => pokemon.id)).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9,
		]);
	});

	it("caches loaded generations", async () => {
		mockedFetchGen.mockResolvedValue([createPokemon(1)]);

		const { result, rerender } = renderHook(({ gen }) => usePokemon(gen), {
			initialProps: { gen: "1" },
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(1);

		rerender({ gen: "1" });

		await waitFor(() => {
			expect(result.current.pokemon).toEqual([createPokemon(1)]);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(1);
	});

	it("loads a new generation when the selected generation changes", async () => {
		mockedFetchGen.mockImplementation(async (generation) => [
			createPokemon(generation, generation),
		]);

		const { result, rerender } = renderHook(({ gen }) => usePokemon(gen), {
			initialProps: { gen: "1" },
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		rerender({ gen: "2" });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(2);
		expect(mockedFetchGen).toHaveBeenNthCalledWith(1, 1);
		expect(mockedFetchGen).toHaveBeenNthCalledWith(2, 2);

		expect(result.current.pokemon).toEqual([createPokemon(2, 2)]);
	});

	it("uses the cached generation when switching back to it", async () => {
		mockedFetchGen.mockImplementation(async (generation) => [
			createPokemon(generation, generation),
		]);

		const { result, rerender } = renderHook(({ gen }) => usePokemon(gen), {
			initialProps: { gen: "1" },
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		rerender({ gen: "2" });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		rerender({ gen: "1" });

		await waitFor(() => {
			expect(result.current.pokemon).toEqual([createPokemon(1, 1)]);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(2);
	});

	it("does not duplicate requests for a generation already loading", async () => {
		let resolveFetch!: (pokemon: Pokemon[]) => void;

		const pending = new Promise<Pokemon[]>((resolve) => {
			resolveFetch = resolve;
		});

		mockedFetchGen.mockReturnValue(pending);

		const { result } = renderHook(() => usePokemon("1"));

		await waitFor(() => {
			expect(mockedFetchGen).toHaveBeenCalledTimes(1);
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(true);
		});

		resolveFetch([createPokemon(1)]);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockedFetchGen).toHaveBeenCalledTimes(1);
	});
});
