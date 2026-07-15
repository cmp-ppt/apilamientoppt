import { useMemo } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { SECTORS, TONS, MESES, DOW, SF_PARAMS, SF_PROVIDERS, TML } from '../constants';
import { daysInMonth, parseMonth, streak, fmtHum, fmtCell, fmtSF, fmtSFShort, specPass, humColor, humWord, feColor, humCellColor, fmt } from '../utils/format';

// Data for an occupancy cancha (CNN or PM, or the active tab's cancha by default).
// Pass canchaOverride (e.g. 'CNN') to read a specific cancha regardless of the active tab —
// used by the multi-cancha overview and the cross-area alarm feed.
export function useCanchaView(canchaOverride) {
  const { month, cancha: activeCancha, refDay, shift, data, hum, fe, vessels, vesselsFor, eventForDay, ensureMonth } = useAcopio();
  const cancha = canchaOverride || activeCancha;
  return useMemo(() => {
    const isSF = cancha === 'SF';
    const occCancha = isSF ? 'CNN' : cancha;
    const d = ensureMonth(data, month);
    const monthData = d[month][occCancha];
    const dim = daysInMonth(month);
    const sectors = SECTORS[occCancha];
    const tons = TONS[occCancha];
    const { y, m } = parseMonth(month);
    const refIdx = refDay - 1;

    const contam = {};
    let contamTotal = 0;
    for (const s of sectors) {
      const arr = monthData[s];
      contam[s] = new Set();
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] === 'fresca' && arr[i - 1] === 'secado') { contam[s].add(i); contamTotal++; }
      }
    }

    const dayHeaders = [];
    for (let dnum = 1; dnum <= dim; dnum++) {
      const ev = eventForDay(month, dnum);
      dayHeaders.push({
        day: dnum,
        label: String(dnum).padStart(2, '0'),
        dow: DOW[new Date(y, m - 1, dnum).getDay()],
        isRef: dnum === refDay,
        vesselOp: ev ? ev.op : null,
      });
    }

    const makeRows = (mode) => sectors.map((s) => {
      const arr = monthData[s];
      const cells = arr.map((st, i) => {
        const isRef = i === refIdx;
        const dias = st === 'secado' ? streak(arr, i) : 0;
        if (mode === 'humedad' || mode === 'fe') {
          const isFe = mode === 'fe';
          const clickable = st !== 'libre';
          const store = isFe ? fe : hum;
          const ov = store?.[month]?.[cancha]?.[shift]?.[s]?.[i];
          const measured = ov != null && !isNaN(ov);
          const val = measured ? Number(ov) : null;
          let bg = null, fg = null;
          if (measured) { const c = isFe ? feColor(val) : humCellColor(val); bg = c.bg; fg = c.fg; }
          return { day: i + 1, isRef, clickable, measured, value: val, text: measured ? fmtCell(val) : '', bg, fg, state: st };
        }
        const isBad = st === 'fresca' && contam[s].has(i);
        return { day: i + 1, isRef, state: st, isBad, dias };
      });
      return { sector: s, cells };
    });

    const rowsEstado = makeRows('estado');
    const rowsHum = makeRows('humedad');
    const rowsFe = makeRows('fe');

    const semaforo = sectors.map((s) => {
      const arr = monthData[s];
      const st = arr[refIdx];
      const dias = st === 'secado' ? streak(arr, refIdx) : null;
      const eff = hum?.[month]?.[cancha]?.[shift]?.[s]?.[refIdx];
      const effN = eff != null && !isNaN(eff) ? Number(eff) : null;
      let riskLabel, rc;
      if (st === 'libre') { riskLabel = '—'; rc = '#54637a'; }
      else if (st === 'fresca') { riskLabel = 'Húmeda'; rc = '#3f77e8'; }
      else { riskLabel = humWord(effN); rc = humColor(effN); }
      return {
        sector: s,
        stateLabel: st === 'fresca' ? 'Acopio fresca' : st === 'secado' ? 'En secado' : 'Libre',
        dryLabel: st === 'secado' ? dias + ' d secado' : st === 'fresca' ? 'acopio fresca' : 'libre',
        riskLabel, riskColor: rc,
        humValue: effN,
      };
    });

    const vesselsView = vesselsFor(month).map((v, vi) => {
      const isShip = v.op === 'hierro', isCu = v.op === 'cobre';
      let worstH = null, tSum = null;
      if (isShip) {
        let mx = null; const sset = new Set();
        for (const s of sectors) {
          const arr = monthData[s];
          for (let j = 0; j < arr.length - 1; j++) {
            if (arr[j] === 'secado' && arr[j + 1] !== 'secado') {
              const shipDay = j + 2;
              if (shipDay >= v.from && shipDay <= v.to + 1) {
                sset.add(s);
                const h = hum?.[month]?.[cancha]?.[shift]?.[s]?.[j];
                const hN = h != null && !isNaN(h) ? Number(h) : null;
                if (hN != null) mx = mx == null ? hN : Math.max(mx, hN);
              }
            }
          }
        }
        worstH = mx;
        tSum = sset.size ? [...sset].reduce((a, s) => a + tons[s], 0) : null;
      }
      const rc = isShip ? humColor(worstH) : '#54637a';
      const muted = v.op === 'cerrado';
      const prodLabel = isShip ? (v.prod || 'APF') : isCu ? 'CON CU' : '';
      return {
        index: vi,
        name: v.name,
        range: String(v.from).padStart(2, '0') + '–' + String(v.to).padStart(2, '0') + ' ' + MESES[m - 1].slice(0, 3),
        accent: v.op === 'hierro' ? '#3f77e8' : v.op === 'cobre' ? '#ef9b3a' : '#9aa7b8',
        prodLabel,
        tonsLabel: v.tons != null ? fmt(v.tons) + ' t' : '',
        muted,
        riskLabel: isShip ? prodLabel : isCu ? 'Cobre' : 'Cerrado',
        riskColor: isShip ? '#1a73e8' : isCu ? '#ef9b3a' : '#54637a',
        humLabel: isShip && worstH != null ? 'máx ' + fmtHum(worstH) : '',
        humColor: rc,
        op: v.op,
      };
    });

    const states = sectors.map((s) => monthData[s][refIdx]);
    const occ = Math.round((states.filter((x) => x !== 'libre').length / sectors.length) * 100);
    const secIdx = sectors.filter((s) => monthData[s][refIdx] === 'secado');
    const humToday = sectors.map((s) => hum?.[month]?.[cancha]?.[shift]?.[s]?.[refIdx]).filter((h) => h != null && !isNaN(h)).map(Number);
    const avgHum = humToday.length ? humToday.reduce((a, b) => a + b, 0) / humToday.length : null;
    const feToday = sectors.map((s) => fe?.[month]?.[cancha]?.[shift]?.[s]?.[refIdx]).filter((v) => v != null && !isNaN(v)).map(Number);
    const avgFe = feToday.length ? feToday.reduce((a, b) => a + b, 0) / feToday.length : null;

    let nextV;
    if (vesselsFor(month).length) {
      const cur = eventForDay(month, refDay);
      if (cur && cur.op === 'hierro') nextV = { txt: cur.name.replace('MV ', ''), sub: 'en curso' };
      else {
        const up = vesselsFor(month).find((v) => v.op === 'hierro' && v.from > refDay);
        nextV = up ? { txt: up.name.replace('MV ', ''), sub: 'desde ' + String(up.from).padStart(2, '0') + '-' + String(m).padStart(2, '0') } : { txt: '—', sub: 'sin programa' };
      }
    } else nextV = { txt: '—', sub: 'sin programa' };

    const humMonth = []; const feMonth = [];
    let humMaxDay = 0, feMaxDay = 0;
    const hbm = hum?.[month]?.[cancha]?.[shift] || {};
    for (const s in hbm) { for (const k in hbm[s]) { const v = hbm[s][k]; if (v != null && !isNaN(v)) { humMonth.push(Number(v)); humMaxDay = Math.max(humMaxDay, +k + 1); } } }
    const fbm = fe?.[month]?.[cancha]?.[shift] || {};
    for (const s in fbm) { for (const k in fbm[s]) { const v = fbm[s][k]; if (v != null && !isNaN(v)) { feMonth.push(Number(v)); feMaxDay = Math.max(feMaxDay, +k + 1); } } }
    const avgHumMonth = humMonth.length ? humMonth.reduce((a, b) => a + b, 0) / humMonth.length : null;
    const avgFeMonth = feMonth.length ? feMonth.reduce((a, b) => a + b, 0) / feMonth.length : null;

    const kpis = [
      { label: 'Ocupación cancha', value: occ + '%', sub: (sectors.length - states.filter((x) => x === 'libre').length) + ' de ' + sectors.length + ' feeders', color: '#1a73e8' },
      { label: 'Feeders en secado', value: String(secIdx.length), sub: 'esperando embarque', color: '#1f9d55' },
      { label: 'Humedad prom. día', value: avgHum != null ? fmtHum(avgHum) : '—', sub: humToday.length ? humToday.length + (humToday.length === 1 ? ' feeder medido' : ' feeders medidos') : 'sin registro', color: avgHum != null ? humCellColor(avgHum).bg : '#1a73e8' },
      { label: 'Humedad prom. mes', value: avgHumMonth != null ? fmtHum(avgHumMonth) : '—', sub: humMaxDay ? 'hasta el día ' + String(humMaxDay).padStart(2, '0') : 'sin registro', color: avgHumMonth != null ? humCellColor(avgHumMonth).bg : '#1a73e8' },
      { label: 'Ley Fe día', value: avgFe != null ? (Math.round(avgFe * 100) / 100).toFixed(2).replace('.', ',') + '%' : '—', sub: feToday.length ? feToday.length + (feToday.length === 1 ? ' feeder medido' : ' feeders medidos') : 'sin registro', color: avgFe != null ? feColor(avgFe).bg : '#1a73e8' },
      { label: 'Ley Fe mes', value: avgFeMonth != null ? (Math.round(avgFeMonth * 100) / 100).toFixed(2).replace('.', ',') + '%' : '—', sub: feMaxDay ? 'hasta el día ' + String(feMaxDay).padStart(2, '0') : 'sin registro', color: avgFeMonth != null ? feColor(avgFeMonth).bg : '#1a73e8' },
      { label: 'Acopio sobre secado', value: String(contamTotal), sub: 'eventos en el mes', color: contamTotal > 0 ? '#dc2626' : '#1f9d55' },
      { label: 'Próximo embarque', value: nextV.txt, sub: nextV.sub, color: '#182a44' },
    ];

    const ev = eventForDay(month, refDay);
    const closed = ev && ev.op === 'cerrado';

    return {
      isSF, dim, sectors, tons, monthData, dayHeaders,
      rowsEstado, rowsHum, rowsFe, semaforo, vessels: vesselsView,
      kpis, contamTotal, closed, refIdx,
      occRaw: occ, avgHumRaw: avgHum, avgFeRaw: avgFe,
      monthLabel: MESES[m - 1] + ' ' + y,
      canchaTitle: cancha === 'CNN' ? 'Cancha CNN' : cancha === 'PM' ? 'Cancha Magnetita' : 'Sinter Feed',
    };
  }, [month, cancha, refDay, shift, data, hum, fe, vessels, vesselsFor, eventForDay, ensureMonth]);
}

export function useSFView() {
  const { month, refDay, shift, sfOcc, sinter, ensureSFMonth } = useAcopio();
  return useMemo(() => {
    const dim = daysInMonth(month);
    const { y, m } = parseMonth(month);
    const refIdx = refDay - 1;
    const sfSectors = SECTORS.SF;

    const sfDayHeaders = [];
    for (let dnum = 1; dnum <= dim; dnum++) {
      sfDayHeaders.push({ day: dnum, label: String(dnum).padStart(2, '0'), dow: DOW[new Date(y, m - 1, dnum).getDay()], isRef: dnum === refDay });
    }

    const sfOccData = ensureSFMonth(sfOcc, month)[month];

    const buildSFRows = (provider) => sfSectors.map((s) => {
      const cells = [];
      for (let i = 0; i < dim; i++) {
        const isRef = i === refIdx;
        const occSt = (sfOccData[s] || [])[i] || 'libre';
        const enabled = occSt === provider || occSt === 'mixto';
        const minis = SF_PARAMS.map((p) => {
          const ov = enabled ? sinter?.[month]?.[shift]?.[provider]?.[p.key]?.[s]?.[i] : null;
          const measured = ov != null && !isNaN(ov);
          const val = measured ? Number(ov) : null;
          let pass = null;
          if (measured) pass = specPass(p.key, val);
          return { key: p.key, label: p.label, measured, value: val, text: measured ? fmtSFShort(val) : '', pass, enabled };
        });
        cells.push({ day: i + 1, isRef, minis, enabled });
      }
      return { sector: s, cells };
    });

    const sfSections = SF_PROVIDERS.map((pv) => ({ key: pv.key, title: pv.label, rows: buildSFRows(pv.key) }));

    const sfOccRows = sfSectors.map((s) => {
      const arr = sfOccData[s] || new Array(dim).fill('libre');
      const cells = arr.map((st, i) => ({ day: i + 1, isRef: i === refIdx, state: st }));
      return { sector: s, cells };
    });

    const sfKpis = SF_PARAMS.map((p) => {
      const vals = [];
      for (const pv of SF_PROVIDERS) sfSectors.forEach((s) => { const v = sinter?.[month]?.[shift]?.[pv.key]?.[p.key]?.[s]?.[refIdx]; if (v != null && !isNaN(v)) vals.push(Number(v)); });
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      const pass = avg != null ? specPass(p.key, avg) : null;
      return { label: p.label + ' día', value: avg != null ? fmtSF(avg) + '%' : '—', sub: vals.length ? vals.length + (vals.length === 1 ? ' medición' : ' mediciones') : 'sin registro', color: avg == null ? '#1a73e8' : pass ? '#1f9d55' : '#dc2626' };
    });

    const sfKpisMonth = SF_PARAMS.map((p) => {
      const vals = []; let maxDay = 0;
      for (const pv of SF_PROVIDERS) {
        const bucket = sinter?.[month]?.[shift]?.[pv.key]?.[p.key] || {};
        for (const s in bucket) { for (const k in bucket[s]) { const v = bucket[s][k]; if (v != null && !isNaN(v)) { vals.push(Number(v)); maxDay = Math.max(maxDay, +k + 1); } } }
      }
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      const pass = avg != null ? specPass(p.key, avg) : null;
      return { label: p.label + ' mes', value: avg != null ? fmtSF(avg) + '%' : '—', sub: maxDay ? 'hasta el día ' + String(maxDay).padStart(2, '0') : 'sin registro', color: avg == null ? '#1a73e8' : pass ? '#1f9d55' : '#dc2626' };
    });

    return { dim, sfDayHeaders, sfOccRows, sfSections, sfKpis, sfKpisMonth };
  }, [month, refDay, shift, sfOcc, sinter, ensureSFMonth]);
}
