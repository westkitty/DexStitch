import type {
  BoundingBox2D,
  EmbroideryProgram,
  NestingOutput,
  PatternResult,
  Point2D,
  PreviewModel
} from "@dexstitch/types";
import { computeBoundingBox } from "@dexstitch/types";

/**
 * Build a preview model from pattern, nesting, and optional embroidery
 * Computes overall bounding box for UI viewport setup
 */
export function buildPreviewModel(
  pattern: PatternResult | null,
  nesting: NestingOutput | null,
  embroidery: EmbroideryProgram | null = null
): PreviewModel {
  let bounds: BoundingBox2D | undefined;

  if (pattern) {
    // Compute overall bounds from all pattern pieces
    const allPoints: Point2D[] = [];
    for (const piece of pattern.pieces) {
      allPoints.push(...piece.outline);
      if (piece.notches) allPoints.push(...piece.notches);
      if (piece.grainline) allPoints.push(...piece.grainline);
    }
    if (allPoints.length > 0) {
      bounds = computeBoundingBox(allPoints);
    }
  }

  return {
    pattern,
    nesting,
    embroidery,
    bounds
  };
}
