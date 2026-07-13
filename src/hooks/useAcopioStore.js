import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SECTORS, SEED, VESSELS_SEED, STATE_ORDER, STATE_ORDER_SF,
  SYNC, KEYS, SF_PARAMS,
} from '../constants';
import { daysInMonth, parseMonth } from '../utils/format';
import { xlsxRows, xlsxRowsSinter } from '../utils/xlsx';

function seedData() {
  const mk = (cancha) => {
    const o = {};
    for (const s of SECTORS[cancha]) {
      const str = '.' + SEED[cancha][s];
      o[s] = str.split('').map((ch) => (ch === 'F' ? 'fresca' : ch === 'S' ? 'secado' : 'libre'));
    }
    return o;
  };
  return { '2026-06': { CNN: mk('CNN'), PM: mk('PM') } };
}

function ensureMonth(data, month) {
  if (data[month]) return data;
  const dim = daysInMonth(month);
  const mk = (cancha) => {
    const o = {};
    for (const s of SECTORS[cancha]) o[s] = new Array(dim).fill('libre');
    return o;
  };
  return { ...data, [month]: { CNN: mk('CNN'), PM: mk('PM') } };
}

function ensureSFMonth(sfOcc, month) {
  if (sfOcc[month]) return sfOcc;
  const dim = daysInMonth(month);
  const o = {};
  for (const s of SECTORS.SF) o[s] = new Array(dim).fill('libre');
  return { ...sfOcc, [month]: o };
}

function migrateSinter(obj) {
  const paramKeys = new Set(SF_PARAMS.map((p) => p.key));
  const out = JSON.parse(JSON.stringify(obj || {}));
  for (const mo in out) {
    for (const sh in out[mo]) {
      const bucket = out[mo][sh];
      const keys = Object.keys(bucket || {});
      const looksOld = keys.some((k) => paramKeys.has(k));
      if (looksOld) out[mo][sh] = { default: bucket };
    }
  }
  return out;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* quota / privacy mode */ }
}

export function useAcopioStore() {
  const [month, setMonth] = useState('2026-06');
  const [cancha, setCancha] = useState('CNN');
  const [refDay, setRefDay] = useState(29);
  const [shift, setShift] = useState('D');

  const [data, setData] = useState(() => loadJSON(KEYS.data, seedData()));
  const [hum, setHumState] = useState(() => loadJSON(KEYS.hum, {}));
  const [fe, setFeState] = useState(() => loadJSON(KEYS.fe, {}));
  const [sinter, setSinterState] = useState(() => migrateSinter(loadJSON(KEYS.sinter, {})));
  const [sfOcc, setSfOccState] = useState(() => loadJSON(KEYS.sfOcc, {}));
  const [log, setLogState] = useState(() => loadJSON(KEYS.log, {}));
  const [vessels, setVesselsState] = useState(() => {
    const v = loadJSON(KEYS.vessels, null);
    if (v) return v;
    const base = { '2026-06': VESSELS_SEED.map((v) => ({ ...v })) };
    saveJSON(KEYS.vessels, base);
    return base;
  });

  const [modal, setModal] = useState(null);
  const [modalVesselType, setModalVesselType] = useState('hierro_apf');
  const [syncStatus, setSyncStatus] = useState('off');

  const editingRef = useRef(false);

  const cloudEnabled = useCallback(() => !!(SYNC.url && SYNC.anonKey), []);
  const cloudHeaders = useCallback((extra) => ({
    apikey: SYNC.anonKey,
    Authorization: 'Bearer ' + SYNC.anonKey,
    ...extra,
  }), []);

  const cloudGet = useCallback(async () => {
    const res = await fetch(SYNC.url + '/rest/v1/' + SYNC.table + '?select=key,value', { method: 'GET', headers: cloudHeaders() });
    if (!res.ok) throw new Error('GET ' + res.status);
    const body = await res.json();
    const out = {};
    if (Array.isArray(body)) body.forEach((r) => { if (r && r.key != null && r.value != null) out[r.key] = r.value; });
    return out;
  }, [cloudHeaders]);

  const cloudPut = useCallback(async (key, value) => {
    if (!cloudEnabled()) return;
    try {
      setSyncStatus('syncing');
      const res = await fetch(SYNC.url + '/rest/v1/' + SYNC.table, {
        method: 'POST',
        headers: cloudHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
      });
      setSyncStatus(res.ok ? 'ok' : 'error');
    } catch (e) { setSyncStatus('error'); }
  }, [cloudEnabled, cloudHeaders]);

  const applyRemote = useCallback((map) => {
    if (map[KEYS.data] != null) { saveJSON(KEYS.data, map[KEYS.data]); setData(map[KEYS.data]); }
    if (map[KEYS.hum] != null) { saveJSON(KEYS.hum, map[KEYS.hum]); setHumState(map[KEYS.hum]); }
    if (map[KEYS.fe] != null) { saveJSON(KEYS.fe, map[KEYS.fe]); setFeState(map[KEYS.fe]); }
    if (map[KEYS.log] != null) { saveJSON(KEYS.log, map[KEYS.log]); setLogState(map[KEYS.log]); }
    if (map[KEYS.vessels] != null) { saveJSON(KEYS.vessels, map[KEYS.vessels]); setVesselsState(map[KEYS.vessels]); }
    if (map[KEYS.sfOcc] != null) { saveJSON(KEYS.sfOcc, map[KEYS.sfOcc]); setSfOccState(map[KEYS.sfOcc]); }
    if (map[KEYS.sinter] != null) {
      const migrated = migrateSinter(map[KEYS.sinter]);
      saveJSON(KEYS.sinter, migrated);
      setSinterState(migrated);
    }
  }, []);

  const modalRef = useRef(modal);
  useEffect(() => { modalRef.current = modal; }, [modal]);

  useEffect(() => {
    if (!cloudEnabled()) return;
    setSyncStatus('syncing');
    cloudGet().then((map) => { if (map) applyRemote(map); setSyncStatus('ok'); }).catch(() => setSyncStatus('error'));
    const timer = setInterval(() => {
      if (editingRef.current || modalRef.current) return;
      cloudGet().then((map) => { if (map) { applyRemote(map); setSyncStatus('ok'); } }).catch(() => setSyncStatus('error'));
    }, SYNC.pollMs);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- persisted setters ----
  const saveData = useCallback((next) => { saveJSON(KEYS.data, next); setData(next); cloudPut(KEYS.data, next); }, [cloudPut]);
  const saveHum = useCallback((next) => { saveJSON(KEYS.hum, next); setHumState(next); cloudPut(KEYS.hum, next); }, [cloudPut]);
  const saveFe = useCallback((next) => { saveJSON(KEYS.fe, next); setFeState(next); cloudPut(KEYS.fe, next); }, [cloudPut]);
  const saveSinter = useCallback((next) => { saveJSON(KEYS.sinter, next); setSinterState(next); cloudPut(KEYS.sinter, next); }, [cloudPut]);
  const saveSFOcc = useCallback((next) => { saveJSON(KEYS.sfOcc, next); setSfOccState(next); cloudPut(KEYS.sfOcc, next); }, [cloudPut]);
  const saveLog = useCallback((next) => { saveJSON(KEYS.log, next); setLogState(next); cloudPut(KEYS.log, next); }, [cloudPut]);
  const saveVessels = useCallback((next) => { saveJSON(KEYS.vessels, next); setVesselsState(next); cloudPut(KEYS.vessels, next); }, [cloudPut]);

  // ---- derived helpers ----
  const vesselsFor = useCallback((mo) => (Array.isArray(vessels[mo]) ? vessels[mo] : []), [vessels]);

  const eventForDay = useCallback((mo, day) => {
    for (const v of vesselsFor(mo)) { if (day >= v.from && day <= v.to) return v; }
    return null;
  }, [vesselsFor]);

  const effHum = useCallback((sector, idx, st) => {
    const ov = hum?.[month]?.[cancha]?.[shift]?.[sector]?.[idx];
    if (ov != null && !isNaN(ov)) return Number(ov);
    return null; // no default estimate — must be measured
  }, [hum, month, cancha, shift]);

  // ---- actions ----
  const shiftMonth = useCallback((delta) => {
    let { y, m } = parseMonth(month);
    m += delta;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    const nextMonth = y + '-' + String(m).padStart(2, '0');
    const nextData = ensureMonth(data, nextMonth);
    if (nextData !== data) saveData(nextData);
    setRefDay((d) => Math.min(d, daysInMonth(nextMonth)));
    setMonth(nextMonth);
  }, [month, data, saveData]);

  const cycle = useCallback((sector, dayIdx) => {
    const d = ensureMonth(data, month);
    const arr = d[month][cancha][sector].slice();
    arr[dayIdx] = STATE_ORDER[(STATE_ORDER.indexOf(arr[dayIdx]) + 1) % 3];
    saveData({ ...d, [month]: { ...d[month], [cancha]: { ...d[month][cancha], [sector]: arr } } });
  }, [data, month, cancha, saveData]);

  const cycleSF = useCallback((sector, dayIdx) => {
    let occ = ensureSFMonth(sfOcc, month);
    const arr = occ[month][sector].slice();
    const newSt = STATE_ORDER_SF[(STATE_ORDER_SF.indexOf(arr[dayIdx]) + 1) % STATE_ORDER_SF.length];
    arr[dayIdx] = newSt;
    occ = { ...occ, [month]: { ...occ[month], [sector]: arr } };
    saveSFOcc(occ);
    if (newSt === 'libre') {
      const next = JSON.parse(JSON.stringify(sinter || {}));
      let changed = false;
      for (const sh of ['D', 'N']) {
        for (const pv of ['ema', 'bella']) {
          for (const p of SF_PARAMS) {
            const bucket = next?.[month]?.[sh]?.[pv]?.[p.key]?.[sector];
            if (bucket && bucket[dayIdx] != null) { delete bucket[dayIdx]; changed = true; }
          }
        }
      }
      if (changed) saveSinter(next);
    }
  }, [sfOcc, month, saveSFOcc, sinter, saveSinter]);

  const setHumAt = useCallback((sector, idx, raw) => {
    const next = JSON.parse(JSON.stringify(hum || {}));
    next[month] = next[month] || {}; next[month][cancha] = next[month][cancha] || {};
    next[month][cancha][shift] = next[month][cancha][shift] || {};
    next[month][cancha][shift][sector] = next[month][cancha][shift][sector] || {};
    const v = String(raw).replace(',', '.');
    if (raw === '' || raw == null || isNaN(Number(v))) delete next[month][cancha][shift][sector][idx];
    else next[month][cancha][shift][sector][idx] = Number(v);
    saveHum(next);
  }, [hum, month, cancha, shift, saveHum]);

  const setFeAt = useCallback((sector, idx, raw) => {
    const next = JSON.parse(JSON.stringify(fe || {}));
    next[month] = next[month] || {}; next[month][cancha] = next[month][cancha] || {};
    next[month][cancha][shift] = next[month][cancha][shift] || {};
    next[month][cancha][shift][sector] = next[month][cancha][shift][sector] || {};
    const v = String(raw).replace(',', '.');
    if (raw === '' || raw == null || isNaN(Number(v))) delete next[month][cancha][shift][sector][idx];
    else next[month][cancha][shift][sector][idx] = Number(v);
    saveFe(next);
  }, [fe, month, cancha, shift, saveFe]);

  const setSinterAt = useCallback((provider, paramKey, sector, idx, raw) => {
    const next = JSON.parse(JSON.stringify(sinter || {}));
    next[month] = next[month] || {}; next[month][shift] = next[month][shift] || {};
    next[month][shift][provider] = next[month][shift][provider] || {};
    next[month][shift][provider][paramKey] = next[month][shift][provider][paramKey] || {};
    next[month][shift][provider][paramKey][sector] = next[month][shift][provider][paramKey][sector] || {};
    const v = String(raw).replace(',', '.');
    if (raw === '' || raw == null || isNaN(Number(v))) delete next[month][shift][provider][paramKey][sector][idx];
    else next[month][shift][provider][paramKey][sector][idx] = Number(v);
    saveSinter(next);
  }, [sinter, month, shift, saveSinter]);

  const setLog = useCallback((field, value) => {
    const next = JSON.parse(JSON.stringify(log || {}));
    next[month] = next[month] || {}; next[month][refDay] = next[month][refDay] || {};
    next[month][refDay][shift] = next[month][refDay][shift] || {};
    if (value === '' || value == null) delete next[month][refDay][shift][field];
    else next[month][refDay][shift][field] = value;
    saveLog(next);
  }, [log, month, refDay, shift, saveLog]);

  const typeKeyToOp = (tk) => {
    if (tk === 'hierro_apf') return { op: 'hierro', prod: 'APF' };
    if (tk === 'hierro_asf') return { op: 'hierro', prod: 'ASF' };
    if (tk === 'cobre') return { op: 'cobre', prod: 'CON CU' };
    return { op: 'cerrado', prod: null };
  };

  const saveVesselForm = useCallback((index, form) => {
    const dim = daysInMonth(month);
    let name = (form.name || '').trim();
    let from = parseInt(form.from, 10);
    let to = parseInt(form.to, 10);
    const { op, prod } = typeKeyToOp(form.typeKey);
    let tons = parseFloat(String(form.tons || '').replace(/\./g, '').replace(',', '.'));
    if (isNaN(tons)) tons = null;
    if (!name) name = op === 'cerrado' ? 'Puerto cerrado' : op === 'cobre' ? 'Embarque cobre' : 'Motonave';
    if (isNaN(from)) from = 1;
    if (isNaN(to)) to = from;
    from = Math.max(1, Math.min(dim, from));
    to = Math.max(from, Math.min(dim, to));
    const list = vesselsFor(month).map((v) => ({ ...v }));
    const entry = { name, from, to, op, prod, tons };
    if (index != null) list[index] = entry; else list.push(entry);
    list.sort((a, b) => a.from - b.from);
    saveVessels({ ...vessels, [month]: list });
  }, [month, vesselsFor, vessels, saveVessels]);

  const deleteVessel = useCallback((index) => {
    const list = vesselsFor(month).map((v) => ({ ...v }));
    list.splice(index, 1);
    saveVessels({ ...vessels, [month]: list });
  }, [month, vesselsFor, vessels, saveVessels]);

  const doReset = useCallback(() => {
    const idx = refDay - 1;
    if (cancha === 'SF') {
      const nextSinter = JSON.parse(JSON.stringify(sinter || {}));
      const sb = nextSinter?.[month]?.[shift];
      if (sb) { for (const pv of Object.keys(sb)) { for (const pk of Object.keys(sb[pv])) { for (const s of Object.keys(sb[pv][pk])) { if (sb[pv][pk][s]) delete sb[pv][pk][s][idx]; } } } }
      saveSinter(nextSinter);
      const nextOcc = JSON.parse(JSON.stringify(ensureSFMonth(sfOcc, month)));
      for (const s of SECTORS.SF) { if (nextOcc[month][s]) nextOcc[month][s][idx] = 'libre'; }
      saveSFOcc(nextOcc);
      return;
    }
    const nextData = JSON.parse(JSON.stringify(ensureMonth(data, month)));
    for (const s of SECTORS[cancha]) { if (nextData[month][cancha][s]) nextData[month][cancha][s][idx] = 'libre'; }
    saveData(nextData);
    const nextLog = JSON.parse(JSON.stringify(log || {}));
    if (nextLog[month] && nextLog[month][refDay]) {
      delete nextLog[month][refDay][shift];
      if (!Object.keys(nextLog[month][refDay]).length) delete nextLog[month][refDay];
    }
    saveLog(nextLog);
    const nextHum = JSON.parse(JSON.stringify(hum || {}));
    const hb = nextHum?.[month]?.[cancha]?.[shift];
    if (hb) { for (const s of Object.keys(hb)) { if (hb[s]) delete hb[s][idx]; } }
    saveHum(nextHum);
    const nextFe = JSON.parse(JSON.stringify(fe || {}));
    const fb = nextFe?.[month]?.[cancha]?.[shift];
    if (fb) { for (const s of Object.keys(fb)) { if (fb[s]) delete fb[s][idx]; } }
    saveFe(nextFe);
  }, [cancha, refDay, month, shift, sinter, saveSinter, sfOcc, saveSFOcc, data, saveData, log, saveLog, hum, saveHum, fe, saveFe]);

  const importExcel = useCallback(async (file) => {
    let rows;
    try { rows = await xlsxRows(await file.arrayBuffer()); }
    catch (err) { return { ok: false, message: String(err.message || err) }; }
    const nextHum = JSON.parse(JSON.stringify(hum || {}));
    const nextFe = JSON.parse(JSON.stringify(fe || {}));
    const SH = ['D', 'N'];
    const setNested = (obj, mo, ca, sh, fd, idx, val) => {
      obj[mo] = obj[mo] || {}; obj[mo][ca] = obj[mo][ca] || {}; obj[mo][ca][sh] = obj[mo][ca][sh] || {};
      obj[mo][ca][sh][fd] = obj[mo][ca][sh][fd] || {}; obj[mo][ca][sh][fd][idx] = val;
    };
    let filled = 0;
    const map = { CNN: { fe: 'feCNN', hum: 'humCNN' }, PM: { fe: 'fePM', hum: 'humPM' } };
    for (const row of rows) {
      const [Y, M, D] = row.date.split('-').map(Number);
      const mo = Y + '-' + String(M).padStart(2, '0');
      const idx = D - 1;
      for (const ca of ['CNN', 'PM']) {
        const occ = data?.[mo]?.[ca];
        if (!occ) continue;
        for (const fd of SECTORS[ca]) {
          const st = occ[fd] && occ[fd][idx];
          if (st === 'fresca') {
            const hv = row[map[ca].hum], fv = row[map[ca].fe];
            for (const sh of SH) {
              if (hv != null && !isNaN(hv)) { setNested(nextHum, mo, ca, sh, fd, idx, Math.round(hv * 100) / 100); filled++; }
              if (fv != null && !isNaN(fv)) { setNested(nextFe, mo, ca, sh, fd, idx, Math.round(fv * 100) / 100); }
            }
          }
        }
      }
    }
    saveHum(nextHum); saveFe(nextFe);
    const nMonths = new Set(rows.map((r) => r.date.slice(0, 7))).size;
    return {
      ok: true,
      message: filled > 0
        ? `Se importaron ${rows.length} días (${nMonths} ${nMonths === 1 ? 'mes' : 'meses'}). Los valores de humedad y Ley Fe se aplicaron a los feeders en acopio fresco.`
        : `Se leyeron ${rows.length} días, pero ningún feeder estaba en acopio fresco en esas fechas, así que no se aplicó ningún valor.`,
    };
  }, [hum, fe, data, saveHum, saveFe]);

  const importExcelSinter = useCallback(async (file) => {
    let rows;
    try { rows = await xlsxRowsSinter(await file.arrayBuffer()); }
    catch (err) { return { ok: false, message: String(err.message || err) }; }
    const next = JSON.parse(JSON.stringify(sinter || {}));
    const sectors = SECTORS.SF;
    const SH = ['D', 'N'];
    const paramKeys = ['fe', 'p', 'sio2', 'al2o3', 's', 'tio2'];
    const keyMap = { fe: 'fet', p: 'p', sio2: 'sio2', al2o3: 'al2o3', s: 's', tio2: 'tio2' };
    let daysWithData = 0;
    for (const row of rows) {
      const [Y, M, D] = row.date.split('-').map(Number);
      const mo = Y + '-' + String(M).padStart(2, '0');
      const idx = D - 1;
      let anyData = false;
      for (const provKey of ['ema', 'bella']) {
        const rowData = row[provKey];
        const hasData = rowData.fe != null && !isNaN(rowData.fe) && rowData.fe > 0;
        if (hasData) {
          anyData = true;
          for (const pk of paramKeys) {
            const v = rowData[pk];
            if (v == null || isNaN(v)) continue;
            const val = Math.round(v * 100) / 100;
            for (const sh of SH) {
              next[mo] = next[mo] || {}; next[mo][sh] = next[mo][sh] || {};
              next[mo][sh][provKey] = next[mo][sh][provKey] || {};
              next[mo][sh][provKey][keyMap[pk]] = next[mo][sh][provKey][keyMap[pk]] || {};
              for (const s of sectors) {
                next[mo][sh][provKey][keyMap[pk]][s] = next[mo][sh][provKey][keyMap[pk]][s] || {};
                next[mo][sh][provKey][keyMap[pk]][s][idx] = val;
              }
            }
          }
        }
      }
      if (anyData) daysWithData++;
    }
    saveSinter(next);
    const nMonths = new Set(rows.map((r) => r.date.slice(0, 7))).size;
    return {
      ok: true,
      message: rows.length > 0
        ? `Se leyeron ${rows.length} días (${nMonths} ${nMonths === 1 ? 'mes' : 'meses'}). Se registraron las leyes de ${daysWithData} días con datos en los 6 feeders de cada proveedor. Marca la Ocupación manualmente para que las leyes se muestren.`
        : 'No se encontraron filas de datos válidas en el Excel.',
    };
  }, [sinter, saveSinter]);

  const requestReset = useCallback(() => {
    const { m } = parseMonth(month);
    const dLabel = String(refDay).padStart(2, '0') + '-' + String(m).padStart(2, '0');
    const tNom = shift === 'D' ? 'Día' : 'Noche';
    const caNom = cancha === 'CNN' ? 'CNN' : cancha === 'PM' ? 'Magnetita' : 'Sinter Feed';
    const message = cancha === 'SF'
      ? `Se borrará la ocupación y las 6 leyes químicas registradas ese día (${dLabel}, turno ${tNom}) en los 6 feeders de Sinter Feed, para Ema y Bella Ester. El resto del mes no se toca.`
      : `Se borrará el día ${dLabel} (turno ${tNom}, cancha ${caNom}): ocupación de feeders, registro de turno y humedades de ese día. El resto del mes no se toca.`;
    setModal({ kind: 'confirm', title: 'Borrar día ' + dLabel, message, okLabel: 'Borrar día', onOk: 'doReset' });
  }, [month, refDay, shift, cancha, setModal]);

  return {
    // state
    month, cancha, refDay, shift,
    data, hum, fe, sinter, sfOcc, log, vessels,
    modal, modalVesselType, syncStatus,
    cloudEnabled: cloudEnabled(),
    editingRef,
    // setters
    setCancha, setRefDay, setShift, setModal, setModalVesselType,
    // derived
    vesselsFor, eventForDay, effHum, ensureMonth: (d, mo) => ensureMonth(d, mo), ensureSFMonth: (o, mo) => ensureSFMonth(o, mo),
    // actions
    shiftMonth, cycle, cycleSF, setHumAt, setFeAt, setSinterAt, setLog,
    saveVesselForm, deleteVessel, doReset, requestReset, importExcel, importExcelSinter,
  };
}
