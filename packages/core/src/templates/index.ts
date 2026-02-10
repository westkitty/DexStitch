/**
 * Template Gallery System
 * Provides pre-designed pattern templates for quick access
 */

import type { PatternSpec, MeasurementSet } from '@dexstitch/types';

export interface GarmentTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  spec: PatternSpec;
  requiredMeasurements?: Array<keyof MeasurementSet>;
  estimatedTime?: string; // e.g., "2-3 hours"
  fabricRecommendations?: string[];
}

export type TemplateCategory = 
  | 'singlets'
  | 'harnesses'
  | 'jockstraps'
  | 'briefs'
  | 'bodysuits'
  | 'tanks'
  | 'shorts'
  | 'leggings'
  | 'accessories'
  | 'custom';

export interface TemplateGallery {
  templates: GarmentTemplate[];
  categories: TemplateCategory[];
  getByCategory(category: TemplateCategory): GarmentTemplate[];
  getByTag(tag: string): GarmentTemplate[];
  search(query: string): GarmentTemplate[];
  getById(id: string): GarmentTemplate | undefined;
}

/**
 * Create a template gallery instance
 */
export function createTemplateGallery(): TemplateGallery {
  return {
    templates: getAllTemplates(),
    categories: [
      'singlets',
      'harnesses',
      'jockstraps',
      'briefs',
      'bodysuits',
      'tanks',
      'shorts',
      'leggings',
      'accessories',
      'custom'
    ],
    
    getByCategory(category: TemplateCategory) {
      return this.templates.filter(t => t.category === category);
    },
    
    getByTag(tag: string) {
      return this.templates.filter(t => 
        t.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    },
    
    search(query: string) {
      const q = query.toLowerCase();
      return this.templates.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    },
    
    getById(id: string) {
      return this.templates.find(t => t.id === id);
    }
  };
}

import { getSingletTemplates } from './singlets';
import { getHarnessTemplates } from './harnesses';
import { getJockstrapTemplates } from './jockstraps';
import { getBriefTemplates } from './briefs';
import { getBodysuitTemplates } from './bodysuits';
import { getTankTemplates } from './tanks';
import { getShortsTemplates } from './shorts';
import { getLeggingsTemplates } from './leggings';
import { getAccessoryTemplates } from './accessories';

/**
 * Get all available templates
 */
function getAllTemplates(): GarmentTemplate[] {
  return [
    ...getSingletTemplates(),
    ...getHarnessTemplates(),
    ...getJockstrapTemplates(),
    ...getBriefTemplates(),
    ...getBodysuitTemplates(),
    ...getTankTemplates(),
    ...getShortsTemplates(),
    ...getLeggingsTemplates(),
    ...getAccessoryTemplates()
  ];
}

export { getSingletTemplates, getHarnessTemplates, getJockstrapTemplates, getBriefTemplates, getBodysuitTemplates, getTankTemplates, getShortsTemplates, getLeggingsTemplates, getAccessoryTemplates };
