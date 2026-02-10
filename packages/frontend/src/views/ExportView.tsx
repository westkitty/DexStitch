import { exportToSVG, exportToDXF, exportToJSON, exportToDST, exportToPDF } from "@dexstitch/core";
import type { PatternResult, NestingOutput, EmbroideryProgram } from "@dexstitch/types";

type ExportViewProps = {
  pattern: PatternResult | null;
  nesting: NestingOutput | null;
  embroidery?: EmbroideryProgram | null;
};

export default function ExportView({ pattern, nesting, embroidery }: ExportViewProps) {
  const downloadFile = (content: string | Uint8Array, filename: string, mimeType: string) => {
    let blobContent: BlobPart;
    if (typeof content === 'string') {
      blobContent = content;
    } else {
      // Convert Uint8Array to ArrayBuffer
      blobContent = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as unknown as BlobPart;
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
    if (!pattern) return;
    const svg = exportToSVG(pattern, nesting || undefined);
    downloadFile(svg, "dexstitch-pattern.svg", "image/svg+xml");
  };

  const handleExportDXF = () => {
    if (!pattern) return;
    const dxf = exportToDXF(pattern, nesting || undefined);
    downloadFile(dxf, "dexstitch-pattern.dxf", "application/dxf");
  };

  const handleExportJSON = () => {
    if (!pattern) return;
    const json = exportToJSON(pattern, nesting || undefined);
    downloadFile(json, "dexstitch-project.json", "application/json");
  };

  const handleExportPDF = () => {
    if (!pattern) return;
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

  return (
    <div className="panel">
      <h2 className="section-title">Export</h2>
      <div className="export-group">
        <h3>Pattern Exports</h3>
        <button className="primary" type="button" onClick={handleExportSVG} disabled={!pattern}>
          📥 SVG (Vector)
        </button>
        <button className="primary" type="button" onClick={handleExportDXF} disabled={!pattern}>
          📥 DXF (CAD)
        </button>
        <button className="primary" type="button" onClick={handleExportPDF} disabled={!pattern}>
          📥 PDF (Print)
        </button>
        <button className="primary" type="button" onClick={handleExportJSON} disabled={!pattern}>
          📥 JSON (Project)
        </button>
      </div>
      
      <div className="export-group">
        <h3>Embroidery Exports</h3>
        <button 
          className="primary" 
          type="button" 
          onClick={handleExportDST}
          disabled={!embroidery}
        >
          📥 DST (Machine)
        </button>
      </div>
    </div>
  );
}
