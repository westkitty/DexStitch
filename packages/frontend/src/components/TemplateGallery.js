import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { createTemplateGallery } from '@dexstitch/core';
import './TemplateGallery.css';
export function TemplateGallery({ onSelectTemplate }) {
    const gallery = useMemo(() => createTemplateGallery(), []);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const displayedTemplates = useMemo(() => {
        let templates = gallery.templates;
        // Filter by category
        if (selectedCategory !== 'all') {
            templates = gallery.getByCategory(selectedCategory);
        }
        // Filter by search
        if (searchQuery.trim()) {
            templates = gallery.search(searchQuery);
        }
        return templates;
    }, [gallery, selectedCategory, searchQuery]);
    const categoryCounts = useMemo(() => {
        const counts = { all: gallery.templates.length };
        gallery.categories.forEach(cat => {
            counts[cat] = gallery.getByCategory(cat).length;
        });
        return counts;
    }, [gallery]);
    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
    };
    const handleUseTemplate = () => {
        if (selectedTemplate) {
            onSelectTemplate(selectedTemplate.spec);
            setSelectedTemplate(null);
        }
    };
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return '#4caf50';
            case 'intermediate': return '#ff9800';
            case 'advanced': return '#f44336';
            default: return '#999';
        }
    };
    return (_jsxs("div", { className: "template-gallery", children: [_jsxs("div", { className: "gallery-header", children: [_jsx("h2", { children: "\uD83D\uDCDA Template Library" }), _jsxs("p", { className: "gallery-subtitle", children: [displayedTemplates.length, " templates available"] })] }), _jsxs("div", { className: "gallery-controls", children: [_jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Search templates...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), _jsxs("div", { className: "category-filters", children: [_jsxs("button", { className: `category-chip ${selectedCategory === 'all' ? 'active' : ''}`, onClick: () => setSelectedCategory('all'), children: ["All (", categoryCounts.all, ")"] }), gallery.categories.map(category => (_jsxs("button", { className: `category-chip ${selectedCategory === category ? 'active' : ''}`, onClick: () => setSelectedCategory(category), children: [category.charAt(0).toUpperCase() + category.slice(1), " (", categoryCounts[category], ")"] }, category)))] })] }), _jsx("div", { className: "gallery-grid", children: displayedTemplates.map((template) => (_jsxs("div", { className: "template-card", onClick: () => handleTemplateClick(template), children: [_jsxs("div", { className: "template-card-header", children: [_jsx("h3", { children: template.name }), _jsx("span", { className: "difficulty-badge", style: { backgroundColor: getDifficultyColor(template.difficulty) }, children: template.difficulty })] }), _jsx("p", { className: "template-description", children: template.description }), _jsxs("div", { className: "template-meta", children: [template.estimatedTime && (_jsxs("span", { className: "meta-item", children: ["\u23F1\uFE0F ", template.estimatedTime] })), _jsxs("span", { className: "meta-item", children: ["\uD83D\uDCC1 ", template.category] })] }), _jsxs("div", { className: "template-tags", children: [template.tags.slice(0, 4).map((tag, idx) => (_jsxs("span", { className: "tag", children: ["#", tag] }, idx))), template.tags.length > 4 && (_jsxs("span", { className: "tag", children: ["+", template.tags.length - 4, " more"] }))] })] }, template.id))) }), displayedTemplates.length === 0 && (_jsxs("div", { className: "empty-state", children: [_jsx("p", { children: "\uD83D\uDE15 No templates found matching your criteria" }), _jsx("button", { onClick: () => { setSearchQuery(''); setSelectedCategory('all'); }, children: "Clear filters" })] })), selectedTemplate && (_jsx("div", { className: "template-modal-overlay", onClick: () => setSelectedTemplate(null), children: _jsxs("div", { className: "template-modal", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "modal-close", onClick: () => setSelectedTemplate(null), children: "\u2715" }), _jsx("h2", { children: selectedTemplate.name }), _jsx("span", { className: "difficulty-badge large", style: { backgroundColor: getDifficultyColor(selectedTemplate.difficulty) }, children: selectedTemplate.difficulty }), _jsx("p", { className: "modal-description", children: selectedTemplate.description }), _jsxs("div", { className: "modal-details", children: [_jsxs("div", { className: "detail-section", children: [_jsx("h4", { children: "\u23F1\uFE0F Estimated Time" }), _jsx("p", { children: selectedTemplate.estimatedTime || 'Not specified' })] }), selectedTemplate.fabricRecommendations && (_jsxs("div", { className: "detail-section", children: [_jsx("h4", { children: "\uD83E\uDDF5 Fabric Recommendations" }), _jsx("ul", { children: selectedTemplate.fabricRecommendations.map((fabric, idx) => (_jsx("li", { children: fabric }, idx))) })] })), selectedTemplate.requiredMeasurements && (_jsxs("div", { className: "detail-section", children: [_jsx("h4", { children: "\uD83D\uDCCF Required Measurements" }), _jsx("p", { children: selectedTemplate.requiredMeasurements.join(', ') })] })), _jsxs("div", { className: "detail-section", children: [_jsx("h4", { children: "\uD83C\uDFF7\uFE0F Tags" }), _jsx("div", { className: "template-tags", children: selectedTemplate.tags.map((tag, idx) => (_jsxs("span", { className: "tag", children: ["#", tag] }, idx))) })] })] }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { className: "btn-secondary", onClick: () => setSelectedTemplate(null), children: "Cancel" }), _jsx("button", { className: "btn-primary", onClick: handleUseTemplate, children: "Use This Template" })] })] }) }))] }));
}
