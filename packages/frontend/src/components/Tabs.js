import { jsx as _jsx } from "react/jsx-runtime";
export default function Tabs({ tabs, activeId, onChange }) {
    return (_jsx("div", { className: "tabs", children: tabs.map((tab) => (_jsx("button", { className: `tab-button ${activeId === tab.id ? "active" : ""}`, onClick: () => onChange(tab.id), type: "button", children: tab.label }, tab.id))) }));
}
