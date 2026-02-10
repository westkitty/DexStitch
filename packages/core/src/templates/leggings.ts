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
    },
    {
      id: 'leggings-compression-full',
      name: 'Pro Compression Tights',
      category: 'leggings',
      description: 'Medical grade compression tights for recovery and performance.',
      tags: ['leggings', 'compression', 'medical', 'recovery', 'pro'],
      difficulty: 'advanced',
      estimatedTime: '4 hours',
      fabricRecommendations: ['High-denier spandex', 'Power mesh'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-compression-full',
        name: 'Pro Compression',
        parameters: {
          compressionGradient: 'graduated',
          footless: true,
          waist: 'drawstring'
        }
      }
    },
    {
      id: 'leggings-cropped-3-4',
      name: '3/4 Training Tights',
      category: 'leggings',
      description: 'Cropped tights that end mid-calf. Popular for basketball and gym.',
      tags: ['leggings', 'cropped', 'training', 'basketball', 'gym'],
      difficulty: 'beginner',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Dri-fit', 'Performance polyester'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-cropped-3-4',
        name: '3/4 Tights',
        parameters: {
          length: 'mid-calf',
          knees: 'articulated',
          waist: 'elastic-logo'
        }
      }
    },
    {
      id: 'leggings-stirrup-gym',
      name: 'Stirrup Gymnastics Pants',
      category: 'leggings',
      description: 'Traditional gymnastics pants with foot stirrups to keep them distinct.',
      tags: ['leggings', 'gymnast', 'stirrup', 'uniform', 'classic'],
      difficulty: 'intermediate',
      estimatedTime: '3.5 hours',
      fabricRecommendations: ['Heavy duty lycra', 'Nylon double-knit'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-stirrup-gym',
        name: 'Stirrup Pants',
        parameters: {
          stirrup: 'elastic',
          crease: 'sewn-in',
          fit: 'straight-leg'
        }
      }
    },
    {
      id: 'leggings-panel-moto',
      name: 'Moto Style Leggings',
      category: 'leggings',
      description: 'Fashion leggings with pintuck detailing at the knees.',
      tags: ['leggings', 'fashion', 'moto', 'streetwear', 'pintuck'],
      difficulty: 'advanced',
      estimatedTime: '5 hours',
      fabricRecommendations: ['Faux leather', 'Coated denim', 'Heavy Ponte'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-panel-moto',
        name: 'Moto Leggings',
        parameters: {
          pintucks: 'knee-thigh',
          zippers: 'ankle',
          waist: 'banded'
        }
      }
    },
    {
      id: 'leggings-base-layer-thermal',
      name: 'Thermal Long Johns',
      category: 'leggings',
      description: 'Classic thermal underwear bottoms for cold weather.',
      tags: ['leggings', 'thermal', 'long-johns', 'winter', 'underwear'],
      difficulty: 'beginner',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Waffle knit', 'Wool blend'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-base-layer-thermal',
        name: 'Long Johns',
        parameters: {
          cuffs: 'ribbed',
          fly: 'functional',
          fit: 'relaxed'
        }
      }
    },
    {
      id: 'leggings-running-pocket',
      name: 'Distance Running Tights',
      category: 'leggings',
      description: 'Tights equipped with multiple pockets for gels and keys.',
      tags: ['leggings', 'running', 'distance', 'pockets', 'utility'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Moisture wicking', 'Reflective print'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-running-pocket',
        name: 'Runner Tights',
        parameters: {
          pocketSide: true,
          pocketBackZip: true,
          ankles: 'zipper'
        }
      }
    },
    {
      id: 'leggings-shorts-hybrid',
      name: '2-in-1 Shorts Leggings',
      category: 'leggings',
      description: 'Leggings with attached shorts for modesty and style.',
      tags: ['leggings', 'hybrid', '2-in-1', 'shorts', 'gym'],
      difficulty: 'intermediate',
      estimatedTime: '4.5 hours',
      fabricRecommendations: ['Shorts: Woven', 'Leggings: Knit'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-shorts-hybrid',
        name: '2-in-1 Leggings',
        parameters: {
          shortsLength: 'mid-thigh',
          waist: 'shared',
          layering: 'attached'
        }
      }
    },
    {
      id: 'leggings-flare-bottom',
      name: 'Flared Yoga Pants',
      category: 'leggings',
      description: 'Retro style yoga pants with a flared leg opening.',
      tags: ['leggings', 'flare', 'yoga', 'retro', 'bootcut'],
      difficulty: 'beginner',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Cotton/Lycra', 'Supplex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-flare-bottom',
        name: 'Flare Leggings',
        parameters: {
          flare: 'bell-bottom',
          waist: 'foldover',
          fit: 'fitted-thigh'
        }
      }
    },
    {
      id: 'leggings-pattern-print',
      name: 'Full Print Leggings',
      category: 'leggings',
      description: 'Simple construction designed to showcase busy prints.',
      tags: ['leggings', 'print', 'fashion', 'simple', 'canvas'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Printed spandex', 'Sublimated poly'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-pattern-print',
        name: 'Print Leggings',
        parameters: {
          seams: 'inside-leg-only',
          waist: 'elastic',
          fit: 'standard'
        }
      }
    },
    {
      id: 'leggings-seamless-knit',
      name: 'Circular Knit Seamless Leggings',
      category: 'leggings',
      description: 'Advanced manufacturing style for seamless comfort.',
      tags: ['leggings', 'seamless', 'knit', 'advanced', 'comfort'],
      difficulty: 'advanced', // Requires circular knitting machine
      estimatedTime: 'Varies',
      fabricRecommendations: ['Yarn', 'Nylon/Spandex thread'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'leggings-seamless-knit',
        name: 'Seamless Leggings',
        parameters: {
          texture: 'mapped',
          waist: 'integrated',
          gusset: 'knit-in'
        }
      }
    }
  ];
}
