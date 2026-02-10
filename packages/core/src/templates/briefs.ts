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
    }
  ];
}
