import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';
import { cancelBtn } from './ValueModal';

const ACTION_COLOR = {
  'Importó Excel': '#1a73e8',
  'Error al importar Excel': '#dc2626',
  'Editó Humedad': '#1a73e8',
  'Editó Ley de Fe': '#1f9d55',
  'Editó Ley de Azufre': '#7c3aed',
  'Cambió estado de acopio': '#3f77e8',
  'Borró día': '#dc2626',
};

const fmtDate = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true,
});

export default function AuditLogModal() {
  const { auditLog, setModal } = useAcopio();
  const close = () => setModal(null);
  const entries = auditLog || [];

  return (
    <ModalShell onClose={close} maxWidth={820}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#182a44', margin: 0 }}>Historial de Cambios</h3>
          <p style={{ fontSize: 11, color: '#54637a', margin: '4px 0 0' }}>Registro de auditoría — quién cambió qué y cuándo · en línea</p>
        </div>
        <button onClick={close} aria-label="Cerrar" style={{ border: 'none', background: 'transparent', color: '#9aa7b8', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 2 }}>×</button>
      </div>

      <div style={{ marginTop: 16, maxHeight: 440, overflowY: 'auto', border: '1px solid #e2e7ef', borderRadius: 4 }}>
        {entries.length === 0 ? (
          <p style={{ fontSize: 12, color: '#9aa7b8', padding: '24px 16px', textAlign: 'center', margin: 0 }}>Todavía no hay movimientos registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr style={{ background: '#f6f8fb', position: 'sticky', top: 0 }}>
                <th style={thStyle}>FECHA / HORA</th>
                <th style={thStyle}>USUARIO</th>
                <th style={thStyle}>ACCIÓN</th>
                <th style={thStyle}>UBICACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} style={{ borderTop: '1px solid #eef2f7' }}>
                  <td className="font-mono-scada" style={{ ...tdStyle, color: '#54637a', whiteSpace: 'nowrap' }}>{fmtDate.format(new Date(e.ts))}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#182a44' }}>{e.user}</div>
                    {e.email && <div style={{ fontSize: 10, color: '#9aa7b8' }}>{e.email}</div>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700,
                      color: '#fff', background: ACTION_COLOR[e.action] || '#54637a', whiteSpace: 'nowrap',
                    }}>
                      {e.action}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#182a44', fontSize: 10.5, letterSpacing: 0.3 }}>{e.location}</div>
                    {e.detail && <div style={{ fontSize: 10.5, color: '#54637a', marginTop: 1 }}>{e.detail}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span className="font-mono-scada" style={{ fontSize: 10, color: '#9aa7b8' }}>{entries.length} movimientos registrados</span>
        <button onClick={close} style={cancelBtn}>CERRAR</button>
      </div>
    </ModalShell>
  );
}

const thStyle = { textAlign: 'left', padding: '8px 10px', fontWeight: 700, fontSize: 10, color: '#54637a', letterSpacing: 0.4 };
const tdStyle = { padding: '8px 10px', verticalAlign: 'top' };
