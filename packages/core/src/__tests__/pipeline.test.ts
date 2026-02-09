import { describe, expect, it } from "vitest";
import { generatePattern } from "../patternEngine";
import { nestPieces } from "../nest";
import { buildPreviewModel } from "../preview";
import { computeBoundingBox } from "@dexstitch/types";

const measurements = {
  height: 1700,
  neck: 380,
  chest: 980,
  waist: 760,
  hip: 980
};

const patternSpec = {
  id: "basic-panel",
  name: "Basic Panel",
  parameters: {
    ease: 1.2,
    dartDepth: 0
  }
};

describe("golden path pipeline", () => {
  it("produces a stable preview shape from pattern spec", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const nesting = nestPieces({
      pieces: pattern.pieces,
      binWidth: 600,
      allowRotation: false,
      allowMirroring: false
    });
    const preview = buildPreviewModel(pattern, nesting, null);

    expect(preview.pattern?.pieces.length).toBe(2);
    expect(preview.nesting?.placements.length).toBe(2);
    expect(preview.pattern?.pieces).toMatchObject([
      { id: "front", name: "Front Panel" },
      { id: "back", name: "Back Panel" }
    ]);
  });

  it("generates pattern pieces with correct Point2D geometry", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const frontPiece = pattern.pieces[0];

    // Verify outline is Point2D array
    expect(frontPiece.outline).toBeInstanceOf(Array);
    expect(frontPiece.outline.length).toBeGreaterThan(0);
    expect(frontPiece.outline[0]).toHaveProperty("x");
    expect(frontPiece.outline[0]).toHaveProperty("y");

    // All coordinates should be numbers in mm
    frontPiece.outline.forEach((point) => {
      expect(typeof point.x).toBe("number");
      expect(typeof point.y).toBe("number");
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeGreaterThanOrEqual(0);
    });
  });

  it("computes stable bounding boxes", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const frontPiece = pattern.pieces[0];
    const bbox = computeBoundingBox(frontPiece.outline);

    // Bounding box should be valid
    expect(bbox.minX).toBeLessThanOrEqual(bbox.maxX);
    expect(bbox.minY).toBeLessThanOrEqual(bbox.maxY);

    // Should match known dimensions (chest/2 * ease, height/4)
    const expectedWidth = (measurements.chest / 2) * patternSpec.parameters.ease;
    const expectedHeight = measurements.height / 4;

    expect(bbox.maxX - bbox.minX).toBeCloseTo(expectedWidth, 1);
    expect(bbox.maxY - bbox.minY).toBeCloseTo(expectedHeight, 1);
  });

  it("generates pattern with dart when dartDepth > 0", () => {
    const specWithDart = {
      ...patternSpec,
      parameters: { ease: 1.2, dartDepth: 20 }
    };

    const pattern = generatePattern(measurements, specWithDart);
    const frontPiece = pattern.pieces[0];

    // Front piece with dart should have 7 points (rectangle + 3 dart points)
    expect(frontPiece.outline.length).toBe(7);
  });

  it("generates pattern without dart when dartDepth = 0", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const frontPiece = pattern.pieces[0];

    // Front piece without dart should be a simple rectangle (4 points)
    expect(frontPiece.outline.length).toBe(4);
  });

  it("includes grainlines and notches", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const frontPiece = pattern.pieces[0];

    expect(frontPiece.grainline).toBeDefined();
    expect(frontPiece.grainline?.length).toBe(2);
    expect(frontPiece.grainline?.[0]).toHaveProperty("x");
    expect(frontPiece.grainline?.[0]).toHaveProperty("y");

    expect(frontPiece.notches).toBeDefined();
    expect(frontPiece.notches?.length).toBeGreaterThan(0);
  });

  it("computes preview bounds correctly", () => {
    const pattern = generatePattern(measurements, patternSpec);
    const nesting = nestPieces({
      pieces: pattern.pieces,
      binWidth: 600,
      allowRotation: false,
      allowMirroring: false
    });
    const preview = buildPreviewModel(pattern, nesting, null);

    expect(preview.bounds).toBeDefined();
    expect(preview.bounds?.minX).toBeLessThanOrEqual(preview.bounds?.maxX ?? 0);
    expect(preview.bounds?.minY).toBeLessThanOrEqual(preview.bounds?.maxY ?? 0);
  });
});
