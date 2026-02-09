import type { PatternResult, Point2D } from "@dexstitch/types";

type ExportViewProps = {
  pattern: PatternResult | null;
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

export default function ExportView({ pattern }: ExportViewProps) {
  const handleExport = () => {
    if (!pattern) {
      return;
    }
    const svgContent =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">` +
      pattern.pieces
        .map((piece, index) => {
          const offsetX = 20 + index * 220;
          return `<g transform="translate(${offsetX} 40)"><path d="${pointsToPathData(
            piece.outline
          )}" fill="none" stroke="#0f172a" /><text x="0" y="-10" font-size="12">${
            piece.name
          }</text></g>`;
        })
        .join("") +
      `</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dexstitch-pattern.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel">
      <h2 className="section-title">Export</h2>
      <button className="primary" type="button" onClick={handleExport}>
        Download pattern SVG
      </button>
    </div>
  );
}
