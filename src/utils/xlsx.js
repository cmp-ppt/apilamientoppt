// Minimal .xlsx reader using native DecompressionStream — no external deps.
export async function xlsxGrid(buf) {
  const bytes = new Uint8Array(buf);
  const dv = new DataView(bytes.buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('No es un archivo .xlsx válido');
  const cdOffset = dv.getUint32(eocd + 16, true);
  const cdCount = dv.getUint16(eocd + 10, true);
  let p = cdOffset;
  const entries = [];
  for (let n = 0; n < cdCount; n++) {
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOff = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.slice(p + 46, p + 46 + nameLen));
    entries.push({ name, method, compSize, localOff });
    p += 46 + nameLen + extraLen + commentLen;
  }
  const inflate = async (b) => {
    const ds = new DecompressionStream('deflate-raw');
    const w = ds.writable.getWriter();
    w.write(b);
    w.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  };
  const extract = async (nm) => {
    const en = entries.find((x) => x.name === nm);
    if (!en) return null;
    const lp = en.localOff;
    const nl = dv.getUint16(lp + 26, true);
    const el = dv.getUint16(lp + 28, true);
    const s = lp + 30 + nl + el;
    const comp = bytes.slice(s, s + en.compSize);
    return en.method === 0 ? new TextDecoder().decode(comp) : new TextDecoder().decode(await inflate(comp));
  };
  const ssXml = await extract('xl/sharedStrings.xml');
  const strings = [];
  if (ssXml) {
    const re = /<si>([\s\S]*?)<\/si>/g;
    let mm;
    while ((mm = re.exec(ssXml))) strings.push(mm[1].replace(/<[^>]+>/g, ''));
  }
  const sheetName = entries.find((x) => /^xl\/worksheets\/sheet1\.xml$/.test(x.name))
    ? 'xl/worksheets/sheet1.xml'
    : (entries.find((x) => /^xl\/worksheets\//.test(x.name)) || {}).name;
  const sheet = await extract(sheetName);
  const colOf = (ref) => {
    const m = ref.match(/^([A-Z]+)/)[1];
    let c = 0;
    for (const ch of m) c = c * 26 + (ch.charCodeAt(0) - 64);
    return c;
  };
  const rowRe = /<row r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  const cellRe = /<c r="([A-Z]+\d+)"([^>]*?)>(?:<v>([^<]*)<\/v>)?<\/c>/g;
  const grid = [];
  let rm;
  while ((rm = rowRe.exec(sheet))) {
    const rn = +rm[1];
    const cells = {};
    let cm;
    cellRe.lastIndex = 0;
    while ((cm = cellRe.exec(rm[2]))) {
      const col = colOf(cm[1]);
      const attrs = cm[2];
      const v = cm[3];
      if (v == null) { cells[col] = null; continue; }
      if (/t="s"/.test(attrs)) cells[col] = strings[+v];
      else cells[col] = +v;
    }
    grid[rn] = cells;
  }
  return grid;
}

export function serialToDate(s) {
  const d = new Date(Date.UTC(1899, 11, 30));
  d.setUTCDate(d.getUTCDate() + Math.round(s));
  return d.toISOString().slice(0, 10);
}

export async function xlsxRows(buf) {
  const grid = await xlsxGrid(buf);
  const rows = [];
  for (let r = 1; r < grid.length; r++) {
    const c = grid[r];
    if (!c) continue;
    if (typeof c[1] !== 'number') continue;
    rows.push({ date: serialToDate(c[1]), feCNN: c[2], fePM: c[3], humCNN: c[4], humPM: c[5] });
  }
  return rows;
}

export async function xlsxRowsSinter(buf) {
  const grid = await xlsxGrid(buf);
  const rows = [];
  for (let r = 3; r < grid.length; r++) {
    const c = grid[r];
    if (!c || typeof c[1] !== 'number') continue;
    rows.push({
      date: serialToDate(c[1]),
      ema: { fe: c[2], p: c[3], sio2: c[4], al2o3: c[5], s: c[6], tio2: c[7] },
      bella: { fe: c[9], p: c[10], sio2: c[11], al2o3: c[12], s: c[13], tio2: c[14] },
    });
  }
  return rows;
}
