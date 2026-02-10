/**
 * Wrestling Singlet Templates
 * Men's competition and training singlets
 */

import type { GarmentTemplate } from './index';

export function getSingletTemplates(): GarmentTemplate[] {
  return [
    // Classic Wrestling Singlets
    {
      id: 'singlet-classic-red',
      name: 'Classic Competition Singlet - Red',
      category: 'singlets',
      description: 'Traditional FILA-approved wrestling singlet in bold red. High-cut legs, scoop neck, minimal seams for competition compliance.',
      tags: ['wrestling', 'competition', 'classic', 'red', 'sports', 'athletic'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Lycra/Spandex blend (82% Nylon, 18% Spandex)', 'Moisture-wicking polyester'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'singlet-classic-red',
        name: 'Classic Competition Singlet',
        parameters: {
          ease: 0.95, // Compression fit
          legHeight: 180, // High-cut leg opening
          neckDepth: 120, // Scoop neck
          backCut: 100, // Lower back
          strapWidth: 50
        }
      }
    },
    {
      id: 'singlet-classic-blue',
      name: 'Classic Competition Singlet - Blue',
      category: 'singlets',
      description: 'Professional wrestling singlet in royal blue. FILA regulation design with reinforced seams.',
      tags: ['wrestling', 'competition', 'classic', 'blue', 'sports'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Lycra/Spandex blend', 'Competition-grade stretchy fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'singlet-classic-blue',
        name: 'Classic Competition Singlet',
        parameters: {
          ease: 0.95,
          legHeight: 180,
          neckDepth: 120,
          backCut: 100,
          strapWidth: 50
        }
      }
    },
    {
      id: 'singlet-racing-black',
      name: 'Speed Singlet - Black',
      category: 'singlets',
      description: 'Low-profile racing singlet designed for minimal drag. Popular for training and freestyle.',
      tags: ['wrestling', 'racing', 'training', 'black', 'performance'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Ultra-smooth Lycra', 'Low-friction polyester blend'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-racing-black',
        name: 'Speed Singlet',
        parameters: {
          ease: 0.92, // Extra compression
          legHeight: 190, // Higher cut
          neckDepth: 100,
          backCut: 90,
          strapWidth: 45
        }
      }
    },
    {
      id: 'singlet-training-gray',
      name: 'Training Singlet - Heather Gray',
      category: 'singlets',
      description: 'Comfortable practice singlet with relaxed fit for daily training sessions.',
      tags: ['wrestling', 'training', 'practice', 'gray', 'comfort'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Cotton/Spandex blend', 'Breathable athletic fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-training-gray',
        name: 'Training Singlet',
        parameters: {
          ease: 1.05, // Relaxed fit
          legHeight: 160,
          neckDepth: 110,
          backCut: 110,
          strapWidth: 55
        }
      }
    },
    {
      id: 'singlet-collegiate-stripe',
      name: 'Collegiate Stripe Singlet',
      category: 'singlets',
      description: 'Team-style singlet with side stripe panels. Customizable colors for school branding.',
      tags: ['wrestling', 'collegiate', 'team', 'stripe', 'custom'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Sublimation-ready polyester', 'Two-tone Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'singlet-collegiate-stripe',
        name: 'Collegiate Stripe Singlet',
        parameters: {
          ease: 0.95,
          legHeight: 175,
          neckDepth: 115,
          backCut: 105,
          strapWidth: 50,
          sidePanelWidth: 80, // Stripe panel
          colorBlocking: true
        }
      }
    },
    {
      id: 'singlet-folkstyle-red-black',
      name: 'Folkstyle Singlet - Red/Black',
      category: 'singlets',
      description: 'American folkstyle wrestling singlet with bold contrast panels.',
      tags: ['wrestling', 'folkstyle', 'american', 'red', 'black'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Durable Lycra blend', 'Competition fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-folkstyle-red-black',
        name: 'Folkstyle Singlet',
        parameters: {
          ease: 0.96,
          legHeight: 175,
          neckDepth: 120,
          backCut: 100,
          strapWidth: 52
        }
      }
    },
    {
      id: 'singlet-reversible',
      name: 'Reversible Training Singlet',
      category: 'singlets',
      description: 'Two-sided singlet that reverses to different color. Perfect for scrimmages.',
      tags: ['wrestling', 'training', 'reversible', 'two-tone', 'practice'],
      difficulty: 'advanced',
      estimatedTime: '5-6 hours',
      fabricRecommendations: ['Double-faced Lycra', 'Reversible athletic mesh'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-reversible',
        name: 'Reversible Singlet',
        parameters: {
          ease: 1.0,
          legHeight: 170,
          neckDepth: 115,
          backCut: 105,
          strapWidth: 55,
          doubleLined: true
        }
      }
    },
    {
      id: 'singlet-euro-style',
      name: 'European Style Singlet',
      category: 'singlets',
      description: 'Low-cut European competition singlet with modern aesthetic.',
      tags: ['wrestling', 'european', 'modern', 'competition', 'low-cut'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['High-performance Lycra', 'Italian athletic fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-euro-style',
        name: 'European Singlet',
        parameters: {
          ease: 0.93,
          legHeight: 185,
          neckDepth: 130, // Deeper scoop
          backCut: 95,
          strapWidth: 48
        }
      }
    },
    {
      id: 'singlet-tank-hybrid',
      name: 'Tank Hybrid Singlet',
      category: 'singlets',
      description: 'Singlet with wider tank-style straps for enhanced shoulder support.',
      tags: ['wrestling', 'hybrid', 'tank', 'comfort', 'wide-strap'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Heavy-duty Lycra', 'Reinforced stretch fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-tank-hybrid',
        name: 'Tank Hybrid Singlet',
        parameters: {
          ease: 0.98,
          legHeight: 165,
          neckDepth: 100,
          backCut: 110,
          strapWidth: 70 // Wide straps
        }
      }
    },
    {
      id: 'singlet-compression-pro',
      name: 'Pro Compression Singlet',
      category: 'singlets',
      description: 'Maximum compression design for muscle support and aerodynamics.',
      tags: ['wrestling', 'compression', 'pro', 'performance', 'tight'],
      difficulty: 'advanced',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Medical-grade compression fabric', 'Power Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'singlet-compression-pro',
        name: 'Pro Compression Singlet',
        parameters: {
          ease: 0.88, // Maximum compression
          legHeight: 195,
          neckDepth: 110,
          backCut: 95,
          strapWidth: 45,
          compressionZones: true
        }
      }
    }
  ];
}
