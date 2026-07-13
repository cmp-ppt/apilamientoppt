import { useAcopio } from '../../store/AcopioContext';
import ValueModal from './ValueModal';
import Sinter6Modal from './Sinter6Modal';
import VesselModal from './VesselModal';
import ConfirmModal from './ConfirmModal';

export default function ModalRoot() {
  const { modal } = useAcopio();
  if (!modal) return null;
  if (modal.kind === 'hum') return <ValueModal modal={modal} />;
  if (modal.kind === 'sinter6') return <Sinter6Modal modal={modal} />;
  if (modal.kind === 'vessel') return <VesselModal modal={modal} />;
  if (modal.kind === 'confirm') return <ConfirmModal modal={modal} />;
  return null;
}
