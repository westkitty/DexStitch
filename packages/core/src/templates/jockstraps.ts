/**
 * Jockstrap Templates
 * Athletic supporters and fashion jocks
 */

import type { GarmentTemplate } from './index';

export function getJockstrapTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'jock-classic-white',
      name: 'Classic Athletic Jockstrap - White',
      category: 'jockstraps',
      description: 'Traditional athletic supporter with wide waistband and support pouch.',
      tags: ['jockstrap', 'athletic', 'classic', 'sports', 'white', 'traditional'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Cotton blend', 'Athletic mesh', 'Moisture-wicking fabric'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-classic-white',
        name: 'Classic Athletic Jock',
        parameters: {
          waistbandWidth: 40,
          pouchStyle: 'contoured',
          legStrapWidth: 25,
          supportLevel: 'medium'
        }
      }
    },
    {
      id: 'jock-bike-style',
      name: 'Bike Style Jockstrap',
      category: 'jockstraps',
      description: 'Iconic jockstrap design inspired by classic Bike brand style.',
      tags: ['jockstrap', 'bike', 'vintage', 'classic', 'retro'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton', 'Cotton/Lycra blend'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-bike-style',
        name: 'Bike Jockstrap',
        parameters: {
          waistbandWidth: 35,
          pouchStyle: 'standard',
          legStrapWidth: 20,
          supportLevel: 'medium'
        }
      }
    },
    {
      id: 'jock-fashion-mesh',
      name: 'Fashion Mesh Jockstrap',
      category: 'jockstraps',
      description: 'See-through mesh jockstrap with contrast trim. Not for athletic use.',
      tags: ['jockstrap', 'fashion', 'mesh', 'sexy', 'sheer', 'see-through'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Athletic mesh', 'Power mesh', 'Fishnet'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-fashion-mesh',
        name: 'Mesh Fashion Jock',
        parameters: {
          waistbandWidth: 30,
          pouchStyle: 'minimalist',
          legStrapWidth: 20,
          supportLevel: 'low',
          sheer: true
        }
      }
    },
    {
      id: 'jock-thong-hybrid',
      name: 'Thong-Back Jockstrap',
      category: 'jockstraps',
      description: 'Modern hybrid with jock pouch and thong back strap.',
      tags: ['jockstrap', 'thong', 'hybrid', 'modern', 'minimal'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Microfiber', 'Modal blend', 'Soft stretch fabric'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-thong-hybrid',
        name: 'Thong Jockstrap',
        parameters: {
          waistbandWidth: 25,
          pouchStyle: 'contoured',
          backStrapStyle: 'thong',
          supportLevel: 'low'
        }
      }
    },
    {
      id: 'jock-cup-pocket',
      name: 'Cup Pocket Jockstrap',
      category: 'jockstraps',
      description: 'Heavy-duty athletic jock with integrated cup pocket for protective cups.',
      tags: ['jockstrap', 'athletic', 'protection', 'cup', 'sports', 'heavy-duty'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Heavy cotton', 'Reinforced athletic fabric', 'Double-layer pouch'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-cup-pocket',
        name: 'Cup Pocket Jock',
        parameters: {
          waistbandWidth: 45,
          pouchStyle: 'cup-pocket',
          legStrapWidth: 30,
          supportLevel: 'high',
          reinforced: true
        }
      }
    },
    {
      id: 'jock-swim',
      name: 'Swim Jockstrap',
      category: 'jockstraps',
      description: 'Water-friendly jockstrap in quick-dry fabric. Perfect for beach or pool.',
      tags: ['jockstrap', 'swim', 'water', 'beach', 'pool', 'quick-dry'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Nylon/Spandex swim fabric', 'Quick-dry polyester', 'Chlorine-resistant'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-swim',
        name: 'Swim Jockstrap',
        parameters: {
          waistbandWidth: 30,
          pouchStyle: 'lined',
          legStrapWidth: 25,
          supportLevel: 'medium',
          waterproof: true
        }
      }
    },
    {
      id: 'jock-metallic',
      name: 'Metallic Jockstrap',
      category: 'jockstraps',
      description: 'Eye-catching metallic fabric jock for parties and showing off.',
      tags: ['jockstrap', 'metallic', 'shiny', 'party', 'fashion', 'flashy'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Metallic spandex', 'Holographic fabric', 'Liquid metal look'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-metallic',
        name: 'Metallic Jockstrap',
        parameters: {
          waistbandWidth: 30,
          pouchStyle: 'contoured',
          legStrapWidth: 25,
          supportLevel: 'low',
          shiny: true
        }
      }
    },
    {
      id: 'jock-wide-band',
      name: 'Wide Band Jockstrap',
      category: 'jockstraps',
      description: 'Modern jock with extra-wide branded waistband for supreme comfort.',
      tags: ['jockstrap', 'wide-band', 'modern', 'comfort', 'designer'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Elastic waistband material', 'Modal blend pouch', 'Soft cotton'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-wide-band',
        name: 'Wide Band Jock',
        parameters: {
          waistbandWidth: 60, // Extra wide
          pouchStyle: 'contoured',
          legStrapWidth: 25,
          supportLevel: 'medium'
        }
      }
    },
    {
      id: 'jock-exposed-elastic',
      name: 'Exposed Elastic Jockstrap',
      category: 'jockstraps',
      description: 'Trendy jock with exposed colored elastic waistband and leg straps.',
      tags: ['jockstrap', 'elastic', 'colorful', 'trendy', 'fashion'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Colored elastic', 'Microfiber pouch', 'Contrast fabrics'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-exposed-elastic',
        name: 'Exposed Elastic Jock',
        parameters: {
          waistbandWidth: 35,
          pouchStyle: 'minimalist',
          legStrapWidth: 25,
          supportLevel: 'low',
          exposedElastic: true,
          contrastColor: true
        }
      }
    },
    {
      id: 'jock-zip-front',
      name: 'Zip-Front Jockstrap',
      category: 'jockstraps',
      description: 'Convenient zip-front opening on pouch for easy access.',
      tags: ['jockstrap', 'zipper', 'zip-front', 'convenient', 'functional'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Durable cotton blend', 'Heavy microfiber', 'Reinforced pouch'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-zip-front',
        name: 'Zip-Front Jockstrap',
        parameters: {
          waistbandWidth: 35,
          pouchStyle: 'zip-front',
          legStrapWidth: 25,
          supportLevel: 'medium',
          zipperLength: 100
        }
      }
    },
    {
      id: 'jock-wide-band-classic',
      name: 'Wide Band Classic Jock',
      category: 'jockstraps',
      description: 'A classic jockstrap updated with a modern wide elastic waistband.',
      tags: ['jockstrap', 'wide-band', 'classic', 'comfort', 'cotton'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton pouch', 'Wide elastic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-wide-band-classic',
        name: 'Wide Band Classic',
        parameters: {
          waistbandWidth: 50,
          pouchMaterial: 'cotton',
          legStraps: 25
        }
      }
    },
    {
      id: 'jock-narrow-band-sport',
      name: 'Narrow Band Sport Jock',
      category: 'jockstraps',
      description: 'Low-profile sport jock with narrow waistband to minimize bulk.',
      tags: ['jockstrap', 'sport', 'minimal', 'lightweight', 'running'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Moisture-wicking mesh', 'Narrow elastic'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-narrow-band-sport',
        name: 'Narrow Band Sport',
        parameters: {
          waistbandWidth: 20,
          pouchBreathability: 'high',
          support: 'medium'
        }
      }
    },
    {
      id: 'jock-mesh-pouch',
      name: 'Full Mesh Pouch Jock',
      category: 'jockstraps',
      description: 'Jockstrap featuring a breathable, see-through mesh pouch.',
      tags: ['jockstrap', 'mesh', 'breathable', 'sexy', 'summer'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Athletic mesh', 'Soft elastic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-mesh-pouch',
        name: 'Mesh Pouch Jock',
        parameters: {
          pouchVisibility: 'sheer',
          airflow: 'max',
          legStraps: 20
        }
      }
    },
    {
      id: 'jock-cotton-retro',
      name: 'Retro Cotton Jock',
      category: 'jockstraps',
      description: 'Vintage style cotton jockstrap reminiscent of 1950s gym gear.',
      tags: ['jockstrap', 'retro', 'vintage', 'cotton', 'old-school'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Heavy cotton jersey', 'Natural rubber elastic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-cotton-retro',
        name: 'Retro Cotton Jock',
        parameters: {
          waistbandColor: 'cream',
          stitchStyle: 'vintage-zigzag',
          pouchShape: 'traditional'
        }
      }
    },
    {
      id: 'jock-strapless-pouch',
      name: 'Strapless Pouch Jock',
      category: 'jockstraps',
      description: 'Minimalist "strapless" design that clips or adheres (C-string style).',
      tags: ['jockstrap', 'strapless', 'minimal', 'tan-lines', 'novelty'],
      difficulty: 'advanced',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Rigid wire core', 'Soft covering fabric'],
      requiredMeasurements: ['hip'],
      spec: {
        id: 'jock-strapless-pouch',
        name: 'Strapless Pouch',
        parameters: {
          tensionStyle: 'internal-frame',
          coverage: 'front-only'
        }
      }
    },
    {
      id: 'jock-lift-support',
      name: 'Lift & Support Jock',
      category: 'jockstraps',
      description: 'Engineered specifically for maximum lift and frontal enhancement.',
      tags: ['jockstrap', 'enhancement', 'lift', 'support', 'push-up'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Stretch cotton', 'Internal sling fabric'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-lift-support',
        name: 'Lift Support Jock',
        parameters: {
          internalSling: true,
          pouchStructure: 'lifting',
          waistbandWidth: 35
        }
      }
    },
    {
      id: 'jock-double-strap',
      name: 'Double Strap Jock',
      category: 'jockstraps',
      description: 'Features double leg straps for a unique aesthetic and extra grip.',
      tags: ['jockstrap', 'double-strap', 'fetish', 'fashion', 'secure'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Elastic', 'Spandex'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-double-strap',
        name: 'Double Strap Jock',
        parameters: {
          strapCount: 2, // per leg
          strapSpacing: 20,
          pouchStyle: 'standard'
        }
      }
    },
    {
      id: 'jock-fashion-neon',
      name: 'Neon Fashion Jock',
      category: 'jockstraps',
      description: 'Bright neon colors for parties and visibility.',
      tags: ['jockstrap', 'neon', 'party', 'fashion', 'bright'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Neon spandex', 'Colored elastic'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-fashion-neon',
        name: 'Neon Fashion Jock',
        parameters: {
          colorParams: 'custom-neon',
          blacklightReactive: true,
          legStraps: 20
        }
      }
    },
    {
      id: 'jock-swim-support',
      name: 'Swim Support Jock',
      category: 'jockstraps',
      description: 'Designed to be worn under board shorts for support.',
      tags: ['jockstrap', 'swim', 'underwear', 'support', 'water'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Chlorine resistant mesh', 'Swim elastic'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-swim-support',
        name: 'Swim Support Jock',
        parameters: {
          quickDry: true,
          saltResistance: true,
          profile: 'low'
        }
      }
    },
    {
      id: 'jock-protective-cup',
      name: 'Protective Cup Jock v2',
      category: 'jockstraps',
      description: 'Updated protective jock with improved cup pocket stability.',
      tags: ['jockstrap', 'protection', 'sports', 'cup', 'safety'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Heavy duty mesh', 'Wide elastic'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-protective-cup',
        name: 'Cup Jock v2',
        parameters: {
          pocketSecure: 'velcro-tab',
          cupSize: 'universal',
          ventilation: true
        }
      }
    },
    {
      id: 'jock-open-back-brief',
      name: 'Open Back Brief Jock',
      category: 'jockstraps',
      description: 'Brief front with a jockstrap-style open back.',
      tags: ['jockstrap', 'hybrid', 'brief-front', 'open-back', 'fashion'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Microfiber', 'Elastic'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-open-back-brief',
        name: 'Open Back Brief Jock',
        parameters: {
          frontCoverage: 'full-brief',
          backStyle: 'jock-straps',
          sideSeam: 50
        }
      }
    },
    {
      id: 'jock-string-back',
      name: 'String Back Jock',
      category: 'jockstraps',
      description: 'Leg straps made of very think string elastic for minimal lines.',
      tags: ['jockstrap', 'string', 'minimal', 'tan-lines', 'revealing'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Round elastic cord', 'Soft pouch fabric'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-string-back',
        name: 'String Back Jock',
        parameters: {
          legStrapType: 'round-cord',
          strapThickness: 3,
          pouchStyle: 'triangle'
        }
      }
    },
    {
      id: 'jock-contrast-binding',
      name: 'Contrast Binding Jock',
      category: 'jockstraps',
      description: 'Jockstrap featuring high contrast color binding on the pouch.',
      tags: ['jockstrap', 'contrast', 'retro', 'fashion', 'binding'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Cotton', 'Contrast bias tape'],
      requiredMeasurements: ['waist', 'hip'],
      spec: {
        id: 'jock-contrast-binding',
        name: 'Contrast Binding Jock',
        parameters: {
          bindingWidth: 10,
          colorCombo: 'custom',
          waistbandMatchBinding: true
        }
      }
    },
    {
      id: 'jock-logo-band',
      name: 'Big Logo Jockstrap',
      category: 'jockstraps',
      description: 'Space for custom branding on a wide waistband.',
      tags: ['jockstrap', 'logo', 'brand', 'merch', 'wide-band'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Jacquard elastic (custom)', 'Cotton pouch'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-logo-band',
        name: 'Big Logo Jock',
        parameters: {
          logoHeight: 40,
          waistbandWidth: 45,
          brandingSpace: true
        }
      }
    },
    {
      id: 'jock-seamless-knit',
      name: 'Seamless Knit Jock',
      category: 'jockstraps',
      description: 'Tubular knit jockstrap with no side seams.',
      tags: ['jockstrap', 'seamless', 'knit', 'modern', 'comfort'],
      difficulty: 'advanced', // Needs specialized equipment/fabric
      estimatedTime: '1 hour', // if knitting machine
      fabricRecommendations: ['Circular knit tube', 'Spandex yarn'],
      requiredMeasurements: ['waist'],
      spec: {
        id: 'jock-seamless-knit',
        name: 'Seamless Knit Jock',
        parameters: {
          seamCount: 0,
          stretchZones: 'integrated',
          waistbandIntegrated: true
        }
      }
    }
  ];
}
