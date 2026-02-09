import { useEffect, useMemo, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { generatePattern, nestPieces } from "@dexstitch/core";
import Tabs from "./components/Tabs";
import MeasurementsView from "./views/MeasurementsView";
import DesignView from "./views/DesignView";
import LayoutView from "./views/LayoutView";
import EmbroideryView from "./views/EmbroideryView";
import ExportView from "./views/ExportView";
import { ProjectProvider, createDefaultProject, useProject } from "./state";
import { loadProject, saveProject } from "./db";

function AppShell() {
  const { project, setProject, updateMeasurements, updatePatternSpec, setEmbroidery } =
    useProject();
  const [activeTab, setActiveTab] = useState("measurements");
  const [collabStatus, setCollabStatus] = useState("local-only");
  const collabEnabled = import.meta.env.VITE_ENABLE_COLLAB === "true";

  useEffect(() => {
    let cancelled = false;
    loadProject()
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        if (loaded) {
          setProject(loaded);
        } else {
          setProject(createDefaultProject());
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [setProject]);

  useEffect(() => {
    const nextPattern = generatePattern(project.measurements, project.patternSpec);
    setProject((prev) => ({
      ...prev,
      pattern: nextPattern
    }));
  }, [project.measurements, project.patternSpec, setProject]);

  useEffect(() => {
    if (!project.pattern) {
      return;
    }
    const nextNesting = nestPieces({
      pieces: project.pattern.pieces,
      binWidth: 600,
      allowRotation: false,
      allowMirroring: false
    });
    setProject((prev) => ({
      ...prev,
      nesting: nextNesting
    }));
  }, [project.pattern, setProject]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveProject(project).catch(() => undefined);
    }, 400);

    return () => window.clearTimeout(handle);
  }, [project]);

  useEffect(() => {
    if (!collabEnabled) {
      setCollabStatus("local-only");
      return;
    }

    const doc = new Y.Doc();
    const provider = new WebrtcProvider("dexstitch-dev", doc);
    provider.on("status", (event: { connected: boolean }) => {
      setCollabStatus(event.connected ? "connected" : "disconnected");
    });

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [collabEnabled]);

  const tabs = useMemo(
    () => [
      { id: "measurements", label: "Measurements" },
      { id: "design", label: "Design" },
      { id: "layout", label: "Layout" },
      { id: "embroidery", label: "Embroidery" },
      { id: "export", label: "Export" }
    ],
    []
  );

  return (
    <div className="app-shell">
      <header>
        <h1>DexStitch</h1>
        <p>Local-first pattern and embroidery workstation</p>
      </header>
      <main>
        <div className="panel">
          <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
          <div style={{ marginTop: 12 }}>
            <span className="status-pill">
              {collabEnabled ? `Collab: ${collabStatus}` : "Local-only mode"}
            </span>
          </div>
        </div>
        {activeTab === "measurements" && (
          <MeasurementsView
            measurements={project.measurements}
            patternSpec={project.patternSpec}
            onMeasurementsChange={updateMeasurements}
            onPatternSpecChange={updatePatternSpec}
          />
        )}
        {activeTab === "design" && <DesignView pattern={project.pattern} />}
        {activeTab === "layout" && (
          <LayoutView pattern={project.pattern} nesting={project.nesting} />
        )}
        {activeTab === "embroidery" && (
          <EmbroideryView embroidery={project.embroidery} onEmbroideryChange={setEmbroidery} />
        )}
        {activeTab === "export" && <ExportView pattern={project.pattern} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppShell />
    </ProjectProvider>
  );
}
