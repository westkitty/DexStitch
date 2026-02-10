import { useEffect, useMemo, useRef, useState } from "react";
import { generatePattern, nestPieces } from "@dexstitch/core";
import Tabs from "./components/Tabs";
import MeasurementsView from "./views/MeasurementsView";
import DesignView from "./views/DesignView";
import LayoutView from "./views/LayoutView";
import EmbroideryView from "./views/EmbroideryView";
import ExportView from "./views/ExportView";
import { ProjectProvider, createDefaultProject, useProject } from "./state";
import { loadProject, saveProject } from "./db";
import { createCollaborationManager, type CollabStatus } from "./collaboration";

function AppShell() {
  const { project, setProject, updateMeasurements, updatePatternSpec, setEmbroidery } =
    useProject();
  const [activeTab, setActiveTab] = useState("measurements");
  const [collabStatus, setCollabStatus] = useState<CollabStatus>({
    connected: false,
    status: 'disconnected',
    peers: 0
  });
  const collabEnabled = import.meta.env.VITE_ENABLE_COLLAB === "true";
  const collabRef = useRef(createCollaborationManager("dexstitch-room"));

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

  // Initialize collaboration when enabled
  useEffect(() => {
    if (!collabEnabled) {
      setCollabStatus({ connected: false, status: 'disconnected', peers: 0 });
      return;
    }

    const collab = collabRef.current;
    
    // Connect to collaboration room
    collab.connect((status) => {
      setCollabStatus(status);
    }).catch((error) => {
      console.error('Collaboration connection failed:', error);
      setCollabStatus({ connected: false, status: 'disconnected', peers: 0 });
    });

    // Sync project to shared store
    collab.syncProjectToY(project);

    // Listen for changes from peers
    const unsubscribe = collab.onProjectChange((remoteProject) => {
      // Merge remote changes with local state (prefer local if just updated)
      if (remoteProject.measurements && Date.now() - lastLocalUpdateRef.current > 500) {
        setProject((prev) => ({
          ...prev,
          ...remoteProject
        }));
      }
    });

    // Set user awareness
    collab.setLocalAwareness({
      userName: 'Designer-' + Math.random().toString(36).slice(2, 8),
      userColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      activeView: activeTab
    });

    return () => {
      unsubscribe();
      collab.disconnect();
    };
  }, [collabEnabled, project, activeTab, setProject]);

  // Track last time local state was updated
  const lastLocalUpdateRef = useRef(Date.now());

  useEffect(() => {
    lastLocalUpdateRef.current = Date.now();
  }, [project]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/DexStitchLogo.png" 
            alt="DexStitch Logo" 
            style={{ height: '60px', width: 'auto' }}
          />
          <div>
            <h1 style={{ margin: 0 }}>DexStitch</h1>
            <p style={{ margin: 0 }}>Local-first pattern and embroidery workstation</p>
          </div>
        </div>
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
        {activeTab === "export" && (
          <ExportView pattern={project.pattern} nesting={project.nesting} embroidery={project.embroidery.stitchPlan} />
        )}
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
