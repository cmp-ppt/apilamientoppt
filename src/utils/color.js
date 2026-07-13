export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// percent: -1 (fully black) .. 0 (unchanged) .. 1 (fully white)
export function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const mix = (c) => c + (t - c) * p;
  return rgbToHex(mix(r), mix(g), mix(b));
}

export function lerpColor(hex1, hex2, t) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const tt = Math.max(0, Math.min(1, t));
  const mix = (a, b) => a + (b - a) * tt;
  return rgbToHex(mix(c1.r, c2.r), mix(c1.g, c2.g), mix(c1.b, c2.b));
}
