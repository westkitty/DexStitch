import type { EmbroideryProgram, VectorPath } from "@dexstitch/types";

export type VectorizeOptions = {
  threshold: number;
};

export type StitchOptions = {
  stitchLength: number;
};

export async function vectorizeImage(
  _imageData: ImageData,
  _options: VectorizeOptions
): Promise<VectorPath[]> {
  return [
    {
      d: "M50 10 A40 40 0 1 1 49.9 10 Z"
    }
  ];
}

export function generateStitchPlan(
  paths: VectorPath[],
  options: StitchOptions
): EmbroideryProgram {
  const stitches = paths.flatMap((_path, index) => {
    const offset = index * 5;
    return [
      { x: 0 + offset, y: 0 + offset, command: "stitch" as const },
      { x: options.stitchLength + offset, y: 0 + offset, command: "stitch" as const },
      {
        x: options.stitchLength + offset,
        y: options.stitchLength + offset,
        command: "stitch" as const
      }
    ];
  });

  return {
    stitches,
    colors: ["#1f2933"]
  };
}
