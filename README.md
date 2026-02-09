# DexStitch Monorepo

Monorepo scaffold for the DexStitch PWA. Packages:

- `packages/types`: Shared domain types (MeasurementSet, PatternSpec, etc.)
- `packages/frontend`: React + Vite app (PWA UI)
- `packages/core`: TypeScript core stubs (pattern, nesting, embroidery)
- `packages/wasm-modules`: Placeholder for future WASM sources

## Development

- `pnpm install`
- `pnpm dev` (start all dev servers + watchers)
- `pnpm build` (build all packages)
- `pnpm typecheck` (run tsc on all packages)
- `pnpm lint` (eslint all packages)
- `pnpm format` (prettier all files)
- `pnpm preview` (preview frontend build)

## Testing

- `pnpm --filter @dexstitch/core test` (run core tests)
- `pnpm --filter @dexstitch/types test` (run types tests)

## Feature flags

Yjs collaboration is gated behind `VITE_ENABLE_COLLAB=true` in `packages/frontend/.env` (default: false/local-only mode).

## Notes

- Core logic is stubbed in `packages/core/src`.
- Shared types live in `packages/types`.
- The frontend is wired to those stubs and persists project state via IndexedDB.
- Build orchestration: types/core watch in parallel via `pnpm dev`.
