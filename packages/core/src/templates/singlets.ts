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
    },
    {
      id: 'singlet-retro-low-cut',
      name: 'Retro Low-Cut Singlet',
      category: 'singlets',
      description: '70s style wrestling singlet with ultra-low scoop neck and high legs.',
      tags: ['wrestling', 'retro', 'vintage', 'low-cut', '70s'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Nylon tricot', 'Shiny Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
      spec: {
        id: 'singlet-retro-low-cut',
        name: 'Retro Low-Cut Singlet',
        parameters: {
          ease: 0.94,
          legHeight: 200,
          neckDepth: 160,
          backCut: 140,
          strapWidth: 35
        }
      }
    },
    {
      id: 'singlet-powerlifting-comp',
      name: 'Powerlifting Competition Singlet',
      category: 'singlets',
      description: 'Heavyweight singlet meeting powerlifting federation specs. Non-supportive construction.',
      tags: ['powerlifting', 'competition', 'heavyweight', 'squat', 'deadlift'],
      difficulty: 'intermediate',
      estimatedTime: '4 hours',
      fabricRecommendations: ['Heavyweight polyester double-knit', 'Thick supplementary spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-powerlifting-comp',
        name: 'Powerlifting Singlet',
        parameters: {
          ease: 1.0,
          legHeight: 120, // Lower cut for coverage
          legLength: 150, // Longer leg
          neckDepth: 100,
          strapWidth: 60,
          gusset: true
        }
      }
    },
    {
      id: 'singlet-mesh-panel',
      name: 'Mesh Panel Ventilation Singlet',
      category: 'singlets',
      description: 'Modern singlet with strategic mesh zones for maximum cooling.',
      tags: ['wrestling', 'breathable', 'mesh', 'modern', 'cool'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Athletic mesh', 'Microfiber', 'Spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-mesh-panel',
        name: 'Mesh Panel Singlet',
        parameters: {
          ease: 0.96,
          sidePanelMesh: true,
          backPanelMesh: true,
          legHeight: 180,
          neckDepth: 110
        }
      }
    },
    {
      id: 'singlet-zipper-front',
      name: 'Zip-Front Singlet',
      category: 'singlets',
      description: 'Fashion-forward singlet with functional front zipper closure.',
      tags: ['wrestling', 'fashion', 'zipper', 'clubwear', 'access'],
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      fabricRecommendations: ['Stretch vinyl', 'Wet look spandex', 'Neoprene'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'neck'],
      spec: {
        id: 'singlet-zipper-front',
        name: 'Zip-Front Singlet',
        parameters: {
          ease: 0.98,
          zipperLength: 300,
          collarHeight: 40,
          legHeight: 170
        }
      }
    },
    {
      id: 'singlet-womens-comp',
      name: 'Women\'s Competition Singlet',
      category: 'singlets',
      description: 'FILA-compliant women\'s cut with higher neckline and adjust fit.',
      tags: ['wrestling', 'womens', 'competition', 'fila', 'female'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Opaque Lycra', 'Performance spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-womens-comp',
        name: 'Women\'s Competition Singlet',
        parameters: {
          ease: 0.95,
          bustAdjustment: true,
          neckDepth: 80, // Higher neckline
          armholeDepth: 180, // Adjusted armhole
          legHeight: 160
        }
      }
    },
    {
      id: 'singlet-womens-training',
      name: 'Women\'s Racerback Singlet',
      category: 'singlets',
      description: 'Training singlet with racerback design for shoulder mobility.',
      tags: ['wrestling', 'womens', 'training', 'racerback'],
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      fabricRecommendations: ['Soft poly-blend', 'Cotton-touch spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-womens-training',
        name: 'Women\'s Racerback Singlet',
        parameters: {
          ease: 1.02,
          racerbackWidth: 40,
          neckDepth: 90,
          legHeight: 150
        }
      }
    },
    {
      id: 'singlet-high-neck',
      name: 'High-Neck Grappling Singlet',
      category: 'singlets',
      description: 'Full coverage singlet preventing mat burn on chest and neck.',
      tags: ['wrestling', 'grappling', 'high-neck', 'protection', 'nogi'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Rashguard material', 'Durable spandex'],
      requiredMeasurements: ['chest', 'waist', 'hip', 'neck'],
      spec: {
        id: 'singlet-high-neck',
        name: 'High-Neck Singlet',
        parameters: {
          ease: 0.90, // Tight fit
          neckDepth: 0, // Crew neck
          armholeDepth: 190,
          legHeight: 180
        }
      }
    },
    {
      id: 'singlet-side-stripe-v2',
      name: 'Modern Side Stripe Singlet',
      category: 'singlets',
      description: 'Updated classic with asymmetric side striping.',
      tags: ['wrestling', 'stripe', 'modern', 'asymmetric', 'team'],
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      fabricRecommendations: ['Sublimated polyester', 'Lycra'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-side-stripe-v2',
        name: 'Modern Side Stripe Singlet',
        parameters: {
          ease: 0.95,
          stripeWidth: 60,
          asymmetric: true,
          legHeight: 175
        }
      }
    },
    {
      id: 'singlet-vintage-80s',
      name: '80s High-Cut Singlet',
      category: 'singlets',
      description: 'The golden era cut with very high legs and thin straps.',
      tags: ['wrestling', '80s', 'vintage', 'retro', 'high-cut'],
      difficulty: 'intermediate',
      estimatedTime: '3 hours',
      fabricRecommendations: ['Nylon spandex', 'Shiny finish fabric'],
      requiredMeasurements: ['chest', 'waist', 'hip'],
      spec: {
        id: 'singlet-vintage-80s',
        name: '80s High-Cut Singlet',
        parameters: {
          ease: 0.93,
          legHeight: 220, // Very high cut
          neckDepth: 140,
          strapWidth: 30,
          backCut: 130
        }
      }
    },
    {
      id: 'singlet-youth-training',
      name: 'Youth Universal Singlet',
      category: 'singlets',
      description: 'Adjustable fit singlet designed for growing bodies.',
      tags: ['wrestling', 'youth', 'kids', 'training', 'adjustable'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['Durable nylon blend', 'Washable synthetic'],
      requiredMeasurements: ['height', 'chest', 'waist'],
      spec: {
        id: 'singlet-youth-training',
        name: 'Youth Universal Singlet',
        parameters: {
          ease: 1.1, // Growth room
          adjustableStraps: true,
          legHeight: 140,
          neckDepth: 90
        }
      }
    }
  ];
}
