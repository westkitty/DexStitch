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
    },
    {
      id: 'shorts-retro-runner',
      name: 'Retro Runner Shorts',
      category: 'shorts',
      description: '70s style running shorts with curved hems and contrast binding.',
      tags: ['shorts', 'retro', 'runner', '70s', 'classic'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Satin', 'Nylon', 'Lightweight polyester'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-retro-runner',
        name: 'Retro Runner',
        parameters: {
          inseam: 50,
          binding: 'contrast',
          waist: 'elastic',
          hem: 'curved-high'
        }
      }
    },
    {
      id: 'shorts-compression-wrestling',
      name: 'Wrestling Compression Shorts',
      category: 'shorts',
      description: 'Base layer shorts specifically designed for under singlets.',
      tags: ['shorts', 'wrestling', 'base-layer', 'compression', 'protective'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Compression knit', 'Spandex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-compression-wrestling',
        name: 'Wrestling Shorts',
        parameters: {
          inseam: 150,
          cupPocket: true,
          grip: 'silicone-thigh',
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'shorts-booty-style',
      name: 'Booty Shorts',
      category: 'shorts',
      description: 'Minimum coverage shorts that accentuate the glutes.',
      tags: ['shorts', 'booty', 'short', 'sexy', 'dance', 'rave'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Velvet', 'Spandex', 'Metallic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-booty-style',
        name: 'Booty Shorts',
        parameters: {
          inseam: 25,
          rise: 'low',
          fit: 'tight'
        }
      }
    },
    {
      id: 'shorts-rugby-drill',
      name: 'Rugby Drill Shorts',
      category: 'shorts',
      description: 'Heavy duty shorts designed for contact sports training.',
      tags: ['shorts', 'rugby', 'tough', 'heavy-duty', 'sports'],
      difficulty: 'intermediate',
      estimatedTime: '3.5 hours',
      fabricRecommendations: ['Heavy cotton drill', 'Canvas'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-rugby-drill',
        name: 'Rugby Shorts',
        parameters: {
          inseam: 100,
          pockets: true,
          reinforcedSeams: true,
          fabricWeight: 'heavy'
        }
      }
    },
    {
      id: 'shorts-board-swim',
      name: 'Long Board Shorts',
      category: 'shorts',
      description: 'Knee-length surf shorts with a relaxed fit.',
      tags: ['shorts', 'swim', 'board', 'surf', 'long'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Microfiber', 'Quick-dry nylon'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-board-swim',
        name: 'Board Shorts',
        parameters: {
          inseam: 250,
          fly: 'lace-up',
          waist: 'fixed',
          lining: false
        }
      }
    },
    {
      id: 'shorts-split-side-marathon',
      name: 'Elite Marathon Split Shorts',
      category: 'shorts',
      description: 'Maximum freedom of movement with full side splits.',
      tags: ['shorts', 'running', 'marathon', 'split', 'elite'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Ultra-light polyester', 'Tech fabric'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-split-side-marathon',
        name: 'Marathon Shorts',
        parameters: {
          split: 'full-hip',
          liner: 'brief',
          waist: 'drawstring',
          weight: 'ultra-light'
        }
      }
    },
    {
      id: 'shorts-boxing-trunks',
      name: 'Classic Boxing Trunks',
      category: 'shorts',
      description: 'High-waisted trunks with wide elastic band for boxing.',
      tags: ['shorts', 'boxing', 'trunks', 'ring', 'fight'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Satin', 'Polyester'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-boxing-trunks',
        name: 'Boxing Trunks',
        parameters: {
          waistbandWidth: 100, // Very wide
          fit: 'loose',
          length: 'knee',
          slits: 'side'
        }
      }
    },
    {
      id: 'shorts-vale-tudo',
      name: 'Vale Tudo Fight Shorts',
      category: 'shorts',
      description: 'Tight fighting shorts for MMA and grappling.',
      tags: ['shorts', 'mma', 'fight', 'grappling', 'vale-tudo'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Heavy duty spandex', 'Rashguard material'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-vale-tudo',
        name: 'Fight Shorts',
        parameters: {
          fit: 'compression',
          waist: 'drawstring-internal',
          layer: 'double-front'
        }
      }
    },
    {
      id: 'shorts-high-waist-dance',
      name: 'High Waist Dance Shorts',
      category: 'shorts',
      description: 'Form fitting shorts that sit at the natural waist.',
      tags: ['shorts', 'dance', 'high-waist', 'rehearsal', 'studio'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton/Lycra', 'Supplex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-high-waist-dance',
        name: 'Dance Shorts',
        parameters: {
          rise: 'high',
          inseam: 50,
          waistband: 'wide-foldover'
        }
      }
    },
    {
      id: 'shorts-thermal-layer',
      name: 'Thermal Base Shorts',
      category: 'shorts',
      description: 'Mid-thigh thermal shorts for winter layering.',
      tags: ['shorts', 'thermal', 'winter', 'layer', 'warm'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Merino wool', 'Thermal knit'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'shorts-thermal-layer',
        name: 'Thermal Shorts',
        parameters: {
          fit: 'snug',
          length: 'mid-thigh',
          fly: 'functional'
        }
      }
    }
  ];
}
