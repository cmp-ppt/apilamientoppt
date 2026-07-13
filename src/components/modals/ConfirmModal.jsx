import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';
import { cancelBtn, okBtn } from './ValueModal';

export default function ConfirmModal({ modal }) {
  const { setModal, doReset } = useAcopio();
  const close = () => setModal(null);
  const confirm = () => {
    if (modal.onOk === 'doReset') doReset();
    close();
  };

  return (
    <ModalShell onClose={close}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#182a44', margin: 0 }}>{modal.title}</h3>
      <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#54637a', margin: '10px 0 0' }}>{modal.message}</p>
      <div style={{ display: 'flex', gap: 9, marginTop: 20 }}>
        <button onClick={close} style={cancelBtn}>{modal.onOk ? 'CANCELAR' : 'CERRAR'}</button>
        {modal.onOk && <button onClick={confirm} style={{ ...okBtn, background: '#dc2626', boxShadow: '0 0 12px #dc262655' }}>{(modal.okLabel || 'CONFIRMAR').toUpperCase()}</button>}
      </div>
    </ModalShell>
  );
}
