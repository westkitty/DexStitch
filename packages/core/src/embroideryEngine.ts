import type { EmbroideryProgram, Point2D, Stitch } from "@dexstitch/types";

/**
 * Configuration for image-to-vector conversion
 */
export interface VectorizerConfig {
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothing: number;
  /** Color threshold for edge detection (0-255) */
  threshold: number;
  /** Simplify paths to reduce point count */
  simplify: boolean;
  /** Minimum path length to include */
  minPathLength: number;
}

/**
 * Vector shape that can be stitched
 */
export interface VectorShape {
  id: string;
  type: 'fill' | 'stroke' | 'outline';
  points: Point2D[];
  color?: { r: number; g: number; b: number };
  closed: boolean;
}

/**
 * Vectorize a raster image to vector shapes using edge detection and contour tracing
 * 
 * @param imageData - Canvas image data from image source
 * @param config - Vectorization configuration
 * @returns Array of vector shapes ready for stitching
 */
export function vectorizeImage(imageData: ImageData, config: Partial<VectorizerConfig> = {}): VectorShape[] {
  const fullConfig: VectorizerConfig = {
    smoothing: 0.5,
    threshold: 128,
    simplify: true,
    minPathLength: 5,
    ...config
  };

  // Convert to grayscale
  const grayscale = toGrayscale(imageData);

  // Apply threshold to create binary image
  const binary = applyThreshold(grayscale, fullConfig.threshold);

  // Trace contours
  const contours = traceContours(binary, imageData.width, imageData.height);

  // Convert contours to vector shapes
  return contours
    .map((contour, idx) => ({
      id: `shape-${idx}`,
      type: 'fill' as const,
      points: contour,
      closed: true
    }))
    .filter(shape => shape.points.length >= fullConfig.minPathLength);
}

/**
 * Generate embroidery stitches from vector shapes
 * 
 * @param shapes - Vector shapes to stitch
 * @param options - Generation options
 * @returns Embroidery program ready for machine output
 */
export function generateStitches(
  shapes: VectorShape[],
  options: Partial<EcoStitchOptions> = {}
): EmbroideryProgram {
  const fullOptions: EcoStitchOptions = {
    ecoMode: true,
    stitchDensity: 0.1, // mm between stitches
    minJumpOptimization: true,
    maxJumpDistance: 100,
    ...options
  };

  let stitches: Stitch[] = [];
  let currentColor = { r: 0, g: 0, b: 0 };
  let lastPosition: Point2D = { x: 0, y: 0 };

  // Sort shapes for optimal routing if ecoMode is enabled
  let orderedShapes = shapes;
  if (fullOptions.ecoMode) {
    orderedShapes = optimizeShapeOrder(shapes, lastPosition);
  }

  // Generate stitches for each shape
  for (const shape of orderedShapes) {
    if (shape.color && (shape.color.r !== currentColor.r || shape.color.g !== currentColor.g || shape.color.b !== currentColor.b)) {
      // Color change
      stitches.push({
        x: lastPosition.x,
        y: lastPosition.y,
        command: 'stop' // Machine stop for color change
      });
      currentColor = shape.color;
    }

    // Generate stitches for this shape
    const shapeStitches = generateShapeStitches(shape, lastPosition, fullOptions);
    stitches = stitches.concat(shapeStitches);

    if (shapeStitches.length > 0) {
      const last = shapeStitches[shapeStitches.length - 1];
      lastPosition = { x: last.x, y: last.y };
    }
  }

  // Calculate metrics
  const stitchCount = stitches.filter(s => s.command === 'stitch').length;
  const jumpCount = stitches.filter(s => s.command === 'jump').length;
  const threadLength = calculateThreadLength(stitches);
  const estimatedTime = (stitchCount / 700) * 60 * 1000; // 700 stitches per minute in ms

  return {
    stitches,
    threadData: [{
      color: currentColor,
      length: threadLength
    }],
    metadata: {
      stitchCount,
      jumpCount,
      estimatedTime,
      threadLength,
      needleCount: 1
    }
  };
}

/**
 * Options for Eco-Stitch optimization
 */
interface EcoStitchOptions {
  ecoMode: boolean;
  stitchDensity: number;
  minJumpOptimization: boolean;
  maxJumpDistance: number;
}

/**
 * Optimize shape order to minimize jumps (traveling salesman problem approximation)
 */
function optimizeShapeOrder(shapes: VectorShape[], startPos: Point2D): VectorShape[] {
  if (shapes.length <= 1) return shapes;

  // Simple nearest-neighbor approximation
  const remaining = [...shapes];
  const ordered: VectorShape[] = [];
  let current = startPos;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const shape = remaining[i];
      const firstPoint = shape.points[0];
      const dist = Math.hypot(firstPoint.x - current.x, firstPoint.y - current.y);

      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const nearest = remaining.splice(nearestIdx, 1)[0];
    ordered.push(nearest);
    current = nearest.points[nearest.points.length - 1];
  }

  return ordered;
}

/**
 * Generate stitch path for a single vector shape
 */
function generateShapeStitches(shape: VectorShape, startPos: Point2D, options: EcoStitchOptions): Stitch[] {
  const stitches: Stitch[] = [];
  const points = shape.points;

  if (points.length === 0) return stitches;

  // Jump to start position if far away
  const start = points[0];
  const distToStart = Math.hypot(start.x - startPos.x, start.y - startPos.y);

  if (distToStart > 1) { // More than 1mm away
    if (distToStart > options.maxJumpDistance && !options.minJumpOptimization) {
      stitches.push({
        x: start.x,
        y: start.y,
        command: 'jump'
      });
    } else if (options.minJumpOptimization) {
      // Use connecting stitches instead of jump
      const steps = Math.ceil(distToStart / 5);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        stitches.push({
          x: startPos.x + (start.x - startPos.x) * t,
          y: startPos.y + (start.y - startPos.y) * t,
          command: 'stitch'
        });
      }
    }
  }

  // Stitch along the shape outline
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const dist = Math.hypot(next.x - current.x, next.y - current.y);

    // Number of stitches along this segment
    const segmentStitches = Math.ceil(dist / options.stitchDensity);

    for (let j = 1; j <= segmentStitches; j++) {
      const t = j / segmentStitches;
      stitches.push({
        x: current.x + (next.x - current.x) * t,
        y: current.y + (next.y - current.y) * t,
        command: 'stitch'
      });
    }
  }

  // Close the shape
  if (shape.closed && stitches.length > 0) {
    const lastStitch = stitches[stitches.length - 1];
    const firstPoint = points[0];
    const dist = Math.hypot(firstPoint.x - lastStitch.x, firstPoint.y - lastStitch.y);

    if (dist > options.stitchDensity * 2) {
      const steps = Math.ceil(dist / options.stitchDensity);
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        stitches.push({
          x: lastStitch.x + (firstPoint.x - lastStitch.x) * t,
          y: lastStitch.y + (firstPoint.y - lastStitch.y) * t,
          command: 'stitch'
        });
      }
    }
  }

  return stitches;
}

/**
 * Convert image to grayscale
 */
function toGrayscale(imageData: ImageData): Uint8ClampedArray {
  const data = imageData.data;
  const grayscale = new Uint8ClampedArray(imageData.width * imageData.height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard grayscale formula
    grayscale[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  return grayscale;
}

/**
 * Apply threshold to create binary image
 */
function applyThreshold(grayscale: Uint8ClampedArray, threshold: number): Uint8ClampedArray {
  const binary = new Uint8ClampedArray(grayscale.length);

  for (let i = 0; i < grayscale.length; i++) {
    binary[i] = grayscale[i] > threshold ? 255 : 0;
  }

  return binary;
}

/**
 * Trace contours in binary image using simple edge following
 */
function traceContours(binary: Uint8ClampedArray, width: number, height: number): Point2D[][] {
  const visited = new Uint8ClampedArray(binary.length);
  const contours: Point2D[][] = [];

  // Find all contours
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] > 127 && !visited[i]) {
      const contour = traceContour(binary, visited, i, width, height);
      if (contour.length > 5) {
        contours.push(contour);
      }
    }
  }

  return contours;
}

/**
 * Trace a single contour starting from a pixel
 */
function traceContour(binary: Uint8ClampedArray, visited: Uint8ClampedArray, startIdx: number, width: number, height: number): Point2D[] {
  const contour: Point2D[] = [];
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
  ];

  let idx = startIdx;
  let visited_count = 0;
  const max_iterations = width * height;

  while (visited_count < max_iterations) {
    visited[idx] = 1;
    const y = Math.floor(idx / width);
    const x = idx % width;
    contour.push({ x: x * 2, y: y * 2 }); // Scale up for visibility

    // Find next white pixel
    let foundNext = false;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (binary[nidx] > 127 && !visited[nidx]) {
          idx = nidx;
          foundNext = true;
          break;
        }
      }
    }

    if (!foundNext) break;
    visited_count++;
  }

  return contour;
}

/**
 * Calculate total thread length from stitch path
 */
function calculateThreadLength(stitches: Stitch[]): number {
  let length = 0;

  for (let i = 1; i < stitches.length; i++) {
    const prev = stitches[i - 1];
    const curr = stitches[i];
    length += Math.hypot(curr.x - prev.x, curr.y - prev.y);
  }

  return length;
}
