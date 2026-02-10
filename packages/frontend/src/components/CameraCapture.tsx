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
  const animationRef = useRef<number>();

  const startCamera = async () => {
    if (stream) {
      return;
    }
    const nextStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" }
    });
    setStream(nextStream);
    if (videoRef.current) {
      videoRef.current.srcObject = nextStream;
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    onFrame?.(imageData);
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
          backgroundColor: '#000'
        }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="primary" type="button" onClick={startCamera} disabled={!!stream}>
          {stream ? '✓ Camera Active' : 'Start Camera'}
        </button>
        <button className="primary" type="button" onClick={captureFrame} disabled={!stream}>
          Capture Frame
        </button>
        <button className="primary" type="button" onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </button>
      </div>
    </div>
  );
}
