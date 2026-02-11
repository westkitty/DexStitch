import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback } from "react";
export default function CameraCapture({ onFrame, landmarks, showGuide = true, autoCapture = false }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState("");
    const [poseQuality, setPoseQuality] = useState('none');
    const [countdown, setCountdown] = useState(null);
    const [captureSuccess, setCaptureSuccess] = useState(false);
    const [distance, setDistance] = useState('too-far');
    const animationRef = useRef();
    const countdownRef = useRef();
    const lastCaptureRef = useRef(0);
    const startCamera = async () => {
        if (stream) {
            return;
        }
        try {
            setError("");
            // Check if getUserMedia is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError("Camera API not available. Please use HTTPS or localhost, and ensure your browser supports camera access.");
                return;
            }
            const nextStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    // Force portrait aspect ratio
                    width: { ideal: 720, max: 1080 },
                    height: { ideal: 1280, max: 1920 },
                    aspectRatio: { ideal: 0.5625 } // 9:16 portrait
                }
            });
            setStream(nextStream);
            if (videoRef.current) {
                videoRef.current.srcObject = nextStream;
                // Wait for video to be ready
                await new Promise((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            void videoRef.current?.play();
                            resolve();
                        };
                    }
                });
            }
        }
        catch (err) {
            console.error("Camera error:", err);
            const errorMsg = err instanceof Error ? err.message : String(err);
            if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')) {
                setError("Camera permission denied. Please allow camera access in your browser settings.");
            }
            else if (errorMsg.includes('NotFoundError')) {
                setError("No camera found. Please connect a camera device.");
            }
            else if (errorMsg.includes('NotReadableError')) {
                setError("Camera is already in use by another application.");
            }
            else {
                setError(`Camera error: ${errorMsg}`);
            }
        }
    };
    const stopCamera = () => {
        try {
            stream?.getTracks().forEach((track) => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setError("");
        }
        catch (err) {
            console.error("Error stopping camera:", err);
        }
    };
    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) {
            setError("Video not ready. Please wait a moment.");
            return;
        }
        try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                setError("Failed to get canvas context");
                return;
            }
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            onFrame?.(imageData);
            setError("");
            // Show success feedback
            setCaptureSuccess(true);
            setTimeout(() => setCaptureSuccess(false), 1500);
        }
        catch (err) {
            console.error("Capture error:", err);
            setError("Failed to capture frame");
        }
    }, [onFrame]);
    // Calculate distance from camera based on shoulder width
    const calculateDistance = useCallback((lm) => {
        if (!lm || lm.length === 0)
            return 'too-far';
        // Use shoulder width as distance indicator (wider = closer)
        const leftShoulder = lm[11];
        const rightShoulder = lm[12];
        if (!leftShoulder || !rightShoulder)
            return 'too-far';
        const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
        // Optimal range: shoulders take up 25-45% of frame width
        if (shoulderWidth < 0.20)
            return 'too-far';
        if (shoulderWidth > 0.50)
            return 'too-close';
        return 'optimal';
    }, []);
    // Assess pose quality based on landmarks
    const assessPoseQuality = useCallback((lm) => {
        if (!lm || lm.length === 0)
            return 'none';
        // Check confidence of key landmarks
        const keyPoints = [0, 11, 12, 23, 24]; // nose, shoulders, hips
        const visibleKeyPoints = keyPoints.filter(i => lm[i] && (lm[i].visibility ?? 1) > 0.5);
        if (visibleKeyPoints.length < 3)
            return 'poor';
        // Check distance
        const dist = calculateDistance(lm);
        if (dist !== 'optimal')
            return 'poor';
        // Check if body is centered
        if (lm[0]) { // nose
            const centerX = lm[0].x;
            const isCentered = centerX > 0.35 && centerX < 0.65;
            // Check if full body is visible (shoulders and hips)
            const hasShoulders = lm[11] && lm[12] && (lm[11].visibility ?? 0) > 0.5 && (lm[12].visibility ?? 0) > 0.5;
            const hasHips = lm[23] && lm[24] && (lm[23].visibility ?? 0) > 0.5 && (lm[24].visibility ?? 0) > 0.5;
            if (isCentered && hasShoulders && hasHips && visibleKeyPoints.length >= 5) {
                return 'excellent';
            }
            if (hasShoulders && hasHips) {
                return 'good';
            }
        }
        return 'poor';
    }, [calculateDistance]);
    // Update pose quality and distance whenever landmarks change
    useEffect(() => {
        const quality = assessPoseQuality(landmarks);
        setPoseQuality(quality);
        const dist = calculateDistance(landmarks);
        setDistance(dist);
    }, [landmarks, assessPoseQuality, calculateDistance]);
    // Auto-capture when pose is excellent
    useEffect(() => {
        if (!autoCapture || !stream || poseQuality !== 'excellent' || countdown !== null) {
            return;
        }
        const now = Date.now();
        // Prevent multiple captures too close together
        if (now - lastCaptureRef.current < 5000) {
            return;
        }
        // Start countdown
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(interval);
                    captureFrame();
                    lastCaptureRef.current = Date.now();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
        countdownRef.current = interval;
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [poseQuality, autoCapture, stream, countdown, captureFrame]);
    // Cancel countdown if pose degrades
    useEffect(() => {
        if (poseQuality !== 'excellent' && countdown !== null && countdownRef.current) {
            clearInterval(countdownRef.current);
            setCountdown(null);
        }
    }, [poseQuality, countdown]);
    // Draw video feed with overlays
    useEffect(() => {
        const drawFrame = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || !stream) {
                return;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            // Match canvas size to video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
            }
            // MIRROR the video feed horizontally (natural selfie view)
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();
            // Apply grayscale filter
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }
            ctx.putImageData(imageData, 0, 0);
            // Draw ADAPTIVE guide overlay that scales with detected pose
            if (showGuide) {
                const quality = assessPoseQuality(landmarks);
                const dist = calculateDistance(landmarks);
                const guideColor = quality === 'excellent' ? '#00ff00' : quality === 'good' ? '#ffaa00' : '#ff4444';
                ctx.strokeStyle = guideColor;
                ctx.lineWidth = 6;
                ctx.setLineDash([15, 10]);
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 10;
                // If we have landmarks and distance is optimal, overlay guide ON the detected pose
                if (landmarks && landmarks.length > 0 && dist === 'optimal') {
                    // Draw guide aligned with actual pose position
                    const nose = landmarks[0];
                    const leftShoulder = landmarks[11];
                    const rightShoulder = landmarks[12];
                    const leftHip = landmarks[23];
                    const rightHip = landmarks[24];
                    if (nose && leftShoulder && rightShoulder && leftHip && rightHip) {
                        const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
                        const centerY = ((leftShoulder.y + rightShoulder.y) / 2) * canvas.height;
                        const hipCenterY = ((leftHip.y + rightHip.y) / 2) * canvas.height;
                        const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) * canvas.width;
                        ctx.beginPath();
                        // Head circle at nose position
                        ctx.arc(nose.x * canvas.width, nose.y * canvas.height, shoulderWidth * 0.35, 0, Math.PI * 2);
                        // Shoulders
                        ctx.moveTo(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height);
                        ctx.lineTo(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height);
                        // Body
                        ctx.moveTo(centerX, centerY);
                        ctx.lineTo(centerX, hipCenterY);
                        // Arms
                        ctx.moveTo(leftShoulder.x * canvas.width - shoulderWidth * 0.4, centerY + shoulderWidth * 0.5);
                        ctx.lineTo(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height);
                        ctx.moveTo(rightShoulder.x * canvas.width + shoulderWidth * 0.4, centerY + shoulderWidth * 0.5);
                        ctx.lineTo(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height);
                        // Legs
                        const legSpread = shoulderWidth * 0.6;
                        ctx.moveTo(centerX, hipCenterY);
                        ctx.lineTo(centerX - legSpread / 2, hipCenterY + (canvas.height - hipCenterY) * 0.8);
                        ctx.moveTo(centerX, hipCenterY);
                        ctx.lineTo(centerX + legSpread / 2, hipCenterY + (canvas.height - hipCenterY) * 0.8);
                        ctx.stroke();
                    }
                }
                else {
                    // Draw static guide in center (when no pose or wrong distance)
                    const centerX = canvas.width / 2;
                    const bodyTop = canvas.height * 0.08;
                    const bodyBottom = canvas.height * 0.92;
                    const bodyWidth = canvas.width * 0.25;
                    ctx.beginPath();
                    // Head
                    ctx.arc(centerX, bodyTop + 40, 35, 0, Math.PI * 2);
                    // Shoulders
                    ctx.moveTo(centerX - 60, bodyTop + 100);
                    ctx.lineTo(centerX + 60, bodyTop + 100);
                    // Body outline
                    ctx.moveTo(centerX, bodyTop + 75);
                    ctx.lineTo(centerX, bodyBottom - 180);
                    // Arms
                    ctx.moveTo(centerX - bodyWidth / 2 - 20, bodyTop + 150);
                    ctx.lineTo(centerX - 60, bodyTop + 100);
                    ctx.moveTo(centerX + bodyWidth / 2 + 20, bodyTop + 150);
                    ctx.lineTo(centerX + 60, bodyTop + 100);
                    // Legs
                    ctx.moveTo(centerX, bodyBottom - 180);
                    ctx.lineTo(centerX - 50, bodyBottom - 20);
                    ctx.moveTo(centerX, bodyBottom - 180);
                    ctx.lineTo(centerX + 50, bodyBottom - 20);
                    ctx.stroke();
                }
                ctx.setLineDash([]);
                ctx.shadowBlur = 0;
                // Draw alignment box
                ctx.strokeStyle = guideColor;
                ctx.lineWidth = 8;
                const boxMargin = 40;
                ctx.strokeRect(boxMargin, boxMargin, canvas.width - boxMargin * 2, canvas.height - boxMargin * 2);
            }
            // Draw detected pose landmarks - BRIGHT AND VISIBLE
            if (landmarks && landmarks.length > 0) {
                const quality = assessPoseQuality(landmarks);
                const skeletonColor = quality === 'excellent' ? '#00ff00' : quality === 'good' ? '#ffaa00' : '#ff4444';
                ctx.fillStyle = skeletonColor;
                ctx.strokeStyle = skeletonColor;
                ctx.lineWidth = 4;
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 8;
                // Draw keypoints - LARGER
                landmarks.forEach((point) => {
                    const x = point.x * canvas.width;
                    const y = point.y * canvas.height;
                    const confidence = point.visibility ?? 1;
                    if (confidence > 0.3) {
                        ctx.beginPath();
                        ctx.arc(x, y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                // Draw skeleton connections - THICKER
                const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 7], // Left arm
                    [0, 4], [4, 5], [5, 6], [6, 8], // Right arm
                    [9, 10], // Hips
                    [11, 12], [12, 14], [14, 16], // Left leg
                    [11, 13], [13, 15], [15, 17], // Right leg
                ];
                connections.forEach(([start, end]) => {
                    if (landmarks[start] && landmarks[end]) {
                        const startX = landmarks[start].x * canvas.width;
                        const startY = landmarks[start].y * canvas.height;
                        const endX = landmarks[end].x * canvas.width;
                        const endY = landmarks[end].y * canvas.height;
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();
                    }
                });
                ctx.shadowBlur = 0;
            }
            animationRef.current = requestAnimationFrame(drawFrame);
        };
        if (stream) {
            drawFrame();
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [stream, landmarks, showGuide, assessPoseQuality, calculateDistance]);
    return (_jsxs("div", { style: { position: 'relative' }, children: [error && (_jsxs("div", { style: {
                    padding: '16px',
                    marginBottom: '12px',
                    background: '#ff6b6b',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.95em',
                    lineHeight: '1.6'
                }, children: [_jsxs("div", { style: { fontWeight: 'bold', marginBottom: '8px' }, children: ["\u26A0\uFE0F ", error] }), error.includes('HTTPS') && (_jsxs("div", { style: {
                            marginTop: '12px',
                            fontSize: '0.9em',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px',
                            borderRadius: '6px'
                        }, children: [_jsx("div", { style: { fontWeight: 'bold', marginBottom: '8px' }, children: "\uD83D\uDCA1 How to fix:" }), _jsxs("div", { style: { marginBottom: '6px' }, children: [_jsx("strong", { children: "Option 1 (Easiest):" }), " Access from the same computer via:"] }), _jsx("div", { style: {
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    marginBottom: '12px'
                                }, children: "http://localhost:5174/" }), _jsxs("div", { style: { marginBottom: '6px' }, children: [_jsx("strong", { children: "Option 2:" }), " Access from another device but accept the security warning for local development"] }), _jsx("div", { style: { fontSize: '0.85em', opacity: 0.9, marginTop: '8px' }, children: "Note: Browsers require secure connections (HTTPS or localhost) for camera access. This is a security feature to protect users." })] }))] })), _jsxs("div", { style: { position: 'relative', maxWidth: '640px', margin: '0 auto' }, children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, style: { display: 'none' } }), _jsx("canvas", { ref: canvasRef, style: {
                            width: '100%',
                            height: 'auto',
                            borderRadius: 12,
                            display: 'block',
                            backgroundColor: '#000',
                            minHeight: '400px',
                            border: poseQuality === 'excellent' ? '8px solid #00ff00' : poseQuality === 'good' ? '8px solid #ffaa00' : '8px solid #ff4444'
                        } }), stream && (_jsxs(_Fragment, { children: [_jsxs("div", { style: {
                                    position: 'absolute',
                                    top: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: poseQuality === 'excellent' ? '#00ff00' : poseQuality === 'good' ? '#ffaa00' : poseQuality === 'none' ? '#666' : '#ff4444',
                                    color: poseQuality === 'excellent' || poseQuality === 'good' ? '#000' : '#fff',
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '1.4em',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    zIndex: 10,
                                    textAlign: 'center',
                                    minWidth: '200px'
                                }, children: [poseQuality === 'none' && (distance === 'too-far' ? '👋 Come Closer!' : distance === 'too-close' ? '🔙 Step Back!' : '❓ No Pose Detected'), poseQuality === 'poor' && (distance === 'too-far' ? '👋 Move Closer to Camera' : distance === 'too-close' ? '🔙 Step Back a Bit' : '⚠️ Center Yourself in Frame'), poseQuality === 'good' && '👍 Almost Perfect - Hold Still', poseQuality === 'excellent' && countdown === null && '✓ PERFECT - HOLD STILL'] }), countdown !== null && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: '#00ff00',
                                    color: '#000',
                                    padding: '60px',
                                    borderRadius: '50%',
                                    fontWeight: 'bold',
                                    fontSize: '6em',
                                    boxShadow: '0 8px 40px rgba(0,255,0,0.8)',
                                    zIndex: 20,
                                    width: '200px',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: 'pulse 1s ease-in-out'
                                }, children: countdown })), captureSuccess && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0, 255, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                    zIndex: 25
                                }, children: _jsx("div", { style: {
                                        background: '#00ff00',
                                        color: '#000',
                                        padding: '40px 60px',
                                        borderRadius: '16px',
                                        fontWeight: 'bold',
                                        fontSize: '2.5em',
                                        boxShadow: '0 8px 40px rgba(0,255,0,0.8)'
                                    }, children: "\u2713 CAPTURED!" }) })), _jsx("div", { style: {
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.8)',
                                    color: '#fff',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '1em',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    zIndex: 10,
                                    textAlign: 'center',
                                    maxWidth: '90%'
                                }, children: autoCapture
                                    ? poseQuality === 'excellent' && countdown === null
                                        ? '🎯 Perfect! Hold still...'
                                        : distance === 'too-far'
                                            ? '📐 Move closer until the guide matches your body'
                                            : distance === 'too-close'
                                                ? '📐 Step back until your full body is visible'
                                                : '📐 Align yourself with the guide overlay'
                                    : '📷 Position yourself and click "Capture Frame"' })] }))] }), _jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: '16px' }, children: [_jsx("button", { className: "primary", type: "button", onClick: startCamera, disabled: !!stream, style: {
                            cursor: stream ? 'not-allowed' : 'pointer',
                            opacity: stream ? 0.6 : 1
                        }, children: stream ? '✓ Camera Active' : 'Start Camera' }), _jsx("button", { className: "primary", type: "button", onClick: captureFrame, disabled: !stream, style: {
                            cursor: !stream ? 'not-allowed' : 'pointer',
                            opacity: !stream ? 0.6 : 1
                        }, children: "Capture Frame" }), _jsx("button", { className: "primary", type: "button", onClick: stopCamera, disabled: !stream, style: {
                            cursor: !stream ? 'not-allowed' : 'pointer',
                            opacity: !stream ? 0.6 : 1
                        }, children: "Stop Camera" })] })] }));
}
