import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function prefixPublicAssets() {
  let base = "/";

  return {
    name: "washpanda-public-assets-base",
    enforce: "pre",
    configResolved(config) {
      base = config.base;
    },
    transform(code, id) {
      if (base === "/" || !/\.[jt]sx?$/.test(id)) return null;
      const transformed = code.replace(
        /(["'`])\/(?!\/)([^"'`]+?\.(?:png|jpe?g|webp|svg))\1/gi,
        (_match, quote, assetPath) => `${quote}${base}${assetPath}${quote}`,
      );
      return transformed === code ? null : { code: transformed, map: null };
    },
  };
}

export default defineConfig({
  plugins: [prefixPublicAssets(), react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
