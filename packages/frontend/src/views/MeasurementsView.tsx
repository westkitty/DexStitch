import CameraCapture from "../components/CameraCapture";
import type { MeasurementSet, PatternSpec } from "@dexstitch/types";

type MeasurementsViewProps = {
  measurements: MeasurementSet;
  patternSpec: PatternSpec;
  onMeasurementsChange: (next: Partial<MeasurementSet>) => void;
  onPatternSpecChange: (next: Partial<PatternSpec>) => void;
};

export default function MeasurementsView({
  measurements,
  patternSpec,
  onMeasurementsChange,
  onPatternSpecChange
}: MeasurementsViewProps) {
  return (
    <div className="panel">
      <h2 className="section-title">Measurements</h2>
      <div className="form-grid">
        {Object.entries(measurements).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={`measurement-${key}`}>{key}</label>
            <input
              id={`measurement-${key}`}
              type="number"
              value={value}
              onChange={(event) =>
                onMeasurementsChange({ [key]: Number(event.target.value) })
              }
            />
          </div>
        ))}
        <div>
          <label htmlFor="pattern-ease">ease</label>
          <input
            id="pattern-ease"
            type="number"
            step="0.1"
            value={patternSpec.parameters.ease}
            onChange={(event) =>
              onPatternSpecChange({
                parameters: {
                  ...patternSpec.parameters,
                  ease: Number(event.target.value)
                }
              })
            }
          />
        </div>
        <div>
          <label htmlFor="pattern-dart">dart depth (mm)</label>
          <input
            id="pattern-dart"
            type="number"
            step="5"
            value={patternSpec.parameters.dartDepth || 0}
            onChange={(event) =>
              onPatternSpecChange({
                parameters: {
                  ...patternSpec.parameters,
                  dartDepth: Number(event.target.value)
                }
              })
            }
          />
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3 className="section-title">Camera capture</h3>
        <CameraCapture />
      </div>
    </div>
  );
}
