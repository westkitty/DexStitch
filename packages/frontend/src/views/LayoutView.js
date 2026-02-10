import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function pointsToPathData(points) {
    if (points.length === 0)
        return "";
    const first = points[0];
    let path = `M${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L${points[i].x} ${points[i].y}`;
    }
    path += " Z";
    return path;
}
export default function LayoutView({ pattern, nesting }) {
    if (!pattern || !nesting) {
        return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Layout" }), _jsx("p", { children: "Generate a pattern to see layout placements." })] }));
    }
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Layout" }), _jsx("svg", { viewBox: "0 0 800 400", role: "img", "aria-label": "Layout preview", children: nesting.placements.map((placement, index) => {
                    const piece = pattern.pieces.find((item) => item.id === placement.pieceId);
                    if (!piece) {
                        return null;
                    }
                    return (_jsx("g", { transform: `translate(${placement.x} ${placement.y}) rotate(${(placement.rotation * 180) / Math.PI})`, children: _jsx("path", { d: pointsToPathData(piece.outline), fill: "#fef3c7", stroke: "#0f172a" }) }, `${placement.pieceId}-${index}`));
                }) }), _jsxs("p", { children: ["Utilization: ", Math.round((nesting.utilizedArea / nesting.binArea) * 100), "%"] })] }));
}
