# DexStitch Template Creation Guide

**Version:** 1.0  
**Last Updated:** February 10, 2026  
**Target Audience:** Developers, Pattern Designers, Contributors

---

## Table of Contents

1. [Overview](#overview)
2. [Template Structure](#template-structure)
3. [Type Definitions](#type-definitions)
4. [Creating Your First Template](#creating-your-first-template)
5. [Category Guidelines](#category-guidelines)
6. [Best Practices](#best-practices)
7. [Testing Your Template](#testing-your-template)
8. [Contributing Templates](#contributing-templates)
9. [Examples](#examples)

---

## Overview

DexStitch uses a **structured template system** that allows contributors to define reusable garment patterns. Each template contains:

- **Metadata** (name, category, difficulty, description)
- **Pattern specification** (parameters for the pattern engine)
- **Fabrication guidance** (recommended fabrics, time estimates)
- **Measurement requirements** (which body measurements are needed)

### Key Principles

✅ **Local-first** - Templates are pure data structures, no server calls  
✅ **Type-safe** - Full TypeScript support with strict typing  
✅ **Extensible** - Custom parameters beyond standard ease/dartDepth  
✅ **Discoverable** - Tags and categories for easy searching  
✅ **Beginner-friendly** - Clear difficulty ratings and fabric recommendations

---

## Template Structure

### Core Template Interface

```typescript
export interface GarmentTemplate {
  // Unique identifier (lowercase-kebab-case)
  id: string;
  
  // Human-readable name
  name: string;
  
  // Category for filtering (see Category Guidelines)
  category: TemplateCategory;
  
  // Brief description (1-2 sentences, ~150 chars max)
  description: string;
  
  // Optional thumbnail URL or path (for future use)
  thumbnail?: string;
  
  // Searchable tags (lowercase, no spaces)
  tags: string[];
  
  // Skill level required
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Pattern specification (the core pattern data)
  spec: PatternSpec;
  
  // Optional: Which measurements are needed
  requiredMeasurements?: Array<keyof MeasurementSet>;
  
  // Optional: Estimated construction time
  estimatedTime?: string; // e.g., "2-3 hours"
  
  // Optional: Fabric suggestions
  fabricRecommendations?: string[];
}
```

### Pattern Specification

```typescript
export type PatternSpec = {
  id: string;           // Should match template id
  name: string;         // Should match template name
  parameters: {
    // Standard parameters (optional)
    ease?: number;      // Defaults to 1.05 if not specified
    dartDepth?: number; // In millimeters
    
    // Custom parameters (anything you need!)
    [key: string]: unknown;
  };
};
```

### Available Categories

```typescript
export type TemplateCategory = 
  | 'singlets'      // Wrestling singlets, athletic one-pieces
  | 'harnesses'     // Chest harnesses, body harnesses
  | 'jockstraps'    // Athletic supporters, fashion jocks
  | 'briefs'        // Underwear, bikini briefs
  | 'bodysuits'     // Unitards, full-body garments
  | 'tanks'         // Tank tops, sleeveless shirts
  | 'shorts'        // Athletic shorts, swim trunks
  | 'leggings'      // Compression pants, tights
  | 'accessories'   // Arm warmers, cuffs, collars, etc.
  | 'custom';       // For new categories (propose in PR)
```

---

## Creating Your First Template

### Step 1: Choose Your Category

Determine which existing category fits your garment. If none fit, use `'custom'` and propose a new category in your PR.

### Step 2: Define Template Metadata

```typescript
const myTemplate: GarmentTemplate = {
  id: 'tank-mesh-muscle',              // Unique, descriptive
  name: 'Mesh Muscle Tank',             // What users will see
  category: 'tanks',                     // From available categories
  description: 'Lightweight muscle tank with mesh side panels for maximum breathability during intense workouts.',
  tags: ['tank', 'mesh', 'muscle', 'gym', 'breathable', 'workout'],
  difficulty: 'intermediate',           // honest assessment
  estimatedTime: '2-3 hours',           // realistic for average sewist
  fabricRecommendations: [
    'Athletic mesh for side panels',
    'Moisture-wicking jersey for main body',
    'Stretchy rib knit for hem'
  ],
  requiredMeasurements: ['chest', 'waist'],
  
  spec: {
    id: 'tank-mesh-muscle',             // Must match template id
    name: 'Mesh Muscle Tank',           // Must match template name
    parameters: {
      // Standard parameters (optional)
      ease: 1.02,                        // Fitted tank
      
      // Custom parameters for your design
      armholeDepth: 240,                 // mm, very deep cut
      neckDepth: 150,                    // mm, moderate scoop
      strapWidth: 30,                    // mm, medium straps
      meshPanelWidth: 80,                // mm, side mesh panels
      hemStyle: 'curved'                 // curved vs straight hem
    }
  }
};
```

### Step 3: Add to Category File

Templates are organized by category. Add your template to the appropriate file:

```typescript
// packages/core/src/templates/tanks.ts

import type { GarmentTemplate } from './index';

export function getTankTemplates(): GarmentTemplate[] {
  return [
    // ... existing templates ...
    
    // Your new template
    {
      id: 'tank-mesh-muscle',
      name: 'Mesh Muscle Tank',
      // ... rest of template definition
    }
  ];
}
```

### Step 4: Export from Index

If creating a **new category file**, add it to the index:

```typescript
// packages/core/src/templates/index.ts

import { getYourNewCategoryTemplates } from './your-new-category';

function getAllTemplates(): GarmentTemplate[] {
  return [
    // ... existing imports ...
    ...getYourNewCategoryTemplates()
  ];
}

export { getYourNewCategoryTemplates };
```

---

## Category Guidelines

### When to Create a New Category

Create a new category when:
- ✅ You have 3+ templates that don't fit existing categories
- ✅ The garment type is fundamentally different from existing categories
- ✅ Users would expect to filter by this category

**Don't create new categories for:**
- ❌ Variations of existing categories (e.g., "long-sleeve-tanks" → use `tanks`)
- ❌ Single templates (put in `custom` until you have more)
- ❌ Brand names or styles (use tags instead)

### Category File Template

```typescript
// packages/core/src/templates/your-category.ts

/**
 * [Category Name] Templates
 * Brief description of what this category contains
 */

import type { GarmentTemplate } from './index';

export function getYourCategoryTemplates(): GarmentTemplate[] {
  return [
    {
      id: 'category-template-1',
      name: 'Template Name 1',
      category: 'your-category',
      description: '...',
      tags: ['...'],
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      fabricRecommendations: ['...'],
      requiredMeasurements: ['chest', 'waist'],
      spec: {
        id: 'category-template-1',
        name: 'Template Name 1',
        parameters: {
          ease: 1.0,
          // custom params...
        }
      }
    },
    // Add more templates...
  ];
}
```

---

## Best Practices

### ✅ DO

**Naming Conventions:**
- IDs: `lowercase-kebab-case` (e.g., `singlet-classic-red`)
- Names: `Title Case` (e.g., `Classic Competition Singlet - Red`)
- Tags: `lowercase, no spaces` (e.g., `wrestling`, `competition`, `red`)

**Descriptions:**
- Keep to 1-2 sentences (~150 characters)
- Focus on key features and use cases
- Be specific about style/fit details

**Parameters:**
- Use millimeters (mm) for all dimensions
- Document what each custom parameter controls
- Provide sensible defaults
- Keep parameter names descriptive (`armholeDepth` not `ahd`)

**Difficulty Ratings:**
```typescript
'beginner'      // Simple construction, minimal pieces, basic techniques
'intermediate'  // Multiple pieces, some fitting, moderate sewing skills
'advanced'      // Complex patterns, precise fitting, advanced techniques
```

**Fabric Recommendations:**
- Be specific ("`Cotton/Spandex blend (95/5)`" not just "`stretchy fabric`")
- List 2-4 options
- Include fiber content when relevant
- Mention special requirements (e.g., "`Chlorine-resistant for swimwear`")

**Time Estimates:**
- Be realistic for average skill level
- Use ranges ("`2-3 hours`" not "`2.5 hours`")
- Consider cutting, assembly, and finishing

### ❌ DON'T

- Don't duplicate template IDs (must be globally unique)
- Don't use copyrighted brand names in template names
- Don't make ease required if your pattern doesn't use it
- Don't forget to add tags (minimum 3, maximum 10)
- Don't use overly technical jargon in descriptions
- Don't set difficulty to 'beginner' if it requires advanced techniques

---

## Testing Your Template

### 1. TypeScript Compilation

```bash
pnpm typecheck
```

Should complete without errors related to your template.

### 2. Visual Inspection

1. Start dev server: `pnpm dev`
2. Navigate to Templates tab (📚)
3. Find your template by:
   - Filtering by category
   - Searching by name/tags
4. Click template card to view details
5. Verify all fields display correctly

### 3. Pattern Generation Test

1. Click "Use This Template"
2. App should switch to Design tab
3. Pattern should generate without errors
4. Check console for any warnings

### 4. Template Validation Checklist

```typescript
// Manually verify:
□ id is unique (search codebase for duplicates)
□ name is clear and descriptive
□ category is valid TemplateCategory
□ description is 1-2 sentences
□ tags.length >= 3
□ difficulty matches actual complexity
□ spec.id === template.id
□ spec.name === template.name
□ parameters make sense for garment type
□ fabricRecommendations are specific
□ estimatedTime is reasonable
□ requiredMeasurements match pattern needs
```

---

## Contributing Templates

### Submission Process

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feat/add-cycling-jersey-templates`
3. **Add your templates** to appropriate category file
4. **Test thoroughly** (see Testing section)
5. **Commit with clear message**: `feat: add 5 cycling jersey templates`
6. **Open Pull Request** with:
   - Summary of templates added
   - Category used or proposed
   - Screenshots of templates in gallery (optional but helpful)
   - Any custom parameters explained

### PR Template for New Templates

```markdown
## New Templates

### Category: [category name]

### Templates Added:
1. [Template Name] - [Brief description]
2. [Template Name] - [Brief description]
...

### Custom Parameters
If you added custom parameters, explain them:
- `parameterName`: What it controls, valid range, units

### Testing
- [ ] TypeScript compiles without errors
- [ ] Templates visible in gallery
- [ ] All templates generate patterns successfully
- [ ] Difficulty ratings are accurate
- [ ] Fabric recommendations are specific

### Screenshots
[Optional: Add screenshots of templates in the gallery]
```

---

## Examples

### Example 1: Simple Accessory

```typescript
{
  id: 'accessory-wrist-sweatband',
  name: 'Sport Wrist Sweatband',
  category: 'accessories',
  description: 'Classic terry cloth wristband for absorbing sweat during workouts.',
  tags: ['accessory', 'wristband', 'sweatband', 'sports', 'terry-cloth'],
  difficulty: 'beginner',
  estimatedTime: '30 minutes',
  fabricRecommendations: [
    'Terry cloth toweling',
    'Cotton French terry',
    'Moisture-wicking athletic terry'
  ],
  requiredMeasurements: [], // One-size-fits-most
  spec: {
    id: 'accessory-wrist-sweatband',
    name: 'Sport Wrist Sweatband',
    parameters: {
      width: 80,        // mm width of band
      length: 200,      // mm circumference (stretches)
      thickness: 5,     // mm material thickness
      elastic: true     // Uses elastic for fit
    }
  }
}
```

### Example 2: Complex Garment with Multiple Parameters

```typescript
{
  id: 'bodysuit-dance-performance',
  name: 'Dance Performance Bodysuit',
  category: 'bodysuits',
  description: 'Professional dance bodysuit with long sleeves, scoop neck, and snap crotch. Designed for stage performance with full range of motion.',
  tags: ['bodysuit', 'dance', 'performance', 'long-sleeve', 'stretch', 'professional'],
  difficulty: 'advanced',
  estimatedTime: '6-8 hours',
  fabricRecommendations: [
    'Four-way stretch lycra/spandex (82% Nylon, 18% Spandex)',
    'Performance velvet for luxury look',
    'Metallic spandex for stage presence',
    'High-quality metal snaps for crotch closure'
  ],
  requiredMeasurements: ['height', 'chest', 'waist', 'hip'],
  spec: {
    id: 'bodysuit-dance-performance',
    name: 'Dance Performance Bodysuit',
    parameters: {
      ease: 0.92,              // Compression fit for performance
      
      // Torso
      neckline: 'scoop',       // 'crew', 'scoop', 'v-neck'
      neckDepth: 120,          // mm from shoulder
      backStyle: 'standard',   // 'standard', 'open', 'keyhole'
      
      // Sleeves
      sleeves: 'long',         // 'none', 'short', 'long'
      sleeveLength: 550,       // mm from shoulder to wrist
      
      // Legs
      legLength: 'brief',      // 'brief', 'short', 'full'
      legCut: 'high',          // 'standard', 'high', 'bikini'
      
      // Closure
      snapCrotch: true,        // Snap closure for bathroom access
      snapCount: 3,            // Number of snaps
      
      // Construction
      seamType: 'flatlock',    // 'flatlock', 'cover-stitch'
      bindingWidth: 15,        // mm binding on edges
      
      // Style details
      contrast: false,         // Contrast panels
      mesh: false              // Mesh inserts
    }
  }
}
```

### Example 3: Template with Variants

Instead of creating separate templates for each color, use a base template:

```typescript
{
  id: 'singlet-classic-competition',
  name: 'Classic Competition Singlet',
  category: 'singlets',
  description: 'FILA-approved wrestling singlet with high-cut legs and minimal seams. Available in multiple colors for team customization.',
  tags: ['singlet', 'wrestling', 'competition', 'fila', 'sports', 'team'],
  difficulty: 'intermediate',
  estimatedTime: '3-4 hours',
  fabricRecommendations: [
    'Lycra/Spandex blend (82% Nylon, 18% Spandex)',
    'Competition-grade stretch fabric',
    'Moisture-wicking polyester blend'
  ],
  requiredMeasurements: ['chest', 'waist', 'hip', 'height'],
  spec: {
    id: 'singlet-classic-competition',
    name: 'Classic Competition Singlet',
    parameters: {
      ease: 0.95,          // Compression fit
      legHeight: 180,      // High-cut leg opening
      neckDepth: 120,      // Scoop neck
      backCut: 100,        // Lower back
      strapWidth: 50,      // Medium straps
      
      // Color variants (future: UI color picker)
      colorVariant: 'red'  // 'red', 'blue', 'black', 'custom'
    }
  }
}
```

---

## Advanced Topics

### Custom Pattern Engine Integration

If your template requires complex pattern generation beyond the standard engine, you can create a custom pattern plugin:

```typescript
// packages/core/src/plugins.ts

export const myCustomGarmentPlugin: PatternPlugin = {
  id: 'my-custom-garment',
  name: 'My Custom Garment',
  version: '1.0.0',
  
  generate: async (measurements, spec) => {
    // Your custom pattern generation logic
    // Returns PatternResult with pieces
    return {
      pieces: [
        {
          id: 'piece-1',
          name: 'Front Panel',
          outline: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            // ... more points
          ],
          grainline: [{ x: 50, y: 10 }, { x: 50, y: 90 }]
        }
      ]
    };
  },
  
  validate: (measurements, spec) => {
    // Optional validation
    const errors: string[] = [];
    if (measurements.chest < 500) {
      errors.push('Chest measurement too small for this garment');
    }
    return errors;
  }
};
```

Then reference in your template:

```typescript
{
  id: 'custom-garment-template',
  // ... metadata ...
  spec: {
    id: 'my-custom-garment', // Matches plugin id
    name: 'My Custom Garment',
    parameters: {
      // Your custom parameters
    }
  }
}
```

### Internationalization (i18n)

Templates are currently English-only. For i18n support:

```typescript
// Future structure (not yet implemented):
{
  id: 'singlet-classic',
  name: {
    en: 'Classic Singlet',
    es: 'Malla Clásica',
    fr: 'Maillot Classique'
  },
  description: {
    en: 'Traditional wrestling singlet...',
    es: 'Malla de lucha tradicional...',
    fr: 'Maillot de lutte traditionnelle...'
  },
  // ...
}
```

### Template Versioning

Include version in id for major changes:

```typescript
{
  id: 'singlet-classic-v2',  // If significantly different from v1
  name: 'Classic Singlet (Updated)',
  // ...
}
```

---

## FAQ

### Q: Can I create templates for non-athletic wear?

**A:** Absolutely! While current templates focus on athletic/performance wear, the system supports any garment type. Propose new categories as needed.

### Q: Do I need to know how to sew to create templates?

**A:** Basic sewing knowledge helps, but the key is understanding garment structure and being able to define it parametrically. Collaborate with sewists for complex garments.

### Q: What if my garment needs measurements that aren't in MeasurementSet?

**A:** Current measurements are: `height`, `neck`, `chest`, `waist`, `hip`. For additional measurements, open an issue to discuss extending the MeasurementSet type.

### Q: Can I include thumbnail images?

**A:** Yes! The `thumbnail` field is optional. Place images in `packages/frontend/public/templates/` and reference as `/templates/your-image.jpg`.

### Q: How do I handle sizing (S/M/L vs custom measurements)?

**A:** Templates use body measurements, not sizes. Users input their measurements and the pattern is generated. You can add `sizeGuide` to template metadata as a string field.

### Q: Can templates have dependencies on other templates?

**A:** Not currently. Each template must be self-contained. If you need shared logic, create utility functions in the core package.

---

## Resources

- **Type Definitions**: [`packages/types/src/index.ts`](packages/types/src/index.ts)
- **Existing Templates**: [`packages/core/src/templates/`](packages/core/src/templates/)
- **Pattern Engine**: [`packages/core/src/patternEngine.ts`](packages/core/src/patternEngine.ts)
- **Plugin System**: [`packages/core/src/plugins.ts`](packages/core/src/plugins.ts)
- **Template Gallery UI**: [`packages/frontend/src/components/TemplateGallery.tsx`](packages/frontend/src/components/TemplateGallery.tsx)

---

## Support

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **New Features**: Open a GitHub Issue with enhancement label
- **General Chat**: See CONTRIBUTING.md for community links

---

## License

By contributing templates, you agree to license them under the same Unlicense as the project (public domain).

---

**Happy Template Creating! 🎨✂️**

*Last updated: February 10, 2026*
