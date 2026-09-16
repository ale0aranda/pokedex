import { cloneElement, type ReactElement, type SVGProps } from "react";

import type { PokemonType } from "@/shared/lib/pokemon/types";

type TypeIconProps = {
	type: PokemonType;
	size?: number;
};

const ICONS: Record<PokemonType, ReactElement<SVGProps<SVGSVGElement>>> = {
	normal: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	fire: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 14c-3 0-5-2-5-4.5 0-2 1.5-3.5 2-5 .5 1 .5 2 1.5 2.5C7 5.5 7 3 8 2c.5 1.5 1.5 2.5 2 4 .5-1 .5-2 .5-2.5C12 5 13 7 13 9.5c0 2.5-2 4.5-5 4.5z"
				fill="currentColor"
			/>
		</svg>
	),
	water: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 2C8 2 3 8 3 11a5 5 0 0010 0C13 8 8 2 8 2z"
				fill="currentColor"
			/>
		</svg>
	),
	grass: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 14V7M8 7C8 7 5 4 2 3c1 3 3 5 6 4M8 7c0 0 3-3 6-4-1 3-3 5-6 4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	electric: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M9 2L4 9h4l-1 5 5-7H8L9 2z" fill="currentColor" />
		</svg>
	),
	ice: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 2v12M2 8h12M4 4l8 8M12 4l-8 8"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
		</svg>
	),
	fighting: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M5 12l5-8M10 12L5 4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="8" cy="8" r="2.5" fill="currentColor" />
		</svg>
	),
	poison: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<circle cx="8" cy="9" r="4" fill="currentColor" />
			<path
				d="M6 5V3h4v2M5 3h6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	ground: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M2 11h12M4 11V7l4-4 4 4v4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	flying: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M2 10c2-4 5-5 8-4M14 6c-2 0-4 2-4 4M2 10c2-1 5-1 7 1"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	psychic: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<circle cx="8" cy="8" r="3" fill="currentColor" />
			<path
				d="M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.5 1.5M10.5 10.5L12 12M4 12l1.5-1.5M10.5 5.5L12 4"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
		</svg>
	),
	bug: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<ellipse cx="8" cy="9" rx="3" ry="4" fill="currentColor" />
			<path
				d="M5 6l-2-2M11 6l2-2M5 9H3M11 9h2M5 12l-2 2M11 12l2 2"
				stroke="currentColor"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
		</svg>
	),
	rock: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M5 13l-2-5 3-4h4l3 4-2 5H5z" fill="currentColor" />
		</svg>
	),
	ghost: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M4 13V7a4 4 0 018 0v6l-2-1.5-2 1.5-2-1.5-2 1.5z"
				fill="currentColor"
			/>
			<circle cx="6.5" cy="7.5" r="1" fill="white" />
			<circle cx="9.5" cy="7.5" r="1" fill="white" />
		</svg>
	),
	dragon: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M3 13L8 3l5 10M5.5 9h5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	dark: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M10 3A5 5 0 105 13a6 6 0 005-10z" fill="currentColor" />
		</svg>
	),
	steel: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 2l1.5 4.5H14l-3.75 2.75L11.5 14 8 11.5 4.5 14l1.25-4.75L2 6.5h4.5L8 2z"
				fill="currentColor"
			/>
		</svg>
	),
	fairy: (
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 2l.8 2.4H14l-2.1 1.6.8 2.4L8 7l-4.7 1.4.8-2.4L2 4.4h5.2L8 2zM8 9l.5 1.5H10l-1.3 1 .5 1.5L8 12l-1.2.9.5-1.5L6 10.5h1.5L8 9z"
				fill="currentColor"
			/>
		</svg>
	),
};

export function TypeIcon({ type, size = 10 }: TypeIconProps) {
	return (
		<span
			className="inline-flex shrink-0"
			style={{ width: size, height: size }}
			aria-hidden="true"
		>
			{cloneElement(ICONS[type], { width: "100%", height: "100%" })}
		</span>
	);
}
