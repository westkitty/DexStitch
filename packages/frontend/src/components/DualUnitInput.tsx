import { useState, useEffect } from "react";

interface DualUnitInputProps {
  id: string;
  label: string;
  value: number; // in mm (internal standard)
  onChange: (newValue: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export default function DualUnitInput({
  id,
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999
}: DualUnitInputProps) {
  const [inputValue, setInputValue] = useState<string>(`${value}`);
  const [unit, setUnit] = useState<"mm" | "in">("mm");
  const [isEditing, setIsEditing] = useState(false);

  const mmToIn = (mm: number) => mm / 25.4;
  const inToMm = (inches: number) => inches * 25.4;

  // Update display when value prop changes (from external source)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(`${value}`);
    }
  }, [value, isEditing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value;
    setInputValue(newInput);
  };

  const handleUnitToggle = () => {
    // When toggling units, convert displayed value
    const currentNumValue = parseFloat(inputValue) || 0;
    if (unit === "mm") {
      // Switch to inches
      const inches = mmToIn(currentNumValue);
      setInputValue(`${inches.toFixed(2)}`);
      setUnit("in");
    } else {
      // Switch to mm
      const mm = inToMm(currentNumValue);
      setInputValue(`${mm.toFixed(0)}`);
      setUnit("mm");
    }
  };

  const handleBlur = () => {
    // Parse input and convert to mm if needed
    const numValue = parseFloat(inputValue) || 0;
    let mmValue = numValue;

    if (unit === "in") {
      mmValue = inToMm(numValue);
    }

    // Clamp to min/max
    mmValue = Math.max(min, Math.min(max, mmValue));

    // Update parent with mm value
    onChange(mmValue);

    // Reset display to mm
    setInputValue(`${mmValue}`);
    setUnit("mm");
    setIsEditing(false);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    } else if (event.key === "Escape") {
      setInputValue(`${value}`);
      setUnit("mm");
      setIsEditing(false);
    }
  };

  const displayInches = mmToIn(value).toFixed(2);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <input
          id={id}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          step={step}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={handleUnitToggle}
          style={{
            padding: "6px 10px",
            fontSize: "0.85em",
            fontWeight: "bold",
            border: "2px solid var(--input-border)",
            borderRadius: "4px",
            background: unit === "mm" ? "var(--highlight)" : "var(--input-bg)",
            color: unit === "mm" ? "white" : "var(--text-color)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          title="Toggle between mm and inches"
        >
          {unit === "mm" ? "mm" : "in"}
        </button>
      </div>
      <div style={{ marginTop: "4px", fontSize: "0.85em", color: "var(--text-secondary)" }}>
        {value} mm • {displayInches} in
      </div>
    </div>
  );
}
