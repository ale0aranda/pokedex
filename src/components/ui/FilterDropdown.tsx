import { useEffect, useRef, useState } from "react";

import { ALL_TYPES } from "@/shared/lib/pokemon/constants";
import { TypeIcon } from "@/shared/lib/pokemon/icons";
import type { PokemonType } from "@/shared/lib/pokemon/types";

type Option = {
	value: string;
	label: string;
};

type FilterDropdownProps = {
	label: string;
	value: string;
	options: readonly Option[];
	onChange: (value: string) => void;
	color?: string;
	showTypeIcons?: boolean;
};

const isPokemonType = (value: string): value is PokemonType =>
	(ALL_TYPES as readonly string[]).includes(value);

export function FilterDropdown({
	label,
	value,
	options,
	onChange,
	color,
	showTypeIcons = false,
}: FilterDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = options.find((option) => option.value === value);
	const isActive = value !== "";
	const selectedValue = selected?.value ?? "";
	const selectedType = isPokemonType(selectedValue) ? selectedValue : null;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((previous) => !previous)}
				aria-expanded={open}
				aria-haspopup="true"
				className="flex items-center gap-2 rounded-lg border px-3 py-2 font-pokemon text-[7px] transition"
				style={
					isActive && color
						? {
								background: color,
								color: "white",
								borderColor: "transparent",
							}
						: undefined
				}
			>
				{isActive && showTypeIcons && selectedType && (
					<TypeIcon type={selectedType} size={10} />
				)}

				{isActive ? selected?.label : label}

				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					fill="none"
					className={`transition-transform ${open ? "rotate-180" : ""}`}
					aria-hidden="true"
				>
					<path
						d="M1 2.5L4 5.5L7 2.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{open && (
				<div className="absolute left-0 top-full z-50 mt-1 min-w-32.5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
					<button
						type="button"
						onClick={() => {
							onChange("");
							setOpen(false);
						}}
						className={`w-full px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${
							value === "" ? "font-semibold text-zinc-900" : "text-zinc-500"
						}`}
					>
						All
					</button>

					<div className="my-0.5 h-px bg-zinc-100" />

					{options.map((option) => {
						const isSelected = value === option.value;
						const optionType = isPokemonType(option.value)
							? option.value
							: null;

						return (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setOpen(false);
								}}
								className={`flex w-full items-center gap-2 px-3 py-2 text-left font-pokemon text-[7px] transition hover:bg-zinc-50 ${
									isSelected ? "font-semibold text-zinc-900" : "text-zinc-500"
								}`}
							>
								{showTypeIcons && optionType && (
									<TypeIcon type={optionType} size={10} />
								)}

								{option.label}

								{isSelected && (
									<svg
										width="8"
										height="8"
										viewBox="0 0 8 8"
										fill="none"
										className="ml-auto text-zinc-900"
										aria-hidden="true"
									>
										<path
											d="M1 4L3 6L7 2"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
