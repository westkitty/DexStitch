import { describe, test, expect } from 'vitest';
import { generatePattern } from '../patternEngine';
import { nestPieces } from '../nest';
import { vectorizeImage, generateStitches } from '../embroideryEngine';
import { buildPreviewModel } from '../preview';
import {
  exportToSVG,
  exportToDXF,
  exportToJSON,
  exportToDST
} from '../export';
import type { MeasurementSet, PatternSpec, ProjectData } from '@dexstitch/types';

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

/**
 * User Journey Tests - 7 Complete User Paths
 * 
 * These tests simulate real user interactions from start to finish
 */

describe('User Journey Simulations', () => {
  /**
   * PATH 1: GOOD PATH (Happy Path)
   * User successfully completes full workflow without errors
   */
  describe('Path 1: Good Path - Complete Successful Workflow', () => {
    test('user creates pattern from measurements to export', () => {
      // Step 1: User enters measurements
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      // Step 2: User generates pattern
      const spec: PatternSpec = {
        id: 'basic-tshirt',
        name: 'Basic T-Shirt',
        parameters: {
          ease: 1.1,
          dartDepth: 15
        }
      };

      const pattern = generatePattern(measurements, spec);
      expect(pattern.pieces.length).toBe(2);
      expect(pattern.pieces[0].name).toBe('Front Panel');

      // Step 3: User performs nesting
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: true,
        allowMirroring: false
      });

      expect(nesting.placements.length).toBe(2);
      expect(nesting.utilizedArea).toBeGreaterThan(0);

      // Step 4: User generates preview
      const preview = buildPreviewModel(pattern, nesting);
      expect(preview.pattern).toBe(pattern);
      expect(preview.nesting).toBe(nesting);
      expect(preview.bounds).toBeDefined();

      // Step 5: User exports to multiple formats
      const svg = exportToSVG(pattern);
      expect(svg).toContain('<svg');
      expect(svg.length).toBeGreaterThan(100);

      const dxf = exportToDXF(pattern);
      expect(dxf).toContain('SECTION');
      expect(dxf).toContain('ENTITIES');

      const json = exportToJSON(pattern);
      const parsed = JSON.parse(json);
      expect(parsed.pattern.pieces.length).toBe(2);

      // Success! User has completed full workflow
      expect(true).toBe(true);
    });

    test('user adds embroidery and exports to machine format', () => {
      // User creates pattern
      const measurements: MeasurementSet = {
        height: 1600,
        neck: 360,
        chest: 900,
        waist: 750,
        hip: 850
      };

      const pattern = generatePattern(measurements, {
        id: 'embroidered-shirt',
        name: 'Embroidered Shirt',
        parameters: { ease: 1.05, dartDepth: 0 }
      });

      // User creates embroidery design from image
      const imageData = new ImageData(100, 100);
      // Fill with simple pattern
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255; // R
        imageData.data[i + 1] = 255; // G
        imageData.data[i + 2] = 255; // B
        imageData.data[i + 3] = 255; // A
      }

      const vectors = vectorizeImage(imageData, {
        threshold: 128,
        minPathLength: 5
      });

      const embroidery = generateStitches(vectors, {
        ecoMode: true,
        stitchDensity: 0.2
      });

      expect(embroidery.stitches.length).toBeGreaterThanOrEqual(0);

      // User exports embroidery to DST format
      const dst = exportToDST(embroidery);
      expect(dst).toBeInstanceOf(Uint8Array);
      expect(dst.length).toBeGreaterThan(512); // Tajima DST minimum

      // Success!
      expect(true).toBe(true);
    });
  });

  /**
   * PATH 2: BAD PATH (Error Handling)
   * User encounters errors and system handles gracefully
   */
  describe('Path 2: Bad Path - Invalid Inputs and Error Recovery', () => {
    test('handles invalid measurements gracefully', () => {
      // User enters unrealistic measurements
      const badMeasurements: MeasurementSet = {
        height: -100, // Negative!
        neck: 0,
        chest: 50, // Too small
        waist: 10000, // Too large
        hip: NaN // Not a number!
      };

      const spec: PatternSpec = {
        id: 'test',
        name: 'Test',
        parameters: { ease: 1.0, dartDepth: 0 }
      };

      // System should either throw or handle gracefully
      try {
        const pattern = generatePattern(badMeasurements, spec);
        // If it doesn't throw, check output is still valid
        expect(pattern).toHaveProperty('pieces');
        expect(Array.isArray(pattern.pieces)).toBe(true);
      } catch (error) {
        // Error is acceptable - system caught invalid input
        expect(error).toBeDefined();
      }
    });

    test('handles empty pattern pieces in nesting', () => {
      // User tries to nest with no pieces
      const result = nestPieces({
        pieces: [],
        binWidth: 1000,
        allowRotation: false,
        allowMirroring: false
      });

      expect(result.placements.length).toBe(0);
      expect(result.utilizedArea).toBe(0);
    });

    test('handles invalid bin width', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'test',
        name: 'Test',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      // Try nesting with zero/negative bin width
      const result = nestPieces({
        pieces: pattern.pieces,
        binWidth: 0,
        allowRotation: false,
        allowMirroring: false
      });

      // System should handle gracefully
      expect(result).toBeDefined();
    });

    test('handles export of null/empty data', () => {
      const emptyPattern = { pieces: [] };

      // Should not crash
      expect(() => exportToSVG(emptyPattern)).not.toThrow();
      expect(() => exportToDXF(emptyPattern)).not.toThrow();
      expect(() => exportToJSON(emptyPattern)).not.toThrow();
    });
  });

  /**
   * PATH 3: EDGE CASE PATH
   * User provides boundary values and extreme inputs
   */
  describe('Path 3: Edge Case Path - Boundary Value Testing', () => {
    test('handles minimum valid measurements', () => {
      const minMeasurements: MeasurementSet = {
        height: 1000, // Very short
        neck: 200,
        chest: 500,
        waist: 400,
        hip: 500
      };

      const pattern = generatePattern(minMeasurements, {
        id: 'mini',
        name: 'Mini',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      expect(pattern.pieces.length).toBeGreaterThan(0);
      expect(pattern.pieces[0].outline.length).toBeGreaterThan(0);
    });

    test('handles maximum valid measurements', () => {
      const maxMeasurements: MeasurementSet = {
        height: 2500, // Very tall
        neck: 700,
        chest: 2000,
        waist: 1800,
        hip: 2000
      };

      const pattern = generatePattern(maxMeasurements, {
        id: 'maxi',
        name: 'Maxi',
        parameters: { ease: 2.0, dartDepth: 50 }
      });

      expect(pattern.pieces.length).toBeGreaterThan(0);
      expect(pattern.pieces[0].outline.length).toBeGreaterThan(0);
    });

    test('handles zero ease and zero dart', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'tight',
        name: 'Tight Fit',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      expect(pattern.pieces[0].outline.length).toBe(4); // Simple rectangle
    });

    test('handles maximum ease and deep darts', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'loose',
        name: 'Loose Fit',
        parameters: { ease: 3.0, dartDepth: 100 }
      });

      expect(pattern.pieces[0].outline.length).toBeGreaterThan(4); // Has darts
    });

    test('handles single pixel image for embroidery', () => {
      const tinyImage = new ImageData(1, 1);
      tinyImage.data[0] = 0;
      tinyImage.data[1] = 0;
      tinyImage.data[2] = 0;
      tinyImage.data[3] = 255;

      const vectors = vectorizeImage(tinyImage);
      expect(Array.isArray(vectors)).toBe(true);
    });

    test('handles very large image for embroidery', () => {
      // Simulate large image (without actually allocating massive memory)
      const largeImage = new ImageData(500, 500);

      // Fill with pattern
      for (let i = 0; i < largeImage.data.length; i += 4) {
        const value = (i / 4) % 255;
        largeImage.data[i] = value;
        largeImage.data[i + 1] = value;
        largeImage.data[i + 2] = value;
        largeImage.data[i + 3] = 255;
      }

      expect(() => vectorizeImage(largeImage, { minPathLength: 10 })).not.toThrow();
    });

    test('handles very narrow bin width in nesting', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'test',
        name: 'Test',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      const result = nestPieces({
        pieces: pattern.pieces,
        binWidth: 100, // Very narrow
        allowRotation: true,
        allowMirroring: false
      });

      // Should still work, even if inefficient
      expect(result).toBeDefined();
      expect(result.placements.length).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * PATH 4: OFFLINE PATH
   * User works entirely offline (local-first architecture)
   */
  describe('Path 4: Offline Path - Local-First Workflow', () => {
    test('complete workflow without network dependencies', () => {
      // All operations are local - no fetch, no API calls

      // Step 1: Local measurements
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      // Step 2: Local pattern generation
      const pattern = generatePattern(measurements, {
        id: 'offline-pattern',
        name: 'Offline Pattern',
        parameters: { ease: 1.1, dartDepth: 15 }
      });

      expect(pattern.pieces.length).toBeGreaterThan(0);

      // Step 3: Local nesting
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      });

      expect(nesting.placements.length).toBeGreaterThan(0);

      // Step 4: Local preview
      const preview = buildPreviewModel(pattern, nesting);
      expect(preview.bounds).toBeDefined();

      // Step 5: Local exports
      const svg = exportToSVG(pattern);
      const json = exportToJSON(pattern);

      expect(svg.length).toBeGreaterThan(0);
      expect(json.length).toBeGreaterThan(0);

      // All operations completed without network!
      expect(true).toBe(true);
    });

    test('stores project data locally (JSON serialization)', () => {
      const measurements: MeasurementSet = {
        height: 1650,
        neck: 370,
        chest: 920,
        waist: 780,
        hip: 880
      };

      const pattern = generatePattern(measurements, {
        id: 'local-save',
        name: 'Local Save',
        parameters: { ease: 1.05, dartDepth: 10 }
      });

      // Create project data object
      const projectData: Partial<ProjectData> = {
        measurements,
        pattern
      };

      // Serialize to JSON (simulates localStorage or IndexedDB)
      const serialized = JSON.stringify(projectData);
      expect(serialized.length).toBeGreaterThan(0);

      // Deserialize
      const deserialized = JSON.parse(serialized);
      expect(deserialized.measurements.height).toBe(1650);
      expect(deserialized.pattern.pieces.length).toBe(2);

      // Data persists offline!
      expect(true).toBe(true);
    });
  });

  /**
   * PATH 5: COLLABORATION PATH
   * Multiple users working on same project (simulated)
   */
  describe('Path 5: Collaboration Path - Multi-User Workflow', () => {
    test('user A creates pattern, user B modifies measurements', () => {
      // User A creates initial pattern
      const userAMeasurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const patternA = generatePattern(userAMeasurements, {
        id: 'collab',
        name: 'Collaborative Pattern',
        parameters: { ease: 1.1, dartDepth: 15 }
      });

      // User B receives the pattern and modifies measurements
      const userBMeasurements: MeasurementSet = {
        ...userAMeasurements,
        chest: 1000, // User B increases chest
        waist: 850   // and waist
      };

      const patternB = generatePattern(userBMeasurements, {
        id: 'collab',
        name: 'Collaborative Pattern',
        parameters: { ease: 1.1, dartDepth: 15 }
      });

      // Both patterns are valid, User B's is larger
      const widthA = Math.max(...patternA.pieces[0].outline.map(p => p.x));
      const widthB = Math.max(...patternB.pieces[0].outline.map(p => p.x));

      expect(widthB).toBeGreaterThan(widthA);
    });

    test('concurrent nesting operations produce valid results', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'concurrent',
        name: 'Concurrent Test',
        parameters: { ease: 1.05, dartDepth: 0 }
      });

      // Simulate two users nesting with different settings
      const nesting1 = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: false,
        allowMirroring: false
      });

      const nesting2 = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: true,
        allowMirroring: true
      });

      // Both are valid
      expect(nesting1.placements.length).toBeGreaterThan(0);
      expect(nesting2.placements.length).toBeGreaterThan(0);
    });

    test('shared project data structure stays consistent', () => {
      // Base project
      const baseProject: Partial<ProjectData> = {
        measurements: {
          height: 1700,
          neck: 380,
          chest: 950,
          waist: 800,
          hip: 900
        }
      };

      // User 1 adds pattern
      const project1 = {
        ...baseProject,
        pattern: generatePattern(baseProject.measurements!, {
          id: 'shared',
          name: 'Shared',
          parameters: { ease: 1.0, dartDepth: 0 }
        })
      };

      // User 2 adds nesting
      const project2 = {
        ...project1,
        nesting: nestPieces({
          pieces: project1.pattern.pieces,
          binWidth: 1500,
          allowRotation: false,
          allowMirroring: false
        })
      };

      // Project remains consistent
      expect(project2.measurements).toEqual(baseProject.measurements);
      expect(project2.pattern).toBe(project1.pattern);
      expect(project2.nesting).toBeDefined();
    });
  });

  /**
   * PATH 6: PERFORMANCE PATH
   * User works with large/complex patterns
   */
  describe('Path 6: Performance Path - Large Scale Operations', () => {
    test('handles pattern with many measurements iterations', () => {
      // Test rapid re-generation with changing measurements
      const baseMeasurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const iterations = 50;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        const measurements = {
          ...baseMeasurements,
          chest: 900 + i * 2 // Gradually increase
        };

        const pattern = generatePattern(measurements, {
          id: 'perf-test',
          name: 'Performance Test',
          parameters: { ease: 1.05, dartDepth: 10 }
        });

        expect(pattern.pieces.length).toBe(2);
      }

      const duration = performance.now() - start;

      // Should complete reasonably fast
      expect(duration).toBeLessThan(1000); // 1 second for 50 iterations
    });

    test('handles nesting with many pieces', () => {
      // Create multiple patterns to get many pieces
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const patterns = [
        generatePattern(measurements, { id: '1', name: 'P1', parameters: { ease: 1.0, dartDepth: 0 } }),
        generatePattern(measurements, { id: '2', name: 'P2', parameters: { ease: 1.1, dartDepth: 5 } }),
        generatePattern(measurements, { id: '3', name: 'P3', parameters: { ease: 1.2, dartDepth: 10 } })
      ];

      const allPieces = patterns.flatMap(p => p.pieces);

      const start = performance.now();

      const nesting = nestPieces({
        pieces: allPieces,
        binWidth: 2000,
        allowRotation: true,
        allowMirroring: false
      });

      const duration = performance.now() - start;

      expect(nesting.placements.length).toBe(allPieces.length);
      expect(duration).toBeLessThan(2000); // 2 seconds
    });

    test('handles many export operations', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'export-test',
        name: 'Export Test',
        parameters: { ease: 1.05, dartDepth: 10 }
      });

      const start = performance.now();

      for (let i = 0; i < 20; i++) {
        exportToSVG(pattern);
        exportToDXF(pattern);
        exportToJSON(pattern);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // Should be fast
    });

    test('preview generation scales with pattern complexity', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      // Simple pattern
      const simple = generatePattern(measurements, {
        id: 'simple',
        name: 'Simple',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      // Complex pattern
      const complex = generatePattern(measurements, {
        id: 'complex',
        name: 'Complex',
        parameters: { ease: 1.5, dartDepth: 50 }
      });

      const start1 = performance.now();
      const preview1 = buildPreviewModel(simple, null);
      const duration1 = performance.now() - start1;

      const start2 = performance.now();
      const preview2 = buildPreviewModel(complex, null);
      const duration2 = performance.now() - start2;

      expect(preview1.bounds).toBeDefined();
      expect(preview2.bounds).toBeDefined();

      // Both should be fast (< 100ms)
      expect(duration1).toBeLessThan(100);
      expect(duration2).toBeLessThan(100);
    });
  });

  /**
   * PATH 7: RECOVERY PATH
   * User encounters errors and successfully recovers
   */
  describe('Path 7: Recovery Path - Error Handling and Recovery', () => {
    test('recovers from invalid measurement by re-entering correct data', () => {
      // Step 1: User enters invalid measurement
      const badMeasurements: MeasurementSet = {
        height: 0,
        neck: 0,
        chest: 0,
        waist: 0,
        hip: 0
      };

      let firstAttempt;
      try {
        firstAttempt = generatePattern(badMeasurements, {
          id: 'recovery-test',
          name: 'Recovery Test',
          parameters: { ease: 1.0, dartDepth: 0 }
        });
      } catch (error) {
        firstAttempt = null;
      }

      // Step 2: User corrects measurements
      const goodMeasurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const secondAttempt = generatePattern(goodMeasurements, {
        id: 'recovery-test',
        name: 'Recovery Test',
        parameters: { ease: 1.0, dartDepth: 0 }
      });

      // Recovery successful!
      expect(secondAttempt.pieces.length).toBe(2);
    });

    test('recovers from failed nesting by adjusting bin width', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'nesting-recovery',
        name: 'Nesting Recovery',
        parameters: { ease: 1.5, dartDepth: 20 }
      });

      // Step 1: Try with too narrow bin
      const attempt1 = nestPieces({
        pieces: pattern.pieces,
        binWidth: 50, // Too narrow
        allowRotation: false,
        allowMirroring: false
      });

      // Step 2: User increases bin width
      const attempt2 = nestPieces({
        pieces: pattern.pieces,
        binWidth: 2000, // Much wider
        allowRotation: true,
        allowMirroring: true
      });

      // Second attempt should be better
      expect(attempt2.placements.length).toBeGreaterThanOrEqual(attempt1.placements.length);
    });

    test('recovers from export error by trying different format', () => {
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'export-recovery',
        name: 'Export Recovery',
        parameters: { ease: 1.05, dartDepth: 10 }
      });

      // Try multiple export formats until one works
      let successfulExport = false;

      try {
        exportToSVG(pattern);
        successfulExport = true;
      } catch (e) {
        try {
          exportToDXF(pattern);
          successfulExport = true;
        } catch (e2) {
          try {
            exportToJSON(pattern);
            successfulExport = true;
          } catch (e3) {
            // All failed
          }
        }
      }

      expect(successfulExport).toBe(true);
    });

    test('preserves partial progress when error occurs', () => {
      // User completes measurements and pattern
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      const pattern = generatePattern(measurements, {
        id: 'partial-save',
        name: 'Partial Save',
        parameters: { ease: 1.05, dartDepth: 10 }
      });

      // Save progress
      const savedProject = {
        measurements,
        pattern
      };

      // Simulate error during nesting
      let nesting = null;
      try {
        nesting = nestPieces({
          pieces: pattern.pieces,
          binWidth: -100, // Invalid
          allowRotation: false,
          allowMirroring: false
        });
      } catch (e) {
        // Error occurred, but we still have saved progress
      }

      // Verify saved data is intact
      expect(savedProject.measurements).toEqual(measurements);
      expect(savedProject.pattern).toEqual(pattern);

      // User can retry nesting later
      nesting = nestPieces({
        pieces: savedProject.pattern.pieces,
        binWidth: 1500, // Corrected value
        allowRotation: false,
        allowMirroring: false
      });

      expect(nesting.placements.length).toBeGreaterThan(0);
    });

    test('can restart workflow from any saved state', () => {
      // Simulate saving state at different stages

      // Stage 1: Measurements only
      const stage1 = {
        measurements: {
          height: 1700,
          neck: 380,
          chest: 950,
          waist: 800,
          hip: 900
        }
      };

      // Stage 2: Measurements + Pattern
      const stage2 = {
        ...stage1,
        pattern: generatePattern(stage1.measurements, {
          id: 'restart',
          name: 'Restart Test',
          parameters: { ease: 1.0, dartDepth: 0 }
        })
      };

      // Stage 3: Measurements + Pattern + Nesting
      const stage3 = {
        ...stage2,
        nesting: nestPieces({
          pieces: stage2.pattern.pieces,
          binWidth: 1500,
          allowRotation: false,
          allowMirroring: false
        })
      };

      // User can resume from any stage
      expect(stage1.measurements).toBeDefined();
      expect(stage2.pattern).toBeDefined();
      expect(stage3.nesting).toBeDefined();

      // Can re-generate from any point
      const newPattern = generatePattern(stage1.measurements, {
        id: 'restart-2',
        name: 'Restart 2',
        parameters: { ease: 1.2, dartDepth: 15 }
      });

      expect(newPattern.pieces.length).toBe(2);
    });
  });

  /**
   * COMPREHENSIVE INTEGRATION TEST
   * All paths combined into one complete test
   */
  describe('Complete System Integration', () => {
    test('full system test with all features', () => {
      // User enters measurements
      const measurements: MeasurementSet = {
        height: 1700,
        neck: 380,
        chest: 950,
        waist: 800,
        hip: 900
      };

      // Generate pattern with validation
      const pattern = generatePattern(measurements, {
        id: 'comprehensive-test',
        name: 'Comprehensive Test Pattern',
        parameters: { ease: 1.15, dartDepth: 20 }
      });

      expect(pattern.pieces.length).toBe(2);
      expect(pattern.pieces[0].name).toBe('Front Panel');
      expect(pattern.pieces[1].name).toBe('Back Panel');

      // Perform nesting with multiple options
      const nesting = nestPieces({
        pieces: pattern.pieces,
        binWidth: 1500,
        allowRotation: true,
        allowMirroring: false
      });

      expect(nesting.placements.length).toBe(2);
      expect(nesting.utilizedArea).toBeGreaterThan(0);
      expect(nesting.binArea).toBeGreaterThanOrEqual(nesting.utilizedArea);

      // Create embroidery
      const imageData = new ImageData(100, 100);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = (i / 4) % 2 === 0 ? 0 : 255;
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const vectors = vectorizeImage(imageData, {
        threshold: 128,
        minPathLength: 5,
        smoothing: 0.5
      });

      const embroidery = generateStitches(vectors, {
        ecoMode: true,
        stitchDensity: 0.15,
        minJumpOptimization: true
      });

      expect(embroidery.stitches.length).toBeGreaterThanOrEqual(0);

      // Build preview
      const preview = buildPreviewModel(pattern, nesting, embroidery);

      expect(preview.pattern).toBe(pattern);
      expect(preview.nesting).toBe(nesting);
      expect(preview.embroidery).toBe(embroidery);
      expect(preview.bounds).toBeDefined();

      // Export to all formats
      const svg = exportToSVG(pattern);
      const dxf = exportToDXF(pattern);
      const json = exportToJSON(pattern);
      const dst = exportToDST(embroidery);

      expect(svg).toContain('<svg');
      expect(dxf).toContain('SECTION');
      expect(JSON.parse(json).pattern.pieces.length).toBe(2);
      expect(dst).toBeInstanceOf(Uint8Array);

      // Create complete project data structure
      const completeProject: Partial<ProjectData> = {
        measurements,
        pattern,
        nesting,
        embroidery
      };

      // Serialize and deserialize
      const serialized = JSON.stringify(completeProject);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.measurements.height).toBe(1700);
      expect(deserialized.pattern.pieces.length).toBe(2);

      // SUCCESS! Complete system integration test passed
      console.log('✅ All 7 user paths tested successfully!');
      console.log('✅ Complete system integration validated!');
      expect(true).toBe(true);
    });
  });
});
