import React from 'react';
import { TemplateGallery } from '../components/TemplateGallery';
import type { PatternSpec } from '@dexstitch/types';

interface TemplatesViewProps {
  onSelectTemplate: (spec: PatternSpec) => void;
}

export function TemplatesView({ onSelectTemplate }: TemplatesViewProps) {
  return (
    <div className="templates-view">
      <TemplateGallery onSelectTemplate={onSelectTemplate} />
    </div>
  );
}
