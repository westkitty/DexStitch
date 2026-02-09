/**
 * DexStitch Geometry Types
 *
 * CANONICAL UNIT: millimeters (mm)
 * All numeric coordinates, dimensions, and measurements are in mm unless explicitly documented otherwise.
 *
 * WINDING DIRECTION CONVENTION:
 * - Outer boundaries: counter-clockwise (CCW)
 * - Inner holes/cutouts: clockwise (CW)
 * This follows the SVG fill-rule="evenodd" convention for correct rendering.
 */

/**
 * 2D point in mm coordinates
 */
export type Point2D = {
  x: number;
  y: number;
};

/**
 * 2D vector (direction + magnitude) in mm
 */
export type Vector2D = {
  x: number;
  y: number;
};

/**
 * 2D affine transformation
 * Represents translate, rotate, scale operations
 */
export type Transform2D = {
  /** Translation offset in mm */
  tx: number;
  ty: number;
  /** Rotation angle in radians (counter-clockwise) */
  rotation: number;
  /** Scale factors (1.0 = no scale) */
  scaleX: number;
  scaleY: number;
};

/**
 * Axis-aligned bounding box in mm
 */
export type BoundingBox2D = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/**
 * Create identity transform (no change)
 */
export function identityTransform(): Transform2D {
  return {
    tx: 0,
    ty: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1
  };
}

/**
 * Compute bounding box from points
 */
export function computeBoundingBox(points: Point2D[]): BoundingBox2D {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Calculate distance between two points
 */
export function distance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Apply transform to a point
 */
export function transformPoint(p: Point2D, t: Transform2D): Point2D {
  // Scale
  let x = p.x * t.scaleX;
  let y = p.y * t.scaleY;

  // Rotate
  if (t.rotation !== 0) {
    const cos = Math.cos(t.rotation);
    const sin = Math.sin(t.rotation);
    const xRot = x * cos - y * sin;
    const yRot = x * sin + y * cos;
    x = xRot;
    y = yRot;
  }

  // Translate
  return {
    x: x + t.tx,
    y: y + t.ty
  };
}
