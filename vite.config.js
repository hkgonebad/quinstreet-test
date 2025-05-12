import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Add the Tailwind CSS plugin
  plugins: [tailwindcss()],

  // Global CSS preprocessor options
  css: {
    devSourcemap: true,
  },

  // Build options
  build: {
    // Manifest file for asset caching
    manifest: true,

    // Minify options
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },

    // Optimize output
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["tailwindcss"],
        },
      },
    },

    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },

  // Development server options
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: true,
    },
  },

  base: "/quinstreet-test/",
});
