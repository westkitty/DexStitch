import type { MeasurementSet, PatternResult, PatternSpec, Point2D } from "@dexstitch/types";

/**
 * Generate a basic rectangular panel pattern with optional dart
 * All dimensions in mm, CCW winding
 */
export function generatePattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { chest, waist, height } = measurements;
  const { ease = 1.05, dartDepth = 0 } = spec.parameters;

  // Calculate panel dimensions in mm
  // Panel width: half chest + ease allowance
  const panelWidth = (chest / 2) * ease;
  // Panel height: roughly 1/4 of body height
  const panelHeight = height / 4;

  // Front panel with optional dart
  const frontOutline: Point2D[] = [];

  if (dartDepth > 0) {
    // Add dart at center-bottom for waist shaping
    const dartX = panelWidth / 2;
    const dartBaseY = panelHeight * 0.7; // Dart starts 70% down
    const dartTipY = panelHeight * 0.3; // Dart ends 30% down
    const dartHalfWidth = (chest - waist) / 4; // Quarter of chest-waist difference

    // Build outline with dart (CCW winding)
    frontOutline.push(
      { x: 0, y: 0 }, // Top-left
      { x: panelWidth, y: 0 }, // Top-right
      { x: panelWidth, y: panelHeight }, // Bottom-right
      { x: dartX + dartHalfWidth, y: dartBaseY }, // Dart right base
      { x: dartX, y: dartTipY }, // Dart tip
      { x: dartX - dartHalfWidth, y: dartBaseY }, // Dart left base
      { x: 0, y: panelHeight } // Bottom-left
    );
  } else {
    // Simple rectangle (CCW)
    frontOutline.push(
      { x: 0, y: 0 },
      { x: panelWidth, y: 0 },
      { x: panelWidth, y: panelHeight },
      { x: 0, y: panelHeight }
    );
  }

  // Back panel (simple rectangle, identical dimensions)
  const backOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: panelWidth, y: 0 },
    { x: panelWidth, y: panelHeight },
    { x: 0, y: panelHeight }
  ];

  // Define grainlines (vertical through center)
  const grainlineX = panelWidth / 2;
  const grainlineMargin = 20; // mm from edges

  return {
    pieces: [
      {
        id: "front",
        name: "Front Panel",
        outline: frontOutline,
        seamAllowance: 15, // 15mm standard seam allowance
        grainline: [
          { x: grainlineX, y: grainlineMargin },
          { x: grainlineX, y: panelHeight - grainlineMargin }
        ],
        notches: [
          { x: panelWidth / 2, y: 0 } // Center notch at top
        ],
        annotations: ["Cut 1 on fold", `Ease: ${ease.toFixed(1)}x`]
      },
      {
        id: "back",
        name: "Back Panel",
        outline: backOutline,
        seamAllowance: 15,
        grainline: [
          { x: grainlineX, y: grainlineMargin },
          { x: grainlineX, y: panelHeight - grainlineMargin }
        ],
        notches: [
          { x: panelWidth / 2, y: 0 } // Center notch at top
        ],
        annotations: ["Cut 1 on fold"]
      }
    ],
    auxData: {
      units: "mm",
      generatedBy: "basic-panel-v1",
      panelWidth,
      panelHeight
    }
  };
}
