import React, { useState, useMemo } from 'react';
import { createTemplateGallery, type GarmentTemplate, type TemplateCategory } from '@dexstitch/core';
import type { PatternSpec } from '@dexstitch/types';
import './TemplateGallery.css';

interface TemplateGalleryProps {
  onSelectTemplate: (spec: PatternSpec) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const gallery = useMemo(() => createTemplateGallery(), []);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<GarmentTemplate | null>(null);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#999';
    }
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
      </div>

      <div className="gallery-grid">
        {displayedTemplates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateClick(template)}
          >
            <div className="template-card-header">
              <h3>{template.name}</h3>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
              >
                {template.difficulty}
              </span>
            </div>
            
            <p className="template-description">{template.description}</p>
            
            <div className="template-meta">
              {template.estimatedTime && (
                <span className="meta-item">⏱️ {template.estimatedTime}</span>
              )}
              <span className="meta-item">📁 {template.category}</span>
            </div>
            
            <div className="template-tags">
              {template.tags.slice(0, 4).map((tag, idx) => (
                <span key={idx} className="tag">#{tag}</span>
              ))}
              {template.tags.length > 4 && (
                <span className="tag">+{template.tags.length - 4} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayedTemplates.length === 0 && (
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
