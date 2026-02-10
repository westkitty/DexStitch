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
    },
    {
      id: 'bodysuit-leotard-classic',
      name: 'Classic Dance Leotard',
      category: 'bodysuits',
      description: 'The standard for dance and gymnastics. Long sleeve, scoop neck.',
      tags: ['bodysuit', 'leotard', 'dance', 'classic', 'gymnastics'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Cotton/Lycra', 'Nylon/Spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-leotard-classic',
        name: 'Classic Leotard',
        parameters: {
          sleeves: 'long',
          legCut: 'ballet',
          neckline: 'scoop-front-back'
        }
      }
    },
    {
      id: 'bodysuit-short-sleeve-gym',
      name: 'Short Sleeve Gym Bodysuit',
      category: 'bodysuits',
      description: 'Versatile bodysuit for gymnastics or aerobics.',
      tags: ['bodysuit', 'gym', 'short-sleeve', 'aerobics', 'sport'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Shiny Lycra', 'Velvet'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-short-sleeve-gym',
        name: 'Gym Bodysuit',
        parameters: {
          sleeves: 'short',
          mechanics: 'gusseted',
          legCut: 'moderate'
        }
      }
    },
    {
      id: 'bodysuit-hooded-wrestler',
      name: 'Hooded Wrestling Bodysuit',
      category: 'bodysuits',
      description: 'Full body suit with an integrated hood for ring entrances.',
      tags: ['bodysuit', 'wrestling', 'hooded', 'costume', 'entrance'],
      difficulty: 'advanced',
      estimatedTime: '6 hours',
      fabricRecommendations: ['Heavy vinyl', 'Spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'neck'],
      spec: {
        id: 'bodysuit-hooded-wrestler',
        name: 'Hooded Bodysuit',
        parameters: {
          hood: true,
          zipper: 'front-full',
          legLength: 'ankle'
        }
      }
    },
    {
      id: 'bodysuit-zip-front-mock',
      name: 'Mock Neck Zip Bodysuit',
      category: 'bodysuits',
      description: 'Sleek bodysuit with a mock neck and functional front zipper.',
      tags: ['bodysuit', 'mock-neck', 'zipper', 'fashion', 'surf'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Neoprene (thin)', 'Scuba knit'],
      requiredMeasurements: ['chest', 'waist', 'neck'],
      spec: {
        id: 'bodysuit-zip-front-mock',
        name: 'Mock Zip Bodysuit',
        parameters: {
          neckline: 'mock',
          zipperLength: 350,
          sleeves: 'long'
        }
      }
    },
    {
      id: 'bodysuit-turtleneck-dance',
      name: 'Turtleneck Dance Bodysuit',
      category: 'bodysuits',
      description: 'Elegant turtleneck bodysuit, often used in contemporary dance.',
      tags: ['bodysuit', 'turtleneck', 'dance', 'elegant', 'stage'],
      difficulty: 'intermediate',
      estimatedTime: '3.5 hours',
      fabricRecommendations: ['Fine mesh', 'Microfiber'],
      requiredMeasurements: ['chest', 'waist', 'neck'],
      spec: {
        id: 'bodysuit-turtleneck-dance',
        name: 'Turtleneck Bodysuit',
        parameters: {
          neckline: 'turtleneck',
          closure: 'keyhole-back',
          sleeves: 'long'
        }
      }
    },
    {
      id: 'bodysuit-thong-back',
      name: 'Thong Back Bodysuit',
      category: 'bodysuits',
      description: 'Bodysuit with thong back to eliminate panty lines under bottoms.',
      tags: ['bodysuit', 'thong', 'layering', 'minimal', 'no-show'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Stretch rayon', 'Modal'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-thong-back',
        name: 'Thong Bodysuit',
        parameters: {
          backCut: 'thong',
          snapCrotch: true,
          legCut: 'high'
        }
      }
    },
    {
      id: 'bodysuit-panelled-hero',
      name: 'Superhero Panel Bodysuit',
      category: 'bodysuits',
      description: 'Complex pattern with muscle-shading panels for cosplay.',
      tags: ['bodysuit', 'cosplay', 'superhero', 'costume', 'complex'],
      difficulty: 'advanced',
      estimatedTime: '10 hours',
      fabricRecommendations: ['4-way stretch vinyl', 'Specialty spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-panelled-hero',
        name: 'Hero Bodysuit',
        parameters: {
          panels: 'muscle-contour',
          zipper: 'invisible-back',
          gloves: 'integrated'
        }
      }
    },
    {
      id: 'bodysuit-wetsuit-style',
      name: 'Wetsuit Style Bodysuit',
      category: 'bodysuits',
      description: 'Fashion bodysuit inspired by surfing wetsuits. Panel detailing.',
      tags: ['bodysuit', 'wetsuit', 'surf', 'fashion', 'panel'],
      difficulty: 'advanced',
      estimatedTime: '6 hours',
      fabricRecommendations: ['Scuba', 'Neoprene', 'Color-block lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-wetsuit-style',
        name: 'Wetsuit Bodysuit',
        parameters: {
          seams: 'flatlock-contrast',
          colorBlock: true,
          zipper: 'back-pull-cord'
        }
      }
    },
    {
      id: 'bodysuit-gymnastics-comp',
      name: 'Competition Gym Leotard',
      category: 'bodysuits',
      description: 'Sparkly, foil-fabric leotard for gymnastics competitions.',
      tags: ['bodysuit', 'gymnastics', 'competition', 'sparkle', 'foil'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Mystique foil', 'Hologram spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-gymnastics-comp',
        name: 'Comp Leotard',
        parameters: {
          scrunchieMatch: true,
          sleeves: '3/4',
          neckline: 'jewel'
        }
      }
    },
    {
      id: 'bodysuit-cycling-skin',
      name: 'Cycling Skinsuit',
      category: 'bodysuits',
      description: 'Aerodynamic one-piece for time trial cycling.',
      tags: ['bodysuit', 'cycling', 'skinsuit', 'aero', 'speed'],
      difficulty: 'advanced',
      estimatedTime: '6 hours',
      fabricRecommendations: ['Dimpled aero fabric', 'Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'bodysuit-cycling-skin',
        name: 'Cycling Skinsuit',
        parameters: {
          chamois: 'integrated',
          grippers: 'silicone-leg',
          zipper: 'front-hidden'
        }
      }
    }
  ];
}
