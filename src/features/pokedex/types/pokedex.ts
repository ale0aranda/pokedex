import type { SORT_OPTIONS } from "@/shared/lib/pokemon/constants";

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type SortDirection = "asc" | "desc";
