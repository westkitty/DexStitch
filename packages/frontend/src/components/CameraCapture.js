import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
export default function CameraCapture({ onFrame }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
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
    return (_jsxs("div", { children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, style: { width: "100%", borderRadius: 12, marginBottom: 12 } }), _jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [_jsx("button", { className: "primary", type: "button", onClick: startCamera, children: "Start camera" }), _jsx("button", { className: "primary", type: "button", onClick: captureFrame, children: "Capture frame" }), _jsx("button", { className: "primary", type: "button", onClick: stopCamera, children: "Stop camera" })] })] }));
}
