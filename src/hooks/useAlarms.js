import { useCallback, useMemo, useState } from 'react';
import { useCanchaView, useSFView } from './useDerived';
import { TML } from '../constants';

const ACK_KEY = 'acopioAlarmAck_v1';

function loadAck() {
  try { return new Set(JSON.parse(localStorage.getItem(ACK_KEY) || '[]')); } catch (e) { return new Set(); }
}
function saveAck(set) {
  try { localStorage.setItem(ACK_KEY, JSON.stringify([...set])); } catch (e) { /* ignore */ }
}

const CANCHA_LABEL = { CNN: 'Cancha CNN', PM: 'Cancha Magnetita' };

function contamAndHumidityAlarms(view, canchaKey) {
  const list = [];
  const label = CANCHA_LABEL[canchaKey];
  for (const row of view.rowsEstado) {
    for (const c of row.cells) {
      if (c.isBad) {
        list.push({
          id: `contam|${canchaKey}|${row.sector}|${c.day}`,
          severity: 'high',
          area: canchaKey,
          source: `${label} · ${row.sector}`,
          message: 'Acopio de carga fresca sobre material en secado',
          day: c.day,
        });
      }
    }
  }
  for (const s of view.semaforo) {
    if (s.humValue != null && s.humValue > TML) {
      list.push({
        id: `hum|${canchaKey}|${s.sector}|${view.refIdx}|${s.humValue}`,
        severity: s.humValue > TML + 0.6 ? 'high' : 'medium',
        area: canchaKey,
        source: `${label} · ${s.sector}`,
        message: `Humedad ${s.humValue.toFixed(1).replace('.', ',')}% sobre TML (${TML}%)`,
        day: null,
      });
    }
    if (s.stateLabel === 'En secado' && s.humValue == null) {
      const row = view.rowsEstado.find((r) => r.sector === s.sector);
      const dias = row ? row.cells[view.refIdx]?.dias : null;
      if (dias != null && dias >= 2) {
        list.push({
          id: `stale|${canchaKey}|${s.sector}|${view.refIdx}`,
          severity: dias >= 4 ? 'medium' : 'low',
          area: canchaKey,
          source: `${label} · ${s.sector}`,
          message: `Sin humedad registrada — ${dias} d en secado sin medición`,
          day: null,
        });
      }
    }
  }
  return list;
}

function sinterAlarms(sf) {
  const list = [];
  for (const sec of sf.sfSections) {
    for (const row of sec.rows) {
      const cell = row.cells.find((c) => c.isRef);
      if (!cell || !cell.enabled) continue;
      for (const mc of cell.minis) {
        if (mc.measured && mc.pass === false) {
          list.push({
            id: `sf|${sec.key}|${row.sector}|${cell.day}|${mc.key}`,
            severity: 'medium',
            area: 'SF',
            source: `Sinter Feed · ${row.sector} (${sec.key === 'ema' ? 'Ema' : 'Bella Ester'})`,
            message: `${mc.label} ${mc.text}% fuera de especificación`,
            day: null,
          });
        }
      }
    }
  }
  return list;
}

export function useAlarms() {
  const cnn = useCanchaView('CNN');
  const pm = useCanchaView('PM');
  const sf = useSFView();
  const [ack, setAck] = useState(loadAck);

  const allAlarms = useMemo(() => [
    ...contamAndHumidityAlarms(cnn, 'CNN'),
    ...contamAndHumidityAlarms(pm, 'PM'),
    ...sinterAlarms(sf),
  ].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  }), [cnn, pm, sf]);

  const alarms = useMemo(() => allAlarms.filter((a) => !ack.has(a.id)), [allAlarms, ack]);

  const dismiss = useCallback((id) => {
    setAck((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveAck(next);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setAck((prev) => {
      const next = new Set(prev);
      allAlarms.forEach((a) => next.add(a.id));
      saveAck(next);
      return next;
    });
  }, [allAlarms]);

  return { alarms, totalActive: alarms.length, dismiss, dismissAll };
}
