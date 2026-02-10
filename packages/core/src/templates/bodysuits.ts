/**
 * Bodysuit Templates
 * Full-body coverage garments, unitards, and body-con pieces
 */

import type { GarmentTemplate } from './index';

export function getBodysuitTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'bodysuit-full-coverage',
      name: 'Full Coverage Bodysuit',
      category: 'bodysuits',
      description: 'Complete bodysuit with long sleeves and legs. Perfect for dance, performance, or layering.',
      tags: ['bodysuit', 'full-coverage', 'long-sleeve', 'dance', 'unitard'],
      difficulty: 'advanced',
      estimatedTime: '6-8 hours',
      fabricRecommendations: ['Stretch velvet', 'Lycra/Spandex', 'Performance jersey'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'bodysuit-full-coverage',
        name: 'Full Bodysuit',
        parameters: {
          sleeves: 'long',
          legLength: 'full',
          neckline: 'crew',
          ease: 0.95,
          zipLocation: 'back'
        }
      }
    },
    {
      id: 'bodysuit-sleeveless',
      name: 'Sleeveless Tank Bodysuit',
      category: 'bodysuits',
      description: 'Athletic sleeveless bodysuit with snap crotch. Great for gym or street wear.',
      tags: ['bodysuit', 'sleeveless', 'tank', 'athletic', 'gym'],
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Cotton/Spandex blend', 'Athletic rib knit', 'Stretch cotton'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-sleeveless',
        name: 'Tank Bodysuit',
        parameters: {
          sleeves: 'none',
          legLength: 'brief',
          neckline: 'scoop',
          ease: 1.0,
          snapCrotch: true
        }
      }
    },
    {
      id: 'bodysuit-mesh-cutout',
      name: 'Mesh Cutout Bodysuit',
      category: 'bodysuits',
      description: 'Fashion bodysuit with strategic mesh panels and cutouts.',
      tags: ['bodysuit', 'mesh', 'cutout', 'fashion', 'club', 'sexy'],
      difficulty: 'advanced',
      estimatedTime: '6-7 hours',
      fabricRecommendations: ['Power mesh', 'Stretch lace', 'Contrast solid fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-mesh-cutout',
        name: 'Mesh Cutout Bodysuit',
        parameters: {
          sleeves: 'long',
          legLength: 'brief',
          neckline: 'high',
          ease: 0.98,
          meshPanels: true,
          cutoutCount: 4
        }
      }
    },
    {
      id: 'bodysuit-halter-neck',
      name: 'Halter Neck Bodysuit',
      category: 'bodysuits',
      description: 'Sexy halter-style bodysuit showing off shoulders and back.',
      tags: ['bodysuit', 'halter', 'backless', 'sexy', 'party'],
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Stretchy silk-blend', 'Satin-back crepe', 'Jersey knit'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-halter-neck',
        name: 'Halter Bodysuit',
        parameters: {
          sleeves: 'none',
          legLength: 'brief',
          neckline: 'halter',
          ease: 1.0,
          backStyle: 'open',
          snapCrotch: true
        }
      }
    },
    {
      id: 'bodysuit-compression-sport',
      name: 'Compression Sport Bodysuit',
      category: 'bodysuits',
      description: 'High-performance compression bodysuit for athletics and recovery.',
      tags: ['bodysuit', 'compression', 'sport', 'athletic', 'performance'],
      difficulty: 'advanced',
      estimatedTime: '5-6 hours',
      fabricRecommendations: ['Compression fabric', 'Moisture-wicking polyester', 'Medical-grade Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'bodysuit-compression-sport',
        name: 'Compression Bodysuit',
        parameters: {
          sleeves: 'long',
          legLength: 'full',
          neckline: 'crew',
          ease: 0.85, // Maximum compression
          flatlock: true,
          zipLocation: 'front'
        }
      }
    }
  ];
}
