import { describe, test, expect } from 'vitest';
import { estimateMeasurementsFromPose } from '../bodyScanner';
import type { PoseLandmark } from '../bodyScanner';

describe('Body Scanner', () => {
  function createTestLandmarks(): PoseLandmark[] {
    // MediaPipe Pose format with 33 keypoints
    const landmarks: PoseLandmark[] = [];

    // Create basic skeleton structure
    for (let i = 0; i < 33; i++) {
      landmarks.push({
        x: 0.5 + Math.random() * 0.1,
        y: 0.3 + (i / 33) * 0.4,
        z: 0,
        visibility: 0.9
      });
    }

    // Set specific landmarks for testing
    // NOSE = 0
    landmarks[0] = { x: 0.5, y: 0.1, z: 0, visibility: 0.95 };

    // Shoulders = 11, 12
    landmarks[11] = { x: 0.4, y: 0.3, z: 0, visibility: 0.9 };
    landmarks[12] = { x: 0.6, y: 0.3, z: 0, visibility: 0.9 };

    // Hips = 23, 24
    landmarks[23] = { x: 0.45, y: 0.6, z: 0, visibility: 0.9 };
    landmarks[24] = { x: 0.55, y: 0.6, z: 0, visibility: 0.9 };

    // Ankles = 27, 28
    landmarks[27] = { x: 0.45, y: 0.95, z: 0, visibility: 0.85 };
    landmarks[28] = { x: 0.55, y: 0.95, z: 0, visibility: 0.85 };

    return landmarks;
  }

  describe('estimateMeasurementsFromPose()', () => {
    test('returns array of measurement estimates', () => {
      const landmarks = createTestLandmarks();
      const result = estimateMeasurementsFromPose(landmarks);

      expect(Array.isArray(result)).toBe(true);
    });

    test('each measurement has required properties', () => {
      const landmarks = createTestLandmarks();
      const result = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1700
      });

      for (const measurement of result) {
        expect(measurement).toHaveProperty('name');
        expect(measurement).toHaveProperty('value');
        expect(measurement).toHaveProperty('confidence');

        expect(typeof measurement.name).toBe('string');
        expect(typeof measurement.value).toBe('number');
        expect(typeof measurement.confidence).toBe('number');

        expect(measurement.value).toBeGreaterThan(0);
        expect(measurement.confidence).toBeGreaterThanOrEqual(0);
        expect(measurement.confidence).toBeLessThanOrEqual(1);
      }
    });

    test('returns empty array for insufficient landmarks', () => {
      const fewLandmarks: PoseLandmark[] = [
        { x: 0.5, y: 0.5, z: 0, visibility: 0.9 },
        { x: 0.6, y: 0.6, z: 0, visibility: 0.9 }
      ];

      const result = estimateMeasurementsFromPose(fewLandmarks);

      expect(result.length).toBe(0);
    });

    test('filters low confidence landmarks', () => {
      const landmarks = createTestLandmarks();

      // Set all landmarks to low visibility
      landmarks.forEach(l => l.visibility = 0.2);

      const result = estimateMeasurementsFromPose(landmarks, {
        minConfidence: 0.5
      });

      // Should return empty or very few measurements
      expect(result.length).toBeLessThan(3);
    });

    test('respects minConfidence parameter', () => {
      const landmarks = createTestLandmarks();

      const lowThreshold = estimateMeasurementsFromPose(landmarks, {
        minConfidence: 0.3,
        referenceHeight: 1700
      });

      const highThreshold = estimateMeasurementsFromPose(landmarks, {
        minConfidence: 0.95,
        referenceHeight: 1700
      });

      // Higher threshold should produce fewer measurements
      expect(highThreshold.length).toBeLessThanOrEqual(lowThreshold.length);
    });

    test('uses referenceHeight for scaling', () => {
      const landmarks = createTestLandmarks();

      const short = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1500
      });

      const tall = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 2000
      });

      // Both should produce measurements, but values should differ
      if (short.length > 0 && tall.length > 0) {
        const shortHeight = short.find(m => m.name === 'height');
        const tallHeight = tall.find(m => m.name === 'height');

        if (shortHeight && tallHeight) {
          expect(tallHeight.value).toBeGreaterThan(shortHeight.value);
        }
      }
    });

    test('produces reasonable measurement values', () => {
      const landmarks = createTestLandmarks();
      const result = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1700
      });

      for (const measurement of result) {
        // Measurements should be in reasonable ranges (mm)
        if (measurement.name === 'height') {
          expect(measurement.value).toBeGreaterThan(1000);
          expect(measurement.value).toBeLessThan(2500);
        }

        if (measurement.name === 'chest') {
          expect(measurement.value).toBeGreaterThan(500);
          expect(measurement.value).toBeLessThan(2000);
        }

        if (measurement.name === 'waist') {
          expect(measurement.value).toBeGreaterThan(400);
          expect(measurement.value).toBeLessThan(2000);
        }
      }
    });

    test('handles landmarks with missing visibility', () => {
      const landmarks = createTestLandmarks();

      // Remove visibility from some landmarks
      landmarks.forEach((l, i) => {
        if (i % 2 === 0) {
          delete l.visibility;
        }
      });

      expect(() => estimateMeasurementsFromPose(landmarks)).not.toThrow();
      const result = estimateMeasurementsFromPose(landmarks);
      expect(Array.isArray(result)).toBe(true);
    });

    test('handles landmarks with missing z coordinate', () => {
      const landmarks = createTestLandmarks();

      landmarks.forEach(l => {
        delete l.z;
      });

      expect(() => estimateMeasurementsFromPose(landmarks)).not.toThrow();
    });

    test('produces consistent results for same input', () => {
      const landmarks = createTestLandmarks();

      const result1 = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1700
      });
      const result2 = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1700
      });

      expect(result1.length).toBe(result2.length);
      expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    });

    test('measurement confidence reflects landmark visibility', () => {
      const landmarks = createTestLandmarks();

      // Set specific landmarks to different visibilities
      landmarks.forEach((l, i) => {
        l.visibility = i < 17 ? 0.95 : 0.6;
      });

      const result = estimateMeasurementsFromPose(landmarks, {
        referenceHeight: 1700,
        minConfidence: 0.5
      });

      // All returned measurements should have confidence >= minConfidence
      for (const measurement of result) {
        expect(measurement.confidence).toBeGreaterThanOrEqual(0.5);
      }
    });
  });
});
