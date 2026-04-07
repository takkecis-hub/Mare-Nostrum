/**
 * Mercator projection for the Mediterranean bounding box.
 * Maps real-world lat/lon to SVG viewport coordinates (860×520).
 */

const VW = 860;
const VH = 520;
const PADDING = 40;

/** Mediterranean bounding box */
const LON_MIN = -1.0;
const LON_MAX = 37.0;
const LAT_MIN = 30.0;
const LAT_MAX = 46.0;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function mercY(lat: number): number {
  return Math.log(Math.tan(Math.PI / 4 + degToRad(lat) / 2));
}

const Y_MIN = mercY(LAT_MIN);
const Y_MAX = mercY(LAT_MAX);

/**
 * Project a geographic coordinate (lat/lon) to SVG viewport (x, y).
 * Returns rounded integer pixel coordinates within an 860×520 viewBox.
 */
export function projectToSVG(
  lat: number,
  lon: number,
): { x: number; y: number } {
  const x =
    PADDING + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (VW - 2 * PADDING);
  const merc = mercY(lat);
  // Invert Y for SVG (top = north)
  const y =
    PADDING + ((Y_MAX - merc) / (Y_MAX - Y_MIN)) * (VH - 2 * PADDING);
  return { x: Math.round(x), y: Math.round(y) };
}
