// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://ale0aranda.github.io",
	base: "/pokedex",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [react()],
});
