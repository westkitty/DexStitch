import { describe, test, expect } from 'vitest';
import { nestPieces } from '../nest';
import { generatePattern } from '../patternEngine';
import type { MeasurementSet, PatternSpec, NestingInput } from '@dexstitch/types';

describe('Nesting Algorithm', () => {
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
    parameters: { ease: 1.05, dartDepth: 0 }
  };

  describe('nestPieces()', () => {
    test('returns valid nesting output', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1000,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result).toHaveProperty('placements');
      expect(result).toHaveProperty('utilizedArea');
      expect(result).toHaveProperty('binArea');
    });

    test('places all pieces', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 2000,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.placements.length).toBe(pattern.pieces.length);
    });

    test('each placement has required properties', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      for (const placement of result.placements) {
        expect(placement).toHaveProperty('pieceId');
        expect(placement).toHaveProperty('x');
        expect(placement).toHaveProperty('y');
        expect(placement).toHaveProperty('rotation');
        expect(placement).toHaveProperty('flipped');

        expect(typeof placement.x).toBe('number');
        expect(typeof placement.y).toBe('number');
        expect(typeof placement.rotation).toBe('number');
        expect(typeof placement.flipped).toBe('boolean');
      }
    });

    test('pieces stay within bin width', () => {
      const pattern = generatePattern(measurements, spec);
      const binWidth = 1500;
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      for (const placement of result.placements) {
        // Find the original piece
        const piece = pattern.pieces.find(p => p.id === placement.pieceId);
        expect(piece).toBeDefined();

        // Check that x + piece width <= binWidth (with some padding tolerance)
        const maxX = Math.max(...piece!.outline.map(p => p.x));
        expect(placement.x + maxX).toBeLessThanOrEqual(binWidth + 20); // 20mm padding tolerance
      }
    });

    test('utilizedArea is positive for non-empty input', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.utilizedArea).toBeGreaterThan(0);
    });

    test('binArea is greater than or equal to utilizedArea', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.binArea).toBeGreaterThanOrEqual(result.utilizedArea);
    });

    test('handles empty pieces array', () => {
      const input: NestingInput = {
        pieces: [],
        binWidth: 1000,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.placements.length).toBe(0);
      expect(result.utilizedArea).toBe(0);
      expect(result.binArea).toBe(0);
    });

    test('handles single piece', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: [pattern.pieces[0]],
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.placements.length).toBe(1);
      expect(result.placements[0].x).toBeGreaterThanOrEqual(0);
      expect(result.placements[0].y).toBeGreaterThanOrEqual(0);
    });

    test('rotation support when enabled', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1000,
        allowRotation: true,
        allowMirroring: false
      };

      const result = nestPieces(input);

      // Should successfully place pieces (rotation may help fit)
      expect(result.placements.length).toBe(pattern.pieces.length);
    });

    test('deterministic for same input', () => {
      const pattern = generatePattern(measurements, spec);
      const input: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      };

      const result1 = nestPieces(input);
      const result2 = nestPieces(input);

      expect(result1.placements.length).toBe(result2.placements.length);
      expect(result1.utilizedArea).toBe(result2.utilizedArea);
    });

    test('larger bin width improves packing', () => {
      const pattern = generatePattern(measurements, spec);

      const narrowInput: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 500,
        allowRotation: false,
        allowMirroring: false
      };

      const wideInput: NestingInput = {
        pieces: pattern.pieces,
        binWidth: 2000,
        allowRotation: false,
        allowMirroring: false
      };

      const narrowResult = nestPieces(narrowInput);
      const wideResult = nestPieces(wideInput);

      // Wider bin should have equal or better efficiency
      expect(wideResult.placements.length).toBeGreaterThanOrEqual(narrowResult.placements.length);
    });

    test('handles pieces with different sizes', () => {
      // Generate patterns with different measurements
      const small = generatePattern(
        { ...measurements, chest: 700 },
        spec
      );
      const large = generatePattern(
        { ...measurements, chest: 1200 },
        spec
      );

      const input: NestingInput = {
        pieces: [...small.pieces, ...large.pieces],
        binWidth: 2000,
        allowRotation: false,
        allowMirroring: false
      };

      const result = nestPieces(input);

      expect(result.placements.length).toBe(4); // 2 from each pattern
    });
  });
});
