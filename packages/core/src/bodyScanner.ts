import type { MeasurementSet } from "@dexstitch/types";

/**
 * Body measurement from pose estimation
 */
export interface MeasurementEstimate {
  /** Measurement name */
  name: keyof MeasurementSet;
  /** Estimated value in mm */
  value: number;
  /** Confidence (0-1) */
  confidence: number;
}

/**
 * Pose landmarks from TensorFlow.js pose estimation
 */
export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Configuration for body scanning
 */
export interface BodyScannerConfig {
  /** Reference height in mm (for scale calibration) */
  referenceHeight?: number;
  /** Reference object width in mm (e.g., A4 paper: 210mm) */
  referenceWidth?: number;
  /** Minimum confidence threshold for landmarks (0-1) */
  minConfidence: number;
  /** Image resolution (larger = slower but more accurate) */
  imageSize: number;
}

/**
 * Estimate body measurements from pose landmarks using vision transformation
 * 
 * @param landmarks - Array of pose keypoints with x,y,z coordinates
 * @param config - Body scanner configuration
 * @returns Array of estimated measurements with confidence scores
 */
export function estimateMeasurementsFromPose(
  landmarks: PoseLandmark[],
  config: Partial<BodyScannerConfig> = {}
): MeasurementEstimate[] {
  const fullConfig: BodyScannerConfig = {
    minConfidence: 0.5,
    imageSize: 640,
    ...config
  };

  if (landmarks.length < 17) {
    // Need at least MediaPipe Pose's 33 keypoints
    return [];
  }

  const measurements: MeasurementEstimate[] = [];

  // Define keypoint indices (MediaPipe Pose format)
  const NOSE = 0;
  const L_SHOULDER = 11;
  const R_SHOULDER = 12;
  const L_HIP = 23;
  const R_HIP = 24;
  const R_ANKLE = 28;


  // Skip if landmarks don't pass confidence threshold
  const validLandmarks = landmarks.filter(l => (l.visibility ?? 1) > fullConfig.minConfidence);
  if (validLandmarks.length < 10) {
    return measurements;
  }

  // Calculate pixel-to-mm conversion factor
  let pixelToMmScale = 1;
  if (fullConfig.referenceHeight) {
    // Use reference height (e.g., user's stated height)
    const headToAnkleDistance = distance(
      landmarks[NOSE],
      landmarks[R_ANKLE]
    );
    pixelToMmScale = fullConfig.referenceHeight / (headToAnkleDistance || 1);
  }

  // Estimate height
  const headToAnkle = distance(landmarks[NOSE], landmarks[R_ANKLE]) * pixelToMmScale;
  measurements.push({
    name: 'height',
    value: Math.round(headToAnkle),
    confidence: getAverageConfidence([landmarks[NOSE], landmarks[R_ANKLE]])
  });

  // Estimate neck circumference (rough estimate from shoulder width)
  const neckWidth = distance(landmarks[L_SHOULDER], landmarks[R_SHOULDER]) * pixelToMmScale * 0.3; // Neck is ~30% of shoulder width
  measurements.push({
    name: 'neck',
    value: Math.round(neckWidth * Math.PI), // Convert width to circumference (diameter * π)
    confidence: getAverageConfidence([landmarks[L_SHOULDER], landmarks[R_SHOULDER]])
  });

  // Estimate chest (shoulder to shin distance, use as proxy)
  // Estimate chest (shoulder to shin distance, use as proxy)

  const chestEstimate = distance(landmarks[L_SHOULDER], landmarks[R_SHOULDER]) * pixelToMmScale * 1.2; // Chest slightly wider
  measurements.push({
    name: 'chest',
    value: Math.round(chestEstimate * Math.PI), // Convert width to circumference
    confidence: getAverageConfidence([landmarks[L_SHOULDER], landmarks[R_SHOULDER], landmarks[L_HIP], landmarks[R_HIP]])
  });

  // Estimate waist (hip width with reduction)
  const hipWidth = distance(landmarks[L_HIP], landmarks[R_HIP]) * pixelToMmScale;
  const waistEstimate = hipWidth * 0.85; // Waist is typically ~85% of hip width
  measurements.push({
    name: 'waist',
    value: Math.round(waistEstimate * Math.PI), // Convert to circumference
    confidence: getAverageConfidence([landmarks[L_HIP], landmarks[R_HIP]])
  });

  // Estimate hip (hip width)
  const hipCircumference = hipWidth * Math.PI; // Convert width to circumference
  measurements.push({
    name: 'hip',
    value: Math.round(hipCircumference),
    confidence: getAverageConfidence([landmarks[L_HIP], landmarks[R_HIP]])
  });

  // Filter out low-confidence measurements
  return measurements.filter(m => m.confidence > fullConfig.minConfidence);
}

/**
 * Calculate Euclidean distance between two landmarks
 */
function distance(a: PoseLandmark, b: PoseLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get average visibility confidence from landmarks
 */
function getAverageConfidence(landmarks: PoseLandmark[]): number {
  const visibilities = landmarks
    .map(l => l.visibility ?? 1)
    .filter(v => v > 0);

  if (visibilities.length === 0) return 0;
  return visibilities.reduce((a, b) => a + b, 0) / visibilities.length;
}

/**
 * Refine measurements using depth estimation if available
 * This uses a simple heuristic to adjust circumferences based on body volume
 * 
 * @param measurements - Initial measurements from pose estimation
 * @param depthMap - Optional depth map as Canvas ImageData
 * @returns Refined measurements
 */
export function refineMeasurementsWithDepth(
  measurements: MeasurementEstimate[],
  depthMap?: ImageData
): MeasurementEstimate[] {
  if (!depthMap) {
    return measurements;
  }

  // Simple depth-based refinement: if depth variance is high, increase circumference estimates
  const depthValues = extractDepthValues(depthMap);
  const depthVariance = calculateVariance(depthValues);
  const depthStd = Math.sqrt(depthVariance);

  // Apply refinement based on depth standard deviation
  // Higher variance suggests more 3D body volume
  const refinementFactor = Math.min(1.15, 1.0 + depthStd / 100);

  return measurements.map(m => ({
    ...m,
    // Apply refinement mainly to circumference measurements (chest, waist, hip)
    value: ['chest', 'waist', 'hip'].includes(m.name)
      ? Math.round(m.value * refinementFactor)
      : m.value
  }));
}

/**
 * Extract depth values from canvas depth map
 */
function extractDepthValues(imageData: ImageData): number[] {
  const data = imageData.data;
  const depths: number[] = [];

  // Assume depth is encoded in red channel (common for monocular depth maps)
  for (let i = 0; i < data.length; i += 4) {
    depths.push(data[i]); // Red channel
  }

  return depths;
}

/**
 * Calculate variance of array values
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Apply smoothing filter to measurement estimates to reduce noise
 * Uses exponential moving average
 * 
 * @param current - Current measurement estimates
 * @param previous - Previous measurement estimates
 * @param alpha - Smoothing factor (0-1, higher = more weight on current)
 * @returns Smoothed measurements
 */
export function smoothMeasurements(
  current: MeasurementEstimate[],
  previous: MeasurementEstimate[],
  alpha: number = 0.7
): MeasurementEstimate[] {
  const previousMap = new Map(previous.map(m => [m.name, m]));

  return current.map(m => {
    const prev = previousMap.get(m.name);
    if (!prev) return m;

    return {
      ...m,
      value: Math.round(prev.value * (1 - alpha) + m.value * alpha),
      confidence: (prev.confidence * (1 - alpha) + m.confidence * alpha)
    };
  });
}
