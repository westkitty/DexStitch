import { useRef, useState, useEffect } from "react";

type CameraCaptureProps = {
  onFrame?: (imageData: ImageData) => void;
  landmarks?: Array<{x: number, y: number, z?: number, visibility?: number}>;
  showGuide?: boolean;
  autoCapture?: boolean;
};

export default function CameraCapture({ onFrame, landmarks, showGuide = true, autoCapture = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [poseQuality, setPoseQuality] = useState<'none' | 'poor' | 'good' | 'excellent'>('none');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const animationRef = useRef<number>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const lastCaptureRef = useRef<number>(0);

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
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(nextStream);
      if (videoRef.current) {
        videoRef.current.srcObject = nextStream;
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve();
            };
          }
        });
      }
    } catch (err) {
      console.error("Camera error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')) {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (errorMsg.includes('NotFoundError')) {
        setError("No camera found. Please connect a camera device.");
      } else if (errorMsg.includes('NotReadableError')) {
        setError("Camera is already in use by another application.");
      } else {
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
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  const captureFrame = () => {
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
    } catch (err) {
      console.error("Capture error:", err);
      setError("Failed to capture frame");
    }
  };

  // Assess pose quality based on landmarks
  const assessPoseQuality = (lm: typeof landmarks): 'none' | 'poor' | 'good' | 'excellent' => {
    if (!lm || lm.length === 0) return 'none';
    
    // Check confidence of key landmarks
    const keyPoints = [0, 11, 12, 23, 24]; // nose, shoulders, hips
    const visibleKeyPoints = keyPoints.filter(i => lm[i] && (lm[i].visibility ?? 1) > 0.5);
    
    if (visibleKeyPoints.length < 3) return 'poor';
    
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
  };

  // Auto-capture when pose is excellent
  useEffect(() => {
    const quality = assessPoseQuality(landmarks);
    setPoseQuality(quality);
    
    if (autoCapture && quality === 'excellent' && !countdown && stream) {
      const now = Date.now();
      // Prevent multiple captures too close together
      if (now - lastCaptureRef.current > 5000) {
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
      }
    } else if (quality !== 'excellent' && countdown !== null) {
      // Cancel countdown if pose degrades
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      setCountdown(null);
    }
    
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [landmarks, autoCapture, countdown, stream]);

  // Draw video feed with overlays
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
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      // Draw video frame in GRAYSCALE
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
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

      // Draw HIGH-CONTRAST guide overlay
      if (showGuide) {
        const quality = assessPoseQuality(landmarks);
        const guideColor = quality === 'excellent' ? '#00ff00' : quality === 'good' ? '#ffaa00' : '#ff4444';
        
        ctx.strokeStyle = guideColor;
        ctx.lineWidth = 6;
        ctx.setLineDash([15, 10]);
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        
        // Draw body outline guide - MUCH MORE OBVIOUS
        const centerX = canvas.width / 2;
        const bodyTop = canvas.height * 0.08;
        const bodyBottom = canvas.height * 0.92;
        const bodyWidth = canvas.width * 0.25;
        
        ctx.beginPath();
        // Head - larger and more visible
        ctx.arc(centerX, bodyTop + 40, 35, 0, Math.PI * 2);
        // Shoulders
        ctx.moveTo(centerX - 60, bodyTop + 100);
        ctx.lineTo(centerX + 60, bodyTop + 100);
        // Body outline
        ctx.moveTo(centerX, bodyTop + 75);
        ctx.lineTo(centerX, bodyBottom - 180);
        // Arms - extended
        ctx.moveTo(centerX - bodyWidth/2 - 20, bodyTop + 150);
        ctx.lineTo(centerX - 60, bodyTop + 100);
        ctx.moveTo(centerX + bodyWidth/2 + 20, bodyTop + 150);
        ctx.lineTo(centerX + 60, bodyTop + 100);
        // Legs
        ctx.moveTo(centerX, bodyBottom - 180);
        ctx.lineTo(centerX - 50, bodyBottom - 20);
        ctx.moveTo(centerX, bodyBottom - 180);
        ctx.lineTo(centerX + 50, bodyBottom - 20);
        ctx.stroke();
        
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
  }, [stream, landmarks, showGuide]);

  return (
    <div style={{ position: 'relative' }}>
      {error && (
        <div style={{
          padding: '16px',
          marginBottom: '12px',
          background: '#ff6b6b',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.95em',
          lineHeight: '1.6'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ {error}</div>
          {error.includes('HTTPS') && (
            <div style={{ 
              marginTop: '12px', 
              fontSize: '0.9em',
              background: 'rgba(0,0,0,0.2)',
              padding: '12px',
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>💡 How to fix:</div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Option 1 (Easiest):</strong> Access from the same computer via:
              </div>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '8px', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                marginBottom: '12px'
              }}>
                http://localhost:5174/
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Option 2:</strong> Access from another device but accept the security warning for local development
              </div>
              <div style={{ fontSize: '0.85em', opacity: 0.9, marginTop: '8px' }}>
                Note: Browsers require secure connections (HTTPS or localhost) for camera access. This is a security feature to protect users.
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
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
            height: 'auto',
            borderRadius: 12,
            display: 'block',
            backgroundColor: '#000',
            minHeight: '400px',
            border: poseQuality === 'excellent' ? '8px solid #00ff00' : poseQuality === 'good' ? '8px solid #ffaa00' : '8px solid #ff4444'
          }}
        />
        
        {/* HUD Overlays */}
        {stream && (
          <>
            {/* Status Indicator - Top Center */}
            <div style={{
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
            }}>
              {poseQuality === 'none' && '❓ No Pose Detected'}
              {poseQuality === 'poor' && '⚠️ Adjust Position'}
              {poseQuality === 'good' && '👍 Almost There'}
              {poseQuality === 'excellent' && countdown === null && '✓ PERFECT - HOLD STILL'}
            </div>
            
            {/* Countdown - Center */}
            {countdown !== null && (
              <div style={{
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
              }}>
                {countdown}
              </div>
            )}
            
            {/* Success Flash */}
            {captureSuccess && (
              <div style={{
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
              }}>
                <div style={{
                  background: '#00ff00',
                  color: '#000',
                  padding: '40px 60px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '2.5em',
                  boxShadow: '0 8px 40px rgba(0,255,0,0.8)'
                }}>
                  ✓ CAPTURED!
                </div>
              </div>
            )}
            
            {/* Instructions - Bottom */}
            <div style={{
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
            }}>
              {autoCapture 
                ? poseQuality === 'excellent' && countdown === null
                  ? '🎯 Hold still - Auto-capture in 3 seconds...'
                  : '📐 Stand in the center, face camera, full body visible'
                : '📷 Click "Capture Frame" when positioned correctly'
              }
            </div>
          </>
        )}
      </div>
      
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: '16px' }}>
        <button 
          className="primary" 
          type="button" 
          onClick={startCamera} 
          disabled={!!stream}
          style={{ 
            cursor: stream ? 'not-allowed' : 'pointer',
            opacity: stream ? 0.6 : 1
          }}
        >
          {stream ? '✓ Camera Active' : 'Start Camera'}
        </button>
        <button 
          className="primary" 
          type="button" 
          onClick={captureFrame} 
          disabled={!stream}
          style={{ 
            cursor: !stream ? 'not-allowed' : 'pointer',
            opacity: !stream ? 0.6 : 1
          }}
        >
          Capture Frame
        </button>
        <button 
          className="primary" 
          type="button" 
          onClick={stopCamera} 
          disabled={!stream}
          style={{ 
            cursor: !stream ? 'not-allowed' : 'pointer',
            opacity: !stream ? 0.6 : 1
          }}
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
}
