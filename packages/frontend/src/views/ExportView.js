import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { exportToSVG, exportToDXF, exportToJSON, exportToDST, exportToPDF } from "@dexstitch/core";
export default function ExportView({ pattern, nesting, embroidery }) {
    const downloadFile = (content, filename, mimeType) => {
        let blobContent;
        if (typeof content === 'string') {
            blobContent = content;
        }
        else {
            // Convert Uint8Array to ArrayBuffer
            blobContent = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
        }
        const blob = new Blob([blobContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
    };
    const handleExportSVG = () => {
        if (!pattern)
            return;
        const svg = exportToSVG(pattern, nesting || undefined);
        downloadFile(svg, "dexstitch-pattern.svg", "image/svg+xml");
    };
    const handleExportDXF = () => {
        if (!pattern)
            return;
        const dxf = exportToDXF(pattern, nesting || undefined);
        downloadFile(dxf, "dexstitch-pattern.dxf", "application/dxf");
    };
    const handleExportJSON = () => {
        if (!pattern)
            return;
        const json = exportToJSON(pattern, nesting || undefined);
        downloadFile(json, "dexstitch-project.json", "application/json");
    };
    const handleExportPDF = () => {
        if (!pattern)
            return;
        const pdfBase64 = exportToPDF(pattern, nesting || undefined);
        // Decode base64 and download
        const binaryString = atob(pdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        downloadFile(bytes, "dexstitch-pattern.pdf", "application/pdf");
    };
    const handleExportDST = () => {
        if (!embroidery) {
            alert("No embroidery design generated yet");
            return;
        }
        const dst = exportToDST(embroidery);
        downloadFile(dst, "dexstitch-design.dst", "application/octet-stream");
    };
    return (_jsxs("div", { className: "panel", children: [_jsx("h2", { className: "section-title", children: "Export" }), _jsxs("div", { className: "export-group", children: [_jsx("h3", { children: "Pattern Exports" }), _jsx("button", { className: "primary", type: "button", onClick: handleExportSVG, disabled: !pattern, children: "\uD83D\uDCE5 SVG (Vector)" }), _jsx("button", { className: "primary", type: "button", onClick: handleExportDXF, disabled: !pattern, children: "\uD83D\uDCE5 DXF (CAD)" }), _jsx("button", { className: "primary", type: "button", onClick: handleExportPDF, disabled: !pattern, children: "\uD83D\uDCE5 PDF (Print)" }), _jsx("button", { className: "primary", type: "button", onClick: handleExportJSON, disabled: !pattern, children: "\uD83D\uDCE5 JSON (Project)" })] }), _jsxs("div", { className: "export-group", children: [_jsx("h3", { children: "Embroidery Exports" }), _jsx("button", { className: "primary", type: "button", onClick: handleExportDST, disabled: !embroidery, children: "\uD83D\uDCE5 DST (Machine)" })] })] }));
}
