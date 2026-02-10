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
    }
  ];
}
