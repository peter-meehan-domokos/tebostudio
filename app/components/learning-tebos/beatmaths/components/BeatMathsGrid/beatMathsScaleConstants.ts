export const SCALE_ALLOWED_NOTES = {
  major: [1, 3, 5, 6, 8, 10, 12],
  minor: [1, 3, 4, 6, 8, 9, 11],
  pentatonicMajor: [1, 3, 5, 8, 10],
  pentatonicMinor: [1, 4, 6, 8, 11],
  chromatic: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
} as const;

export type ScaleType = keyof typeof SCALE_ALLOWED_NOTES;
