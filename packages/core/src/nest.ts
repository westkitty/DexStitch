import type { NestingInput, NestingOutput, Point2D } from "@dexstitch/types";
import { computeBoundingBox, transformPoint } from "@dexstitch/types";

interface PlacedPiece {
  pieceId: string;
  outline: Point2D[]; // Transformed outline
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
}

/**
 * Improved nesting implementation using first-fit decreasing with rotation support
 * Pieces are sorted by area (largest first) and placed greedily
 * Supports rotation (0°, 90°, 180°, 270°) for better packing
 */
export function nestPieces(input: NestingInput): NestingOutput {
  const { pieces, binWidth } = input;
  const padding = 10; // mm padding between pieces
  const binHeight = 5000; // Max height (we'll use multiple rows if needed)

  if (pieces.length === 0) {
    return {
      placements: [],
      utilizedArea: 0,
      binArea: 0
    };
  }

  // Sort pieces by area (largest first)
  const indexedPieces = pieces.map((p, idx) => {
    const bbox = computeBoundingBox(p.outline);
    const area = (bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY);
    return { piece: p, index: idx, area };
  });

  indexedPieces.sort((a, b) => b.area - a.area);

  const placed: PlacedPiece[] = [];
  let totalPieceArea = 0;

  // Try to place each piece
  for (const { piece } of indexedPieces) {
    totalPieceArea += computePieceArea(piece);

    // Try different rotations and find best placement
    let bestPlacement: PlacedPiece | null = null;
    let bestCost = Infinity;

    for (const rotation of [0, 90, 180, 270]) {
      // Create a rotated copy of the piece outline
      const rotatedOutline = rotatePiece(piece.outline, rotation);
      const bbox = computeBoundingBox(rotatedOutline);

      // Try to place at different positions
      const positions = generatePositionsToTry(placed, rotatedOutline, binWidth, padding);

      for (const { x, y } of positions) {
        // Check if placement is valid (no overlaps)
        if (!checkOverlap(placed, rotatedOutline, x, y, padding)) {
          // Cost is y position (favor placing lower)
          const cost = y;
          if (cost < bestCost) {
            bestCost = cost;
            bestPlacement = {
              pieceId: piece.id,
              outline: rotatedOutline.map((p) => ({ x: p.x + x, y: p.y + y })),
              x,
              y,
              rotation,
              flipped: false
            };
          }
        }
      }
    }

    if (bestPlacement) {
      placed.push(bestPlacement);
    }
  }

  // Convert placements to output format
  const placements = placed.map((p) => {
    const bbox = computeBoundingBox(p.outline);
    return {
      pieceId: p.pieceId,
      x: p.x,
      y: p.y,
      rotation: p.rotation,
      flipped: p.flipped
    };
  });

  // Calculate utilization metrics
  let maxX = 0;
  let maxY = 0;
  for (const p of placed) {
    const bbox = computeBoundingBox(p.outline);
    maxX = Math.max(maxX, bbox.maxX);
    maxY = Math.max(maxY, bbox.maxY);
  }

  const usedArea = maxX * maxY;
  const efficiency = totalPieceArea / Math.max(usedArea, 1);

  return {
    placements,
    utilizedArea: totalPieceArea,
    binArea: usedArea,
    efficiency
  };
}

/**
 * Rotate piece outline by angle (in degrees)
 */
function rotatePiece(outline: Point2D[], angleDegrees: number): Point2D[] {
  if (angleDegrees === 0) return outline;

  const angleRad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  return outline.map((p) => ({
    x: p.x * cos - p.y * sin,
    y: p.x * sin + p.y * cos
  }));
}

/**
 * Generate candidate positions to try for placing a piece
 */
function generatePositionsToTry(
  placed: PlacedPiece[],
  outline: Point2D[],
  binWidth: number,
  padding: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const bbox = computeBoundingBox(outline);
  const pieceWidth = bbox.maxX - bbox.minX;
  const pieceHeight = bbox.maxY - bbox.minY;

  // Try baseline (y=0, x along width)
  for (let x = 0; x < binWidth - pieceWidth; x += 50) {
    positions.push({ x: x - bbox.minX, y: -bbox.minY });
  }

  // Try above each placed piece
  for (const placedPiece of placed) {
    const placedBbox = computeBoundingBox(placedPiece.outline);
    const x = placedBbox.minX - bbox.minX;
    const y = placedBbox.maxY - bbox.minY + padding;

    if (x >= 0 && x + pieceWidth <= binWidth && y < 5000) {
      positions.push({ x, y });
    }

    // Also try to the right
    const rightX = placedBbox.maxX - bbox.minX + padding;
    if (rightX >= 0 && rightX + pieceWidth <= binWidth) {
      positions.push({ x: rightX, y: placedBbox.minY - bbox.minY });
    }
  }

  // Remove duplicates
  const seen = new Set<string>();
  return positions.filter((p) => {
    const key = `${Math.round(p.x)},${Math.round(p.y)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Check if placing a piece at (x, y) would cause overlaps with already-placed pieces
 */
function checkOverlap(
  placed: PlacedPiece[],
  newOutline: Point2D[],
  newX: number,
  newY: number,
  padding: number
): boolean {
  const newBbox = computeBoundingBox(newOutline);
  const newBboxShifted = {
    minX: newBbox.minX + newX,
    maxX: newBbox.maxX + newX,
    minY: newBbox.minY + newY,
    maxY: newBbox.maxY + newY
  };

  // Simple AABB (axis-aligned bounding box) overlap check with padding
  for (const p of placed) {
    const existingBbox = computeBoundingBox(p.outline);

    // Check AABB overlap with padding
    if (
      newBboxShifted.minX - padding < existingBbox.maxX &&
      newBboxShifted.maxX + padding > existingBbox.minX &&
      newBboxShifted.minY - padding < existingBbox.maxY &&
      newBboxShifted.maxY + padding > existingBbox.minY
    ) {
      return true; // Overlap detected
    }
  }

  return false;
}

/**
 * Compute area of a piece
 */
function computePieceArea(piece: { outline: Point2D[] }): number {
  const bbox = computeBoundingBox(piece.outline);
  return (bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY);
}
