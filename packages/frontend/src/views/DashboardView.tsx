import React from 'react';
import './DashboardView.css';

export function DashboardView() {
  return (
    <div className="dashboard-view">
      <div className="dashboard-hero">
        <img 
          src="/DexStitchLogo.png" 
          alt="DexStitch Logo" 
          className="dashboard-logo"
        />
        <h1 className="dashboard-title">Welcome to DexStitch</h1>
        <p className="dashboard-subtitle">
          Your Local-First Pattern Design & Embroidery Workstation
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card quick-start">
          <div className="card-icon">🚀</div>
          <h3>Quick Start</h3>
          <p>Start a new project in seconds</p>
          <ol className="quick-steps">
            <li>Click <strong>Templates</strong> to browse 70+ garment templates</li>
            <li>Select your measurements or use camera capture</li>
            <li>Customize your pattern design</li>
            <li>Generate layouts and export for production</li>
          </ol>
        </div>

        <div className="dashboard-card features">
          <div className="card-icon">✨</div>
          <h3>Key Features</h3>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">📚</span>
              <strong>70+ Professional Templates</strong>
              <p>Singlets, tanks, harnesses, jockstraps, briefs, bodysuits & more</p>
            </li>
            <li>
              <span className="feature-icon">📐</span>
              <strong>Precise Pattern Generation</strong>
              <p>Generate custom-fit patterns from your measurements</p>
            </li>
            <li>
              <span className="feature-icon">🎨</span>
              <strong>Embroidery Design</strong>
              <p>Add custom embroidery with vector-to-stitch conversion</p>
            </li>
            <li>
              <span className="feature-icon">📦</span>
              <strong>Smart Fabric Nesting</strong>
              <p>Optimize material usage with automatic layout</p>
            </li>
            <li>
              <span className="feature-icon">💾</span>
              <strong>Local-First & Offline</strong>
              <p>All your work stays on your device, works without internet</p>
            </li>
          </ul>
        </div>

        <div className="dashboard-card stats">
          <div className="card-icon">📊</div>
          <h3>Template Library</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">70+</div>
              <div className="stat-label">Templates</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">∞</div>
              <div className="stat-label">Possibilities</div>
            </div>
          </div>
          <div className="template-categories">
            <span className="category-tag">Singlets</span>
            <span className="category-tag">Tanks</span>
            <span className="category-tag">Harnesses</span>
            <span className="category-tag">Jockstraps</span>
            <span className="category-tag">Briefs</span>
            <span className="category-tag">Bodysuits</span>
            <span className="category-tag">Shorts</span>
            <span className="category-tag">Leggings</span>
            <span className="category-tag">Accessories</span>
          </div>
        </div>

        <div className="dashboard-card workflow">
          <div className="card-icon">🔄</div>
          <h3>Workflow Tabs</h3>
          <div className="workflow-steps">
            <div className="workflow-step">
              <span className="step-number">1</span>
              <strong>Templates</strong>
              <p>Browse & select</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <span className="step-number">2</span>
              <strong>Measurements</strong>
              <p>Enter dimensions</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <span className="step-number">3</span>
              <strong>Design</strong>
              <p>View pattern</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <span className="step-number">4</span>
              <strong>Layout</strong>
              <p>Optimize fabric</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <span className="step-number">5</span>
              <strong>Embroidery</strong>
              <p>Add designs</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <span className="step-number">6</span>
              <strong>Export</strong>
              <p>Save & print</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-cta">
        <h2>Ready to Get Started?</h2>
        <p>Click the <strong>Templates</strong> button above to browse our library and begin your project</p>
      </div>
    </div>
  );
}
