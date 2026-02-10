// Geometry primitives (all dimensions in mm)
export * from "./geometry";
import type { Point2D, BoundingBox2D } from "./geometry";

/**
 * Body measurements in millimeters (mm)
 */
export type MeasurementSet = {
  height: number;
  neck: number;
  chest: number;
  waist: number;
  hip: number;
};

/**
 * Pattern specification with design parameters
 */
export type PatternSpec = {
  id: string;
  name: string;
  parameters: {
    /** Ease factor (typically 0.8 to 1.5) */
    ease: number;
    /** Optional dart depth in mm */
    dartDepth?: number;
  };
};

/**
 * Legacy SVG path representation (deprecated - use Point2D[] instead)
 */
export type VectorPath = {
  d: string;
};

/**
 * A single pattern piece with geometry in mm coordinates
 * outline: CCW winding for exterior, CW for holes
 */
export type PatternPiece = {
  id: string;
  name: string;
  /** Outline as array of points in mm (CCW winding) */
  outline: Point2D[];
  /** Optional seam allowance in mm */
  seamAllowance?: number;
  /** Notch positions for alignment */
  notches?: Point2D[];
  /** Grainline as [start, end] points */
  grainline?: [Point2D, Point2D];
  /** Human-readable annotations */
  annotations?: string[];
};

export type PatternResult = {
  pieces: PatternPiece[];
  auxData?: Record<string, unknown>;
};

export type NestingInput = {
  pieces: PatternPiece[];
  /** Fabric bin width in mm */
  binWidth: number;
  /** Optional fabric bin height in mm */
  binHeight?: number;
  allowRotation: boolean;
  allowMirroring: boolean;
};

export type NestingPlacement = {
  pieceId: string;
  /** Placement position in mm */
  x: number;
  y: number;
  /** Rotation in radians */
  rotation: number;
  flipped: boolean;
};

export type NestingOutput = {
  placements: NestingPlacement[];
  /** Utilized area in mm² */
  utilizedArea: number;
  /** Total bin area in mm² */
  binArea: number;
  /** Packing efficiency (0-1): utilizedArea / binArea */
  efficiency?: number;
};

export type Stitch = {
  /** Stitch position in mm */
  x: number;
  y: number;
  command: "stitch" | "jump" | "trim" | "stop";
};

export type ThreadData = {
  color: { r: number; g: number; b: number };
  length: number;
};

export type EmbroideryProgram = {
  stitches: Stitch[];
  colors?: string[]; // Legacy colors array
  threadData?: ThreadData[]; // New thread data with colors and lengths
  metadata?: {
    stitchCount?: number;
    jumpCount?: number;
    estimatedTime?: number;
    threadLength?: number;
    needleCount?: number;
  };
};

export type MachineProfile = {
  name: string;
  /** Hoop dimensions in mm */
  hoopWidth?: number;
  hoopHeight?: number;
};

/**
 * Preview model for UI rendering
 */
export type PreviewModel = {
  pattern: PatternResult | null;
  nesting: NestingOutput | null;
  embroidery?: EmbroideryProgram | null;
  /** Overall bounding box in mm */
  bounds?: BoundingBox2D;
};

export type ExportBundle = {
  patternSvg?: string;
  projectJson?: string;
  embroideryFile?: ArrayBuffer;
};

export const typesVersion = "0.1.0";
