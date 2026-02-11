import { useRef, useState, useEffect } from "react";
import { getPoseEstimator } from "../ml/poseEstimator";
import type { PoseLandmark } from "@dexstitch/core";

type RotationScanProps = {
  onComplete?: (frames: Array<{ timestamp: number; imageData: ImageData; landmarks: PoseLandmark[] }>) => void;
  onCancel?: () => void;
};

export default function RotationScan({ onComplete, onCancel }: RotationScanProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0); // 0-360
  const [message, setMessage] = useState("Position yourself in center, arms extended");
  const [capturedFrames, setCapturedFrames] = useState<Array<{ timestamp: number; imageData: ImageData; landmarks: PoseLandmark[] }>>([]);
  const animationRef = useRef<number>();
  const scanStartRef = useRef<number | null>(null);
  const lastCaptureRef = useRef<number>(0);
  const poseEstimatorRef = useRef(getPoseEstimator());
  const [modelReady, setModelReady] = useState(false);

  // Initialize pose estimator
  useEffect(() => {
    void poseEstimatorRef.current.initialize().then(() => {
      setModelReady(true);
    }).catch(err => {
      console.error("Failed to initialize pose estimator:", err);
      setError("Failed to load pose detection model");
    });
  }, []);

  const startCamera = async () => {
    if (stream) return;
    try {
      setError("");
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720, max: 1080 },
          height: { ideal: 1280, max: 1920 },
          aspectRatio: { ideal: 0.5625 }
        }
      });
      setStream(nextStream);
      if (videoRef.current) {
        videoRef.current.srcObject = nextStream;
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              void videoRef.current?.play();
              resolve();
            };
          }
        });
      }
    } catch (err) {
      console.error("Camera error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Camera error: ${errorMsg}`);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startScan = () => {
    if (!stream || !modelReady) {
      setError("Camera and model not ready");
      return;
    }
    setScanning(true);
    setScanStartTime(Date.now());
    setCapturedFrames([]);
    setProgress(0);
    setMessage("🔄 Start rotating slowly... Keep arms extended!");
  };

  const setScanStartTime = (time: number) => {
    scanStartRef.current = time;
  };

  const cancelScan = () => {
    setScanning(false);
    scanStartRef.current = null;
    setCapturedFrames([]);
    setProgress(0);
    setMessage("Position yourself in center, arms extended");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Draw video and capture frames during scan
  useEffect(() => {
    const drawFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !stream) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Match canvas size to video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
      }

      // Mirror and draw video
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw rotation indicator ring
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 8;
      ctx.beginPath();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Background ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Progress ring
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 12;
      ctx.beginPath();
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (progress / 360) * Math.PI * 2;
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.stroke();

      // Center circle
      ctx.fillStyle = "#00ff00";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Time indicator
      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const timeRemaining = Math.max(0, 8 - ((Date.now() - (scanStartRef.current || 0)) / 1000));
      ctx.fillText(`${timeRemaining.toFixed(1)}s`, centerX, centerY - radius - 80);

      // Rotation direction indicator
      ctx.fillStyle = "#ffaa00";
      ctx.font = "bold 36px Arial";
      ctx.fillText("⟲ ROTATE CLOCKWISE", centerX, canvas.height - 100);

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    if (stream && (scanning || !scanning)) {
      drawFrame();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stream, scanning, progress]);

  // Capture frames during scan
  useEffect(() => {
    if (!scanning || !stream || !videoRef.current || !modelReady) return;

    const video = videoRef.current;
    if (!video.videoWidth) return;

    const scanDuration = 8000; // 8 seconds to complete 360°
    const captureInterval = 250; // Capture every 250ms (~32 frames)

    const captureFrameAtInterval = async () => {
      const now = Date.now();
      const elapsed = now - (scanStartRef.current || now);

      if (elapsed > scanDuration) {
        // Scan complete!
        setScanning(false);
        setProgress(360);
        setMessage("✓ Scan Complete!");
        
        // Call onComplete after a short delay
        setTimeout(() => {
          onComplete?.(capturedFrames);
        }, 1000);
        return;
      }

      // Calculate progress (0-360)
      const newProgress = (elapsed / scanDuration) * 360;
      setProgress(newProgress);

      // Capture every 250ms
      if (now - lastCaptureRef.current >= captureInterval) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          if (!context) return;

          // Mirror the video
          context.save();
          context.scale(-1, 1);
          context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
          context.restore();

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Estimate pose
          const landmarks = await poseEstimatorRef.current.estimatePose(video);

          capturedFrames.push({
            timestamp: elapsed,
            imageData,
            landmarks
          });

          lastCaptureRef.current = now;
        } catch (err) {
          console.error("Frame capture error:", err);
        }
      }

      if (elapsed <= scanDuration) {
        requestAnimationFrame(captureFrameAtInterval);
      }
    };

    const frameId = requestAnimationFrame(captureFrameAtInterval);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [scanning, stream, modelReady, capturedFrames, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          padding: '16px',
          background: '#ff6b6b',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.95em',
          zIndex: 10
        }}>
          ⚠️ {error}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      {/* Status Message */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: scanning ? 'rgba(0, 255, 0, 0.9)' : 'rgba(100, 100, 100, 0.9)',
        color: '#000',
        padding: '20px 40px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '1.6em',
        textAlign: 'center',
        zIndex: 10,
        minWidth: '300px'
      }}>
        {message}
      </div>

      {/* Progress Text */}
      {scanning && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#00ff00',
          padding: '16px 32px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.4em',
          zIndex: 10
        }}>
          Captured: {capturedFrames.length} frames — Progress: {Math.round(progress)}°
        </div>
      )}

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        zIndex: 10
      }}>
        {!stream ? (
          <button
            className="primary"
            onClick={startCamera}
            style={{
              padding: '16px 32px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              borderRadius: '8px',
              background: '#00ff00',
              color: '#000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📷 Start Camera
          </button>
        ) : !scanning ? (
          <>
            <button
              className="primary"
              onClick={startScan}
              disabled={!modelReady}
              style={{
                padding: '16px 32px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                borderRadius: '8px',
                background: modelReady ? '#00ff00' : '#666',
                color: '#000',
                border: 'none',
                cursor: modelReady ? 'pointer' : 'not-allowed',
                opacity: modelReady ? 1 : 0.5
              }}
            >
              🔄 Start Scan
            </button>
            <button
              className="primary"
              onClick={() => {
                stopCamera();
                onCancel?.();
              }}
              style={{
                padding: '16px 32px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                borderRadius: '8px',
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✕ Cancel
            </button>
          </>
        ) : (
          <button
            className="primary"
            onClick={cancelScan}
            style={{
              padding: '16px 32px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              borderRadius: '8px',
              background: '#ff4444',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ⊗ Stop Scan
          </button>
        )}
      </div>

      {/* Help text - only show before scan */}
      {stream && !scanning && (
        <div style={{
          position: 'absolute',
          top: '180px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '24px 32px',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '80%',
          zIndex: 10,
          lineHeight: '1.8',
          fontSize: '1.1em'
        }}>
          <div style={{ marginBottom: '12px', fontSize: '1.3em', fontWeight: 'bold' }}>
            🎯 360° Body Scan
          </div>
          <div>Stand in the center with <strong>arms extended</strong> at shoulder height</div>
          <div style={{ marginTop: '12px', opacity: 0.9 }}>
            When ready, click "Start Scan" and slowly rotate clockwise
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.95em', opacity: 0.8 }}>
            Take about 8 seconds to complete one full rotation
          </div>
        </div>
      )}
    </div>
  );
}
