/**
 * Shorts Templates
 * Athletic shorts, swim trunks, and fashion shorts
 */

import type { GarmentTemplate } from './index';

export function getShortsTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'shorts-athletic-mesh',
      name: 'Athletic Mesh Shorts',
      category: 'shorts',
      description: 'Classic gym shorts with mesh panels and elastic waistband.',
      tags: ['shorts', 'athletic', 'mesh', 'gym', 'basketball', 'sports'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Athletic mesh', 'Polyester', 'Quick-dry fabric'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-athletic-mesh',
        name: 'Mesh Athletic Shorts',
        parameters: {
          inseam: 175, // 7 inch
          waistbandType: 'elastic',
          pockets: true,
          meshPanels: true,
          lining: true
        }
      }
    },
    {
      id: 'shorts-compression',
      name: 'Compression Athletic Shorts',
      category: 'shorts',
      description: 'Tight-fitting compression shorts for support during intense activity.',
      tags: ['shorts', 'compression', 'athletic', 'tight', 'support', 'performance'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Compression fabric', 'Spandex blend', 'Performance Lycra'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-compression',
        name: 'Compression Shorts',
        parameters: {
          inseam: 125, // 5 inch
          waistbandType: 'elastic-wide',
          pockets: false,
          ease: 0.90, // Tight fit
          flatlock: true
        }
      }
    },
    {
      id: 'shorts-swim-trunk',
      name: 'Swim Trunks - Square Leg',
      category: 'shorts',
      description: 'Classic square-leg swim trunks with drawstring waist.',
      tags: ['shorts', 'swim', 'trunks', 'beach', 'pool', 'water'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Swim fabric', 'Quick-dry nylon', 'Chlorine-resistant polyester'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-swim-trunk',
        name: 'Swim Trunks',
        parameters: {
          inseam: 100, // 4 inch
          waistbandType: 'drawstring',
          pockets: true,
          lining: true,
          waterproof: true
        }
      }
    },
    {
      id: 'shorts-running-split',
      name: 'Running Shorts with Side Splits',
      category: 'shorts',
      description: 'Ultra-light running shorts with side splits for maximum range of motion.',
      tags: ['shorts', 'running', 'split-leg', 'lightweight', 'marathon', 'athletic'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Lightweight nylon', 'Breathable mesh', 'Moisture-wicking'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-running-split',
        name: 'Split Running Shorts',
        parameters: {
          inseam: 75, // 3 inch
          waistbandType: 'elastic-drawstring',
          pockets: true,
          sideSplits: true,
          splitHeight: 75,
          lining: true
        }
      }
    },
    {
      id: 'shorts-cargo-utility',
      name: 'Cargo Utility Shorts',
      category: 'shorts',
      description: 'Functional shorts with multiple pockets and durable construction.',
      tags: ['shorts', 'cargo', 'utility', 'pockets', 'casual', 'functional'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Canvas', 'Cotton twill', 'Ripstop nylon'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-cargo-utility',
        name: 'Cargo Shorts',
        parameters: {
          inseam: 225, // 9 inch
          waistbandType: 'button-fly',
          pockets: true,
          cargoPockets: 2,
          reinforced: true
        }
      }
    }
  ];
}
