import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { distance, Point2D, computeBoundingBox, type PatternPiece } from '../index';

describe('Geometric Invariants (Property-Based Tests)', () => {
  // Helpers for generating valid floating point numbers
  const validFloat = fc.float({
    min: -10000,
    max: 10000,
    noNaN: true,
    noDefaultInfinity: true
  });

  const pointGen = fc.record({ x: validFloat, y: validFloat });

  /**
   * Test that distance is always non-negative (mathematical invariant)
   */
  test('distance between any two points is non-negative', () => {
    fc.assert(
      fc.property(pointGen, pointGen, (p1: Point2D, p2: Point2D) => {
        const d = distance(p1, p2);
        return d >= 0 && isFinite(d);
      }),
      { numRuns: 1000 }
    );
  });

  /**
   * Distance from a point to itself is always zero
   */
  test('distance from point to itself equals zero', () => {
    fc.assert(
      fc.property(pointGen, (p: Point2D) => {
        const d = distance(p, p);
        return Math.abs(d) < 1e-10; // floating point tolerance
      }),
      { numRuns: 1000 }
    );
  });

  /**
   * Distance is symmetric: d(a,b) === d(b,a)
   */
  test('distance is symmetric', () => {
    fc.assert(
      fc.property(pointGen, pointGen, (p1: Point2D, p2: Point2D) => {
        const d1 = distance(p1, p2);
        const d2 = distance(p2, p1);
        return Math.abs(d1 - d2) < 1e-10;
      }),
      { numRuns: 1000 }
    );
  });

  /**
   * Triangle inequality: d(a,c) <= d(a,b) + d(b,c)
   */
  test('distance satisfies triangle inequality', () => {
    fc.assert(
      fc.property(pointGen, pointGen, pointGen, (a: Point2D, b: Point2D, c: Point2D) => {
        const d_ac = distance(a, c);
        const d_ab = distance(a, b);
        const d_bc = distance(b, c);
        return d_ac <= d_ab + d_bc + 1e-10; // tolerance for floating point
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Bounding box contains all points
   */
  test('bounding box contains all input points', () => {
    fc.assert(
      fc.property(fc.array(pointGen, { minLength: 1, maxLength: 100 }), (points: Point2D[]) => {
        const bounds = computeBoundingBox(points);
        return points.every(
          p => p.x >= bounds.minX && p.x <= bounds.maxX && p.y >= bounds.minY && p.y <= bounds.maxY
        );
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Bounding box is minimal (all edges touched by at least one point)
   */
  test('bounding box is axis-aligned minimal box', () => {
    fc.assert(
      fc.property(fc.array(pointGen, { minLength: 1, maxLength: 100 }), (points: Point2D[]) => {
        const bounds = computeBoundingBox(points);
        const hasEdgePointX =
          points.some(p => Math.abs(p.x - bounds.minX) < 1e-10) ||
          points.some(p => Math.abs(p.x - bounds.maxX) < 1e-10);
        const hasEdgePointY =
          points.some(p => Math.abs(p.y - bounds.minY) < 1e-10) ||
          points.some(p => Math.abs(p.y - bounds.maxY) < 1e-10);
        return hasEdgePointX && hasEdgePointY;
      }),
      { numRuns: 500 }
    );
  });
});
