import { useState } from "react";
import { estimateMeasurementsFromPose, smoothMeasurements, type PoseLandmark } from "@dexstitch/core";
import CameraCapture from "../components/CameraCapture";
import type { MeasurementSet, PatternSpec } from "@dexstitch/types";

type MeasurementsViewProps = {
  measurements: MeasurementSet;
  patternSpec: PatternSpec;
  onMeasurementsChange: (next: Partial<MeasurementSet>) => void;
  onPatternSpecChange: (next: Partial<PatternSpec>) => void;
};

export default function MeasurementsView({
  measurements,
  patternSpec,
  onMeasurementsChange,
  onPatternSpecChange
}: MeasurementsViewProps) {
  const [scanStatus, setScanStatus] = useState("Ready");
  const [referencHeight, setReferenceHeight] = useState(measurements.height);

  const handleScanFrame = async (imageData: ImageData) => {
    try {
      setScanStatus("Analyzing pose...");
      
      // Simulate pose estimation (in production, use MediaPipe Pose or TensorFlow.js)
      const mockLandmarks: PoseLandmark[] = generateMockLandmarks(imageData);
      
      const estimates = estimateMeasurementsFromPose(mockLandmarks, {
        referenceHeight: referencHeight,
        minConfidence: 0.5
      });

      if (estimates.length === 0) {
        setScanStatus("No pose detected, try better lighting");
        return;
      }

      // Create measurement update from estimates
      const updates: Partial<MeasurementSet> = {};
      for (const estimate of estimates) {
        if (estimate.confidence > 0.6) {
          updates[estimate.name] = estimate.value;
        }
      }

      setScanStatus(`Detected ${estimates.length} measurements`);
      onMeasurementsChange(updates);
    } catch (error) {
      setScanStatus(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  return (
    <div className="panel">
      <h2 className="section-title">Measurements</h2>
      <div className="form-grid">
        {Object.entries(measurements).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={`measurement-${key}`}>{key} (mm)</label>
            <input
              id={`measurement-${key}`}
              type="number"
              value={value}
              onChange={(event) =>
                onMeasurementsChange({ [key]: Number(event.target.value) })
              }
            />
          </div>
        ))}
        <div>
          <label htmlFor="pattern-ease">ease</label>
          <input
            id="pattern-ease"
            type="number"
            step="0.1"
            value={patternSpec.parameters.ease}
            onChange={(event) =>
              onPatternSpecChange({
                parameters: {
                  ...patternSpec.parameters,
                  ease: Number(event.target.value)
                }
              })
            }
          />
        </div>
        <div>
          <label htmlFor="pattern-dart">dart depth (mm)</label>
          <input
            id="pattern-dart"
            type="number"
            step="5"
            value={patternSpec.parameters.dartDepth || 0}
            onChange={(event) =>
              onPatternSpecChange({
                parameters: {
                  ...patternSpec.parameters,
                  dartDepth: Number(event.target.value)
                }
              })
            }
          />
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3 className="section-title">Body Scanner (Vision)</h3>
        <div className="scan-controls">
          <div>
            <label htmlFor="ref-height">Reference height (mm):</label>
            <input
              id="ref-height"
              type="number"
              value={referencHeight}
              onChange={(e) => setReferenceHeight(Number(e.target.value))}
              placeholder="Your actual height in mm"
            />
          </div>
          <p className="status-pill">{scanStatus}</p>
        </div>
        <CameraCapture onFrame={handleScanFrame} />
      </div>
    </div>
  );
}

/**
 * Generate mock pose landmarks from image data
 * In production, use MediaPipe Pose or TensorFlow.js pose estimator
 */
function generateMockLandmarks(imageData: ImageData): PoseLandmark[] {
  const { width, height } = imageData;
  
  // Simulate detected pose landmarks (33 points for MediaPipe Pose)
  // In real implementation, run ML model on imageData
  return [
    { x: width * 0.5, y: height * 0.1, visibility: 0.95 },  // NOSE
    { x: width * 0.5, y: height * 0.2, visibility: 0.9 },   // LEFT_SHOULDER
    { x: width * 0.5, y: height * 0.2, visibility: 0.9 },   // RIGHT_SHOULDER
    { x: width * 0.5, y: height * 0.4, visibility: 0.85 },  // LEFT_HIP
    { x: width * 0.5, y: height * 0.4, visibility: 0.85 },  // RIGHT_HIP
    { x: width * 0.5, y: height * 0.95, visibility: 0.8 },  // LEFT_ANKLE
    { x: width * 0.5, y: height * 0.95, visibility: 0.8 }   // RIGHT_ANKLE
  ];
}
