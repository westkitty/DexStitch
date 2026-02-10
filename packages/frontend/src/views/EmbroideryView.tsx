import { useState } from "react";
import { vectorizeImage, generateStitches } from "@dexstitch/core";
import type { EmbroideryData } from "../state";

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

type EmbroideryViewProps = {
  embroidery: EmbroideryData;
  onEmbroideryChange: (next: EmbroideryData) => void;
};

export default function EmbroideryView({ embroidery, onEmbroideryChange }: EmbroideryViewProps) {
  const [status, setStatus] = useState("Idle");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setStatus("Loading image");
    const dataUrl = await new Promise<string>((resolve, reject) => {
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
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="panel">
      <h2 className="section-title">Embroidery</h2>
      <input type="file" accept="image/*" onChange={handleFile} />
      <p className="status-pill">{status}</p>
      <svg viewBox="0 0 400 240" role="img" aria-label="Embroidery preview">
        {embroidery.vectors.map((vector, index) => {
          // Convert point array to SVG path data
          const pathData = vector.points.length > 0
            ? `M ${vector.points[0].x} ${vector.points[0].y} ` +
              vector.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
              (vector.closed ? ' Z' : '')
            : '';
          
          return (
            <path 
              key={index} 
              d={pathData} 
              fill={vector.type === 'fill' ? '#d1d5db' : 'none'} 
              stroke="#1e293b" 
              strokeWidth="0.5"
            />
          );
        })}
        {embroidery.stitchPlan && (
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            points={embroidery.stitchPlan.stitches
              .map((stitch) => `${stitch.x},${stitch.y}`)
              .join(" ")}
          />
        )}
      </svg>
      <p>
        Stitch count: {embroidery.stitchPlan?.metadata?.stitchCount ?? embroidery.stitchPlan?.stitches.length ?? 0}
      </p>
    </div>
  );
}
