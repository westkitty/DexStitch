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
    }
  ];
}
