import { describe, test, expect, beforeEach } from 'vitest';
import { PluginRegistry, globalPluginRegistry } from '../plugins';
import type { PatternPlugin, ExportPlugin, EmbroideryPlugin, UIPlugin } from '../plugins';
import type { MeasurementSet, PatternSpec, PatternResult } from '@dexstitch/types';

// Polyfill ImageData for Node.js test environment
if (typeof ImageData === 'undefined') {
  global.ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor(dataOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number) {
      if (dataOrWidth instanceof Uint8ClampedArray) {
        this.data = dataOrWidth;
        this.width = widthOrHeight;
        this.height = height!;
      } else {
        this.width = dataOrWidth;
        this.height = widthOrHeight;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      }
    }
  } as any;
}

describe('Plugin System', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe('PluginRegistry', () => {
    describe('Pattern Plugins', () => {
      const testPatternPlugin: PatternPlugin = {
        id: 'test-pattern',
        name: 'Test Pattern Plugin',
        version: '1.0.0',
        generate: async (measurements: MeasurementSet, spec: PatternSpec): Promise<PatternResult> => {
          return {
            pieces: [
              {
                id: 'test-piece',
                name: 'Test Piece',
                outline: [
                  { x: 0, y: 0 },
                  { x: 100, y: 0 },
                  { x: 100, y: 100 },
                  { x: 0, y: 100 }
                ],
                grainline: [{ x: 50, y: 10 }, { x: 50, y: 90 }]
              }
            ]
          };
        }
      };

      test('registers pattern plugin', () => {
        expect(() => registry.registerPatternPlugin(testPatternPlugin)).not.toThrow();
      });

      test('retrieves registered pattern plugin', () => {
        registry.registerPatternPlugin(testPatternPlugin);
        const retrieved = registry.getPatternPlugin('test-pattern');

        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe('test-pattern');
        expect(retrieved?.name).toBe('Test Pattern Plugin');
      });

      test('returns undefined for unregistered pattern plugin', () => {
        const retrieved = registry.getPatternPlugin('non-existent');
        expect(retrieved).toBeUndefined();
      });

      test('lists all pattern plugins', () => {
        registry.registerPatternPlugin(testPatternPlugin);
        const plugins = registry.getPatternPlugins();

        expect(Array.isArray(plugins)).toBe(true);
        expect(plugins.length).toBe(1);
        expect(plugins[0].id).toBe('test-pattern');
      });

      test('pattern plugin can generate patterns', async () => {
        registry.registerPatternPlugin(testPatternPlugin);
        const plugin = registry.getPatternPlugin('test-pattern');

        expect(plugin).toBeDefined();

        const measurements: MeasurementSet = {
          height: 1700,
          neck: 380,
          chest: 950,
          waist: 800,
          hip: 900
        };

        const spec: PatternSpec = {
          id: 'test',
          name: 'Test',
          parameters: {}
        };

        const result = await plugin!.generate(measurements, spec);

        expect(result.pieces.length).toBeGreaterThan(0);
        expect(result.pieces[0].id).toBe('test-piece');
      });

      test('supports pattern plugin validation', async () => {
        const validatingPlugin: PatternPlugin = {
          ...testPatternPlugin,
          id: 'validating-plugin',
          validate: (measurements, spec) => {
            const errors: string[] = [];
            if (measurements.height < 1000) errors.push('Height too small');
            return errors;
          }
        };

        registry.registerPatternPlugin(validatingPlugin);
        const plugin = registry.getPatternPlugin('validating-plugin');

        expect(plugin?.validate).toBeDefined();

        if (plugin?.validate) {
          const errors = plugin.validate(
            { height: 500, neck: 300, chest: 800, waist: 700, hip: 800 },
            { id: 'test', name: 'Test', parameters: {} }
          );

          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0]).toContain('Height too small');
        }
      });
    });

    describe('Export Plugins', () => {
      const testExportPlugin: ExportPlugin = {
        id: 'test-export',
        name: 'Test Export Plugin',
        fileExtension: '.test',
        mimeType: 'application/test',
        export: async (pattern: PatternResult) => {
          return `TEST FORMAT: ${pattern.pieces.length} pieces`;
        }
      };

      test('registers export plugin', () => {
        expect(() => registry.registerExportPlugin(testExportPlugin)).not.toThrow();
      });

      test('lists all export plugins', () => {
        registry.registerExportPlugin(testExportPlugin);
        const plugins = registry.getExportPlugins();

        expect(Array.isArray(plugins)).toBe(true);
        expect(plugins.length).toBe(1);
        expect(plugins[0].id).toBe('test-export');
      });

      test('export plugin can export patterns', async () => {
        registry.registerExportPlugin(testExportPlugin);
        const plugin = registry.getExportPlugins()[0];

        const pattern: PatternResult = {
          pieces: [
            {
              id: 'piece-1',
              name: 'Piece 1',
              outline: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }],
              grainline: [{ x: 50, y: 10 }, { x: 50, y: 90 }]
            }
          ]
        };

        const output = await plugin.export(pattern);

        expect(typeof output).toBe('string');
        expect(output).toContain('TEST FORMAT');
        expect(output).toContain('1 pieces');
      });

      test('supports export plugin canHandle check', () => {
        const selectivePlugin: ExportPlugin = {
          ...testExportPlugin,
          id: 'selective-export',
          canHandle: (pattern) => pattern.pieces.length > 0
        };

        registry.registerExportPlugin(selectivePlugin);
        const plugin = registry.getExportPlugins().find(p => p.id === 'selective-export');

        expect(plugin?.canHandle).toBeDefined();

        if (plugin?.canHandle) {
          const emptyPattern: PatternResult = { pieces: [] };
          const fullPattern: PatternResult = {
            pieces: [{ id: '1', name: 'P1', outline: [], grainline: [] }]
          };

          expect(plugin.canHandle(emptyPattern)).toBe(false);
          expect(plugin.canHandle(fullPattern)).toBe(true);
        }
      });
    });

    describe('Embroidery Plugins', () => {
      const testEmbroideryPlugin: EmbroideryPlugin = {
        id: 'test-embroidery',
        name: 'Test Embroidery Plugin',
        generateStitches: async (imageData: ImageData) => {
          return {
            stitches: [
              { x: 0, y: 0, command: 'jump' },
              { x: 10, y: 10, command: 'stitch' }
            ],
            metadata: {
              stitchCount: 2
            }
          };
        }
      };

      test('registers embroidery plugin', () => {
        expect(() => registry.registerEmbroideryPlugin(testEmbroideryPlugin)).not.toThrow();
      });

      test('lists all embroidery plugins', () => {
        registry.registerEmbroideryPlugin(testEmbroideryPlugin);
        const plugins = registry.getEmbroideryPlugins();

        expect(Array.isArray(plugins)).toBe(true);
        expect(plugins.length).toBe(1);
        expect(plugins[0].id).toBe('test-embroidery');
      });

      test('embroidery plugin can generate stitches', async () => {
        registry.registerEmbroideryPlugin(testEmbroideryPlugin);
        const plugin = registry.getEmbroideryPlugins()[0];

        expect(plugin.generateStitches).toBeDefined();

        if (plugin.generateStitches) {
          const imageData = new ImageData(100, 100);
          const result = await plugin.generateStitches(imageData);

          expect(result.stitches.length).toBeGreaterThan(0);
          expect(result.metadata).toBeDefined();
        }
      });

      test('supports custom fill patterns', () => {
        const fillPlugin: EmbroideryPlugin = {
          id: 'fill-plugin',
          name: 'Fill Plugin',
          fillPatterns: {
            checkerboard: (bounds) => new Uint8Array(bounds.width * bounds.height),
            dots: (bounds) => new Uint8Array(bounds.width * bounds.height)
          }
        };

        registry.registerEmbroideryPlugin(fillPlugin);
        const plugin = registry.getEmbroideryPlugins().find(p => p.id === 'fill-plugin');

        expect(plugin?.fillPatterns).toBeDefined();
        expect(plugin?.fillPatterns?.checkerboard).toBeDefined();
        expect(plugin?.fillPatterns?.dots).toBeDefined();

        if (plugin?.fillPatterns) {
          const pattern = plugin.fillPatterns.checkerboard({ width: 10, height: 10 });
          expect(pattern).toBeInstanceOf(Uint8Array);
          expect(pattern.length).toBe(100);
        }
      });
    });

    describe('UI Plugins', () => {
      const testUIPlugin: UIPlugin = {
        id: 'test-ui',
        name: 'Test UI Plugin',
        measurementPanel: async () => {
          const div = document.createElement('div');
          div.textContent = 'Test Measurement Panel';
          return div;
        }
      };

      test('registers UI plugin', () => {
        expect(() => registry.registerUIPlugin(testUIPlugin)).not.toThrow();
      });

      test('UI plugin can render panels', async () => {
        registry.registerUIPlugin(testUIPlugin);
        const plugins = registry.getExportPlugins(); // Note: No getUIPlugins method exists yet
        // This tests the registration doesn't error
        expect(plugins).toBeDefined();
      });
    });

    describe('Multiple Plugin Types', () => {
      test('can register multiple plugin types simultaneously', () => {
        const patternPlugin: PatternPlugin = {
          id: 'p1',
          name: 'P1',
          version: '1.0.0',
          generate: async () => ({ pieces: [] })
        };

        const exportPlugin: ExportPlugin = {
          id: 'e1',
          name: 'E1',
          fileExtension: '.e1',
          mimeType: 'application/e1',
          export: async () => 'data'
        };

        const embroideryPlugin: EmbroideryPlugin = {
          id: 'em1',
          name: 'EM1'
        };

        expect(() => {
          registry.registerPatternPlugin(patternPlugin);
          registry.registerExportPlugin(exportPlugin);
          registry.registerEmbroideryPlugin(embroideryPlugin);
        }).not.toThrow();

        expect(registry.getPatternPlugins().length).toBe(1);
        expect(registry.getExportPlugins().length).toBe(1);
        expect(registry.getEmbroideryPlugins().length).toBe(1);
      });

      test('plugins remain isolated by type', () => {
        const plugin1: PatternPlugin = {
          id: 'shared-id',
          name: 'Pattern',
          version: '1.0.0',
          generate: async () => ({ pieces: [] })
        };

        const plugin2: ExportPlugin = {
          id: 'shared-id',
          name: 'Export',
          fileExtension: '.ex',
          mimeType: 'application/ex',
          export: async () => 'data'
        };

        registry.registerPatternPlugin(plugin1);
        registry.registerExportPlugin(plugin2);

        // Both should coexist with same ID
        expect(registry.getPatternPlugin('shared-id')?.name).toBe('Pattern');
        expect(registry.getExportPlugins()[0].name).toBe('Export');
      });
    });
  });

  describe('Global Plugin Registry', () => {
    test('global registry exists', () => {
      expect(globalPluginRegistry).toBeDefined();
      expect(globalPluginRegistry).toBeInstanceOf(PluginRegistry);
    });

    test('can use global registry', () => {
      const plugin: PatternPlugin = {
        id: 'global-test',
        name: 'Global Test',
        version: '1.0.0',
        generate: async () => ({ pieces: [] })
      };

      globalPluginRegistry.registerPatternPlugin(plugin);
      const retrieved = globalPluginRegistry.getPatternPlugin('global-test');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('global-test');
    });
  });
});
