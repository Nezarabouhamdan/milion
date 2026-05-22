import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [vue(), analyzer({ analyzerPort: 8889 })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
