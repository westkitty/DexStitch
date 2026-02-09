import { useRef, useState } from "react";

type CameraCaptureProps = {
  onFrame?: (imageData: ImageData) => void;
};

export default function CameraCapture({ onFrame }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", borderRadius: 12, marginBottom: 12 }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="primary" type="button" onClick={startCamera}>
          Start camera
        </button>
        <button className="primary" type="button" onClick={captureFrame}>
          Capture frame
        </button>
        <button className="primary" type="button" onClick={stopCamera}>
          Stop camera
        </button>
      </div>
    </div>
  );
}
