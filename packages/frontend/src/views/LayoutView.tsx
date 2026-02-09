import type { NestingOutput, PatternResult, Point2D } from "@dexstitch/types";

type LayoutViewProps = {
  pattern: PatternResult | null;
  nesting: NestingOutput | null;
};

function pointsToPathData(points: Point2D[]): string {
  if (points.length === 0) return "";
  const first = points[0];
  let path = `M${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L${points[i].x} ${points[i].y}`;
  }
  path += " Z";
  return path;
}

export default function LayoutView({ pattern, nesting }: LayoutViewProps) {
  if (!pattern || !nesting) {
    return (
      <div className="panel">
        <h2 className="section-title">Layout</h2>
        <p>Generate a pattern to see layout placements.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2 className="section-title">Layout</h2>
      <svg viewBox="0 0 800 400" role="img" aria-label="Layout preview">
        {nesting.placements.map((placement, index) => {
          const piece = pattern.pieces.find((item) => item.id === placement.pieceId);
          if (!piece) {
            return null;
          }
          return (
            <g
              key={`${placement.pieceId}-${index}`}
              transform={`translate(${placement.x} ${placement.y}) rotate(${
                (placement.rotation * 180) / Math.PI
              })`}
            >
              <path d={pointsToPathData(piece.outline)} fill="#fef3c7" stroke="#0f172a" />
            </g>
          );
        })}
      </svg>
      <p>Utilization: {Math.round((nesting.utilizedArea / nesting.binArea) * 100)}%</p>
    </div>
  );
}
