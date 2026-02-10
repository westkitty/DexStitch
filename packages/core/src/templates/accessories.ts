/**
 * Accessory Templates
 * Arm warmers, leg warmers, headbands, and other accessories
 */

import type { GarmentTemplate } from './index';

export function getAccessoryTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'accessory-arm-warmers',
      name: 'Compression Arm Warmers',
      category: 'accessories',
      description: 'Athletic arm sleeves for sun protection and muscle support.',
      tags: ['accessory', 'arm-warmers', 'sleeves', 'compression', 'athletic'],
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      fabricRecommendations: ['Compression fabric', 'Moisture-wicking polyester', 'UV-protective fabric'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'accessory-arm-warmers',
        name: 'Arm Warmers',
        parameters: {
          length: 400, // Wrist to upper arm
          ease: 0.90,
          gripperTop: true,
          thumbHole: false
        }
      }
    },
    {
      id: 'accessory-leg-warmers',
      name: 'Dance Leg Warmers',
      category: 'accessories',
      description: 'Classic scrunch leg warmers for dance and warm-up.',
      tags: ['accessory', 'leg-warmers', 'dance', 'warm-up', 'retro'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Acrylic knit', 'Wool blend', 'Fleece-lined knit'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-leg-warmers',
        name: 'Leg Warmers',
        parameters: {
          length: 500, // Ankle to knee
          width: 120,
          scrunchable: true,
          ribKnit: true
        }
      }
    },
    {
      id: 'accessory-wrist-cuffs',
      name: 'Leather Wrist Cuffs',
      category: 'accessories',
      description: 'Adjustable leather wrist cuffs with D-ring details.',
      tags: ['accessory', 'wrist-cuffs', 'leather', 'fashion', 'd-ring'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Leather', 'Faux leather', 'Heavy elastic with leather overlay'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-wrist-cuffs',
        name: 'Wrist Cuffs',
        parameters: {
          width: 60,
          dRings: true,
          adjustable: true,
          padding: false
        }
      }
    },
    {
      id: 'accessory-garter-belt',
      name: 'Fashion Garter Belt',
      category: 'accessories',
      description: 'Decorative leg garter with adjustable straps and hardware.',
      tags: ['accessory', 'garter', 'leg', 'fashion', 'adjustable'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Elastic webbing', 'Leather strips', 'Decorative hardware'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-garter-belt',
        name: 'Garter Belt',
        parameters: {
          strapWidth: 25,
          adjustable: true,
          oRings: true,
          legPosition: 'thigh'
        }
      }
    },
    {
      id: 'accessory-collar-buckle',
      name: 'Buckle Collar',
      category: 'accessories',
      description: 'Classic buckle collar with D-ring attachment point.',
      tags: ['accessory', 'collar', 'buckle', 'd-ring', 'adjustable'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Leather', 'Heavy webbing', 'Vegan leather'],
      requiredMeasurements: ['neck'],
      spec: {
        id: 'accessory-collar-buckle',
        name: 'Buckle Collar',
        parameters: {
          width: 30,
          dRing: true,
          buckleType: 'roller',
          adjustable: true,
          padding: false
        }
      }
    },
    {
      id: 'accessory-bicep-bands',
      name: 'Elastic Bicep Bands',
      category: 'accessories',
      description: 'Stretchy arm bands that sit on biceps. Fashion or costume accent.',
      tags: ['accessory', 'bicep-bands', 'arm-bands', 'elastic', 'costume'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Wide elastic', 'Stretch vinyl', 'Neoprene'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-bicep-bands',
        name: 'Bicep Bands',
        parameters: {
          width: 50,
          ease: 0.95,
          decorative: true
        }
      }
    },
    {
      id: 'accessory-headband-sport',
      name: 'Sport Headband',
      category: 'accessories',
      description: 'Moisture-wicking headband to keep sweat out of eyes during workouts.',
      tags: ['accessory', 'headband', 'sport', 'sweatband', 'athletic'],
      difficulty: 'beginner',
      estimatedTime: '30 minutes',
      fabricRecommendations: ['Moisture-wicking fabric', 'Terry cloth', 'Stretchy athletic blend'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-headband-sport',
        name: 'Sport Headband',
        parameters: {
          width: 50,
          length: 500,
          elastic: true,
          absorbent: true
        }
      }
    },
    {
      id: 'accessory-knee-pads',
      name: 'Compression Knee Sleeves',
      category: 'accessories',
      description: 'Supportive knee sleeves for protection and compression.',
      tags: ['accessory', 'knee-pads', 'compression', 'support', 'athletic', 'protection'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Neoprene', 'Compression fabric', 'Padded athletic fabric'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-knee-pads',
        name: 'Knee Sleeves',
        parameters: {
          length: 200,
          ease: 0.92,
          padding: true,
          gripperTop: true,
          gripperBottom: true
        }
      }
    },
    {
      id: 'accessory-hood-wrestling',
      name: 'Wrestling Hood',
      category: 'accessories',
      description: 'Lycra hood for warm-up or ring entrance.',
      tags: ['accessory', 'hood', 'wrestling', 'warm-up', 'costume'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Lycra', 'Spandex'],
      requiredMeasurements: ['neck'],
      spec: {
        id: 'accessory-hood-wrestling',
        name: 'Wrestling Hood',
        parameters: {
          faceOpening: 'full',
          neckLength: 'collarbone',
          fit: 'snug'
        }
      }
    },
    {
      id: 'accessory-kneepad-sleeve',
      name: 'Wrestling Knee Pad Sleeve',
      category: 'accessories',
      description: 'Protective sleeve with padding space for knees.',
      tags: ['accessory', 'knee-pad', 'wrestling', 'protection', 'joint'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Neoprene', 'Heavy elastic'],
      requiredMeasurements: ['hip'],
      spec: {
        id: 'accessory-kneepad-sleeve',
        name: 'Knee Pad',
        parameters: {
          paddingThickness: 10,
          length: 250,
          ventilation: 'back-mesh'
        }
      }
    },
    {
      id: 'accessory-elbow-sleeve',
      name: 'Compression Elbow Sleeve',
      category: 'accessories',
      description: 'Supportive sleeve for elbows during heavy lifting.',
      tags: ['accessory', 'elbow', 'compression', 'lifting', 'support'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Compression knit', 'Elastic'],
      requiredMeasurements: [],
     spec: {
        id: 'accessory-elbow-sleeve',
        name: 'Elbow Sleeve',
        parameters: {
          compression: 'high',
          length: 200,
          contour: 'bent-arm'
        }
      }
    },
    {
      id: 'accessory-shin-guard-sleeve',
      name: 'Shin Guard Sleeve',
      category: 'accessories',
      description: 'Fabric sleeve to hold shin guards in place.',
      tags: ['accessory', 'shin-guard', 'soccer', 'sports', 'protection'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Spandex', 'Athletic mesh'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-shin-guard-sleeve',
        name: 'Shin Sleeve',
        parameters: {
          pocket: 'front-internal',
          stirrup: true,
          topGrip: 'silicone'
        }
      }
    },
    {
      id: 'accessory-face-mask-sport',
      name: 'Sport Face Mask',
      category: 'accessories',
      description: 'Breathable face covering for training.',
      tags: ['accessory', 'mask', 'sport', 'face', 'breathable'],
      difficulty: 'beginner',
      estimatedTime: '0.5 hours',
      fabricRecommendations: ['Neoprene', 'Mesh'],
      requiredMeasurements: ['neck'],
      spec: {
        id: 'accessory-face-mask-sport',
        name: 'Sport Mask',
        parameters: {
          earLoops: 'integrated',
          filterPocket: true,
          noseWire: true
        }
      }
    },
    {
      id: 'accessory-belt-lifting',
      name: 'Soft Lifting Belt',
      category: 'accessories',
      description: 'Fabric weightlifting belt with velcro closure.',
      tags: ['accessory', 'belt', 'lifting', 'support', 'gym'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Heavy nylon', 'Webbing core'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'accessory-belt-lifting',
        name: 'Lifting Belt',
        parameters: {
          widthBack: 100,
          widthFront: 60,
          closure: 'velcro-wrap'
        }
      }
    },
    {
      id: 'accessory-ankle-support',
      name: 'Ankle Support Wrap',
      category: 'accessories',
      description: 'Wrap-around support for weak ankles.',
      tags: ['accessory', 'ankle', 'support', 'medical', 'sport'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Elastic bandage', 'Neoprene'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-ankle-support',
        name: 'Ankle Wrap',
        parameters: {
          style: 'figure-8',
          closure: 'velcro',
          heel: 'open'
        }
      }
    },
    {
      id: 'accessory-wrist-wrap-heavy',
      name: 'Heavy Wrist Wrap',
      category: 'accessories',
      description: 'Stiff wrist wraps for maximum stability.',
      tags: ['accessory', 'wrist', 'lifting', 'heavy', 'support'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Heavy elastic', 'Canvas'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-wrist-wrap-heavy',
        name: 'Wrist Wrap',
        parameters: {
          length: 500,
          width: 80,
          thumbLoop: true
        }
      }
    },
    {
      id: 'accessory-sweatband-head',
      name: 'Tapered Head Tie',
      category: 'accessories',
      description: 'Tie-back headband for tennis and running.',
      tags: ['accessory', 'headband', 'tennis', 'ninja', 'tie'],
      difficulty: 'beginner',
      estimatedTime: '0.5 hours',
      fabricRecommendations: ['Dri-fit', 'Microfiber'],
      requiredMeasurements: ['neck'],
      spec: {
        id: 'accessory-sweatband-head',
        name: 'Head Tie',
        parameters: {
          length: 900,
          taper: 'center-wide',
          branding: 'front'
        }
      }
    },
    {
      id: 'accessory-compression-calf',
      name: 'Calf Compression Sleeve',
      category: 'accessories',
      description: 'Graduated compression sleeve for lower legs.',
      tags: ['accessory', 'calf', 'compression', 'runner', 'recovery'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Circular knit spandex', 'Compression lycra'],
      requiredMeasurements: [],
      spec: {
        id: 'accessory-compression-calf',
        name: 'Calf Sleeve',
        parameters: {
          compression: '20-30mmHg',
          length: 'knee-to-ankle',
          topBand: 'wide'
        }
      }
    }
  ];
}
