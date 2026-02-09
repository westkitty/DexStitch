import { useState } from "react";
import type { PatternResult } from "@dexstitch/types";
import PatternSVGRenderer from "../components/PatternSVGRenderer";
import { computeBoundingBox } from "@dexstitch/types";

type DesignViewProps = {
  pattern: PatternResult | null;
};

export default function DesignView({ pattern }: DesignViewProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (!pattern || pattern.pieces.length === 0) {
    return (
      <div className="panel">
        <h2 className="section-title">Pattern preview</h2>
        <p>Adjust measurements to generate pattern</p>
      </div>
    );
  }

  // Compute overall bounds
  const allPoints = pattern.pieces.flatMap((p) => p.outline);
  const bounds = allPoints.length > 0 ? computeBoundingBox(allPoints) : undefined;

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title">Pattern preview</h2>
        <label style={{ fontSize: 14, cursor: "pointer", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={showDebug}
            onChange={(e) => setShowDebug(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Debug overlay
        </label>
      </div>

      <div style={{ height: 500, marginTop: 12 }}>
        <PatternSVGRenderer pieces={pattern.pieces} bounds={bounds} showDebug={showDebug} />
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>
        <div>Pieces: {pattern.pieces.length}</div>
        {bounds && (
          <div>
            Dimensions: {(bounds.maxX - bounds.minX).toFixed(1)}mm × {(bounds.maxY - bounds.minY).toFixed(1)}mm
          </div>
        )}
      </div>
    </div>
  );
}
