import type { PatternResult, PatternSpec, MeasurementSet, NestingOutput, EmbroideryProgram } from "@dexstitch/types";

/**
 * Plugin type for extending pattern generation capabilities
 */
export interface PatternPlugin {
  id: string;
  name: string;
  version: string;
  /** Generate pattern using custom logic */
  generate: (measurements: MeasurementSet, spec: PatternSpec) => Promise<PatternResult>;
  /** Optional validation of measurements/spec */
  validate?: (measurements: MeasurementSet, spec: PatternSpec) => string[];
}

/**
 * Plugin type for extending export capabilities
 */
export interface ExportPlugin {
  id: string;
  name: string;
  fileExtension: string;
  mimeType: string;
  /** Export pattern to custom format */
  export: (pattern: PatternResult, nesting?: NestingOutput) => Promise<string | Uint8Array>;
  /** Check if this plugin can handle the pattern */
  canHandle?: (pattern: PatternResult) => boolean;
}

/**
 * Plugin type for extending embroidery capabilities
 */
export interface EmbroideryPlugin {
  id: string;
  name: string;
  /** Generate custom stitch patterns or effects */
  generateStitches?: (imageData: ImageData) => Promise<EmbroideryProgram>;
  /** Add custom fill patterns */
  fillPatterns?: Record<string, (bounds: { width: number; height: number }) => Uint8Array>;
}

/**
 * Plugin type for UI extensions
 */
export interface UIPlugin {
  id: string;
  name: string;
  /** Render a custom panel in measurements view */
  measurementPanel?: () => Promise<HTMLElement>;
  /** Render a custom panel in design view */
  designPanel?: () => Promise<HTMLElement>;
  /** Render custom settings */
  settingsPanel?: () => Promise<HTMLElement>;
}

/**
 * Plugin registry and loader
 */
export class PluginRegistry {
  private patternPlugins: Map<string, PatternPlugin> = new Map();
  private exportPlugins: Map<string, ExportPlugin> = new Map();
  private embroideryPlugins: Map<string, EmbroideryPlugin> = new Map();
  private uiPlugins: Map<string, UIPlugin> = new Map();

  /**
   * Register a pattern generation plugin
   */
  registerPatternPlugin(plugin: PatternPlugin): void {
    this.patternPlugins.set(plugin.id, plugin);
  }

  /**
   * Register an export format plugin
   */
  registerExportPlugin(plugin: ExportPlugin): void {
    this.exportPlugins.set(plugin.id, plugin);
  }

  /**
   * Register an embroidery processing plugin
   */
  registerEmbroideryPlugin(plugin: EmbroideryPlugin): void {
    this.embroideryPlugins.set(plugin.id, plugin);
  }

  /**
   * Register a UI extension plugin
   */
  registerUIPlugin(plugin: UIPlugin): void {
    this.uiPlugins.set(plugin.id, plugin);
  }

  /**
   * Get a pattern plugin by ID
   */
  getPatternPlugin(id: string): PatternPlugin | undefined {
    return this.patternPlugins.get(id);
  }

  /**
   * Get all pattern plugins
   */
  getPatternPlugins(): PatternPlugin[] {
    return Array.from(this.patternPlugins.values());
  }

  /**
   * Get all export plugins
   */
  getExportPlugins(): ExportPlugin[] {
    return Array.from(this.exportPlugins.values());
  }

  /**
   * Get all embroidery plugins
   */
  getEmbroideryPlugins(): EmbroideryPlugin[] {
    return Array.from(this.embroideryPlugins.values());
  }

  /**
   * Get all UI plugins
   */
  getUIPlugins(): UIPlugin[] {
    return Array.from(this.uiPlugins.values());
  }

  /**
   * Find export plugin for a given file type
   */
  findExportPluginByExtension(ext: string): ExportPlugin | undefined {
    return Array.from(this.exportPlugins.values()).find(
      p => p.fileExtension.toLowerCase() === ext.toLowerCase()
    );
  }

  /**
   * Unregister a plugin
   */
  unregister(type: 'pattern' | 'export' | 'embroidery' | 'ui', id: string): boolean {
    const map =
      type === 'pattern'
        ? this.patternPlugins
        : type === 'export'
          ? this.exportPlugins
          : type === 'embroidery'
            ? this.embroideryPlugins
            : this.uiPlugins;

    return map.delete(id);
  }

  /**
   * Clear all plugins
   */
  clear(): void {
    this.patternPlugins.clear();
    this.exportPlugins.clear();
    this.embroideryPlugins.clear();
    this.uiPlugins.clear();
  }
}

// Global plugin registry instance
export const globalPluginRegistry = new PluginRegistry();

/**
 * Load plugins from a script URL (for dynamic/CDN plugins)
 * 
 * @param url - URL to script that registers plugins
 */
export async function loadPluginFromURL(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onerror = () => reject(new Error(`Failed to load plugin from ${url}`));
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

/**
 * Built-in example: A simple plugin that adds a taper-sleeve variant
 */
export const taperSleevePlugin: PatternPlugin = {
  id: 'taper-sleeve',
  name: 'Taper Sleeve Modifier',
  version: '1.0.0',
  generate: async (_measurements, _spec) => {
    // This is a placeholder - actual implementation would modify sleeve taper
    return {
      pieces: [],
      metadata: { taperedSleeves: true }
    };
  },
  validate: (measurements) => {
    if (measurements.chest < 700) {
      return ['Chest measurement too small for tapered sleeves'];
    }
    return [];
  }
};

/**
 * Built-in example: A plugin for exporting to a custom format
 */
export const customFormatPlugin: ExportPlugin = {
  id: 'custom-format',
  name: 'Custom Sewing Format',
  fileExtension: '.csf',
  mimeType: 'application/x-custom-sewing',
  export: async (pattern) => {
    // Custom serialization format
    const header = 'CUSTOM_SEWING_FORMAT_V1\n';
    const pieces = pattern.pieces.map(p => `PIECE:${p.id}:${p.name}\n`).join('');
    return header + pieces;
  },
  canHandle: (pattern) => pattern.pieces.length > 0
};
