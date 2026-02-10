import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from "react";
const defaultProject = () => ({
    measurements: {
        height: 1700,
        neck: 380,
        chest: 980,
        waist: 760,
        hip: 980
    },
    patternSpec: {
        id: "basic-panel",
        name: "Basic Panel",
        parameters: {
            ease: 1.2,
            dartDepth: 0
        }
    },
    pattern: null,
    nesting: null,
    embroidery: {
        vectors: [],
        stitchPlan: null
    }
});
const ProjectContext = createContext(null);
export function ProjectProvider({ children }) {
    const [project, setProject] = useState(defaultProject());
    const updateMeasurements = (next) => {
        setProject((prev) => ({
            ...prev,
            measurements: { ...prev.measurements, ...next }
        }));
    };
    const updatePatternSpec = (next) => {
        setProject((prev) => ({
            ...prev,
            patternSpec: { ...prev.patternSpec, ...next }
        }));
    };
    const setEmbroidery = (next) => {
        setProject((prev) => ({
            ...prev,
            embroidery: next
        }));
    };
    const value = useMemo(() => ({ project, setProject, updateMeasurements, updatePatternSpec, setEmbroidery }), [project]);
    return _jsx(ProjectContext.Provider, { value: value, children: children });
}
export function useProject() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within ProjectProvider");
    }
    return context;
}
export function createDefaultProject() {
    return defaultProject();
}
