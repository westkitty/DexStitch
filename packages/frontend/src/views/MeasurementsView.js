import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { estimateMeasurementsFromPose } from "@dexstitch/core";
import { getPoseEstimator, disposePoseEstimator } from "../ml/poseEstimator";
import CameraCapture from "../components/CameraCapture";
import RotationScan from "../components/RotationScan";
import DualUnitInput from "../components/DualUnitInput";
export default function MeasurementsView({ measurements, patternSpec, onMeasurementsChange, onPatternSpecChange }) {
    const mmToIn = (mm) => mm / 25.4;
    const formatInches = (mm) => `${mmToIn(mm).toFixed(2)} in`;
    const formatFeetInches = (mm) => {
        const totalInches = mmToIn(mm);
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}'${inches}"`;
    };
    const [scanStatus, setScanStatus] = useState("Loading ML model...");
    const [referencHeight, setReferenceHeight] = useState(measurements.height);
    const [modelReady, setModelReady] = useState(false);
    const [currentLandmarks, setCurrentLandmarks] = useState([]);
    const [scanMode, setScanMode] = useState('camera');
    // Initialize pose estimator on component mount
    useEffect(() => {
        const initModel = async () => {
            try {
                const estimator = getPoseEstimator();
                await estimator.initialize();
                setModelReady(true);
                setScanStatus("Ready - Point camera at subject");
            }
            catch (error) {
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
    const handleScanFrame = async (imageData) => {
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
            const updates = {};
            for (const estimate of estimates) {
                if (estimate.confidence > 0.6) {
                    updates[estimate.name] = estimate.value;
                }
            }
            setScanStatus(`Detected ${estimates.length} measurements ✓`);
            onMeasurementsChange(updates);
        }
        catch (error) {
            setScanStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error("Pose estimation error:", error);
        }
    };
    const handleRotationScanComplete = async (frames) => {
        if (frames.length === 0) {
            setScanStatus("No frames captured");
            return;
        }
        try {
            setScanStatus(`Processing ${frames.length} frames from 360° scan...`);
            // Average measurements from all frame samples
            const allEstimates = {};
            const estimator = getPoseEstimator();
            for (const frame of frames) {
                try {
                    // Get measurements from this frame
                    const landmarks = frame.landmarks.length > 0 ? frame.landmarks : await estimator.estimatePose(frame.imageData);
                    if (landmarks.length === 0)
                        continue;
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
                }
                catch (err) {
                    console.error("Frame processing error:", err);
                    continue;
                }
            }
            // Average all measurements
            const updates = {};
            const measurementCount = Object.keys(allEstimates).length;
            for (const [name, values] of Object.entries(allEstimates)) {
                if (values.length > 0) {
                    const average = values.reduce((a, b) => a + b, 0) / values.length;
                    updates[name] = average;
                }
            }
            // Update landmarks with the last frame for visualization
            setCurrentLandmarks(frames[frames.length - 1].landmarks);
            setScanStatus(`✓ Complete! Averaged ${measurementCount} measurements from 360° scan`);
            onMeasurementsChange(updates);
            // Switch back to camera mode
            setTimeout(() => setScanMode('camera'), 2000);
        }
        catch (error) {
            setScanStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error("Rotation scan error:", error);
        }
    };
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Measurements" }), _jsxs("div", { className: "form-grid", children: [Object.entries(measurements).map(([key, value]) => (_jsx(DualUnitInput, { id: `measurement-${key}`, label: key, value: value, onChange: (newValue) => onMeasurementsChange({ [key]: newValue }) }, key))), _jsxs("div", { children: [_jsx("label", { htmlFor: "pattern-ease", children: "ease" }), _jsx("input", { id: "pattern-ease", type: "number", step: "0.1", value: patternSpec.parameters.ease, onChange: (event) => onPatternSpecChange({
                                    parameters: {
                                        ...patternSpec.parameters,
                                        ease: Number(event.target.value)
                                    }
                                }) })] }), _jsx(DualUnitInput, { id: "pattern-dart", label: "dart depth", value: patternSpec.parameters.dartDepth || 0, onChange: (newValue) => onPatternSpecChange({
                            parameters: {
                                ...patternSpec.parameters,
                                dartDepth: newValue
                            }
                        }), step: 5 })] }), _jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { className: "section-title", children: "Body Scanner (AI-Powered Measurements)" }), _jsxs("div", { style: {
                            background: 'var(--panel-bg)',
                            border: '2px solid var(--highlight)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '16px'
                        }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', color: 'var(--highlight)' }, children: "\uD83D\uDCF8 How to Use the Scanner:" }), _jsxs("ol", { style: { margin: 0, paddingLeft: '20px', lineHeight: '1.8' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Enter your height" }), " in millimeters (e.g., 1750mm / 68.9in)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click \"Start Camera\"" }), " to enable your webcam"] }), _jsxs("li", { children: [_jsx("strong", { children: "Position yourself" }), " in the camera frame:", _jsxs("ul", { style: { marginTop: '8px', marginBottom: '8px' }, children: [_jsx("li", { children: "Stand 6-8 feet from the camera" }), _jsx("li", { children: "Face the camera directly with arms at sides or slightly out" }), _jsx("li", { children: "Ensure your full body is visible from head to feet" }), _jsx("li", { children: "Align yourself with the dotted guide overlay" }), _jsx("li", { children: "Use good lighting - avoid backlighting" })] })] }), _jsxs("li", { children: [_jsx("strong", { children: "Watch for green skeleton" }), " - when it appears, you're being detected"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click \"Capture Frame\"" }), " when positioned correctly"] }), _jsxs("li", { children: [_jsx("strong", { children: "Review measurements" }), " - AI will estimate key body dimensions"] })] }), _jsxs("p", { style: { margin: '12px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9em' }, children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Tip:" }), " Wear fitted clothing and capture multiple times for better accuracy. Manual adjustments can be made to any measurement below."] })] }), _jsxs("div", { className: "scan-controls", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "ref-height", children: "Your Height (mm / in):" }), _jsxs("select", { id: "ref-height", value: referencHeight, onChange: (e) => setReferenceHeight(Number(e.target.value)), style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            fontSize: '1rem',
                                            border: '2px solid var(--input-border)',
                                            borderRadius: '6px',
                                            background: 'var(--input-bg)',
                                            color: 'var(--text-color)',
                                            cursor: 'pointer'
                                        }, children: [_jsx("option", { value: "", children: "Select your height..." }), _jsxs("optgroup", { label: "Imperial (Feet & Inches)", children: [_jsx("option", { value: "1524", children: "5'0\" (1524mm / 152cm)" }), _jsx("option", { value: "1549", children: "5'1\" (1549mm / 155cm)" }), _jsx("option", { value: "1575", children: "5'2\" (1575mm / 158cm)" }), _jsx("option", { value: "1600", children: "5'3\" (1600mm / 160cm)" }), _jsx("option", { value: "1626", children: "5'4\" (1626mm / 163cm)" }), _jsx("option", { value: "1651", children: "5'5\" (1651mm / 165cm)" }), _jsx("option", { value: "1676", children: "5'6\" (1676mm / 168cm)" }), _jsx("option", { value: "1702", children: "5'7\" (1702mm / 170cm)" }), _jsx("option", { value: "1727", children: "5'8\" (1727mm / 173cm)" }), _jsx("option", { value: "1753", children: "5'9\" (1753mm / 175cm)" }), _jsx("option", { value: "1778", children: "5'10\" (1778mm / 178cm)" }), _jsx("option", { value: "1803", children: "5'11\" (1803mm / 180cm)" }), _jsx("option", { value: "1829", children: "6'0\" (1829mm / 183cm)" }), _jsx("option", { value: "1854", children: "6'1\" (1854mm / 185cm)" }), _jsx("option", { value: "1880", children: "6'2\" (1880mm / 188cm)" }), _jsx("option", { value: "1905", children: "6'3\" (1905mm / 191cm)" }), _jsx("option", { value: "1930", children: "6'4\" (1930mm / 193cm)" }), _jsx("option", { value: "1956", children: "6'5\" (1956mm / 196cm)" }), _jsx("option", { value: "1981", children: "6'6\" (1981mm / 198cm)" })] }), _jsxs("optgroup", { label: "Metric (Centimeters)", children: [_jsx("option", { value: "1500", children: "150cm (4'11\" / 1500mm)" }), _jsx("option", { value: "1550", children: "155cm (5'1\" / 1550mm)" }), _jsx("option", { value: "1600", children: "160cm (5'3\" / 1600mm)" }), _jsx("option", { value: "1650", children: "165cm (5'5\" / 1650mm)" }), _jsx("option", { value: "1700", children: "170cm (5'7\" / 1700mm)" }), _jsx("option", { value: "1750", children: "175cm (5'9\" / 1750mm)" }), _jsx("option", { value: "1800", children: "180cm (5'11\" / 1800mm)" }), _jsx("option", { value: "1850", children: "185cm (6'1\" / 1850mm)" }), _jsx("option", { value: "1900", children: "190cm (6'3\" / 1900mm)" }), _jsx("option", { value: "1950", children: "195cm (6'5\" / 1950mm)" }), _jsx("option", { value: "2000", children: "200cm (6'7\" / 2000mm)" })] })] }), referencHeight > 0 && (_jsxs("div", { style: {
                                            marginTop: '8px',
                                            fontSize: '0.9em',
                                            color: 'var(--text-secondary)'
                                        }, children: ["Selected: ", referencHeight, "mm", ' ', "(", (referencHeight / 10).toFixed(1), "cm)", ' ', "(", formatInches(referencHeight), ")", ' ', "(", formatFeetInches(referencHeight), ")"] })), _jsxs("div", { style: { marginTop: '8px' }, children: [_jsx("label", { htmlFor: "custom-height", style: { fontSize: '0.9em' }, children: "Or enter custom (mm / in):" }), _jsx("input", { id: "custom-height", type: "number", value: referencHeight, onChange: (e) => setReferenceHeight(Number(e.target.value)), placeholder: "Custom height in mm", style: {
                                                    width: '100%',
                                                    padding: '6px 10px',
                                                    marginTop: '4px',
                                                    fontSize: '0.95rem',
                                                    border: '2px solid var(--input-border)',
                                                    borderRadius: '6px',
                                                    background: 'var(--input-bg)',
                                                    color: 'var(--text-color)'
                                                } }), referencHeight > 0 && (_jsxs("div", { style: { marginTop: '4px', fontSize: '0.85em', color: 'var(--text-secondary)' }, children: [formatInches(referencHeight), " (", formatFeetInches(referencHeight), ")"] }))] })] }), _jsx("p", { className: "status-pill", style: {
                                    backgroundColor: modelReady ? '#90EE90' : '#FFD700',
                                    color: '#000'
                                }, children: scanStatus })] }), modelReady && (_jsxs("div", { style: { marginTop: '16px' }, children: [_jsxs("div", { style: {
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    flexWrap: 'wrap'
                                }, children: [_jsx("button", { onClick: () => setScanMode('camera'), style: {
                                            padding: '12px 24px',
                                            fontSize: '1em',
                                            fontWeight: scanMode === 'camera' ? 'bold' : 'normal',
                                            background: scanMode === 'camera' ? '#00ff00' : 'var(--input-bg)',
                                            color: scanMode === 'camera' ? '#000' : 'var(--text-color)',
                                            border: '2px solid ' + (scanMode === 'camera' ? '#00ff00' : 'var(--input-border)'),
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }, children: "\uD83D\uDCF7 Single Frame" }), _jsx("button", { onClick: () => setScanMode('rotation'), style: {
                                            padding: '12px 24px',
                                            fontSize: '1em',
                                            fontWeight: scanMode === 'rotation' ? 'bold' : 'normal',
                                            background: scanMode === 'rotation' ? '#ffaa00' : 'var(--input-bg)',
                                            color: scanMode === 'rotation' ? '#000' : 'var(--text-color)',
                                            border: '2px solid ' + (scanMode === 'rotation' ? '#ffaa00' : 'var(--input-border)'),
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }, children: "\uD83D\uDD04 360\u00B0 Rotation Scan" })] }), scanMode === 'camera' ? (_jsx(CameraCapture, { onFrame: handleScanFrame, landmarks: currentLandmarks, showGuide: true, autoCapture: true })) : (_jsx(RotationScan, { onComplete: handleRotationScanComplete, onCancel: () => setScanMode('camera') }))] })), !modelReady && (_jsxs("div", { style: {
                            textAlign: 'center',
                            padding: '40px',
                            background: 'var(--input-bg)',
                            borderRadius: '12px',
                            marginTop: '16px'
                        }, children: [_jsx("div", { style: { fontSize: '2em', marginBottom: '16px' }, children: "\u23F3" }), _jsx("p", { style: { color: 'var(--text-secondary)', margin: '0' }, children: "Loading ML model... This may take 30-60 seconds on first use." })] }))] })] }));
}
