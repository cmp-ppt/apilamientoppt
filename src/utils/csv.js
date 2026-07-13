import { SECTORS, MESES } from '../constants';
import { daysInMonth, parseMonth } from './format';

export function exportCSV({ month, cancha, data, hum, log }) {
  const md = data[month][cancha];
  const dim = daysInMonth(month);
  const { m } = parseMonth(month);
  const L = { fresca: 'Fresca', secado: 'Secado', libre: 'Libre' };
  const lines = [];
  lines.push('Cancha ' + (cancha === 'CNN' ? 'CNN' : 'Magnetita') + ' - ' + month);
  lines.push('');
  lines.push(['Feeder', ...Array.from({ length: dim }, (_, i) => String(i + 1).padStart(2, '0') + '-' + String(m).padStart(2, '0'))].join(';'));
  for (const s of SECTORS[cancha]) lines.push([s, ...md[s].map((x) => L[x])].join(';'));
  for (const [sk, sl] of [['D', 'Turno Día'], ['N', 'Turno Noche']]) {
    lines.push('');
    lines.push('Humedad medida (%) — ' + sl);
    lines.push(['Feeder', ...Array.from({ length: dim }, (_, i) => String(i + 1).padStart(2, '0'))].join(';'));
    const hm = hum?.[month]?.[cancha]?.[sk] || {};
    for (const s of SECTORS[cancha]) {
      const row = md[s].map((st, i) => {
        const v = hm[s]?.[i];
        return v != null ? String(v).replace('.', ',') : '';
      });
      lines.push([s, ...row].join(';'));
    }
  }
  lines.push('');
  lines.push('Registro de turno');
  lines.push(['Día', 'Turno de trabajo', 'Grupo', 'Controlador', 'Uso Bulldozer', 'Uso Excavadora'].join(';'));
  const lg = log?.[month] || {};
  for (let d = 1; d <= dim; d++) {
    for (const [sk, sl] of [['D', 'Día'], ['N', 'Noche']]) {
      const r = lg[d]?.[sk];
      if (r && (r.turno || r.controlador || r.bulldozer || r.excavadora))
        lines.push([
          String(d).padStart(2, '0'),
          sl,
          r.turno || '',
          r.controlador || '',
          r.bulldozer === 'si' ? 'Sí' : r.bulldozer === 'no' ? 'No' : '',
          r.excavadora === 'si' ? 'Sí' : r.excavadora === 'no' ? 'No' : '',
        ].join(';'));
    }
  }
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'acopio_' + cancha + '_' + month + '.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
