import React, { createContext, useContext, useMemo, useState } from "react";
import type {
  EmbroideryProgram,
  MeasurementSet,
  NestingOutput,
  PatternResult,
  PatternSpec
} from "@dexstitch/types";
import type { VectorShape } from "@dexstitch/core";

export type EmbroideryData = {
  vectors: VectorShape[];
  stitchPlan: EmbroideryProgram | null;
  imageDataUrl?: string;
};

export type ProjectData = {
  measurements: MeasurementSet;
  patternSpec: PatternSpec;
  pattern: PatternResult | null;
  nesting: NestingOutput | null;
  embroidery: EmbroideryData;
};

type ProjectContextValue = {
  project: ProjectData;
  setProject: React.Dispatch<React.SetStateAction<ProjectData>>;
  updateMeasurements: (next: Partial<MeasurementSet>) => void;
  updatePatternSpec: (next: Partial<PatternSpec>) => void;
  setEmbroidery: (next: EmbroideryData) => void;
};

const defaultProject = (): ProjectData => ({
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

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<ProjectData>(defaultProject());

  const updateMeasurements = (next: Partial<MeasurementSet>) => {
    setProject((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, ...next }
    }));
  };

  const updatePatternSpec = (next: Partial<PatternSpec>) => {
    setProject((prev) => ({
      ...prev,
      patternSpec: { ...prev.patternSpec, ...next }
    }));
  };

  const setEmbroidery = (next: EmbroideryData) => {
    setProject((prev) => ({
      ...prev,
      embroidery: next
    }));
  };

  const value = useMemo(
    () => ({ project, setProject, updateMeasurements, updatePatternSpec, setEmbroidery }),
    [project]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
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
