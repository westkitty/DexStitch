import { useState, useEffect } from "react";
import { estimateMeasurementsFromPose } from "@dexstitch/core";
import type { PoseLandmark } from "@dexstitch/core";
import { getPoseEstimator, disposePoseEstimator } from "../ml/poseEstimator";
import CameraCapture from "../components/CameraCapture";
import RotationScan from "../components/RotationScan";
import DualUnitInput from "../components/DualUnitInput";
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
  const mmToIn = (mm: number) => mm / 25.4;
  const formatInches = (mm: number) => `${mmToIn(mm).toFixed(2)} in`;
  const formatFeetInches = (mm: number) => {
    const totalInches = mmToIn(mm);
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };
  const [scanStatus, setScanStatus] = useState("Loading ML model...");
  const [referencHeight, setReferenceHeight] = useState(measurements.height);
  const [modelReady, setModelReady] = useState(false);
  const [currentLandmarks, setCurrentLandmarks] = useState<PoseLandmark[]>([]);
  const [scanMode, setScanMode] = useState<'camera' | 'rotation'>('camera');

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

  const handleRotationScanComplete = async (frames: Array<{ timestamp: number; imageData: ImageData; landmarks: PoseLandmark[] }>) => {
    if (frames.length === 0) {
      setScanStatus("No frames captured");
      return;
    }

    try {
      setScanStatus(`Processing ${frames.length} frames from 360° scan...`);

      // Average measurements from all frame samples
      const allEstimates: { [key: string]: number[] } = {};
      const estimator = getPoseEstimator();

      for (const frame of frames) {
        try {
          // Get measurements from this frame
          const landmarks = frame.landmarks.length > 0 ? frame.landmarks : await estimator.estimatePose(frame.imageData);
          
          if (landmarks.length === 0) continue;

          const estimates = estimateMeasurementsFromPose(landmarks, {
            referenceHeight: referencHeight,
            minConfidence: 0.5
          });

          for (const estimate of estimates) {
            if (estimate.confidence > 0.5) {
              if (!allEstimates[estimate.name]) {
                allEstimates[estimate.name] = [];
              }
              allEstimates[estimate.name].push(estimate.value);
            }
          }
        } catch (err) {
          console.error("Frame processing error:", err);
          continue;
        }
      }

      // Average all measurements
      const updates: Partial<MeasurementSet> = {};
      const measurementCount = Object.keys(allEstimates).length;
      
      for (const [name, values] of Object.entries(allEstimates)) {
        if (values.length > 0) {
          const average = values.reduce((a, b) => a + b, 0) / values.length;
          updates[name as keyof MeasurementSet] = average;
        }
      }

      // Update landmarks with the last frame for visualization
      setCurrentLandmarks(frames[frames.length - 1].landmarks);
      setScanStatus(`✓ Complete! Averaged ${measurementCount} measurements from 360° scan`);
      onMeasurementsChange(updates);
      
      // Switch back to camera mode
      setTimeout(() => setScanMode('camera'), 2000);
    } catch (error) {
      setScanStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error("Rotation scan error:", error);
    }
  };

  return (
    <div className="panel">
      <h2 className="section-title">Measurements</h2>
      <div className="form-grid">
        {Object.entries(measurements).map(([key, value]) => (
          <DualUnitInput
            key={key}
            id={`measurement-${key}`}
            label={key}
            value={value}
            onChange={(newValue) =>
              onMeasurementsChange({ [key]: newValue })
            }
          />
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
        <DualUnitInput
          id="pattern-dart"
          label="dart depth"
          value={patternSpec.parameters.dartDepth || 0}
          onChange={(newValue) =>
            onPatternSpecChange({
              parameters: {
                ...patternSpec.parameters,
                dartDepth: newValue
              }
            })
          }
          step={5}
        />
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
            <li><strong>Enter your height</strong> in millimeters (e.g., 1750mm / 68.9in)</li>
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
            <label htmlFor="ref-height">Your Height (mm / in):</label>
            <select
              id="ref-height"
              value={referencHeight}
              onChange={(e) => setReferenceHeight(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '1rem',
                border: '2px solid var(--input-border)',
                borderRadius: '6px',
                background: 'var(--input-bg)',
                color: 'var(--text-color)',
                cursor: 'pointer'
              }}
            >
              <option value="">Select your height...</option>
              <optgroup label="Imperial (Feet & Inches)">
                <option value="1524">5'0" (1524mm / 152cm)</option>
                <option value="1549">5'1" (1549mm / 155cm)</option>
                <option value="1575">5'2" (1575mm / 158cm)</option>
                <option value="1600">5'3" (1600mm / 160cm)</option>
                <option value="1626">5'4" (1626mm / 163cm)</option>
                <option value="1651">5'5" (1651mm / 165cm)</option>
                <option value="1676">5'6" (1676mm / 168cm)</option>
                <option value="1702">5'7" (1702mm / 170cm)</option>
                <option value="1727">5'8" (1727mm / 173cm)</option>
                <option value="1753">5'9" (1753mm / 175cm)</option>
                <option value="1778">5'10" (1778mm / 178cm)</option>
                <option value="1803">5'11" (1803mm / 180cm)</option>
                <option value="1829">6'0" (1829mm / 183cm)</option>
                <option value="1854">6'1" (1854mm / 185cm)</option>
                <option value="1880">6'2" (1880mm / 188cm)</option>
                <option value="1905">6'3" (1905mm / 191cm)</option>
                <option value="1930">6'4" (1930mm / 193cm)</option>
                <option value="1956">6'5" (1956mm / 196cm)</option>
                <option value="1981">6'6" (1981mm / 198cm)</option>
              </optgroup>
              <optgroup label="Metric (Centimeters)">
                <option value="1500">150cm (4'11" / 1500mm)</option>
                <option value="1550">155cm (5'1" / 1550mm)</option>
                <option value="1600">160cm (5'3" / 1600mm)</option>
                <option value="1650">165cm (5'5" / 1650mm)</option>
                <option value="1700">170cm (5'7" / 1700mm)</option>
                <option value="1750">175cm (5'9" / 1750mm)</option>
                <option value="1800">180cm (5'11" / 1800mm)</option>
                <option value="1850">185cm (6'1" / 1850mm)</option>
                <option value="1900">190cm (6'3" / 1900mm)</option>
                <option value="1950">195cm (6'5" / 1950mm)</option>
                <option value="2000">200cm (6'7" / 2000mm)</option>
              </optgroup>
            </select>
            {referencHeight > 0 && (
              <div style={{ 
                marginTop: '8px', 
                fontSize: '0.9em', 
                color: 'var(--text-secondary)' 
              }}>
                Selected: {referencHeight}mm
                {' '}({(referencHeight / 10).toFixed(1)}cm)
                {' '}({formatInches(referencHeight)})
                {' '}({formatFeetInches(referencHeight)})
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              <label htmlFor="custom-height" style={{ fontSize: '0.9em' }}>Or enter custom (mm / in):</label>
              <input
                id="custom-height"
                type="number"
                value={referencHeight}
                onChange={(e) => setReferenceHeight(Number(e.target.value))}
                placeholder="Custom height in mm"
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  marginTop: '4px',
                  fontSize: '0.95rem',
                  border: '2px solid var(--input-border)',
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)'
                }}
              />
              {referencHeight > 0 && (
                <div style={{ marginTop: '4px', fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                  {formatInches(referencHeight)} ({formatFeetInches(referencHeight)})
                </div>
              )}
            </div>
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
            {/* Mode Selection Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setScanMode('camera')}
                style={{
                  padding: '12px 24px',
                  fontSize: '1em',
                  fontWeight: scanMode === 'camera' ? 'bold' : 'normal',
                  background: scanMode === 'camera' ? '#00ff00' : 'var(--input-bg)',
                  color: scanMode === 'camera' ? '#000' : 'var(--text-color)',
                  border: '2px solid ' + (scanMode === 'camera' ? '#00ff00' : 'var(--input-border)'),
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                📷 Single Frame
              </button>
              <button
                onClick={() => setScanMode('rotation')}
                style={{
                  padding: '12px 24px',
                  fontSize: '1em',
                  fontWeight: scanMode === 'rotation' ? 'bold' : 'normal',
                  background: scanMode === 'rotation' ? '#ffaa00' : 'var(--input-bg)',
                  color: scanMode === 'rotation' ? '#000' : 'var(--text-color)',
                  border: '2px solid ' + (scanMode === 'rotation' ? '#ffaa00' : 'var(--input-border)'),
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔄 360° Rotation Scan
              </button>
            </div>

            {/* Render appropriate scanner based on mode */}
            {scanMode === 'camera' ? (
              <CameraCapture 
                onFrame={handleScanFrame} 
                landmarks={currentLandmarks}
                showGuide={true}
                autoCapture={true}
              />
            ) : (
              <RotationScan
                onComplete={handleRotationScanComplete}
                onCancel={() => setScanMode('camera')}
              />
            )}
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
