import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { estimateMeasurementsFromPose } from "@dexstitch/core";
import { getPoseEstimator, disposePoseEstimator } from "../ml/poseEstimator";
import CameraCapture from "../components/CameraCapture";
export default function MeasurementsView({ measurements, patternSpec, onMeasurementsChange, onPatternSpecChange }) {
    const [scanStatus, setScanStatus] = useState("Loading ML model...");
    const [referencHeight, setReferenceHeight] = useState(measurements.height);
    const [modelReady, setModelReady] = useState(false);
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
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Measurements" }), _jsxs("div", { className: "form-grid", children: [Object.entries(measurements).map(([key, value]) => (_jsxs("div", { children: [_jsxs("label", { htmlFor: `measurement-${key}`, children: [key, " (mm)"] }), _jsx("input", { id: `measurement-${key}`, type: "number", value: value, onChange: (event) => onMeasurementsChange({ [key]: Number(event.target.value) }) })] }, key))), _jsxs("div", { children: [_jsx("label", { htmlFor: "pattern-ease", children: "ease" }), _jsx("input", { id: "pattern-ease", type: "number", step: "0.1", value: patternSpec.parameters.ease, onChange: (event) => onPatternSpecChange({
                                    parameters: {
                                        ...patternSpec.parameters,
                                        ease: Number(event.target.value)
                                    }
                                }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "pattern-dart", children: "dart depth (mm)" }), _jsx("input", { id: "pattern-dart", type: "number", step: "5", value: patternSpec.parameters.dartDepth || 0, onChange: (event) => onPatternSpecChange({
                                    parameters: {
                                        ...patternSpec.parameters,
                                        dartDepth: Number(event.target.value)
                                    }
                                }) })] })] }), _jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { className: "section-title", children: "Body Scanner (TensorFlow.js MoveNet)" }), _jsxs("div", { className: "scan-controls", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "ref-height", children: "Reference height (mm):" }), _jsx("input", { id: "ref-height", type: "number", value: referencHeight, onChange: (e) => setReferenceHeight(Number(e.target.value)), placeholder: "Your actual height in mm" })] }), _jsx("p", { className: "status-pill", style: {
                                    backgroundColor: modelReady ? '#90EE90' : '#FFD700',
                                    color: '#000'
                                }, children: scanStatus })] }), modelReady && _jsx(CameraCapture, { onFrame: handleScanFrame }), !modelReady && _jsx("p", { style: { textAlign: 'center', color: '#666' }, children: "Loading ML model... This may take 30-60 seconds." })] })] }));
}
