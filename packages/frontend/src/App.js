import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { generatePattern, nestPieces } from "@dexstitch/core";
import Tabs from "./components/Tabs";
import MeasurementsView from "./views/MeasurementsView";
import DesignView from "./views/DesignView";
import LayoutView from "./views/LayoutView";
import EmbroideryView from "./views/EmbroideryView";
import ExportView from "./views/ExportView";
import { DashboardView } from "./views/DashboardView";
import { TemplateGallery } from "./components/TemplateGallery";
import { ProjectProvider, createDefaultProject, useProject } from "./state";
import { loadProject, saveProject } from "./db";
import { createCollaborationManager } from "./collaboration";
function AppShell() {
    const { project, setProject, updateMeasurements, updatePatternSpec, setEmbroidery } = useProject();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
    const [collabStatus, setCollabStatus] = useState({
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
            }
            else {
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
    const tabs = useMemo(() => [
        { id: "dashboard", label: "🏠 Dashboard" },
        { id: "measurements", label: "📏 Measurements" },
        { id: "design", label: "✂️ Design" },
        { id: "layout", label: "📦 Layout" },
        { id: "embroidery", label: "🎨 Embroidery" },
        { id: "export", label: "💾 Export" }
    ], []);
    const handleSelectTemplate = (spec) => {
        updatePatternSpec(spec);
        setTemplateDrawerOpen(false);
        setActiveTab("measurements");
    };
    return (_jsxs("div", { className: "app-shell", children: [templateDrawerOpen && (_jsx("div", { className: "drawer-overlay", onClick: () => setTemplateDrawerOpen(false), children: _jsxs("div", { className: "template-drawer", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "drawer-header", children: [_jsx("h2", { children: "\uD83D\uDCDA Template Library" }), _jsx("button", { className: "drawer-close", onClick: () => setTemplateDrawerOpen(false), children: "\u2715" })] }), _jsx("div", { className: "drawer-content", children: _jsx(TemplateGallery, { onSelectTemplate: handleSelectTemplate }) })] }) })), _jsxs("header", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [_jsx("img", { src: "/DexStitchLogo.png", alt: "DexStitch Logo", style: { height: '60px', width: 'auto' } }), _jsxs("div", { children: [_jsx("h1", { style: { margin: 0 }, children: "DexStitch" }), _jsx("p", { style: { margin: 0, fontSize: '0.9rem', color: '#666' }, children: "Local-first pattern and embroidery workstation" })] })] }), _jsx("button", { className: "templates-btn", onClick: () => setTemplateDrawerOpen(true), children: "\uD83D\uDCDA Templates" })] }), _jsxs("main", { children: [_jsxs("div", { className: "panel", children: [_jsx(Tabs, { tabs: tabs, activeId: activeTab, onChange: setActiveTab }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("span", { className: "status-pill", children: collabEnabled ? `Collab: ${collabStatus}` : "Local-only mode" }) })] }), activeTab === "dashboard" && _jsx(DashboardView, {}), activeTab === "measurements" && (_jsx(MeasurementsView, { measurements: project.measurements, patternSpec: project.patternSpec, onMeasurementsChange: updateMeasurements, onPatternSpecChange: updatePatternSpec })), activeTab === "design" && _jsx(DesignView, { pattern: project.pattern }), activeTab === "layout" && (_jsx(LayoutView, { pattern: project.pattern, nesting: project.nesting })), activeTab === "embroidery" && (_jsx(EmbroideryView, { embroidery: project.embroidery, onEmbroideryChange: setEmbroidery })), activeTab === "export" && (_jsx(ExportView, { pattern: project.pattern, nesting: project.nesting, embroidery: project.embroidery.stitchPlan }))] })] }));
}
export default function App() {
    return (_jsx(ProjectProvider, { children: _jsx(AppShell, {}) }));
}
