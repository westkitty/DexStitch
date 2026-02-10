import { describe, test, expect } from 'vitest';
import {
  exportToSVG,
  exportToDXF,
  exportToJSON,
  exportToDST,
  generatePattern,
  type PatternSpec
} from '../index';
import type { MeasurementSet } from '@dexstitch/types';

/**
 * Test utilities
 */
function createTestMeasurements(): MeasurementSet {
  return {
    height: 1700,
    neckCircumference: 380,
    chestCircumference: 950,
    waistCircumference: 800,
    hipCircumference: 900
  };
}

function createTestSpec(): PatternSpec {
  return {
    type: 'rectangular',
    parameters: {
      ease: 1.05,
      dartDepth: 15
    }
  };
}

describe('Export Format Validation', () => {
  const measurements = createTestMeasurements();
  const spec = createTestSpec();
  const pattern = generatePattern(measurements, spec);

  describe('SVG Export', () => {
    test('generates valid SVG XML', () => {
      const svg = exportToSVG(pattern);
      
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('viewBox');
      expect(svg).toMatch(/<svg[^>]*>/);
    });

    test('includes all pieces', () => {
      const svg = exportToSVG(pattern);
      
      // Each piece should be represented as a path element
      const pathCount = (svg.match(/<path/g) || []).length;
      expect(pathCount).toBeGreaterThanOrEqual(pattern.pieces.length);
    });

    test('includes piece labels', () => {
      const svg = exportToSVG(pattern);
      
      expect(svg).toContain('<text');
      expect(svg).toContain('Front Panel'); // Standard piece name
    });

    test('SVG is parseable as XML', () => {
      const svg = exportToSVG(pattern);
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      
      expect(doc.documentElement.tagName).toBe('svg');
      expect(doc.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg').length).toBeGreaterThan(0);
    });

    test('viewBox dimensions are reasonable', () => {
      const svg = exportToSVG(pattern);
      const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
      
      expect(viewBoxMatch).toBeTruthy();
      const parts = viewBoxMatch![1].split(/\s+/);
      expect(parts.length).toBeGreaterThanOrEqual(4);
      
      const width = Number(parts[2]);
      const height = Number(parts[3]);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    });
  });

  describe('DXF Export', () => {
    test('starts with DXF header section', () => {
      const dxf = exportToDXF(pattern);
      
      expect(dxf).toContain('0');
      expect(dxf).toContain('SECTION');
      expect(dxf).toContain('HEADER');
    });

    test('includes entities section', () => {
      const dxf = exportToDXF(pattern);
      
      expect(dxf).toContain('ENTITIES');
    });

    test('contains LWPOLYLINE elements', () => {
      const dxf = exportToDXF(pattern);
      
      expect(dxf).toContain('LWPOLYLINE');
    });

    test('exports as string', () => {
      const dxf = exportToDXF(pattern);
      
      expect(typeof dxf).toBe('string');
      expect(dxf.length).toBeGreaterThan(0);
    });

    test('includes end-of-file marker', () => {
      const dxf = exportToDXF(pattern);
      
      expect(dxf).toContain('ENDSEC');
      expect(dxf).toContain('EOF');
    });
  });

  describe('JSON Export', () => {
    test('produces valid JSON string', () => {
      const json = exportToJSON(pattern);

      expect(() => JSON.parse(json)).not.toThrow();
    });

    test('JSON round-trip preserves structure', () => {
      const json = exportToJSON(pattern);
      const parsed = JSON.parse(json);

      expect(parsed.pattern.pieces).toBeDefined();
      expect(parsed.pattern.pieces.length).toBe(pattern.pieces.length);
    });

    test('JSON includes all required fields', () => {
      const json = exportToJSON(pattern);

      const obj = JSON.parse(json);
      expect(obj).toHaveProperty('pattern');
      expect(obj.pattern).toHaveProperty('pieces');
    });

    test('JSON export is deterministic (same input = same output)', () => {
      const json1 = exportToJSON(pattern);
      const json2 = exportToJSON(pattern);

      expect(json1).toBe(json2);
    });

    test('JSON includes piece metadata', () => {
      const json = exportToJSON(pattern);
      const obj = JSON.parse(json);

      expect(obj.pattern.pieces[0]).toHaveProperty('id');
      expect(obj.pattern.pieces[0]).toHaveProperty('name');
      expect(obj.pattern.pieces[0]).toHaveProperty('outline');
    });
  });

  describe('DST Export', () => {
    // DST export requires an EmbroideryProgram, not a PatternResult
    // Skipping these tests as they require embroidery data
    test.skip('produces Uint8Array output', () => {
      // Would need proper EmbroideryProgram
    });

    test.skip('DST has minimum valid file size', () => {
      // Would need proper EmbroideryProgram
    });

    test.skip('DST starts with valid Tajima header', () => {
      // Would need proper EmbroideryProgram
    });

    test.skip('DST export is repeatable', () => {
      // Would need proper EmbroideryProgram
    });
  });

  describe('Export Consistency', () => {
    test('all exports handle same piece data', () => {
      expect(() => {
        exportToSVG(pattern);
        exportToDXF(pattern);
        exportToJSON(pattern);
        // exportToDST requires EmbroideryProgram
      }).not.toThrow();
    });

    test('exports produce non-empty outputs', () => {
      const svg = exportToSVG(pattern);
      const dxf = exportToDXF(pattern);
      const json = exportToJSON(pattern);

      expect(svg.length).toBeGreaterThan(0);
      expect(dxf.length).toBeGreaterThan(0);
      expect(json.length).toBeGreaterThan(0);
    });
  });
});
