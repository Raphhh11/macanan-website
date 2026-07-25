import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://macanan-website.vercel.app", // GANTI dengan domain vercel.app kamu yang sebenarnya
  integrations: [sitemap()],
});