export const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
export const DOW = ['D','L','M','M','J','V','S'];

export const SECTORS = {
  CNN: ['F1','F2','F3','F4','F5','F6'],
  PM: ['F1','F2','F3','F4','F5'],
  SF: ['F1A','F1B','F2A','F2B','F3A','F3B'],
};

export const SF_PARAMS = [
  { key: 'fet', label: 'FeT', dir: 'min', limit: 62.50, hint: 'mín. 62,50%' },
  { key: 'sio2', label: 'SiO2', dir: 'max', limit: 5.90, hint: 'máx. 5,90%' },
  { key: 'al2o3', label: 'Al2O3', dir: 'max', limit: 1.40, hint: 'máx. 1,40%' },
  { key: 'p', label: 'P', dir: 'max', limit: 0.120, hint: 'máx. 0,120%' },
  { key: 's', label: 'S', dir: 'max', limit: 0.16, hint: 'máx. 0,16%' },
  { key: 'tio2', label: 'TiO2', dir: 'max', limit: 0.70, hint: 'máx. 0,70%' },
];

export const SF_PROVIDERS = [
  { key: 'ema', label: 'Leyes químicas por feeder — Sinter Feed · Proveedor Ema' },
  { key: 'bella', label: 'Leyes químicas por feeder — Sinter Feed · Proveedor Bella Ester' },
];

export const TONS = {
  CNN: { F1: 18500, F2: 17200, F3: 19800, F4: 21000, F5: 16400, F6: 15900 },
  PM: { F1: 15200, F2: 14800, F3: 16100, F4: 17500, F5: 13900 },
  SF: { F3A: 10000, F3B: 10000, F2A: 10000, F2B: 10000, F1A: 10000, F1B: 10000 },
};

export const TML = 8.4;

export const SEED = {
  CNN: {
    F1: 'FF..SSFF.SSS.FF......SSSSSSS.',
    F2: 'FF..SSFFFSSS.FFF.....SSSSSSS.',
    F3: 'SSSSSSSSSSSSFSSF....FSSFSSSS.',
    F4: 'SSSSS.SSSSSSFSSS....FFFFFFFS.',
    F5: 'SSFFFFSSS...SSSS....SFFS.....',
    F6: '......SSSFFFSSSS....S......F.',
  },
  PM: {
    F1: 'FF....FF.F................F.S',
    F2: 'FFFFF...F.F..F.......F...F..S',
    F3: 'SSSSSFSSSSSFFSFF.....FFSFSSFS',
    F4: 'SSSSSSSSSSSSSSSS....FSSFFSSSF',
    F5: 'SSSSSSSSSSSSSSSS....SSSFSSSS.',
  },
};

export const VESSELS_SEED = [
  { name: 'MV PIGI', from: 1, to: 1, op: 'hierro', prod: 'ASF', tons: 46977 },
  { name: 'MV JUDD', from: 2, to: 7, op: 'hierro', prod: 'APF', tons: 202900 },
  { name: 'MV JIN MEI', from: 9, to: 14, op: 'hierro', prod: 'APF', tons: 174800 },
  { name: 'MV TTM HARVEST', from: 14, to: 16, op: 'cobre', prod: 'CON CU', tons: 31350 },
  { name: 'MV MINERAL MAURITIUS', from: 16, to: 21, op: 'hierro', prod: 'APF', tons: 205300 },
  { name: 'MV SHANDONG RENAISSANCE', from: 21, to: 25, op: 'hierro', prod: 'APF', tons: 154795 },
  { name: 'MV SHANDONG RENAISSANCE', from: 25, to: 26, op: 'hierro', prod: 'ASF', tons: 52500 },
];

export const STATE_ORDER = ['libre', 'fresca', 'secado'];
export const STATE_ORDER_SF = ['libre', 'ema', 'bella', 'mixto'];

export const SYNC = {
  url: 'https://ywocrktcwnwqzhsgnzex.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3b2Nya3Rjd253cXpoc2duemV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTg5ODUsImV4cCI6MjA5ODkzNDk4NX0.ELpQSgDZFIwV7PEKPIAr2r7_NMG143RZoHbn3hwPhIk',
  table: 'acopio_kv',
  pollMs: 30000,
};

export const KEYS = {
  data: 'acopioData_v4',
  hum: 'acopioHum_v3',
  fe: 'acopioFe_v1',
  log: 'acopioLog_v4',
  vessels: 'acopioVessels_v2',
  sinter: 'acopioSinter_v1',
  sfOcc: 'acopioSFOcc_v1',
};

export const DIAS_RECOMENDADOS = 6;
export const DIAS_CRITICOS = 4;

// ---- SCADA color tokens (dark industrial theme) ----
export const SCADA = {
  bg: '#eef1f6',
  panel: '#ffffff',
  panelHeader: '#f6f8fb',
  border: '#e2e7ef',
  run: '#1f9d55',
  warn: '#ef9b3a',
  alarm: '#dc2626',
  info: '#1a73e8',
  accent: '#3f77e8',
  txt: '#182a44',
  txtDim: '#54637a',
  txtMuted: '#9aa7b8',
};
