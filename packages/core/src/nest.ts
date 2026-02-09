import type { NestingInput, NestingOutput } from "@dexstitch/types";
import { computeBoundingBox } from "@dexstitch/types";

/**
 * Placeholder nesting implementation
 * Places pieces in a simple horizontal row with padding
 * TODO: Replace with proper 2D bin-packing algorithm (SVGNest/libnest2d)
 */
export function nestPieces(input: NestingInput): NestingOutput {
  let cursorX = 0;
  let maxHeight = 0;
  const padding = 10; // mm padding between pieces

  const { pieces, binWidth } = input;

  const placements = pieces.map((piece) => {
    // Compute piece bounding box
    const bbox = computeBoundingBox(piece.outline);
    const pieceWidth = bbox.maxX - bbox.minX;
    const pieceHeight = bbox.maxY - bbox.minY;

    const placement = {
      pieceId: piece.id,
      x: cursorX - bbox.minX, // Offset to align left edge
      y: -bbox.minY, // Offset to align top edge
      rotation: 0,
      flipped: false
    };

    cursorX += pieceWidth + padding;
    maxHeight = Math.max(maxHeight, pieceHeight);

    return placement;
  });

  // Calculate utilization
  const totalPieceArea = pieces.reduce((sum, piece) => {
    const bbox = computeBoundingBox(piece.outline);
    return sum + (bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY);
  }, 0);

  const binArea = binWidth * Math.max(maxHeight, 100);

  return {
    placements,
    utilizedArea: totalPieceArea,
    binArea
  };
}
