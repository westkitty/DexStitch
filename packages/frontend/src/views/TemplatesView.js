import { jsx as _jsx } from "react/jsx-runtime";
import { TemplateGallery } from '../components/TemplateGallery';
export function TemplatesView({ onSelectTemplate }) {
    return (_jsx("div", { className: "templates-view", children: _jsx(TemplateGallery, { onSelectTemplate: onSelectTemplate }) }));
}
