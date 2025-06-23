import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.PORT);

export default defineConfig({
    plugins: [sveltekit(), devtoolsJson()],
    server: {
        port: Number(process.env.PORT) ?? 5173,
    },
});
