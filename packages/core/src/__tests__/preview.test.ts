import { describe, test, expect } from 'vitest';
import { buildPreviewModel } from '../preview';
import { generatePattern } from '../patternEngine';
import { nestPieces } from '../nest';
import type { MeasurementSet, PatternSpec, EmbroideryProgram } from '@dexstitch/types';

describe('Preview Model Builder', () => {
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

  describe('buildPreviewModel()', () => {
    test('returns valid preview model', () => {
      const pattern = generatePattern(measurements, spec);
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      });

      const preview = buildPreviewModel(pattern, nesting);

      expect(preview).toHaveProperty('pattern');
      expect(preview).toHaveProperty('nesting');
      expect(preview).toHaveProperty('embroidery');
      expect(preview).toHaveProperty('bounds');
    });

    test('includes pattern in preview', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.pattern).toBe(pattern);
      expect(preview.pattern?.pieces.length).toBe(2);
    });

    test('includes nesting in preview', () => {
      const pattern = generatePattern(measurements, spec);
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      });

      const preview = buildPreviewModel(pattern, nesting);

      expect(preview.nesting).toBe(nesting);
      expect(preview.nesting?.placements.length).toBeGreaterThan(0);
    });

    test('computes bounding box from pattern', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.bounds).toBeDefined();
      expect(preview.bounds).toHaveProperty('minX');
      expect(preview.bounds).toHaveProperty('minY');
      expect(preview.bounds).toHaveProperty('maxX');
      expect(preview.bounds).toHaveProperty('maxY');
    });

    test('bounds are positive dimensions', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.bounds).toBeDefined();
      if (preview.bounds) {
        const width = preview.bounds.maxX - preview.bounds.minX;
        const height = preview.bounds.maxY - preview.bounds.minY;

        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
      }
    });

    test('handles null pattern', () => {
      const preview = buildPreviewModel(null, null);

      expect(preview.pattern).toBeNull();
      expect(preview.nesting).toBeNull();
      expect(preview.embroidery).toBeNull();
      expect(preview.bounds).toBeUndefined();
    });

    test('handles null nesting', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.pattern).toBe(pattern);
      expect(preview.nesting).toBeNull();
    });

    test('handles null embroidery', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null, null);

      expect(preview.embroidery).toBeNull();
    });

    test('includes embroidery when provided', () => {
      const pattern = generatePattern(measurements, spec);
      const embroidery: EmbroideryProgram = {
        stitches: [
          { x: 0, y: 0, command: 'jump' },
          { x: 10, y: 10, command: 'stitch' }
        ],
        metadata: {
          stitchCount: 2
        }
      };

      const preview = buildPreviewModel(pattern, null, embroidery);

      expect(preview.embroidery).toBe(embroidery);
      expect(preview.embroidery?.stitches.length).toBe(2);
    });

    test('bounds include all pieces', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.bounds).toBeDefined();
      if (preview.bounds) {
        // Check that all piece points are within bounds
        for (const piece of pattern.pieces) {
          for (const point of piece.outline) {
            expect(point.x).toBeGreaterThanOrEqual(preview.bounds.minX);
            expect(point.x).toBeLessThanOrEqual(preview.bounds.maxX);
            expect(point.y).toBeGreaterThanOrEqual(preview.bounds.minY);
            expect(point.y).toBeLessThanOrEqual(preview.bounds.maxY);
          }
        }
      }
    });

    test('bounds include grainlines', () => {
      const pattern = generatePattern(measurements, spec);
      const preview = buildPreviewModel(pattern, null);

      expect(preview.bounds).toBeDefined();
      if (preview.bounds) {
        for (const piece of pattern.pieces) {
          if (piece.grainline) {
            for (const point of piece.grainline) {
              expect(point.x).toBeGreaterThanOrEqual(preview.bounds.minX - 1); // Small tolerance
              expect(point.x).toBeLessThanOrEqual(preview.bounds.maxX + 1);
              expect(point.y).toBeGreaterThanOrEqual(preview.bounds.minY - 1);
              expect(point.y).toBeLessThanOrEqual(preview.bounds.maxY + 1);
            }
          }
        }
      }
    });

    test('accepts all parameters simultaneously', () => {
      const pattern = generatePattern(measurements, spec);
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      });
      const embroidery: EmbroideryProgram = {
        stitches: [{ x: 0, y: 0, command: 'jump' }],
        metadata: { stitchCount: 1 }
      };

      const preview = buildPreviewModel(pattern, nesting, embroidery);

      expect(preview.pattern).toBe(pattern);
      expect(preview.nesting).toBe(nesting);
      expect(preview.embroidery).toBe(embroidery);
      expect(preview.bounds).toBeDefined();
    });
  });
});
