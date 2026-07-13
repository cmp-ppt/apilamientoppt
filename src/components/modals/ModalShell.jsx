export default function ModalShell({ onClose, maxWidth = 420, children }) {
  return (
    <div
      className="no-print"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,14,23,.7)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        fontFamily: "'IBM Plex Sans',system-ui,sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth, background: '#0f1520', border: '1px solid #1a2435', borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,.6), 0 0 0 1px #00e5ff22', overflow: 'hidden' }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,#00e5ff,#448aff)' }} />
        <div style={{ padding: '22px 24px 20px' }}>{children}</div>
      </div>
    </div>
  );
}
