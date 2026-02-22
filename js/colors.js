/**
 * Curated palette — greens, warm accents, high contrast on any background.
 * Designed to pop on both dark voids and light papers.
 */
const NEON_PALETTE = [
  "#2e9025", // forest green (signal)
  "#e8443a", // warm red
  "#e8a317", // gold
  "#7c5cbf", // muted violet
  "#2bb5d4", // teal blue
  "#e85d2a", // burnt orange
  "#45c76a", // lighter green
  "#d94f8c", // rose
  "#8bc63f", // lime
  "#5f82cc", // slate blue
  "#ef8633", // tangerine
  "#27bfa0", // emerald teal
];

let paletteIndex = 0;

/**
 * Returns the next color from the neon palette, cycling through.
 * Each call advances the index so consecutive paths get distinct hues.
 */
function getNextColor() {
  const color = NEON_PALETTE[paletteIndex % NEON_PALETTE.length];
  paletteIndex++;
  return color;
}

/**
 * Reset palette index (useful when recreating all paths).
 */
function resetPalette() {
  paletteIndex = 0;
}

export default getNextColor;
export { resetPalette, NEON_PALETTE };
