import type { MeasurementSet, PatternResult, PatternSpec, Point2D } from "@dexstitch/types";

/**
 * Generate pattern based on template type
 * Routes to specific generators based on spec.id prefix
 */
export function generatePattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const templateId = spec.id.toLowerCase();
  
  // Route to specific pattern generators based on template type
  if (templateId.startsWith('singlet-')) {
    return generateSingletPattern(measurements, spec);
  } else if (templateId.startsWith('tank-')) {
    return generateTankPattern(measurements, spec);
  } else if (templateId.startsWith('harness-')) {
    return generateHarnessPattern(measurements, spec);
  } else if (templateId.startsWith('jock-')) {
    return generateJockstrapPattern(measurements, spec);
  } else if (templateId.startsWith('brief-')) {
    return generateBriefPattern(measurements, spec);
  } else if (templateId.startsWith('bodysuit-')) {
    return generateBodysuitPattern(measurements, spec);
  } else if (templateId.startsWith('shorts-')) {
    return generateShortsPattern(measurements, spec);
  } else if (templateId.startsWith('leggings-')) {
    return generateLeggingsPattern(measurements, spec);
  } else if (templateId.startsWith('accessory-')) {
    return generateAccessoryPattern(measurements, spec);
  }
  
  // Fallback to basic panel pattern
  return generateBasicPattern(measurements, spec);
}

/**
 * Generate a basic rectangular panel pattern with optional dart
 * All dimensions in mm, CCW winding
 */
function generateBasicPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
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

/**
 * Generate a wrestling singlet pattern with shaped legs and straps
 */
function generateSingletPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { chest, hip, height } = measurements;
  const { ease = 0.95, legHeight = 180, neckDepth = 120, backCut = 100, strapWidth = 50 } = spec.parameters as {
    ease?: number;
    legHeight?: number;
    neckDepth?: number;
    backCut?: number;
    strapWidth?: number;
  };
  
  const bodyWidth = (chest / 2) * ease;
  const hipWidth = (hip / 2) * ease;
  const torsoHeight = height * 0.6; // Singlet covers 60% of height
  
  // Front panel with shaped neckline and high-cut legs
  const frontOutline: Point2D[] = [
    { x: 0, y: 0 }, // Top-left (shoulder)
    { x: strapWidth, y: 0 }, // Strap width
    { x: strapWidth, y: neckDepth }, // Neckline depth
    { x: bodyWidth - strapWidth, y: neckDepth }, // Opposite neckline
    { x: bodyWidth - strapWidth, y: 0 }, // Top-right strap
    { x: bodyWidth, y: 0 }, // Shoulder right
    { x: bodyWidth, y: torsoHeight - legHeight }, // High leg cut start
    { x: hipWidth, y: torsoHeight }, // Leg opening bottom
    { x: 0, y: torsoHeight }, // Left leg opening
    { x: 0, y: torsoHeight - legHeight }, // High leg cut left
  ];
  
  // Back panel with lower cut
  const backOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: strapWidth, y: 0 },
    { x: strapWidth, y: backCut }, // Shallower back neckline
    { x: bodyWidth - strapWidth, y: backCut },
    { x: bodyWidth - strapWidth, y: 0 },
    { x: bodyWidth, y: 0 },
    { x: bodyWidth, y: torsoHeight - legHeight },
    { x: hipWidth, y: torsoHeight },
    { x: 0, y: torsoHeight },
    { x: 0, y: torsoHeight - legHeight },
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Singlet Front",
        outline: frontOutline,
        seamAllowance: 10,
        grainline: [{ x: bodyWidth / 2, y: 50 }, { x: bodyWidth / 2, y: torsoHeight - 50 }],
        annotations: [`Singlet - ${spec.name}`, "Cut 1 on fold"]
      },
      {
        id: "back",
        name: "Singlet Back",
        outline: backOutline,
        seamAllowance: 10,
        grainline: [{ x: bodyWidth / 2, y: 50 }, { x: bodyWidth / 2, y: torsoHeight - 50 }],
        annotations: ["Cut 1 on fold"]
      }
    ],
    auxData: { units: "mm", generatedBy: "singlet-v1" }
  };
}

/**
 * Generate a tank top pattern with deep armholes
 */
function generateTankPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { chest, waist } = measurements;
  const { ease = 1.05, armholeDepth = 220, neckDepth = 140, strapWidth = 50 } = spec.parameters as {
    ease?: number;
    armholeDepth?: number;
    neckDepth?: number;
    strapWidth?: number;
  };
  
  const bodyWidth = (chest / 2) * ease;
  const tankHeight = (waist / 2) * 1.5; // Tank is shorter
  
  const frontOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: strapWidth, y: 0 },
    { x: strapWidth, y: neckDepth },
    { x: bodyWidth - strapWidth, y: neckDepth },
    { x: bodyWidth - strapWidth, y: 0 },
    { x: bodyWidth, y: 0 },
    { x: bodyWidth, y: armholeDepth }, // Deep armhole
    { x: bodyWidth * 0.9, y: tankHeight },
    { x: bodyWidth * 0.1, y: tankHeight },
    { x: 0, y: armholeDepth },
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Tank Front",
        outline: frontOutline,
        seamAllowance: 12,
        grainline: [{ x: bodyWidth / 2, y: 40 }, { x: bodyWidth / 2, y: tankHeight - 40 }],
        annotations: [`Tank - ${spec.name}`, "Cut 1 on fold"]
      }
    ],
    auxData: { units: "mm", generatedBy: "tank-v1" }
  };
}

/**
 * Generate a harness pattern with straps
 */
function generateHarnessPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { chest, waist } = measurements;
  const { strapWidth = 30, oRingSize = 50 } = spec.parameters as {
    strapWidth?: number;
    oRingSize?: number;
  };
  
  const chestCirc = chest;
  const strapLength = chestCirc * 0.4;
  
  // Horizontal chest strap
  const chestStrap: Point2D[] = [
    { x: 0, y: 0 },
    { x: strapLength, y: 0 },
    { x: strapLength, y: strapWidth },
    { x: 0, y: strapWidth }
  ];
  
  // Vertical connector strap
  const verticalStrap: Point2D[] = [
    { x: 0, y: 0 },
    { x: strapWidth, y: 0 },
    { x: strapWidth, y: waist * 0.3 },
    { x: 0, y: waist * 0.3 }
  ];
  
  return {
    pieces: [
      {
        id: "chest-strap",
        name: "Chest Strap",
        outline: chestStrap,
        seamAllowance: 5,
        annotations: [`Harness - ${spec.name}`, "Cut 2", `O-ring: ${oRingSize}mm`]
      },
      {
        id: "vertical-strap",
        name: "Vertical Connector",
        outline: verticalStrap,
        seamAllowance: 5,
        annotations: ["Cut 1"]
      }
    ],
    auxData: { units: "mm", generatedBy: "harness-v1" }
  };
}

/**
 * Generate a jockstrap pattern
 */
function generateJockstrapPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { waist, hip } = measurements;
  const { waistbandWidth = 40 } = spec.parameters as {
    waistbandWidth?: number;
  };
  
  const pouchWidth = hip * 0.15;
  const pouchHeight = hip * 0.2;
  
  // Contoured pouch
  const pouchOutline: Point2D[] = [
    { x: pouchWidth * 0.2, y: 0 },
    { x: pouchWidth * 0.8, y: 0 },
    { x: pouchWidth, y: pouchHeight * 0.3 },
    { x: pouchWidth, y: pouchHeight * 0.7 },
    { x: pouchWidth * 0.5, y: pouchHeight },
    { x: 0, y: pouchHeight * 0.7 },
    { x: 0, y: pouchHeight * 0.3 }
  ];
  
  // Waistband
  const waistbandOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: waist * 0.5, y: 0 },
    { x: waist * 0.5, y: waistbandWidth },
    { x: 0, y: waistbandWidth }
  ];
  
  return {
    pieces: [
      {
        id: "pouch",
        name: "Jockstrap Pouch",
        outline: pouchOutline,
        seamAllowance: 8,
        annotations: [`Jockstrap - ${spec.name}`, "Cut 2 (mirrored)"]
      },
      {
        id: "waistband",
        name: "Waistband",
        outline: waistbandOutline,
        seamAllowance: 5,
        annotations: ["Cut 1", "Use elastic"]
      }
    ],
    auxData: { units: "mm", generatedBy: "jockstrap-v1" }
  };
}

/**
 * Generate a brief pattern
 */
function generateBriefPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { hip } = measurements;
  const { ease = 1.05 } = spec.parameters as {
    ease?: number;
  };
  
  const briefWidth = (hip / 2) * ease;
  const briefHeight = hip * 0.35;
  const legCurve = hip * 0.12;
  
  const frontOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: briefWidth, y: 0 },
    { x: briefWidth, y: briefHeight - legCurve },
    { x: briefWidth * 0.8, y: briefHeight },
    { x: briefWidth * 0.2, y: briefHeight },
    { x: 0, y: briefHeight - legCurve }
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Brief Front",
        outline: frontOutline,
        seamAllowance: 10,
        grainline: [{ x: briefWidth / 2, y: 20 }, { x: briefWidth / 2, y: briefHeight - 20 }],
        annotations: [`Brief - ${spec.name}`, "Cut 1 on fold"]
      }
    ],
    auxData: { units: "mm", generatedBy: "brief-v1" }
  };
}

/**
 * Generate a bodysuit pattern
 */
function generateBodysuitPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { chest, height } = measurements;
  const { ease = 1.0 } = spec.parameters as {
    ease?: number;
  };
  
  const bodyWidth = (chest / 2) * ease;
  const bodyHeight = height * 0.55;
  
  // Full bodysuit front piece
  const frontOutline: Point2D[] = [
    { x: bodyWidth * 0.2, y: 0 }, // Neck left
    { x: bodyWidth * 0.8, y: 0 }, // Neck right
    { x: bodyWidth, y: bodyHeight * 0.15 }, // Shoulder
    { x: bodyWidth, y: bodyHeight * 0.35 }, // Armpit
    { x: bodyWidth * 0.9, y: bodyHeight * 0.45 }, // Waist curve
    { x: bodyWidth, y: bodyHeight * 0.7 }, // Hip
    { x: bodyWidth * 0.7, y: bodyHeight }, // Leg opening
    { x: bodyWidth * 0.3, y: bodyHeight }, // Leg opening left
    { x: 0, y: bodyHeight * 0.7 }, // Hip left
    { x: 0, y: bodyHeight * 0.35 }, // Armpit left
    { x: 0, y: bodyHeight * 0.15 } // Shoulder left
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Bodysuit Front",
        outline: frontOutline,
        seamAllowance: 12,
        grainline: [{ x: bodyWidth / 2, y: 40 }, { x: bodyWidth / 2, y: bodyHeight - 40 }],
        annotations: [`Bodysuit - ${spec.name}`, "Cut 1 on fold"]
      }
    ],
    auxData: { units: "mm", generatedBy: "bodysuit-v1" }
  };
}

/**
 * Generate shorts pattern
 */
function generateShortsPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { hip } = measurements;
  const { inseam = 150 } = spec.parameters as {
    inseam?: number;
  };
  
  const shortsWidth = (hip / 2) * 1.1;
  const shortsHeight = inseam * 1.3;
  
  const frontOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: shortsWidth, y: 0 },
    { x: shortsWidth, y: shortsHeight * 0.6 },
    { x: shortsWidth * 0.85, y: shortsHeight },
    { x: shortsWidth * 0.15, y: shortsHeight },
    { x: 0, y: shortsHeight * 0.6 }
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Shorts Front",
        outline: frontOutline,
        seamAllowance: 12,
        grainline: [{ x: shortsWidth / 2, y: 30 }, { x: shortsWidth / 2, y: shortsHeight - 30 }],
        annotations: [`Shorts - ${spec.name}`, "Cut 2"]
      }
    ],
    auxData: { units: "mm", generatedBy: "shorts-v1" }
  };
}

/**
 * Generate leggings pattern
 */
function generateLeggingsPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { hip, height } = measurements;
  const { ease = 1.0 } = spec.parameters as {
    ease?: number;
  };
  
  const legWidth = (hip / 2) * ease;
  const legHeight = height * 0.9;
  const ankleWidth = legWidth * 0.35;
  
  const frontOutline: Point2D[] = [
    { x: 0, y: 0 },
    { x: legWidth, y: 0 },
    { x: legWidth * 0.95, y: legHeight * 0.7 },
    { x: ankleWidth, y: legHeight },
    { x: 0, y: legHeight },
    { x: 0, y: legHeight * 0.7 }
  ];
  
  return {
    pieces: [
      {
        id: "front",
        name: "Leggings Front",
        outline: frontOutline,
        seamAllowance: 10,
        grainline: [{ x: legWidth / 2, y: 50 }, { x: legWidth / 2, y: legHeight - 50 }],
        annotations: [`Leggings - ${spec.name}`, "Cut 2"]
      }
    ],
    auxData: { units: "mm", generatedBy: "leggings-v1" }
  };
}

/**
 * Generate accessory pattern (simple shapes)
 */
function generateAccessoryPattern(measurements: MeasurementSet, spec: PatternSpec): PatternResult {
  const { width = 80, length = 200 } = spec.parameters as {
    width?: number;
    length?: number;
  };
  
  const outline: Point2D[] = [
    { x: 0, y: 0 },
    { x: length as number, y: 0 },
    { x: length as number, y: width as number },
    { x: 0, y: width as number }
  ];
  
  return {
    pieces: [
      {
        id: "main",
        name: spec.name || "Accessory",
        outline,
        seamAllowance: 8,
        annotations: [`Accessory - ${spec.name}`, "Cut as specified"]
      }
    ],
    auxData: { units: "mm", generatedBy: "accessory-v1" }
  };
}
