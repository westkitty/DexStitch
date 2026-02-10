import { describe, test, expect } from 'vitest';
import { generatePattern } from '../patternEngine';
import type { MeasurementSet, PatternSpec } from '@dexstitch/types';

describe('Pattern Engine', () => {
  const standardMeasurements: MeasurementSet = {
    height: 1700,
    neck: 380,
    chest: 950,
    waist: 800,
    hip: 900
  };

  const basicSpec: PatternSpec = {
    id: 'test-pattern',
    name: 'Test Pattern',
    parameters: {
      ease: 1.05,
      dartDepth: 0
    }
  };

  describe('generatePattern()', () => {
    test('generates valid pattern result', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      expect(result).toHaveProperty('pieces');
      expect(Array.isArray(result.pieces)).toBe(true);
      expect(result.pieces.length).toBeGreaterThan(0);
    });

    test('produces front and back panels', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      expect(result.pieces.length).toBe(2);
      expect(result.pieces[0].name).toBe('Front Panel');
      expect(result.pieces[1].name).toBe('Back Panel');
    });

    test('each piece has valid outline', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      for (const piece of result.pieces) {
        expect(piece.outline).toBeDefined();
        expect(Array.isArray(piece.outline)).toBe(true);
        expect(piece.outline.length).toBeGreaterThanOrEqual(3);

        // All points should have x and y
        for (const point of piece.outline) {
          expect(typeof point.x).toBe('number');
          expect(typeof point.y).toBe('number');
          expect(Number.isFinite(point.x)).toBe(true);
          expect(Number.isFinite(point.y)).toBe(true);
        }
      }
    });

    test('respects ease parameter', () => {
      const noEaseSpec = { ...basicSpec, parameters: { ease: 1.0, dartDepth: 0 } };
      const highEaseSpec = { ...basicSpec, parameters: { ease: 1.5, dartDepth: 0 } };

      const noEaseResult = generatePattern(standardMeasurements, noEaseSpec);
      const highEaseResult = generatePattern(standardMeasurements, highEaseSpec);

      // Higher ease should produce wider panels
      const noEaseWidth = Math.max(...noEaseResult.pieces[0].outline.map(p => p.x));
      const highEaseWidth = Math.max(...highEaseResult.pieces[0].outline.map(p => p.x));

      expect(highEaseWidth).toBeGreaterThan(noEaseWidth);
    });

    test('adds dart when dartDepth > 0', () => {
      const dartSpec = { ...basicSpec, parameters: { ease: 1.05, dartDepth: 20 } };
      const result = generatePattern(standardMeasurements, dartSpec);

      // Front panel should have more points when dart is included
      const frontPanel = result.pieces[0];
      expect(frontPanel.outline.length).toBeGreaterThan(4); // More than simple rectangle
    });

    test('no dart when dartDepth = 0', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      const frontPanel = result.pieces[0];
      expect(frontPanel.outline.length).toBe(4); // Simple rectangle
    });

    test('includes grainlines', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      for (const piece of result.pieces) {
        expect(piece.grainline).toBeDefined();
        if (piece.grainline) {
          expect(Array.isArray(piece.grainline)).toBe(true);
          expect(piece.grainline.length).toBeGreaterThanOrEqual(2);
        }
      }
    });

    test('handles small measurements', () => {
      const smallMeasurements: MeasurementSet = {
        height: 1000,
        neck: 200,
        chest: 500,
        waist: 400,
        hip: 500
      };

      expect(() => generatePattern(smallMeasurements, basicSpec)).not.toThrow();
      const result = generatePattern(smallMeasurements, basicSpec);
      expect(result.pieces.length).toBe(2);
    });

    test('handles large measurements', () => {
      const largeMeasurements: MeasurementSet = {
        height: 2200,
        neck: 600,
        chest: 1500,
        waist: 1300,
        hip: 1500
      };

      expect(() => generatePattern(largeMeasurements, basicSpec)).not.toThrow();
      const result = generatePattern(largeMeasurements, basicSpec);
      expect(result.pieces.length).toBe(2);
    });

    test('pattern dimensions scale with measurements', () => {
      const small = { ...standardMeasurements, chest: 700 };
      const large = { ...standardMeasurements, chest: 1200 };

      const smallResult = generatePattern(small, basicSpec);
      const largeResult = generatePattern(large, basicSpec);

      const smallWidth = Math.max(...smallResult.pieces[0].outline.map(p => p.x));
      const largeWidth = Math.max(...largeResult.pieces[0].outline.map(p => p.x));

      expect(largeWidth).toBeGreaterThan(smallWidth);
    });

    test('produces CCW winding for outlines', () => {
      const result = generatePattern(standardMeasurements, basicSpec);

      // Simple test: for a rectangle, points should go CCW
      const piece = result.pieces[1]; // Back panel (simple rectangle)
      expect(piece.outline[0].x).toBeLessThan(piece.outline[1].x); // Move right
      expect(piece.outline[1].y).toBeLessThan(piece.outline[2].y); // Move down
    });

    test('pattern is deterministic', () => {
      const result1 = generatePattern(standardMeasurements, basicSpec);
      const result2 = generatePattern(standardMeasurements, basicSpec);

      expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    });
  });
});
