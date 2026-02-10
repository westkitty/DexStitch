/**
 * Tank Top Templates
 * Sleeveless shirts, muscle tanks, and athletic tanks
 */

import type { GarmentTemplate } from './index';

export function getTankTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'tank-muscle-stringer',
      name: 'Muscle Stringer Tank',
      category: 'tanks',
      description: 'Ultra-low cut stringer tank with thin straps. Shows maximum muscle definition.',
      tags: ['tank', 'stringer', 'muscle', 'gym', 'bodybuilding', 'low-cut'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton jersey', 'Tri-blend', 'Moisture-wicking'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-muscle-stringer',
        name: 'Stringer Tank',
        parameters: {
          armholeDepth: 250, // Very deep
          neckDepth: 180, // Low scoop
          strapWidth: 20, // Thin straps
          hem: 'curved'
        }
      }
    },
    {
      id: 'tank-classic-athletic',
      name: 'Classic Athletic Tank',
      category: 'tanks',
      description: 'Traditional athletic tank with moderate armholes. Versatile everyday wear.',
      tags: ['tank', 'athletic', 'classic', 'everyday', 'casual'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Cotton', 'Cotton/Poly blend', 'Jersey knit'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-classic-athletic',
        name: 'Athletic Tank',
        parameters: {
          armholeDepth: 200,
          neckDepth: 100,
          strapWidth: 40,
          hem: 'straight'
        }
      }
    },
    {
      id: 'tank-racerback',
      name: 'Racerback Tank',
      category: 'tanks',
      description: 'Y-back design that stays in place during workouts.',
      tags: ['tank', 'racerback', 'y-back', 'workout', 'fitted'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Performance blend', 'Moisture-wicking', 'Stretchy athletic fabric'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-racerback',
        name: 'Racerback Tank',
        parameters: {
          armholeDepth: 180,
          neckDepth: 120,
          backStyle: 'racerback',
          hem: 'curved'
        }
      }
    },
    {
      id: 'tank-mesh-overlay',
      name: 'Mesh Overlay Tank',
      category: 'tanks',
      description: 'Fashion tank with sheer mesh overlay panel. Club and festival ready.',
      tags: ['tank', 'mesh', 'fashion', 'club', 'sheer', 'overlay'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Cotton base', 'Mesh overlay', 'Contrast fabrics'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-mesh-overlay',
        name: 'Mesh Overlay Tank',
        parameters: {
          armholeDepth: 220,
          neckDepth: 140,
          strapWidth: 50,
          meshPanel: true,
          hem: 'straight'
        }
      }
    },
    {
      id: 'tank-dropped-armhole',
      name: 'Dropped Armhole Tank',
      category: 'tanks',
      description: 'Oversized armholes that drop to ribcage. Breezy summer style.',
      tags: ['tank', 'dropped-armhole', 'oversized', 'summer', 'relaxed'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Lightweight cotton', 'Linen blend', 'Rayon jersey'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'tank-dropped-armhole',
        name: 'Dropped Armhole Tank',
        parameters: {
          armholeDepth: 300, // Extreme drop
          neckDepth: 150,
          strapWidth: 60,
          hem: 'curved',
          looseFit: true
        }
      }
    },
    {
      id: 'tank-stringer-bodybuilding',
      name: 'Pro Bodybuilding Stringer',
      category: 'tanks',
      description: 'The thinnest straps possible. Minimal coverage for maximal flex.',
      tags: ['tank', 'stringer', 'pro', 'bodybuilding', 'minimal'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Cotton/Spandex', 'Rayon'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-stringer-bodybuilding',
        name: 'Pro Stringer',
        parameters: {
          strapWidth: 10, // extremely thin
          nippleExposure: 'possible',
          hem: 'raw-edge'
        }
      }
    },
    {
      id: 'tank-racerback-running',
      name: 'Running Racerback',
      category: 'tanks',
      description: 'Lightweight runner\'s tank with reflective details.',
      tags: ['tank', 'running', 'racerback', 'cardio', 'reflective'],
      difficulty: 'intermediate',
      estimatedTime: '2.5 hours',
      fabricRecommendations: ['Micro-mesh', 'Dri-fit'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-racerback-running',
        name: 'Run Racerback',
        parameters: {
          reflectivestrips: true,
          ventilation: 'back-panel',
          chafing: 'zero'
        }
      }
    },
    {
      id: 'tank-muscle-deep-cut',
      name: 'Deep Cut Muscle Tank',
      category: 'tanks',
      description: 'Side openings extend down to the waist. Great for showing off obliques.',
      tags: ['tank', 'muscle', 'deep-cut', 'side-boob', 'gym'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['Variable knit', 'Slub cotton'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-muscle-deep-cut',
        name: 'Deep Cut Muscle',
        parameters: {
          sideDrop: 'waist-level',
          neckline: 'crew',
          fit: 'box'
        }
      }
    },
    {
      id: 'tank-crop-mesh',
      name: 'Mesh Crop Tank',
      category: 'tanks',
      description: 'Cropped length tank made entirely of mesh.',
      tags: ['tank', 'crop', 'mesh', 'party', 'breathable'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Large gauge mesh', 'Fishnet'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-crop-mesh',
        name: 'Mesh Crop',
        parameters: {
          length: 'crop-rib',
          edgeFinish: 'binding',
          sheer: true
        }
      }
    },
    {
      id: 'tank-ribbed-undershirt',
      name: 'Classic Ribbed Undershirt',
      category: 'tanks',
      description: 'The standard "wife beater" style tank. Form fitting ribbed cotton.',
      tags: ['tank', 'undershirt', 'ribbed', 'classic', 'layering'],
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      fabricRecommendations: ['2x1 Cotton Rib'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-ribbed-undershirt',
        name: 'Ribbed Tank',
        parameters: {
          fit: 'tight',
          fabricStretch: 'high',
          binding: 'self-fabric'
        }
      }
    },
    {
      id: 'tank-square-neck-retro',
      name: 'Square Neck Retro Tank',
      category: 'tanks',
      description: 'Vintage style tank with a squared-off neckline.',
      tags: ['tank', 'retro', 'square-neck', '70s', 'vintage'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Terry cloth', 'Velour'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-square-neck-retro',
        name: 'Square Neck Tank',
        parameters: {
          neckShape: 'square',
          strapstyle: 'wide',
          fit: 'slim'
        }
      }
    },
    {
      id: 'tank-asymmetric-strap',
      name: 'Asymmetric Strap Tank',
      category: 'tanks',
      description: 'Avant-garde tank with uneven strap widths or placement.',
      tags: ['tank', 'fashion', 'asymmetric', 'modern', 'edgy'],
      difficulty: 'advanced',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Jersey', 'Modal'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-asymmetric-strap',
        name: 'Asymmetric Tank',
        parameters: {
          strapLeft: 'thin',
          strapRight: 'wide',
          neckline: 'slant'
        }
      }
    },
    {
      id: 'tank-hooded-sleeveless',
      name: 'Hooded Muscle Tank',
      category: 'tanks',
      description: 'Sleeveless tank with an attached hood. popular gym cover-up.',
      tags: ['tank', 'hooded', 'gym', 'cover-up', 'urban'],
      difficulty: 'intermediate',
      estimatedTime: '3.5 hours',
      fabricRecommendations: ['French Terry', 'Lightweight fleece'],
      requiredMeasurements: ['chest', 'waist', 'neck'],
      spec: {
        id: 'tank-hooded-sleeveless',
        name: 'Hooded Tank',
        parameters: {
          hood: 'lined',
          pocket: 'kangaroo',
          armhole: 'raw'
        }
      }
    },
    {
      id: 'tank-compression-base',
      name: 'Compression Base Tank',
      category: 'tanks',
      description: 'Tight base layer tank for core support and moisture management.',
      tags: ['tank', 'compression', 'base-layer', 'sport', 'support'],
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Spandex', 'Compression knit'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'tank-compression-base',
        name: 'Compression Tank',
        parameters: {
          fit: 'skin-tight',
          length: 'extra-long', // to tuck in
          seams: 'flatlock'
        }
      }
    },
    {
      id: 'tank-loose-beach',
      name: 'Loose Fit Beach Tank',
      category: 'tanks',
      description: 'Flowy, oversized tank for throwing over swimwear.',
      tags: ['tank', 'beach', 'loose', 'summer', 'vacation'],
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      fabricRecommendations: ['Linen', 'Voile', 'Tissue jersey'],
      requiredMeasurements: ['chest'],
      spec: {
        id: 'tank-loose-beach',
        name: 'Beach Tank',
        parameters: {
          fit: 'oversized',
          hem: 'hi-low',
          drape: 'max'
        }
      }
    }
  ];
}
