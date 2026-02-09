import { useEffect, useRef, useState } from "react";
import type { PatternPiece, Point2D } from "@dexstitch/types";

type PatternSVGRendererProps = {
  pieces: PatternPiece[];
  bounds?: { minX: number; minY: number; maxX: number; maxY: number };
  showDebug?: boolean;
};

/**
 * Convert Point2D array to SVG path data string
 */
function pointsToPathData(points: Point2D[]): string {
  if (points.length === 0) return "";
  const first = points[0];
  let path = `M${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L${points[i].x} ${points[i].y}`;
  }
  path += " Z"; // Close path
  return path;
}

export default function PatternSVGRenderer({
  pieces,
  bounds,
  showDebug = false
}: PatternSVGRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Calculate viewBox from bounds
  const viewBox = bounds
    ? `${bounds.minX - 20} ${bounds.minY - 20} ${bounds.maxX - bounds.minX + 40} ${
        bounds.maxY - bounds.minY + 40
      }`
    : "0 0 800 600";

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((prev) => Math.max(0.1, Math.min(10, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left button
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const preventContextMenu = (e: Event) => e.preventDefault();
    svg.addEventListener("contextmenu", preventContextMenu);
    return () => svg.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "#f8fafc",
          cursor: isPanning ? "grabbing" : "grab",
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: "center"
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {pieces.map((piece) => (
          <g key={piece.id}>
            {/* Main outline */}
            <path
              d={pointsToPathData(piece.outline)}
              fill="#e0f2fe"
              stroke="#0369a1"
              strokeWidth="2"
              fillRule="evenodd"
            />

            {/* Seam allowance indication */}
            {piece.seamAllowance && (
              <path
                d={pointsToPathData(piece.outline)}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="5,5"
                transform={`scale(${1 + piece.seamAllowance / 100})`}
                transformOrigin="0 0"
              />
            )}

            {/* Grainline */}
            {piece.grainline && (
              <line
                x1={piece.grainline[0].x}
                y1={piece.grainline[0].y}
                x2={piece.grainline[1].x}
                y2={piece.grainline[1].y}
                stroke="#0f172a"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )}

            {/* Notches */}
            {piece.notches?.map((notch, idx) => (
              <circle
                key={`notch-${idx}`}
                cx={notch.x}
                cy={notch.y}
                r="3"
                fill="#dc2626"
              />
            ))}

            {/* Debug overlay */}
            {showDebug && (
              <>
                {/* Show all points */}
                {piece.outline.map((point, idx) => (
                  <circle
                    key={`point-${idx}`}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="#f97316"
                  />
                ))}
                {/* Piece label */}
                <text
                  x={piece.outline[0]?.x || 0}
                  y={(piece.outline[0]?.y || 0) - 10}
                  fontSize="12"
                  fill="#0f172a"
                >
                  {piece.name} ({piece.id})
                </text>
              </>
            )}
          </g>
        ))}

        {/* Arrow marker for grainline */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="2.5"
            orient="auto"
          >
            <polygon points="0 0, 5 2.5, 0 5" fill="#0f172a" />
          </marker>
        </defs>
      </svg>

      {/* Controls overlay */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "rgba(255,255,255,0.9)",
          padding: 8,
          borderRadius: 8,
          fontSize: 12
        }}
      >
        <div>Zoom: {zoom.toFixed(2)}x</div>
        <button onClick={handleReset} style={{ padding: "4px 8px", fontSize: 11 }}>
          Reset View
        </button>
      </div>
    </div>
  );
}
