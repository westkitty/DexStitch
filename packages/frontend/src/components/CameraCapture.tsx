import { useRef, useState, useEffect } from "react";

type CameraCaptureProps = {
  onFrame?: (imageData: ImageData) => void;
  landmarks?: Array<{x: number, y: number, z?: number, visibility?: number}>;
  showGuide?: boolean;
};

export default function CameraCapture({ onFrame, landmarks, showGuide = true }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const animationRef = useRef<number>();

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
    } catch (err) {
      console.error("Capture error:", err);
      setError("Failed to capture frame");
    }
  };

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

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw guide overlay
      if (showGuide) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Draw body outline guide
        const centerX = canvas.width / 2;
        const bodyTop = canvas.height * 0.1;
        const bodyBottom = canvas.height * 0.9;
        const bodyWidth = canvas.width * 0.3;
        
        ctx.beginPath();
        // Head
        ctx.arc(centerX, bodyTop + 30, 25, 0, Math.PI * 2);
        // Body outline
        ctx.moveTo(centerX, bodyTop + 55);
        ctx.lineTo(centerX, bodyBottom - 150);
        // Arms
        ctx.moveTo(centerX - bodyWidth/2, bodyTop + 100);
        ctx.lineTo(centerX, bodyTop + 80);
        ctx.lineTo(centerX + bodyWidth/2, bodyTop + 100);
        // Legs
        ctx.moveTo(centerX, bodyBottom - 150);
        ctx.lineTo(centerX - 40, bodyBottom);
        ctx.moveTo(centerX, bodyBottom - 150);
        ctx.lineTo(centerX + 40, bodyBottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw detected pose landmarks
      if (landmarks && landmarks.length > 0) {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        // Draw keypoints
        landmarks.forEach((point) => {
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;
          const confidence = point.visibility ?? 1;
          
          if (confidence > 0.3) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Draw skeleton connections
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
          padding: '12px',
          marginBottom: '12px',
          background: '#ff4444',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.9em'
        }}>
          <div>⚠️ {error}</div>
          {error.includes('HTTPS') && (
            <div style={{ marginTop: '8px', fontSize: '0.85em' }}>
              💡 Tip: Camera access requires a secure connection. Try accessing via:
              <br/>• <code>https://localhost:5174/</code>
              <br/>• or use the IP address (<code>http://10.0.0.126:5174/</code>) and allow insecure localhost in browser
            </div>
          )}
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
          maxWidth: '640px',
          height: 'auto',
          borderRadius: 12, 
          marginBottom: 12,
          display: 'block',
          backgroundColor: '#000',
          minHeight: '400px'
        }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
