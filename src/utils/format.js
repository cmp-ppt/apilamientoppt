import { SF_PARAMS, TML } from '../constants';

export function daysInMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export function parseMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return { y, m };
}

export function streak(arr, i) {
  let n = 0;
  for (let j = i; j >= 0; j--) {
    if (arr[j] === 'secado') n++;
    else break;
  }
  return n;
}

export function fmt(n) {
  return n == null ? '—' : n.toLocaleString('es-CL');
}

export function fmtHum(x) {
  return x == null ? '—' : x.toFixed(1).replace('.', ',') + '%';
}

export function fmtCell(x) {
  if (x == null) return '';
  const r = Math.round(x * 100) / 100;
  return String(Number.isInteger(r) ? r : r).replace('.', ',');
}

export function fmtSF(x) {
  if (x == null || isNaN(x)) return '';
  const r = Math.round(x * 1000) / 1000;
  return String(r).replace('.', ',');
}

export function fmtSFShort(x) {
  if (x == null || isNaN(x)) return '';
  return x.toFixed(2).replace('.', ',');
}

export function specPass(paramKey, value) {
  const p = SF_PARAMS.find((x) => x.key === paramKey);
  if (!p || value == null || isNaN(value)) return null;
  return p.dir === 'min' ? value >= p.limit : value <= p.limit;
}

export function humColor(h) {
  if (h == null) return '#54637a';
  if (h > TML) return '#dc2626';
  if (h > TML - 0.4) return '#ef9b3a';
  return '#1f9d55';
}

export function humWord(h) {
  if (h == null) return '—';
  if (h > TML) return 'Sobre TML';
  if (h > TML - 0.4) return 'Límite';
  return 'Bajo TML';
}

export function feColor(v) {
  if (v >= 65.5) return { bg: '#1f9d55', fg: '#04160c' };
  if (v >= 65.2) return { bg: '#8cc63e', fg: '#12200a' };
  if (v >= 65.0) return { bg: '#ef9b3a', fg: '#2a1c00' };
  return { bg: '#dc2626', fg: '#ffffff' };
}

export function humCellColor(v) {
  if (v > 9) return { bg: '#dc2626', fg: '#ffffff' };
  if (v > TML) return { bg: '#ef9b3a', fg: '#2a1c00' };
  return { bg: '#1f9d55', fg: '#04160c' };
}

// Rangos distintos por cancha: Magnetita trabaja con tenores de azufre
// mas altos que CNN, asi que el umbral "aceptable" tambien es mas alto.
export const AZU_RANGE = {
  PM: { lo: 0.30, hi: 0.5 },
  CNN: { lo: 0.09, hi: 0.12 },
};

export function azuColor(v, cancha) {
  const { lo, hi } = AZU_RANGE[cancha] || AZU_RANGE.CNN;
  if (v > hi) return { bg: '#dc2626', fg: '#ffffff' };
  if (v > lo) return { bg: '#ef9b3a', fg: '#2a1c00' };
  return { bg: '#1f9d55', fg: '#04160c' };
}
