import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import cmpLogo from '../assets/cmp-logo.jpg';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    const msg = await signIn(email.trim(), password);
    setBusy(false);
    if (!msg) return;
    if (msg === 'Invalid login credentials') setError('Correo o contraseña incorrectos.');
    else if (/fetch|network/i.test(msg)) setError('No se pudo conectar al servidor. Revisa tu conexión a internet o si la red bloquea el acceso.');
    else setError(msg);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef1f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, background: '#ffffff', border: '1px solid #e2e7ef', borderRadius: 6, boxShadow: '0 24px 60px rgba(0,0,0,.08)', overflow: 'hidden' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg,#1a73e8,#3f77e8)' }} />
        <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={cmpLogo} alt="CMP" style={{ height: 44, width: 'auto', marginBottom: 18 }} />
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, color: '#182a44', margin: 0, fontFamily: "'JetBrains Mono',monospace" }}>
            ACOPIO Y SECADO
          </h1>
          <p className="scada-label" style={{ marginTop: 4, marginBottom: 24, textAlign: 'center' }}>Puerto Punta Totoralillo</p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="scada-label" style={{ display: 'block', marginBottom: 6 }}>CORREO</label>
              <input
                type="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@cmp.cl" style={inputStyle}
              />
            </div>
            <div>
              <label className="scada-label" style={{ display: 'block', marginBottom: 6 }}>CONTRASEÑA</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <p style={{ width: '100%', margin: '14px 0 0', fontSize: 11.5, color: '#dc2626', background: '#dc262611', border: '1px solid #dc262633', borderRadius: 4, padding: '8px 10px' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} style={{ ...submitBtn, opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer' }}>
            {busy ? 'INGRESANDO…' : 'INGRESAR'}
          </button>

          <p style={{ fontSize: 10.5, color: '#9aa7b8', marginTop: 18, textAlign: 'center', lineHeight: 1.5 }}>
            Acceso restringido. Si no tienes cuenta, solicítala al administrador del dashboard.
          </p>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', border: '1px solid #e2e7ef', background: '#eef1f6', borderRadius: 4,
  padding: '9px 11px', fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, color: '#182a44', outline: 'none',
};

const submitBtn = {
  width: '100%', marginTop: 20, border: 'none', background: '#1a73e8', color: '#ffffff', borderRadius: 4,
  padding: '11px 16px', fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5,
};
