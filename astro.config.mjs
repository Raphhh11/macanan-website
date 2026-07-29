import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://macanan-website.vercel.app",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin/"),
    }),
  ],
});