import { useState, useEffect } from "react";
import { estimateMeasurementsFromPose } from "@dexstitch/core";
import { getPoseEstimator, disposePoseEstimator } from "../ml/poseEstimator";
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
  const [scanStatus, setScanStatus] = useState("Loading ML model...");
  const [referencHeight, setReferenceHeight] = useState(measurements.height);
  const [modelReady, setModelReady] = useState(false);
  const [currentLandmarks, setCurrentLandmarks] = useState<Array<{x: number, y: number, z?: number, visibility?: number}>>([]);

  // Initialize pose estimator on component mount
  useEffect(() => {
    const initModel = async () => {
      try {
        const estimator = getPoseEstimator();
        await estimator.initialize();
        setModelReady(true);
        setScanStatus("Ready - Point camera at subject");
      } catch (error) {
        setScanStatus(`Model error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error("Failed to load pose model:", error);
      }
    };

    void initModel();

    // Cleanup on unmount
    return () => {
      disposePoseEstimator();
    };
  }, []);

  const handleScanFrame = async (imageData: ImageData) => {
    if (!modelReady) {
      setScanStatus("Model not ready");
      return;
    }

    try {
      setScanStatus("Analyzing pose...");

      // Get real pose landmarks from ML model
      const estimator = getPoseEstimator();
      const landmarks = await estimator.estimatePose(imageData);

      // Update landmarks for visualization
      setCurrentLandmarks(landmarks);

      if (landmarks.length === 0) {
        setScanStatus("No pose detected - try better lighting or move closer");
        return;
      }

      const estimates = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: referencHeight,
        minConfidence: 0.5
      });

      if (estimates.length === 0) {
        setScanStatus("Could not estimate measurements from pose");
        return;
      }

      // Create measurement update from estimates
      const updates: Partial<MeasurementSet> = {};
      for (const estimate of estimates) {
        if (estimate.confidence > 0.6) {
          updates[estimate.name] = estimate.value;
        }
      }

      setScanStatus(`Detected ${estimates.length} measurements ✓`);
      onMeasurementsChange(updates);
    } catch (error) {
      setScanStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error("Pose estimation error:", error);
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
        <h3 className="section-title">Body Scanner (AI-Powered Measurements)</h3>
        
        <div style={{ 
          background: 'var(--panel-bg)', 
          border: '2px solid var(--highlight)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: 'var(--highlight)' }}>📸 How to Use the Scanner:</h4>
          <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Enter your height</strong> in millimeters (e.g., 1750mm for 5'9")</li>
            <li><strong>Click "Start Camera"</strong> to enable your webcam</li>
            <li><strong>Position yourself</strong> in the camera frame:
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>Stand 6-8 feet from the camera</li>
                <li>Face the camera directly with arms at sides or slightly out</li>
                <li>Ensure your full body is visible from head to feet</li>
                <li>Align yourself with the dotted guide overlay</li>
                <li>Use good lighting - avoid backlighting</li>
              </ul>
            </li>
            <li><strong>Watch for green skeleton</strong> - when it appears, you're being detected</li>
            <li><strong>Click "Capture Frame"</strong> when positioned correctly</li>
            <li><strong>Review measurements</strong> - AI will estimate key body dimensions</li>
          </ol>
          <p style={{ margin: '12px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
            💡 <strong>Tip:</strong> Wear fitted clothing and capture multiple times for better accuracy. Manual adjustments can be made to any measurement below.
          </p>
        </div>
        
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
          <p className="status-pill" style={{
            backgroundColor: modelReady ? '#90EE90' : '#FFD700',
            color: '#000'
          }}>
            {scanStatus}
          </p>
        </div>
        {modelReady && (
          <div style={{ marginTop: '16px' }}>
            <CameraCapture 
              onFrame={handleScanFrame} 
              landmarks={currentLandmarks}
              showGuide={true}
            />
          </div>
        )}
        {!modelReady && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            background: 'var(--input-bg)',
            borderRadius: '12px',
            marginTop: '16px'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
              Loading ML model... This may take 30-60 seconds on first use.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
