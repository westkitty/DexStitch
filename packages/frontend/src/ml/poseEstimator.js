/**
 * TensorFlow.js MoveNet Pose Estimation
 * Detects human pose from image data and extracts landmarks
 */
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
/**
 * Pose estimator wrapper for TensorFlow.js MoveNet
 * Handles model initialization and inference
 */
export class PoseEstimator {
    constructor() {
        this.detector = null;
        this.isInitializing = false;
        this.initPromise = null;
    }
    /**
     * Initialize the pose detection model
     * Call this once before using estimatePose()
     */
    async initialize() {
        // Already initialized
        if (this.detector)
            return;
        // Currently initializing - return existing promise
        if (this.isInitializing && this.initPromise) {
            return this.initPromise;
        }
        this.isInitializing = true;
        this.initPromise = (async () => {
            try {
                // Set TensorFlow.js backend
                await tf.ready();
                // Use WebGL backend for better performance, fallback to CPU
                try {
                    await tf.setBackend("webgl");
                }
                catch {
                    console.warn("WebGL backend unavailable, using CPU");
                    await tf.setBackend("cpu");
                }
                // Create pose detector using MediaPipe Pose
                this.detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
                });
                // console.log("✓ Pose detection model loaded (MoveNet SINGLEPOSE_THUNDER)");
            }
            catch (error) {
                this.isInitializing = false;
                this.initPromise = null;
                throw new Error(`Failed to initialize pose detector: ${error}`);
            }
        })();
        await this.initPromise;
        this.isInitializing = false;
    }
    /**
     * Estimate pose landmarks from image data or canvas
     * Returns 33 MediaPipe Pose landmarks
     */
    async estimatePose(input) {
        if (!this.detector) {
            throw new Error("Pose estimator not initialized. Call initialize() first");
        }
        try {
            // Run pose detection
            const poses = await this.detector.estimatePoses(input);
            if (poses.length === 0) {
                return [];
            }
            // Extract landmarks from first detected person
            const pose = poses[0];
            if (!pose.keypoints) {
                return [];
            }
            // Convert keypoints to PoseLandmark format (x, y, visibility)
            return pose.keypoints.map(kp => ({
                x: kp.x,
                y: kp.y,
                visibility: kp.score || 0
            }));
        }
        catch (error) {
            console.error("Pose estimation error:", error);
            return [];
        }
    }
    /**
     * Check if model is ready
     */
    isReady() {
        return this.detector !== null;
    }
    /**
     * Dispose of resources and free memory
     */
    dispose() {
        if (this.detector) {
            this.detector.dispose();
            this.detector = null;
        }
        tf.dispose();
    }
}
/**
 * Global pose estimator instance (singleton pattern)
 */
let globalEstimator = null;
/**
 * Get or create the global pose estimator instance
 */
export function getPoseEstimator() {
    if (!globalEstimator) {
        globalEstimator = new PoseEstimator();
    }
    return globalEstimator;
}
/**
 * Cleanup global pose estimator
 */
export function disposePoseEstimator() {
    if (globalEstimator) {
        globalEstimator.dispose();
        globalEstimator = null;
    }
}
