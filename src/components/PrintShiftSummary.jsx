import { useAcopio } from '../store/AcopioContext';
import { daysInMonth, parseMonth } from '../utils/format';
import { MESES } from '../constants';

export default function PrintShiftSummary() {
  const { month, log } = useAcopio();
  const dim = daysInMonth(month);
  const { y, m } = parseMonth(month);
  const lgm = log?.[month] || {};

  const rows = [];
  for (let d = 1; d <= dim; d++) {
    for (const sk of ['D', 'N']) {
      const r = lgm[d]?.[sk];
      if (r && (r.turno || r.controlador || r.bulldozer || r.excavadora)) {
        rows.push({
          dia: String(d).padStart(2, '0'),
          turno: sk === 'D' ? 'Día' : 'Noche',
          grupo: r.turno || '—',
          controlador: r.controlador || '—',
          bulldozer: r.bulldozer === 'si' ? 'Sí' : r.bulldozer === 'no' ? 'No' : '—',
          excavadora: r.excavadora === 'si' ? 'Sí' : r.excavadora === 'no' ? 'No' : '—',
        });
      }
    }
  }

  return (
    <div className="print-only" style={{ background: '#fff', border: '1px solid #e2e7ef', borderRadius: 6, padding: '16px 18px', marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Resumen de registros de turno</h2>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0b3a82' }}>{MESES[m - 1]} {y}</span>
      </div>
      {rows.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9aa7b8' }}>Sin registros de turno para este mes.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: '#0b3a82', color: '#fff' }}>
              <th style={thStyle}>Día</th>
              <th style={thStyle}>Turno</th>
              <th style={thStyle}>Grupo</th>
              <th style={thStyle}>Controlador</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Bulldozer</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Excavadora</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? '#f6f8fb' : '#ffffff' }}>
                <td style={tdStyle}>{r.dia}</td>
                <td style={tdStyle}>{r.turno}</td>
                <td style={{ ...tdStyle, fontWeight: 600, color: '#0b3a82' }}>{r.grupo}</td>
                <td style={tdStyle}>{r.controlador}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.bulldozer}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{r.excavadora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '6px 8px', fontWeight: 600 };
const tdStyle = { padding: '5px 8px', borderBottom: '1px solid #eef2f7' };
