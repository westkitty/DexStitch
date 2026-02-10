/**
 * Harness Templates
 * Chest harnesses, body harnesses, and fashion harnesses
 */

import type { GarmentTemplate } from './index';

export function getHarnessTemplates(): GarmentTemplate[] {
  return [
    // Chest Harnesses
    {
      id: 'harness-classic-chest',
      name: 'Classic Chest Harness',
      category: 'harnesses',
      description: 'Timeless leather chest harness with O-rings and adjustable straps. Essential piece for any collection.',
      tags: ['harness', 'chest', 'leather', 'classic', 'adjustable', 'o-ring'],
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Leather 3-4oz', 'Vegan leather', 'Heavy-duty webbing'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-classic-chest',
        name: 'Classic Chest Harness',
        parameters: {
          strapWidth: 25, // 1 inch straps
          oRingSize: 50, // 2 inch O-rings
          backStrapType: 'single',
          hasShoulderStraps: true,
          adjustmentPoints: 4
        }
      }
    },
    {
      id: 'harness-bulldog',
      name: 'Bulldog Style Harness',
      category: 'harnesses',
      description: 'Bold double-strap chest harness inspired by classic bulldog design. Heavy-duty hardware.',
      tags: ['harness', 'chest', 'bulldog', 'heavy-duty', 'double-strap'],
      difficulty: 'advanced',
      estimatedTime: '5-6 hours',
      fabricRecommendations: ['Thick leather 5-6oz', 'Industrial webbing'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-bulldog',
        name: 'Bulldog Harness',
        parameters: {
          strapWidth: 40, // Wide straps
          oRingSize: 60,
          backStrapType: 'double',
          hasShoulderStraps: true,
          adjustmentPoints: 6,
          studded: true
        }
      }
    },
    {
      id: 'harness-minimal-elastic',
      name: 'Minimal Elastic Harness',
      category: 'harnesses',
      description: 'Sleek elastic chest harness with thin straps. Perfect for wear under clothing.',
      tags: ['harness', 'chest', 'elastic', 'minimal', 'subtle', 'thin'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Elastic webbing', 'Stretch nylon', 'Athletic elastic'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-minimal-elastic',
        name: 'Minimal Elastic Harness',
        parameters: {
          strapWidth: 15,
          oRingSize: 25,
          backStrapType: 'single',
          hasShoulderStraps: true,
          adjustmentPoints: 2,
          elastic: true
        }
      }
    },
    {
      id: 'harness-x-back',
      name: 'X-Back Harness',
      category: 'harnesses',
      description: 'Striking X-back design with center ring. Shows off back muscles.',
      tags: ['harness', 'chest', 'x-back', 'show', 'decorative'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Leather', 'Patent leather', 'Shiny PU'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-x-back',
        name: 'X-Back Harness',
        parameters: {
          strapWidth: 25,
          oRingSize: 50,
          backStrapType: 'x-cross',
          hasShoulderStraps: true,
          adjustmentPoints: 4
        }
      }
    },
    {
      id: 'harness-chain-link',
      name: 'Chain Link Harness',
      category: 'harnesses',
      description: 'Edgy harness with chain details mixed with leather straps.',
      tags: ['harness', 'chest', 'chain', 'metal', 'punk', 'edgy'],
      difficulty: 'advanced',
      estimatedTime: '6-7 hours',
      fabricRecommendations: ['Leather strips', 'Metal chain', 'Chrome hardware'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-chain-link',
        name: 'Chain Link Harness',
        parameters: {
          strapWidth: 20,
          oRingSize: 40,
          backStrapType: 'single',
          hasShoulderStraps: true,
          adjustmentPoints: 4,
          chainAccents: true
        }
      }
    },

    // Full Body Harnesses
    {
      id: 'harness-full-body-basic',
      name: 'Full Body Harness - Basic',
      category: 'harnesses',
      description: 'Complete body harness connecting chest, waist, and leg straps.',
      tags: ['harness', 'full-body', 'complete', 'straps', 'coverage'],
      difficulty: 'advanced',
      estimatedTime: '8-10 hours',
      fabricRecommendations: ['Leather', 'Nylon webbing', 'Mixed materials'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'harness-full-body-basic',
        name: 'Full Body Harness',
        parameters: {
          strapWidth: 25,
          oRingSize: 50,
          chestStraps: true,
          waistStraps: true,
          legStraps: true,
          adjustmentPoints: 8
        }
      }
    },
    {
      id: 'harness-cage-style',
      name: 'Cage Body Harness',
      category: 'harnesses',
      description: 'Geometric cage design wrapping torso. Statement piece with intricate strap work.',
      tags: ['harness', 'cage', 'geometric', 'complex', 'fashion'],
      difficulty: 'advanced',
      estimatedTime: '10-12 hours',
      fabricRecommendations: ['Thin leather strips', 'Elastic cording', 'Rope'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-cage-style',
        name: 'Cage Harness',
        parameters: {
          strapWidth: 15,
          oRingSize: 30,
          strapCount: 12,
          geometric: true,
          adjustmentPoints: 6
        }
      }
    },
    {
      id: 'harness-shoulder-accent',
      name: 'Shoulder Accent Harness',
      category: 'harnesses',
      description: 'Asymmetric shoulder harness with single strap crossing chest.',
      tags: ['harness', 'shoulder', 'asymmetric', 'fashion', 'minimal'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Wide leather strap', 'Heavy elastic'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-shoulder-accent',
        name: 'Shoulder Accent Harness',
        parameters: {
          strapWidth: 50,
          oRingSize: 40,
          asymmetric: true,
          singleShoulder: true,
          adjustmentPoints: 3
        }
      }
    },
    {
      id: 'harness-tactical-vest',
      name: 'Tactical Vest Harness',
      category: 'harnesses',
      description: 'Military-inspired tactical harness with utility loops and D-rings.',
      tags: ['harness', 'tactical', 'military', 'utility', 'functional'],
      difficulty: 'advanced',
      estimatedTime: '7-8 hours',
      fabricRecommendations: ['Nylon webbing', 'Ballistic nylon', 'Mil-spec fabric'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-tactical-vest',
        name: 'Tactical Vest Harness',
        parameters: {
          strapWidth: 35,
          oRingSize: 50,
          utilityLoops: true,
          pocketCount: 4,
          adjustmentPoints: 6,
          reinforced: true
        }
      }
    },
    {
      id: 'harness-rope-style',
      name: 'Rope Harness',
      category: 'harnesses',
      description: 'Traditional rope body harness using decorative knot work.',
      tags: ['harness', 'rope', 'bondage', 'traditional', 'knots'],
      difficulty: 'advanced',
      estimatedTime: '5-6 hours',
      fabricRecommendations: ['Cotton rope 6-8mm', 'Jute rope', 'Hemp rope'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-rope-style',
        name: 'Rope Harness',
        parameters: {
          ropeThickness: 8,
          knotStyle: 'decorative',
          chestWraps: 3,
          adjustable: false,
          ropeLengthMeters: 15
        }
      }
    },
    {
      id: 'harness-club-kid',
      name: 'Club Kid Holographic Harness',
      category: 'harnesses',
      description: 'Futuristic holographic harness for parties and festivals.',
      tags: ['harness', 'holographic', 'party', 'festival', 'rave', 'shiny'],
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Holographic vinyl', 'Iridescent PU', 'Reflective webbing'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-club-kid',
        name: 'Holographic Harness',
        parameters: {
          strapWidth: 30,
          oRingSize: 50,
          holographic: true,
          backStrapType: 'single',
          hasShoulderStraps: true,
          adjustmentPoints: 4
        }
      }
    },
    {
      id: 'harness-utility-belt',
      name: 'Utility Belt Harness Combo',
      category: 'harnesses',
      description: 'Chest harness integrated with utility belt for tools or accessories.',
      tags: ['harness', 'utility', 'belt', 'functional', 'tools'],
      difficulty: 'advanced',
      estimatedTime: '6-7 hours',
      fabricRecommendations: ['Heavy leather', 'Industrial webbing', 'Canvas'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-utility-belt',
        name: 'Utility Harness',
        parameters: {
          strapWidth: 40,
          beltWidth: 50,
          oRingSize: 50,
          pockets: true,
          toolLoops: 6,
          adjustmentPoints: 5
        }
      }
    },
    {
      id: 'harness-x-back-leather',
      name: 'X-Back Leather Harness',
      category: 'harnesses',
      description: 'Classic leather harness with a distinct X-shape back design.',
      tags: ['harness', 'leather', 'x-back', 'classic', 'fetish'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Full-grain leather', 'Bonded leather'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-x-back-leather',
        name: 'X-Back Leather Harness',
        parameters: {
          strapWidth: 30,
          ringSize: 45,
          rivetStyle: 'flat',
          adjustable: true
        }
      }
    },
    {
      id: 'harness-y-back-elastic',
      name: 'Y-Back Elastic Harness',
      category: 'harnesses',
      description: 'Sporty Y-back harness made from durable elastic webbing.',
      tags: ['harness', 'elastic', 'sporty', 'y-back', 'party'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Heavy elastic', 'Nylon webbing'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-y-back-elastic',
        name: 'Y-Back Elastic Harness',
        parameters: {
          strapWidth: 40,
          color: 'neon',
          stretch: true,
          ringType: 'd-ring'
        }
      }
    },
    {
      id: 'harness-bulldog-neoprene',
      name: 'Neoprene Bulldog Harness',
      category: 'harnesses',
      description: 'Soft neoprene bulldog harness for comfort during extended wear.',
      tags: ['harness', 'neoprene', 'bulldog', 'comfort', 'play'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Neoprene', 'Scuba fabric'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-bulldog-neoprene',
        name: 'Neoprene Bulldog Harness',
        parameters: {
          strapWidth: 50,
          padded: true,
          closure: 'velcro', // or buckles
          colorConflict: 'contrast-binding'
        }
      }
    },
    {
      id: 'harness-chest-strap-minimal',
      name: 'Minimal Chest Strap',
      category: 'harnesses',
      description: 'Simple horizontal chest strap to accentuate pectorals.',
      tags: ['harness', 'minimal', 'chest', 'simple', 'starter'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Leather', 'Elastic', 'PVC'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-chest-strap-minimal',
        name: 'Minimal Chest Strap',
        parameters: {
          strapWidth: 25,
          buckleLocation: 'back',
          adjustable: true
        }
      }
    },
    {
      id: 'harness-shoulder-caps',
      name: 'Shoulder Cap Harness',
      category: 'harnesses',
      description: 'Harness featuring broader shoulder caps for a gladiator look.',
      tags: ['harness', 'shoulder', 'gladiator', 'costume', 'armor'],
      difficulty: 'advanced',
      estimatedTime: '6 hours',
      fabricRecommendations: ['Thick leather', 'EVA foam (cosplay)'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-shoulder-caps',
        name: 'Shoulder Cap Harness',
        parameters: {
          capWidth: 120,
          articulated: true,
          riveting: 'heavy'
        }
      }
    },
    {
      id: 'harness-full-body-straps',
      name: 'Full Body Strap System',
      category: 'harnesses',
      description: 'Complex system of straps covering torso and thighs.',
      tags: ['harness', 'full-body', 'complex', 'bondage', 'straps'],
      difficulty: 'advanced',
      estimatedTime: '8 hours',
      fabricRecommendations: ['Nylon webbing', 'Leather straps'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'harness-full-body-straps',
        name: 'Full Body Straps',
        parameters: {
          connections: 12,
          adjustableLegs: true,
          torsoLength: 'variable'
        }
      }
    },
    {
      id: 'harness-leg-straps-set',
      name: 'Thigh Harness Set',
      category: 'harnesses',
      description: 'Standalone thigh harnesses, worn as a pair.',
      tags: ['harness', 'legs', 'thighs', 'accessory', 'pair'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Elastic', 'Leather', 'PVC'],
      requiredMeasurements: ['hip'],
      spec: {
        id: 'harness-leg-straps-set',
        name: 'Thigh Harness Set',
        parameters: {
          strapWidth: 20,
          garters: false,
          buckle: true
        }
      }
    },
    {
      id: 'harness-h-style',
      name: 'H-Style Harness',
      category: 'harnesses',
      description: 'Classic H-front design, simple and effective.',
      tags: ['harness', 'h-style', 'classic', 'simple', 'clean'],
      difficulty: 'beginner',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Leather', 'Webbing'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-h-style',
        name: 'H-Style Harness',
        parameters: {
          barHeight: 'mid-chest',
          strapWidth: 30,
          adjustable: true
        }
      }
    },
    {
      id: 'harness-criss-cross',
      name: 'Criss-Cross Chest Harness',
      category: 'harnesses',
      description: 'Multiple straps crossing over the chest for geometric effect.',
      tags: ['harness', 'geometric', 'criss-cross', 'fashion', 'complex'],
      difficulty: 'intermediate',
      estimatedTime: '5 hours',
      fabricRecommendations: ['Thin leather', 'Elastic cord'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-criss-cross',
        name: 'Criss-Cross Harness',
        parameters: {
          crossPoints: 3,
          symmetry: 'radial',
          ringCenter: true
        }
      }
    },
    {
      id: 'harness-suspender-style',
      name: 'Suspender Harness',
      category: 'harnesses',
      description: 'Harness that doubles as heavy-duty suspenders.',
      tags: ['harness', 'suspenders', 'utility', 'dual-purpose', 'fashion'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Elastic webbing', 'Leather ends'],
      requiredMeasurements: ['height', 'chest', 'waist'],
      spec: {
        id: 'harness-suspender-style',
        name: 'Suspender Harness',
        parameters: {
          clipEnd: 'alligator',
          yBack: true,
          width: 35
        }
      }
    },
    {
      id: 'harness-mesh-crop',
      name: 'Mesh Crop Top Harness',
      category: 'harnesses',
      description: 'Hybrid crop top made of wide mesh netting.',
      tags: ['harness', 'mesh', 'crop-top', 'hybrid', 'clubwear'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Large hole mesh', 'Netting'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-mesh-crop',
        name: 'Mesh Crop Harness',
        parameters: {
          holeSize: 20, // mm
          binding: 'contrast',
          cropLength: 300
        }
      }
    },
    {
      id: 'harness-buckle-heavy',
      name: 'Heavy Buckle Harness',
      category: 'harnesses',
      description: 'Harness featuring oversized buckles as the main aesthetic.',
      tags: ['harness', 'buckles', 'industrial', 'heavy', 'statement'],
      difficulty: 'advanced',
      estimatedTime: '5 hours',
      fabricRecommendations: ['Thick leather belt', 'Heavy webbing'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-buckle-heavy',
        name: 'Heavy Buckle Harness',
        parameters: {
          buckleSize: 60, // mm
          buckleCount: 4,
          strapThickness: 4 // mm
        }
      }
    },
    {
      id: 'harness-neon-party',
      name: 'Neon Party Harness',
      category: 'harnesses',
      description: 'UV-reactive harness for club environments.',
      tags: ['harness', 'neon', 'uv', 'party', 'rave'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['UV reactive elastic', 'Fluorescent vinyl'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-neon-party',
        name: 'Neon Party Harness',
        parameters: {
          color: 'UV-Green',
          glowConfig: 'blacklight',
          width: 25
        }
      }
    },
    {
      id: 'harness-reflective-night',
      name: 'Reflective Night Harness',
      category: 'harnesses',
      description: 'Safety-style harness that reflects light, adapted for fashion.',
      tags: ['harness', 'reflective', 'safety', 'night', 'streetwear'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Reflective tape', 'Nylon with reflective strip'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'harness-reflective-night',
        name: 'Reflective Harness',
        parameters: {
          stripWidth: 50,
          reflectiveArea: 'high',
          buckleType: 'plastic-clip'
        }
      }
    },
    {
      id: 'harness-dual-color',
      name: 'Dual Color Reversible Harness',
      category: 'harnesses',
      description: 'Two-tone harness that can be worn inside out.',
      tags: ['harness', 'reversible', 'two-tone', 'versatile', 'fashion'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Bonded leather (two colors)', 'Double-faced elastic'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'harness-dual-color',
        name: 'Dual Color Harness',
        parameters: {
          primaryColor: 'black',
          secondaryColor: 'red',
          reversibleBuckles: true
        }
      }
    }
  ];
}
