export default function DayHeaderRow({ dayHeaders, onSelectDay, colWidth = 34, labelWidth = 62 }) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: labelWidth, flex: 'none', position: 'sticky', left: 0, background: '#ffffff', zIndex: 3 }} />
      {dayHeaders.map((d) => (
        <div
          key={d.day}
          onClick={() => onSelectDay(d.day)}
          style={{
            width: colWidth, flex: 'none', textAlign: 'center', padding: '4px 0 5px', cursor: 'pointer',
            borderRight: '1px solid #e2e7ef', background: d.isRef ? '#f6f8fb' : 'transparent',
            borderBottom: d.vesselOp ? `2px solid ${d.vesselOp === 'hierro' ? '#3f77e8' : d.vesselOp === 'cobre' ? '#ef9b3a' : '#9aa7b8'}` : '1px solid #e2e7ef',
          }}
        >
          <div style={{ fontSize: 8, color: '#9aa7b8', fontWeight: 600 }}>{d.dow}</div>
          <div
            className="font-mono-scada"
            style={{
              fontSize: 11, fontWeight: 600, marginTop: 2,
              color: d.isRef ? '#eef1f6' : '#54637a',
              background: d.isRef ? '#1a73e8' : 'transparent',
              borderRadius: 3, padding: d.isRef ? '1px 0' : 0,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}
