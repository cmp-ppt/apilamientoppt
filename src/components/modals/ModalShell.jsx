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
        style={{ width: '100%', maxWidth, background: '#ffffff', border: '1px solid #e2e7ef', borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,.6), 0 0 0 1px #1a73e822', overflow: 'hidden' }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,#1a73e8,#3f77e8)' }} />
        <div style={{ padding: '22px 24px 20px' }}>{children}</div>
      </div>
    </div>
  );
}
