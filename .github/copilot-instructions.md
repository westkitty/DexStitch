# DexStitch Copilot Instructions

## Project status
- This repo currently contains a single design document: [dex_stitch_bible_comprehensive_implementation_plan.md](dex_stitch_bible_comprehensive_implementation_plan.md).
- There is no executable code, build config, or tests yet. Do not invent commands; ask before adding scripts or dependencies.

## Intended architecture (from design doc)
- Local-first PWA with optional encrypted sync; core logic runs in-browser and works offline.
- React + TypeScript frontend with a modular core: measurements, pattern engine, nesting, embroidery, exports.
- Heavy computation is expected to run in Web Workers and/or WebAssembly to keep UI responsive.

## Data flow and interface contracts
- Measurements feed the pattern engine; pattern pieces feed nesting and UI previews; embroidery uses vector paths to generate stitch plans; all state persists as a project JSON object.
- Pattern engine shape:
  - `GarmentPattern.generate(measurements, params) -> PatternResult` where `PatternResult.pieces` is the central output.
- Nesting worker API expects `pieces`, fabric constraints, and rotation/mirroring flags; returns placements plus utilization metrics.
- Embroidery pipeline is `ImageVectorizer.vectorize(...)` then `StitchGenerator.generateStitches(...)` producing a `StitchPlan`.
- `ProjectData` is the persisted object tying measurements, pattern params, pieces, embroidery, and nesting together.

## When adding code
- Keep modules decoupled and use typed interfaces similar to those documented in [dex_stitch_bible_comprehensive_implementation_plan.md](dex_stitch_bible_comprehensive_implementation_plan.md).
- Preserve the local-first/offline assumption; prefer IndexedDB for persistence and avoid server dependencies unless explicitly requested.
- If you add workers/WASM, keep APIs message-based and return deterministic results for UI previews.

## Files to consult first
- [dex_stitch_bible_comprehensive_implementation_plan.md](dex_stitch_bible_comprehensive_implementation_plan.md) for architecture, interfaces, and intended module boundaries.
