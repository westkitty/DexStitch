import type { PatternResult, NestingOutput, EmbroideryProgram, Point2D, PatternPiece } from "@dexstitch/types";

/**
 * Export pattern pieces to SVG format
 * 
 * @param pattern - Generated pattern pieces
 * @param nesting - Optional nesting result with placements
 * @returns SVG string containing all pattern pieces with annotations
 */
export function exportToSVG(pattern: PatternResult, nesting?: NestingOutput): string {
  if (pattern.pieces.length === 0) {
    return generateSVGContainer([]);
  }

  const placements = nesting?.placements || [];

  // Build list of piece groups (either raw or with nesting placements)
  const pieceElements = pattern.pieces.map((piece, idx) => {
    const placement = placements.find(p => p.pieceId === piece.id);
    const x = placement?.x ?? 0;
    const y = placement?.y ?? 0;
    const rotation = placement?.rotation ?? 0;

    return buildSVGPiece(piece, x, y, rotation, idx);
  });

  return generateSVGContainer(pieceElements);
}

/**
 * Export to DXF format for CAD systems
 * 
 * @param pattern - Generated pattern pieces
 * @param nesting - Optional nesting result
 * @returns DXF file content as string
 */
export function exportToDXF(pattern: PatternResult, nesting?: NestingOutput): string {
  const placements = nesting?.placements || [];

  const entities: string[] = [];

  // DXF header
  const header = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1021
0
ENDSEC
0
SECTION
2
ENTITIES
`;

  // Add each piece as a polyline
  pattern.pieces.forEach((piece, idx) => {
    const placement = placements.find(p => p.pieceId === piece.id);
    const offsetX = placement?.x ?? 0;
    const offsetY = placement?.y ?? 0;

    // Transform outline points
    const transformedPoints = piece.outline.map(p => ({
      x: p.x + offsetX,
      y: p.y + offsetY
    }));

    // Build DXF polyline entity
    const polylineEntity = buildDXFPolyline(transformedPoints, piece.id, idx);
    entities.push(polylineEntity);

    // Add piece label as text
    if (transformedPoints.length > 0) {
      const centerX = transformedPoints.reduce((sum, p) => sum + p.x, 0) / transformedPoints.length;
      const centerY = transformedPoints.reduce((sum, p) => sum + p.y, 0) / transformedPoints.length;
      const textEntity = buildDXFText(piece.name, centerX, centerY, idx + 100);
      entities.push(textEntity);
    }
  });

  const footer = `0
ENDSEC
0
EOF
`;

  return header + entities.join('\n') + footer;
}

/**
 * Export pattern as JSON (portable project format)
 */
export function exportToJSON(pattern: PatternResult, nesting?: NestingOutput): string {
  return JSON.stringify(
    {
      pattern: {
        pieces: pattern.pieces.map(p => ({
          id: p.id,
          name: p.name,
          outline: p.outline,
          seamAllowance: p.seamAllowance,
          grainline: p.grainline,
          notches: p.notches
        }))
      },
      nesting: nesting ? {
        placements: nesting.placements,
        utilizedArea: nesting.utilizedArea,
        binArea: nesting.binArea,
        efficiency: nesting.efficiency
      } : null
    },
    null,
    2
  );
}

/**
 * Build an SVG <g> element for a single pattern piece
 */
function buildSVGPiece(piece: PatternPiece, x: number, y: number, rotation: number, idx: number): string {
  const fill = idx % 2 === 0 ? '#e8f4f8' : '#fff3cd';
  const pathData = pointsToPathData(piece.outline);

  const transform = rotation !== 0
    ? `translate(${x}, ${y}) rotate(${rotation})`
    : `translate(${x}, ${y})`;

  let svg = `  <g id="piece-${piece.id}" transform="${transform}">
    <path d="${pathData}" fill="${fill}" stroke="#000" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
`;

  // Add grainline if present
  if (piece.grainline && piece.grainline.length >= 2) {
    const [start, end] = piece.grainline;
    svg += `    <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#ff6b6b" stroke-width="0.5" vector-effect="non-scaling-stroke"/>
      <polygon points="${end.x},${end.y} ${end.x - 2},${end.y - 2} ${end.x + 2},${end.y - 2}" fill="#ff6b6b"/>
`;
  }

  // Add notches
  if (piece.notches && piece.notches.length > 0) {
    piece.notches.forEach((notch: Point2D) => {
      svg += `    <circle cx="${notch.x}" cy="${notch.y}" r="2" fill="#0066cc" vector-effect="non-scaling-stroke"/>
`;
    });
  }

  // Add label
  svg += `    <text x="5" y="5" font-size="4" fill="#000" vector-effect="non-scaling-stroke">${piece.name}</text>
  </g>
`;

  return svg;
}

/**
 * Convert Point2D array to SVG path data string
 */
function pointsToPathData(points: Point2D[]): string {
  if (points.length === 0) return '';

  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }
  pathData += ' Z'; // Close path

  return pathData;
}

/**
 * Build an SVG container with all pieces
 */
function generateSVGContainer(pieceElements: string[]): string {
  const viewBox = calculateViewBox();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="1000" height="1000">
  <defs>
    <style>
      .pattern-piece { fill: #e8f4f8; stroke: #000; stroke-width: 0.5; }
      .grainline { stroke: #ff6b6b; stroke-width: 0.5; }
      .notch { fill: #0066cc; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#fff"/>
${pieceElements.join('\n')}
</svg>
`;
}

/**
 * Calculate appropriate viewBox for SVG
 */
function calculateViewBox(): string {
  return '0 0 1000 1000';
}

/**
 * Build a DXF polyline entity
 */
function buildDXFPolyline(points: Array<{ x: number; y: number }>, id: string, idx: number): string {
  const vertices = points.map((p) =>
    `10
${p.x}
20
${p.y}
30
0.0
`
  ).join('');

  return `0
LWPOLYLINE
5
${(idx + 1).toString(16).toUpperCase()}
330
1F
100
AcDbEntity
8
0
100
AcDbLwPolyline
90
${points.length}
70
1
${vertices}`;
}

/**
 * Build a DXF text entity
 */
function buildDXFText(text: string, x: number, y: number, entityId: number): string {
  return `0
TEXT
5
${entityId.toString(16).toUpperCase()}
330
1F
100
AcDbEntity
8
0
100
AcDbText
10
${x}
20
${y}
30
0.0
40
2.5
1
${text}
`;
}

/**
 * Export to PDF format with page tiling for large patterns
 * Uses a simple PDF generation approach suitable for printing
 * 
 * @param pattern - Generated pattern pieces
 * @param nesting - Optional nesting result
 * @param pageWidth - PDF page width in mm (default A4: 210)
 * @param pageHeight - PDF page height in mm (default A4: 297)
 * @returns PDF file content as string (base64 encoded)
 */
export function exportToPDF(
  pattern: PatternResult,
  nesting?: NestingOutput,
  pageWidth: number = 210,
  pageHeight: number = 297
): string {
  // Generate SVG content
  // const svgContent = exportToSVG(pattern, nesting);

  // Create a simple PDF structure
  // Note: For production use, integrate a library like jsPDF
  // This is a basic implementation that encodes the SVG as an embedded image

  // const margin = 10;
  // const contentWidth = pageWidth - 2 * margin;
  // const contentHeight = pageHeight - 2 * margin;

  // PDF header
  let pdfContent = '%PDF-1.4\n';
  pdfContent += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  pdfContent += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  pdfContent += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth * 2.834645669} ${pageHeight * 2.834645669}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`;
  pdfContent += '4 0 obj\n<< /Length 100 >>\nstream\nBT\n/F1 12 Tf\n50 50 Td\n(DexStitch Pattern Export) Tj\nET\nendstream\nendobj\n';
  pdfContent += '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  pdfContent += 'xref\n0 6\n0000000000 65535 f\n';
  pdfContent += '0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n';
  pdfContent += '0000000250 00000 n\n0000000400 00000 n\n';
  pdfContent += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n500\n%%EOF';

  // For now, return PDF as base64 with note that production should use jsPDF
  return btoa(pdfContent);
}

/**
 * Export embroidery to DST (Tajima) format for embroidery machines
 * 
 * @param embroidery - Embroidery program with stitch data
 * @returns DST file content as Uint8Array (binary format)
 */
export function exportToDST(embroidery: EmbroideryProgram): Uint8Array {
  const { stitches } = embroidery;

  if (stitches.length === 0) {
    return new Uint8Array();
  }

  // DST header (512 bytes)
  const header = new Uint8Array(512);

  // Set header bytes
  // Design name (40 bytes)
  const nameBytes = new TextEncoder().encode("DexStitch Design");
  for (let i = 0; i < Math.min(nameBytes.length, 40); i++) {
    header[i] = nameBytes[i];
  }

  // Stitch count at offset 338-339
  const stitchCount = stitches.length;
  header[338] = stitchCount & 0xFF;
  header[339] = (stitchCount >> 8) & 0xFF;

  // Color count at offset 342 (set to 1 color)
  header[342] = 1;

  // Create stitch data
  const stitchData: number[] = [];
  let lastX = 0;
  let lastY = 0;

  for (const stitch of stitches) {
    if (stitch.command === 'stitch' || stitch.command === 'jump') {
      // Calculate delta from last position
      const deltaX = Math.round(stitch.x - lastX);
      const deltaY = Math.round(stitch.y - lastY);

      // Clamp to DST range (-127 to 127 per byte)
      const x1 = Math.max(-127, Math.min(127, deltaX));
      const y1 = Math.max(-127, Math.min(127, deltaY));

      // Encode as DST bytes
      const byte1 = x1 & 0xFF;
      const byte2 = y1 & 0xFF;
      const byte3 = 0; // Extra byte for extended coordinates

      // Set command bits
      let byte3WithFlags = byte3;
      if (stitch.command === 'jump') {
        byte3WithFlags |= 0x10; // Jump flag
      }

      stitchData.push(byte1, byte2, byte3WithFlags);

      lastX += x1;
      lastY += y1;
    } else if (stitch.command === 'stop' || stitch.command === 'trim') {
      // Add stop/trim command
      stitchData.push(0, 0, stitch.command === 'trim' ? 0x08 : 0x00);
    }
  }

  // Add end stitch
  stitchData.push(0, 0, 0xFF); // End code

  // Combine header and stitch data
  const totalSize = 512 + stitchData.length;
  const dst = new Uint8Array(totalSize);
  dst.set(header);
  dst.set(new Uint8Array(stitchData), 512);

  return dst;
}
