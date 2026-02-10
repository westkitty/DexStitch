import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { vectorizeImage, generateStitches } from "@dexstitch/core";
const defaultOptions = {
    threshold: 128,
    smoothing: 0.5,
    simplify: true,
    minPathLength: 5
};
const defaultStitchOptions = {
    ecoMode: true,
    stitchDensity: 0.1,
    minJumpOptimization: true,
    maxJumpDistance: 100
};
export default function EmbroideryView({ embroidery, onEmbroideryChange }) {
    const [status, setStatus] = useState("Idle");
    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setStatus("Loading image");
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Failed to read image"));
            reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        try {
            setStatus("Vectorizing image");
            const vectors = vectorizeImage(imageData, defaultOptions);
            setStatus("Generating stitches");
            const stitchPlan = generateStitches(vectors, defaultStitchOptions);
            onEmbroideryChange({
                vectors,
                stitchPlan,
                imageDataUrl: dataUrl
            });
            setStatus("Vectorized");
        }
        catch (error) {
            setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Embroidery" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleFile }), _jsx("p", { className: "status-pill", children: status }), _jsxs("svg", { viewBox: "0 0 400 240", role: "img", "aria-label": "Embroidery preview", children: [embroidery.vectors.map((vector, index) => {
                        // Convert point array to SVG path data
                        const pathData = vector.points.length > 0
                            ? `M ${vector.points[0].x} ${vector.points[0].y} ` +
                                vector.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
                                (vector.closed ? ' Z' : '')
                            : '';
                        return (_jsx("path", { d: pathData, fill: vector.type === 'fill' ? '#d1d5db' : 'none', stroke: "#1e293b", strokeWidth: "0.5" }, index));
                    }), embroidery.stitchPlan && (_jsx("polyline", { fill: "none", stroke: "#ef4444", strokeWidth: "2", points: embroidery.stitchPlan.stitches
                            .map((stitch) => `${stitch.x},${stitch.y}`)
                            .join(" ") }))] }), _jsxs("p", { children: ["Stitch count: ", embroidery.stitchPlan?.metadata?.stitchCount ?? embroidery.stitchPlan?.stitches.length ?? 0] })] }));
}
