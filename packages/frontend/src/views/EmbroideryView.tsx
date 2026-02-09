import { useState } from "react";
import { generateStitchPlan, vectorizeImage } from "@dexstitch/core";
import type { EmbroideryData } from "../state";

const defaultOptions = {
  threshold: 0.5
};

const defaultStitchOptions = {
  stitchLength: 12
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
    const vectors = await vectorizeImage(imageData, defaultOptions);
    const stitchPlan = generateStitchPlan(vectors, defaultStitchOptions);

    onEmbroideryChange({
      vectors,
      stitchPlan,
      imageDataUrl: dataUrl
    });
    setStatus("Vectorized");
  };

  return (
    <div className="panel">
      <h2 className="section-title">Embroidery</h2>
      <input type="file" accept="image/*" onChange={handleFile} />
      <p className="status-pill">{status}</p>
      <svg viewBox="0 0 400 240" role="img" aria-label="Embroidery preview">
        {embroidery.vectors.map((vector, index) => (
          <path key={index} d={vector.d} fill="none" stroke="#1e293b" />
        ))}
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
        Stitch count: {embroidery.stitchPlan ? embroidery.stitchPlan.stitches.length : 0}
      </p>
    </div>
  );
}
