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
    }
  ];
}
