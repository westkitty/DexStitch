import React, { useState, useMemo } from 'react';
import { createTemplateGallery, type GarmentTemplate, type TemplateCategory } from '@dexstitch/core';
import type { PatternSpec } from '@dexstitch/types';
import './TemplateGallery.css';

type ViewMode = 'grid' | 'list' | 'categories';

interface TemplateGalleryProps {
  onSelectTemplate: (spec: PatternSpec) => void;
  viewMode?: ViewMode;
}

export function TemplateGallery({ onSelectTemplate, viewMode: initialViewMode = 'grid' }: TemplateGalleryProps) {
  const gallery = useMemo(() => createTemplateGallery(), []);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<GarmentTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

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
    const counts: Record<string, number> = { all: gallery.templates.length };
    gallery.categories.forEach(cat => {
      counts[cat] = gallery.getByCategory(cat).length;
    });
    return counts;
  }, [gallery]);

  const handleTemplateClick = (template: GarmentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.spec);
      setSelectedTemplate(null);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#999';
    }
  };

  const renderGridView = () => (
    <div className="gallery-grid">
      {displayedTemplates.map((template) => (
        <div key={template.id} className="template-card" onClick={() => handleTemplateClick(template)}>
          <div className="template-card-header">
            <h3>{template.name}</h3>
            <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(template.difficulty) }}>
              {template.difficulty}
            </span>
          </div>
          <p className="template-description">{template.description}</p>
          <div className="template-meta">
            {template.estimatedTime && (<span className="meta-item">⏱️ {template.estimatedTime}</span>)}
            <span className="meta-item">📁 {template.category}</span>
          </div>
          <div className="template-tags">
            {template.tags.slice(0, 4).map((tag, idx) => (<span key={idx} className="tag">#{tag}</span>))}
            {template.tags.length > 4 && (<span className="tag">+{template.tags.length - 4} more</span>)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="gallery-list">
      {displayedTemplates.map((template) => (
        <div key={template.id} className="template-list-item" onClick={() => handleTemplateClick(template)}>
          <div className="list-item-header">
            <h4>{template.name}</h4>
            <span className="difficulty-badge small" style={{ backgroundColor: getDifficultyColor(template.difficulty) }}>
              {template.difficulty}
            </span>
          </div>
          <p className="list-item-description">{template.description}</p>
          <div className="list-item-footer">
            <span className="meta-item">📁 {template.category}</span>
            {template.estimatedTime && (<span className="meta-item">⏱️ {template.estimatedTime}</span>)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCategoriesView = () => {
    const templatesByCategory: Record<string, GarmentTemplate[]> = {};
    gallery.categories.forEach(cat => {
      templatesByCategory[cat] = gallery.getByCategory(cat).filter(t => 
        !searchQuery.trim() || t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    return (
      <div className="gallery-categories">
        {gallery.categories.map((category) => {
          const templates = templatesByCategory[category];
          if (templates.length === 0) return null;
          const isExpanded = expandedCategories.has(category);
          return (
            <div key={category} className="category-section">
              <div className="category-header" onClick={() => toggleCategory(category)}>
                <span className="category-toggle">{isExpanded ? '▼' : '▶'}</span>
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <span className="category-count">({templates.length})</span>
              </div>
              {isExpanded && (
                <div className="category-templates">
                  {templates.map((template) => (
                    <div key={template.id} className="category-template-item" onClick={() => handleTemplateClick(template)}>
                      <span className="template-name">{template.name}</span>
                      <span className="difficulty-badge mini" style={{ backgroundColor: getDifficultyColor(template.difficulty) }}>
                        {template.difficulty.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="template-gallery">
      <div className="gallery-header">
        <h2>📚 Template Library</h2>
        <p className="gallery-subtitle">{displayedTemplates.length} templates available</p>
      </div>

      <div className="gallery-controls">
        <input
          type="text"
          placeholder="🔍 Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="view-mode-selector">
          <button className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View">▦</button>
          <button className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View">☰</button>
          <button className={`view-mode-btn ${viewMode === 'categories' ? 'active' : ''}`} onClick={() => setViewMode('categories')} title="Categories View">📁</button>
        </div>
      </div>

      {viewMode !== 'categories' && (
        <div className="category-filters">
          <button
            className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({categoryCounts.all})
          </button>
          {gallery.categories.map(category => (
            <button
              key={category}
              className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category]})
            </button>
          ))}
        </div>
      )}

      {viewMode === 'grid' && renderGridView()}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'categories' && renderCategoriesView()}

      {displayedTemplates.length === 0 && viewMode !== 'categories' && (
        <div className="empty-state">
          <p>😕 No templates found matching your criteria</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Clear filters
          </button>
        </div>
      )}

      {selectedTemplate && (
        <div className="template-modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTemplate(null)}>
              ✕
            </button>
            
            <h2>{selectedTemplate.name}</h2>
            <span
              className="difficulty-badge large"
              style={{ backgroundColor: getDifficultyColor(selectedTemplate.difficulty) }}
            >
              {selectedTemplate.difficulty}
            </span>
            
            <p className="modal-description">{selectedTemplate.description}</p>
            
            <div className="modal-details">
              <div className="detail-section">
                <h4>⏱️ Estimated Time</h4>
                <p>{selectedTemplate.estimatedTime || 'Not specified'}</p>
              </div>
              
              {selectedTemplate.fabricRecommendations && (
                <div className="detail-section">
                  <h4>🧵 Fabric Recommendations</h4>
                  <ul>
                    {selectedTemplate.fabricRecommendations.map((fabric, idx) => (
                      <li key={idx}>{fabric}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedTemplate.requiredMeasurements && (
                <div className="detail-section">
                  <h4>📏 Required Measurements</h4>
                  <p>{selectedTemplate.requiredMeasurements.join(', ')}</p>
                </div>
              )}
              
              <div className="detail-section">
                <h4>🏷️ Tags</h4>
                <div className="template-tags">
                  {selectedTemplate.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUseTemplate}>
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
