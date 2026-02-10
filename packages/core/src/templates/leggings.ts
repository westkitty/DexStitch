/**
 * Leggings Templates
 * Compression leggings, tights, and athletic pants
 */

import type { GarmentTemplate } from './index';

export function getLeggingsTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'leggings-full-length-basic',
      name: 'Full Length Leggings - Basic',
      category: 'leggings',
      description: 'Classic full-length leggings with elastic waistband. Comfortable everyday wear.',
      tags: ['leggings', 'full-length', 'basic', 'everyday', 'yoga', 'casual'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Cotton/Spandex blend', 'Lycra blend', 'Soft jersey'],
      requiredMeasurements: ['waist', 'hip', 'height'],
      spec: {
        id: 'leggings-full-length-basic',
        name: 'Full Length Leggings',
        parameters: {
          length: 'full',
          waist: 'mid-rise',
          waistbandWidth: 50,
          ease: 0.95,
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'leggings-compression-athletic',
      name: 'Compression Athletic Leggings',
      category: 'leggings',
      description: 'High-performance compression leggings for sports and training.',
      tags: ['leggings', 'compression', 'athletic', 'sports', 'performance', 'training'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Compression polyester', 'Performance Lycra', 'Moisture-wicking blend'],
      requiredMeasurements: ['waist', 'hip', 'height'],
      spec: {
        id: 'leggings-compression-athletic',
        name: 'Compression Leggings',
        parameters: {
          length: 'full',
          waist: 'high-rise',
          waistbandWidth: 70,
          ease: 0.88, // Maximum compression
          seams: 'flatlock',
          meshPanels: true
        }
      }
    },
    {
      id: 'leggings-capri-length',
      name: 'Capri Length Leggings',
      category: 'leggings',
      description: '3/4 length leggings ending just below the knee. Perfect for warm weather.',
      tags: ['leggings', 'capri', '3/4-length', 'summer', 'yoga', 'casual'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Lightweight Lycra', 'Breathable blend', 'Cotton/Spandex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-capri-length',
        name: 'Capri Leggings',
        parameters: {
          length: 'capri',
          waist: 'mid-rise',
          waistbandWidth: 50,
          ease: 0.95,
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'leggings-pocket-side',
      name: 'Side Pocket Leggings',
      category: 'leggings',
      description: 'Practical leggings with side pockets for phone and essentials.',
      tags: ['leggings', 'pockets', 'functional', 'practical', 'phone-pocket'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Thick Lycra blend', 'Double-knit fabric', 'Structured athletic fabric'],
      requiredMeasurements: ['waist', 'hip', 'height'],
      spec: {
        id: 'leggings-pocket-side',
        name: 'Pocket Leggings',
        parameters: {
          length: 'full',
          waist: 'high-rise',
          waistbandWidth: 70,
          ease: 0.93,
          sidePockets: true,
          pocketType: 'hidden',
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'leggings-mesh-panel',
      name: 'Mesh Panel Fashion Leggings',
      category: 'leggings',
      description: 'Fashion leggings with mesh inserts on calves and thighs.',
      tags: ['leggings', 'mesh', 'fashion', 'trendy', 'stylish', 'panel'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Opaque Lycra base', 'Mesh panels', 'Contrast fabrics'],
      requiredMeasurements: ['waist', 'hip', 'height'],
      spec: {
        id: 'leggings-mesh-panel',
        name: 'Mesh Panel Leggings',
        parameters: {
          length: 'full',
          waist: 'mid-rise',
          waistbandWidth: 60,
          ease: 0.95,
          meshPanels: true,
          panelPlacement: ['calf', 'thigh'],
          seams: 'contrast'
        }
      }
    }
  ];
}
