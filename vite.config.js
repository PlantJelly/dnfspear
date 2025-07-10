import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import tailwindcss from "@tailwindcss/vite";

dotenv.config();

console.log(process.env.PORT);

export default defineConfig({
    plugins: [sveltekit(), devtoolsJson(), tailwindcss()],
    server: {
        port: Number(process.env.PORT) ?? 5173,
    },
});
