import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
export default function DualUnitInput({ id, label, value, onChange, step = 1, min = 0, max = 9999 }) {
    const [inputValue, setInputValue] = useState(`${value}`);
    const [unit, setUnit] = useState("mm");
    const [isEditing, setIsEditing] = useState(false);
    const mmToIn = (mm) => mm / 25.4;
    const inToMm = (inches) => inches * 25.4;
    // Update display when value prop changes (from external source)
    useEffect(() => {
        if (!isEditing) {
            setInputValue(`${value}`);
        }
    }, [value, isEditing]);
    const handleInputChange = (event) => {
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
        }
        else {
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
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleBlur();
        }
        else if (event.key === "Escape") {
            setInputValue(`${value}`);
            setUnit("mm");
            setIsEditing(false);
        }
    };
    const displayInches = mmToIn(value).toFixed(2);
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: id, children: label }), _jsxs("div", { style: { display: "flex", gap: "6px", alignItems: "center" }, children: [_jsx("input", { id: id, type: "number", value: inputValue, onChange: handleInputChange, onBlur: handleBlur, onFocus: handleFocus, onKeyDown: handleKeyDown, step: step, style: { flex: 1 } }), _jsx("button", { type: "button", onClick: handleUnitToggle, style: {
                            padding: "6px 10px",
                            fontSize: "0.85em",
                            fontWeight: "bold",
                            border: "2px solid var(--input-border)",
                            borderRadius: "4px",
                            background: unit === "mm" ? "var(--highlight)" : "var(--input-bg)",
                            color: unit === "mm" ? "white" : "var(--text-color)",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }, title: "Toggle between mm and inches", children: unit === "mm" ? "mm" : "in" })] }), _jsxs("div", { style: { marginTop: "4px", fontSize: "0.85em", color: "var(--text-secondary)" }, children: [value, " mm \u2022 ", displayInches, " in"] })] }));
}
