import { useAcopio } from '../store/AcopioContext';

const TABS = [
  { key: 'CNN', label: 'ACOPIO CNN', sub: '6 feeders' },
  { key: 'PM', label: 'ACOPIO MAGNETITA', sub: '5 feeders' },
  { key: 'SF', label: 'SINTER FEED', sub: '6 feeders' },
];

export default function TabBar() {
  const { cancha, setCancha } = useAcopio();

  return (
    <div className="tab-bar" style={{ display: 'flex', gap: 6, background: '#ffffff', border: '1px solid #e2e7ef', padding: 4, borderRadius: 4, flexWrap: 'wrap' }}>
      {TABS.map((t) => {
        const active = cancha === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setCancha(t.key)}
            className="font-mono-scada"
            style={{
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 0.5,
              background: active ? '#f6f8fb' : 'transparent',
              color: active ? '#1a73e8' : '#54637a',
              boxShadow: active ? 'inset 0 0 0 1px #1a73e844, 0 0 8px #1a73e822' : 'none',
              transition: 'all .15s',
            }}
          >
            {t.label} <span style={{ opacity: 0.55, fontWeight: 500 }}>· {t.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
