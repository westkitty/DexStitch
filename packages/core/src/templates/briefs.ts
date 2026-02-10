/**
 * Brief Templates
 * Underwear briefs, bikini briefs, and athletic briefs
 */

import type { GarmentTemplate } from './index';

export function getBriefTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'brief-classic-bikini',
      name: 'Classic Bikini Brief',
      category: 'briefs',
      description: 'Low-rise bikini brief with moderate coverage. Comfortable everyday wear.',
      tags: ['brief', 'bikini', 'low-rise', 'everyday', 'comfort'],
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      fabricRecommendations: ['Cotton/Spandex blend', 'Modal', 'Microfiber'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-classic-bikini',
        name: 'Bikini Brief',
        parameters: {
          rise: 'low',
          legCut: 'high',
          waistbandWidth: 25,
          coverage: 'moderate'
        }
      }
    },
    {
      id: 'brief-contour-pouch',
      name: 'Contoured Pouch Brief',
      category: 'briefs',
      description: '3D contoured pouch design provides support and definition.',
      tags: ['brief', 'contoured', 'pouch', 'support', '3d'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Microfiber with Lycra', 'Modal blend', 'Performance fabric'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-contour-pouch',
        name: 'Contoured Brief',
        parameters: {
          rise: 'mid',
          legCut: 'moderate',
          waistbandWidth: 30,
          coverage: 'full',
          pouchType: '3d-contoured'
        }
      }
    },
    {
      id: 'brief-athletic-compression',
      name: 'Athletic Compression Brief',
      category: 'briefs',
      description: 'High-performance compression brief for sports and active wear.',
      tags: ['brief', 'athletic', 'compression', 'sports', 'performance'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Compression polyester', 'Moisture-wicking blend', 'Athletic Lycra'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-athletic-compression',
        name: 'Compression Brief',
        parameters: {
          rise: 'mid',
          legCut: 'low',
          waistbandWidth: 35,
          coverage: 'full',
          compression: true
        }
      }
    },
    {
      id: 'brief-string-side',
      name: 'String Side Brief',
      category: 'briefs',
      description: 'Minimal brief with string sides for adjustable fit and minimal tan lines.',
      tags: ['brief', 'string', 'minimal', 'tan-line-free', 'adjustable'],
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      fabricRecommendations: ['Lightweight microfiber', 'Stretch mesh', 'Sheer fabric'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'brief-string-side',
        name: 'String Brief',
        parameters: {
          rise: 'low',
          legCut: 'high',
          waistbandWidth: 15,
          coverage: 'minimal',
          sideTies: true
        }
      }
    },
    {
      id: 'brief-mid-rise-comfort',
      name: 'Mid-Rise Comfort Brief',
      category: 'briefs',
      description: 'Traditional mid-rise brief with full coverage and no-roll waistband.',
      tags: ['brief', 'mid-rise', 'comfort', 'traditional', 'full-coverage'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Soft cotton', 'Bamboo blend', 'Modal'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-mid-rise-comfort',
        name: 'Comfort Brief',
        parameters: {
          rise: 'mid',
          legCut: 'moderate',
          waistbandWidth: 35,
          coverage: 'full',
          noRoll: true
        }
      }
    },
    {
      id: 'brief-square-cut',
      name: 'Square Cut Brief',
      category: 'briefs',
      description: 'Square-leg design inspired by swim briefs. Retro aesthetic.',
      tags: ['brief', 'square-cut', 'retro', 'swim-inspired', 'vintage'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Swim fabric', 'Nylon/Spandex', 'Quick-dry material'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-square-cut',
        name: 'Square Cut Brief',
        parameters: {
          rise: 'low',
          legCut: 'square',
          waistbandWidth: 30,
          coverage: 'moderate',
          legLength: 50 // Longer leg
        }
      }
    },
    {
      id: 'brief-boxer-brief-short',
      name: 'Short Boxer Brief',
      category: 'briefs',
      description: 'Boxer brief with shorter 3-inch inseam. Best of both worlds.',
      tags: ['brief', 'boxer-brief', 'short', 'hybrid', 'sporty'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Cotton/Modal blend', 'Performance jersey', 'Stretch cotton'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-boxer-brief-short',
        name: 'Short Boxer Brief',
        parameters: {
          rise: 'mid',
          legCut: 'boxer',
          waistbandWidth: 35,
          coverage: 'full',
          inseam: 75 // 3 inches
        }
      }
    },
    {
      id: 'brief-enhancing-push-up',
      name: 'Enhancing Push-Up Brief',
      category: 'briefs',
      description: 'Anatomically designed brief with lift and enhancement features.',
      tags: ['brief', 'enhancing', 'push-up', 'lift', 'padded'],
      difficulty: 'advanced',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Stretchy microfiber', 'Padded lining', 'Firm elastic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-enhancing-push-up',
        name: 'Enhancing Brief',
        parameters: {
          rise: 'low',
          legCut: 'high',
          waistbandWidth: 30,
          coverage: 'moderate',
          pouchType: 'push-up',
          padded: true
        }
      }
    },
    {
      id: 'brief-open-back',
      name: 'Open Back Brief',
      category: 'briefs',
      description: 'Cheeky brief with exposed back for minimal coverage.',
      tags: ['brief', 'open-back', 'cheeky', 'minimal', 'revealing'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Stretch lace', 'Sheer mesh', 'Elastic trim'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'brief-open-back',
        name: 'Open Back Brief',
        parameters: {
          rise: 'low',
          legCut: 'high',
          waistbandWidth: 25,
          coverage: 'minimal',
          backStyle: 'open'
        }
      }
    },
    {
      id: 'brief-g-string',
      name: 'G-String Brief',
      category: 'briefs',
      description: 'Minimal g-string with tiny back strap. Nearly invisible under clothing.',
      tags: ['brief', 'g-string', 'minimal', 'invisible', 'no-line'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Microfiber', 'Seamless knit', 'Ultra-thin elastic'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'brief-g-string',
        name: 'G-String',
        parameters: {
          rise: 'low',
          legCut: 'high',
          waistbandWidth: 15,
          coverage: 'minimal',
          backStyle: 'g-string'
        }
      }
    },
    {
      id: 'brief-classic-white',
      name: 'Classic White Brief',
      category: 'briefs',
      description: 'The archetype of men\'s underwear. High rise, full coverage.',
      tags: ['brief', 'classic', 'white', 'traditional', 'cotton'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['100% Cotton rib', 'Cotton/poly blend'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-classic-white',
        name: 'Classic White Brief',
        parameters: {
          rise: 'high',
          fly: 'y-front',
          legCut: 'low',
          waistbandWidth: 30
        }
      }
    },
    {
      id: 'brief-bikini-cut',
      name: 'Modern Bikini Brief',
      category: 'briefs',
      description: 'Low rise brief with high cut legs for a modern silhouette.',
      tags: ['brief', 'bikini', 'modern', 'low-rise', 'sexy'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Microfiber', 'Modal', 'Bamboo'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-bikini-cut',
        name: 'Bikini Brief',
        parameters: {
          rise: 'low',
          legCut: 'high',
          coverage: 'moderate',
          waistbandWidth: 20
        }
      }
    },
    {
      id: 'brief-sport-mesh',
      name: 'Sport Mesh Brief',
      category: 'briefs',
      description: 'Breathable mesh brief designed for high-intensity activities.',
      tags: ['brief', 'sport', 'mesh', 'athletic', 'breathable'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Athletic mesh', 'Coolmax', 'Performance nylon'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-sport-mesh',
        name: 'Sport Mesh Brief',
        parameters: {
          ventilation: 'max',
          support: 'high',
          moistureWicking: true,
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'brief-low-rise-trunk',
      name: 'Low Rise Trunk',
      category: 'briefs',
      description: 'Square cut trunk with a shorter leg and low rise waistband.',
      tags: ['brief', 'trunk', 'low-rise', 'square-cut', 'modern'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton/Elastane', 'Modal/Spandex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-low-rise-trunk',
        name: 'Low Rise Trunk',
        parameters: {
          inseam: 40,
          rise: 'low',
          legCut: 'square'
        }
      }
    },
    {
      id: 'brief-boxer-brief-hybrid',
      name: 'Boxer Brief Hybrid',
      category: 'briefs',
      description: 'Combines the support of a brief with the coverage of a boxer.',
      tags: ['brief', 'boxer-brief', 'hybrid', 'support', 'coverage'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Cotton jersey', 'Performance blend'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-boxer-brief-hybrid',
        name: 'Boxer Brief Hybrid',
        parameters: {
          inseam: 100,
          pouch: 'articulated',
          legGrip: false
        }
      }
    },
    {
      id: 'brief-womens-boy-short',
      name: 'Women\'s Boy Short',
      category: 'briefs',
      description: 'Full coverage women\'s brief with a square leg cut.',
      tags: ['brief', 'womens', 'boy-short', 'coverage', 'comfortable'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Cotton/Spandex', 'System jersey'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-womens-boy-short',
        name: 'Boy Short',
        parameters: {
          rise: 'mid',
          legCut: 'square',
          gusset: 'lined'
        }
      }
    },
    {
      id: 'brief-womens-high-cut',
      name: 'Women\'s High Cut Brief',
      category: 'briefs',
      description: '80s inspired high cut leg opening to elongate the legs.',
      tags: ['brief', 'womens', 'high-cut', 'retro', '80s'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Nylon tricot', 'Cotton blend'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-womens-high-cut',
        name: 'High Cut Brief',
        parameters: {
          legHeight: 'extra-high',
          rise: 'high',
          waistband: 'elastic-encased'
        }
      }
    },
    {
      id: 'brief-swim-racer',
      name: 'Competitive Swim Brief',
      category: 'briefs',
      description: 'Tight fitting, low drag brief for competitive swimming.',
      tags: ['brief', 'swim', 'competitive', 'speed', 'racing'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Chlorine resistant polyester', 'PBT'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-swim-racer',
        name: 'Swim Racer',
        parameters: {
          drag: 'low',
          drawstring: true,
          lining: 'front-only',
          sideSeam: 30 // minimal
        }
      }
    },
    {
      id: 'brief-pouch-enhanced',
      name: 'Pouch Enhanced Brief',
      category: 'briefs',
      description: 'Anatomically contoured pouch for maximum comfort and enhancement.',
      tags: ['brief', 'pouch', 'enhanced', 'comfort', 'contour'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Modal', 'Bamboo rayon'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-pouch-enhanced',
        name: 'Pouch Enhanced Brief',
        parameters: {
          pouchVolume: 'extra',
          seamShape: 'u-shape',
          forwardProjection: true
        }
      }
    },
    {
      id: 'brief-seamless-micro',
      name: 'Seamless Micro Brief',
      category: 'briefs',
      description: 'Minimalist brief with bonded edges for no visible panty line.',
      tags: ['brief', 'seamless', 'micro', 'invisible', 'smooth'],
      difficulty: 'advanced', // Requires bonding equipment/glue
      estimatedTime: '2 hours',
      fabricRecommendations: ['Laser cut microfiber', 'Bonding tape'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-seamless-micro',
        name: 'Seamless Micro Brief',
        parameters: {
          seams: 'none', // bonded
          fabricEdge: 'raw-cut',
          rise: 'low'
        }
      }
    },
    {
      id: 'brief-thermal-base',
      name: 'Thermal Base Layer Brief',
      category: 'briefs',
      description: 'Warm, insulating brief for cold weather base layering.',
      tags: ['brief', 'thermal', 'warm', 'base-layer', 'winter'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Merino wool', 'Thermal waffle knit'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-thermal-base',
        name: 'Thermal Brief',
        parameters: {
          insulation: 'medium',
          rise: 'mid',
          fly: 'functional'
        }
      }
    },
    {
      id: 'brief-retro-fly',
      name: 'Retro Fly Front Brief',
      category: 'briefs',
      description: 'Vintage styled brief with a functional button fly.',
      tags: ['brief', 'retro', 'fly', 'button', 'vintage'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Cotton lawn', 'Lightweight jersey'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-retro-fly',
        name: 'Retro Fly Brief',
        parameters: {
          flyType: 'button',
          buttonCount: 2,
          waistband: 'gathered'
        }
      }
    },
    {
      id: 'brief-side-tie-swim',
      name: 'Side Tie Swim Brief',
      category: 'briefs',
      description: 'Adjustable swim brief with ties at both hips.',
      tags: ['brief', 'swim', 'beach', 'adjustable', 'tie-side'],
      difficulty: 'advanced', // Construction of ties can be tricky
      estimatedTime: '2 hours',
      fabricRecommendations: ['Swimspandex', 'Lycra'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-side-tie-swim',
        name: 'Side Tie Brief',
        parameters: {
          sideStyle: 'tie',
          coverage: 'scanty',
          lining: 'full'
        }
      }
    },
    {
      id: 'brief-high-waist-control',
      name: 'High Waist Control Brief',
      category: 'briefs',
      description: 'High-waisted brief offering light tummy control.',
      tags: ['brief', 'high-waist', 'control', 'shapewear', 'womens'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Power mesh', 'Firm spandex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-high-waist-control',
        name: 'Control Brief',
        parameters: {
          rise: 'ultra-high',
          controlPanel: 'front',
          legCut: 'low'
        }
      }
    },
    {
      id: 'brief-cheeky-cut',
      name: 'Cheeky Cut Brief',
      category: 'briefs',
      description: 'Brief with a gathered back seam to accentuate the glutes.',
      tags: ['brief', 'cheeky', 'ruched', 'flattering', 'fun'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Soft lace', 'Jersey'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'brief-cheeky-cut',
        name: 'Cheeky Brief',
        parameters: {
          backSeam: 'ruched',
          coverage: 'cheeky',
          rise: 'low'
        }
      }
    }
  ];
}
