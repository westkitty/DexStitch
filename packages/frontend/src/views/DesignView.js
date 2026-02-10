import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import PatternSVGRenderer from "../components/PatternSVGRenderer";
import { computeBoundingBox } from "@dexstitch/types";
export default function DesignView({ pattern }) {
    const [showDebug, setShowDebug] = useState(false);
    if (!pattern || pattern.pieces.length === 0) {
        return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Pattern preview" }), _jsx("p", { children: "Adjust measurements to generate pattern" })] }));
    }
    // Compute overall bounds
    const allPoints = pattern.pieces.flatMap((p) => p.outline);
    const bounds = allPoints.length > 0 ? computeBoundingBox(allPoints) : undefined;
    return (_jsxs("div", { className: "panel", children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h2", { className: "section-title", children: "Pattern preview" }), _jsxs("label", { style: { fontSize: 14, cursor: "pointer", userSelect: "none" }, children: [_jsx("input", { type: "checkbox", checked: showDebug, onChange: (e) => setShowDebug(e.target.checked), style: { marginRight: 6 } }), "Debug overlay"] })] }), _jsx("div", { style: { height: 500, marginTop: 12 }, children: _jsx(PatternSVGRenderer, { pieces: pattern.pieces, bounds: bounds, showDebug: showDebug }) }), _jsxs("div", { style: { marginTop: 12, fontSize: 12, color: "#64748b" }, children: [_jsxs("div", { children: ["Pieces: ", pattern.pieces.length] }), bounds && (_jsxs("div", { children: ["Dimensions: ", (bounds.maxX - bounds.minX).toFixed(1), "mm \u00D7 ", (bounds.maxY - bounds.minY).toFixed(1), "mm"] }))] })] }));
}
