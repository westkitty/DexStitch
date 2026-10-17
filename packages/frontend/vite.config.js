import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep the existing HTTPS LAN development setup when its local certificates exist.
// CI and GitHub Pages builds must never require a machine-specific certificate.
const certDirectory = fileURLToPath(new URL("../../certs/", import.meta.url));
const certPath = path.join(certDirectory, "localhost+3.pem");
const keyPath = path.join(certDirectory, "localhost+3-key.pem");

function developmentHttps() {
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) return undefined;
  return {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  };
}

export default defineConfig(({ command }) => ({
  // The public Pages site lives below /DexStitch/. Local development stays at /.
  base: process.env.DEXSTITCH_BASE_PATH || "/",
  // Prefer the editable TypeScript files over old committed .js sidecar files.
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  server: command === "serve" ? { https: developmentHttps() } : {},
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // The checked-in public manifest is the sole source of truth.
      manifest: false,
      includeAssets: ["manifest.webmanifest", "icons/icon-192.svg", "icons/icon-512.svg"],
      // Preserve offline access to the existing large artwork and app bundles.
      workbox: {
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024
      },
      // Avoid a stale production service worker hijacking local development.
      devOptions: { enabled: false }
    })
  ]
}));
