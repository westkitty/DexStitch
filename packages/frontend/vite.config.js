import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";

export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync("/Users/andrew/Projects/DexStitch/certs/localhost+3-key.pem"),
            cert: fs.readFileSync("/Users/andrew/Projects/DexStitch/certs/localhost+3.pem"),
        }
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["manifest.webmanifest"],
            manifest: {
                name: "DexStitch",
                short_name: "DexStitch",
                description: "Local-first pattern and embroidery designer",
                theme_color: "#0f172a",
                background_color: "#f8fafc",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/icons/icon-192.svg",
                        sizes: "192x192",
                        type: "image/svg+xml"
                    },
                    {
                        src: "/icons/icon-512.svg",
                        sizes: "512x512",
                        type: "image/svg+xml"
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ]
});
