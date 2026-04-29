export const CH_DEF: Record<string, { l: string; stage: 'tofu' | 'mofu' | 'bofu'; type: 'revenue' | 'assist' | 'awareness' }> = {
  shopee_store:  { l: 'Shopee Store',  stage: 'mofu', type: 'revenue'   },
  shopee_ads:    { l: 'Shopee Ads',    stage: 'bofu', type: 'revenue'   },
  cpas:          { l: 'CPAS',          stage: 'mofu', type: 'assist'    },
  tiktok_store:  { l: 'TikTok Store',  stage: 'mofu', type: 'revenue'   },
  tiktok_gmvmax: { l: 'GMV Max',       stage: 'bofu', type: 'revenue'   },
  tiktok_ads:    { l: 'TikTok Ads',    stage: 'tofu', type: 'awareness' },
  meta_ads:      { l: 'Meta Ads',      stage: 'tofu', type: 'awareness' },
};

export const STAGE_COLOR = { tofu: '#2563EB', mofu: '#D97706', bofu: '#059669' };
export const STAGE_LABEL = { tofu: 'TOFU · Awareness', mofu: 'MOFU · Consideration', bofu: 'BOFU · Conversion' };

export interface Client {
  key: string;
  ind: string;
  cg: string;
  at: string;
  as: string;
  pic: string;
  chs: string[];
  troas: Record<string, number>;
}

export const CLIENTS: Client[] = [
  { key: 'Kalisha', ind: 'Fashion', cg: 'Dica', at: 'Azhar', as: 'Alfath', pic: 'Ainun',
    chs: ['shopee_store','shopee_ads','cpas','tiktok_store','tiktok_gmvmax','tiktok_ads','meta_ads'],
    troas: { shopee_ads: 4, tiktok_gmvmax: 4 } },
  { key: 'Raecca', ind: 'Fashion', cg: 'Dica', at: 'Azhar', as: 'Alfath', pic: 'Raka',
    chs: ['shopee_store','shopee_ads','cpas','tiktok_store','tiktok_gmvmax','tiktok_ads','meta_ads'],
    troas: { shopee_ads: 4, tiktok_gmvmax: 4 } },
  { key: 'HTTP', ind: '—', cg: 'Dica', at: 'Azhar', as: 'Nunu', pic: 'Gemi',
    chs: ['shopee_store','shopee_ads','cpas','tiktok_store','tiktok_gmvmax','tiktok_ads','meta_ads'],
    troas: { shopee_ads: 4, tiktok_gmvmax: 4 } },
  { key: 'Amerta', ind: '—', cg: 'Bara', at: 'Ilham', as: 'Ziyad', pic: 'Prima',
    chs: ['shopee_store','shopee_ads','cpas','tiktok_store','tiktok_gmvmax','tiktok_ads'],
    troas: { shopee_ads: 4, tiktok_gmvmax: 4 } },
  { key: 'KREM', ind: 'Kecantikan', cg: 'Bara', at: 'Azhar', as: 'Ziyad', pic: 'Oktavia',
    chs: ['shopee_store','shopee_ads','cpas','meta_ads'],
    troas: { shopee_ads: 4 } },
];

export const PERIODS = ['2026-02', '2026-03'];
export const PL: Record<string, string> = { '2026-02': 'Feb 2026', '2026-03': 'Mar 2026' };
export const TC = ['#2563EB', '#059669', '#DC2626', '#7C3AED'];
export const ORD = ['rr','or','yy','nn','gg','gd'];
export const LM: Record<string, string> = { rr: 'Turun >20%', or: 'Turun 10–20%', yy: 'Turun <10%', nn: 'Stabil', gg: 'Naik <20%', gd: 'Naik >20%' };

export interface DataEntry {
  c: string;
  ch: string;
  p: string;
  rev?: number;
  sp?: number | null;
  ord?: number;
  vis?: number | null;
  reach?: number;
  impr?: number;
  results?: number;
}

export const DATA: DataEntry[] = [
  // KALISHA
  { c:'Kalisha', ch:'shopee_store',   p:'2026-02', rev:6061060164,  sp:null,       ord:68809,  vis:880117 },
  { c:'Kalisha', ch:'shopee_ads',     p:'2026-02', rev:5311336625,  sp:364257745,  ord:74656,  vis:null   },
  { c:'Kalisha', ch:'cpas',           p:'2026-02', rev:2200000000,  sp:180000000,  ord:38000,  vis:420000 },
  { c:'Kalisha', ch:'tiktok_store',   p:'2026-02', rev:8651234580,  sp:null,       ord:245288, vis:null   },
  { c:'Kalisha', ch:'tiktok_gmvmax',  p:'2026-02', rev:15528791440, sp:1053853609, ord:388309, vis:null   },
  { c:'Kalisha', ch:'tiktok_ads',     p:'2026-02', sp:85000000,  reach:1850000, impr:4200000, results:320000 },
  { c:'Kalisha', ch:'meta_ads',       p:'2026-02', sp:120000000, reach:2400000, impr:5800000, results:48000  },
  { c:'Kalisha', ch:'shopee_store',   p:'2026-03', rev:6856252658,  sp:null,       ord:76114,  vis:863954 },
  { c:'Kalisha', ch:'shopee_ads',     p:'2026-03', rev:5925685299,  sp:387861763,  ord:83785,  vis:null   },
  { c:'Kalisha', ch:'cpas',           p:'2026-03', rev:2480000000,  sp:192000000,  ord:42500,  vis:458000 },
  { c:'Kalisha', ch:'tiktok_store',   p:'2026-03', rev:8220543210,  sp:null,       ord:207455, vis:null   },
  { c:'Kalisha', ch:'tiktok_gmvmax',  p:'2026-03', rev:14810869751, sp:971836951,  ord:338567, vis:null   },
  { c:'Kalisha', ch:'tiktok_ads',     p:'2026-03', sp:92000000,  reach:2100000, impr:5100000, results:380000 },
  { c:'Kalisha', ch:'meta_ads',       p:'2026-03', sp:138000000, reach:2850000, impr:6900000, results:56000  },
  // RAECCA
  { c:'Raecca', ch:'shopee_store',    p:'2026-02', rev:3800000000,  sp:null,       ord:52000,  vis:620000 },
  { c:'Raecca', ch:'shopee_ads',      p:'2026-02', rev:2200000000,  sp:280000000,  ord:38000,  vis:null   },
  { c:'Raecca', ch:'cpas',            p:'2026-02', rev:980000000,   sp:95000000,   ord:16500,  vis:195000 },
  { c:'Raecca', ch:'tiktok_store',    p:'2026-02', rev:1800000000,  sp:null,       ord:28000,  vis:null   },
  { c:'Raecca', ch:'tiktok_gmvmax',   p:'2026-02', rev:4200000000,  sp:390000000,  ord:95000,  vis:null   },
  { c:'Raecca', ch:'tiktok_ads',      p:'2026-02', sp:65000000,  reach:1200000, impr:2900000, results:180000 },
  { c:'Raecca', ch:'meta_ads',        p:'2026-02', sp:88000000,  reach:1650000, impr:3800000, results:32000  },
  { c:'Raecca', ch:'shopee_store',    p:'2026-03', rev:4100000000,  sp:null,       ord:58000,  vis:670000 },
  { c:'Raecca', ch:'shopee_ads',      p:'2026-03', rev:2600000000,  sp:295000000,  ord:44000,  vis:null   },
  { c:'Raecca', ch:'cpas',            p:'2026-03', rev:1050000000,  sp:98000000,   ord:18000,  vis:210000 },
  { c:'Raecca', ch:'tiktok_store',    p:'2026-03', rev:1650000000,  sp:null,       ord:25000,  vis:null   },
  { c:'Raecca', ch:'tiktok_gmvmax',   p:'2026-03', rev:3900000000,  sp:370000000,  ord:88000,  vis:null   },
  { c:'Raecca', ch:'tiktok_ads',      p:'2026-03', sp:58000000,  reach:980000,  impr:2300000, results:145000 },
  { c:'Raecca', ch:'meta_ads',        p:'2026-03', sp:75000000,  reach:1380000, impr:3200000, results:27000  },
  // HTTP — turun
  { c:'HTTP', ch:'shopee_store',      p:'2026-02', rev:1200000000,  sp:null,       ord:18000,  vis:240000 },
  { c:'HTTP', ch:'shopee_ads',        p:'2026-02', rev:980000000,   sp:145000000,  ord:16500,  vis:null   },
  { c:'HTTP', ch:'cpas',              p:'2026-02', rev:420000000,   sp:68000000,   ord:7200,   vis:88000  },
  { c:'HTTP', ch:'tiktok_store',      p:'2026-02', rev:820000000,   sp:null,       ord:12000,  vis:null   },
  { c:'HTTP', ch:'tiktok_gmvmax',     p:'2026-02', rev:2100000000,  sp:280000000,  ord:42000,  vis:null   },
  { c:'HTTP', ch:'tiktok_ads',        p:'2026-02', sp:55000000,  reach:850000,  impr:1900000, results:120000 },
  { c:'HTTP', ch:'meta_ads',          p:'2026-02', sp:95000000,  reach:1480000, impr:3400000, results:38000  },
  { c:'HTTP', ch:'shopee_store',      p:'2026-03', rev:980000000,   sp:null,       ord:14200,  vis:195000 },
  { c:'HTTP', ch:'shopee_ads',        p:'2026-03', rev:820000000,   sp:152000000,  ord:13800,  vis:null   },
  { c:'HTTP', ch:'cpas',              p:'2026-03', rev:310000000,   sp:72000000,   ord:5400,   vis:65000  },
  { c:'HTTP', ch:'tiktok_store',      p:'2026-03', rev:650000000,   sp:null,       ord:9800,   vis:null   },
  { c:'HTTP', ch:'tiktok_gmvmax',     p:'2026-03', rev:1650000000,  sp:295000000,  ord:33000,  vis:null   },
  { c:'HTTP', ch:'tiktok_ads',        p:'2026-03', sp:48000000,  reach:710000,  impr:1650000, results:95000  },
  { c:'HTTP', ch:'meta_ads',          p:'2026-03', sp:82000000,  reach:1200000, impr:2800000, results:29000  },
  // AMERTA — naik
  { c:'Amerta', ch:'shopee_store',    p:'2026-02', rev:2100000000,  sp:null,       ord:34000,  vis:410000 },
  { c:'Amerta', ch:'shopee_ads',      p:'2026-02', rev:1650000000,  sp:198000000,  ord:28500,  vis:null   },
  { c:'Amerta', ch:'cpas',            p:'2026-02', rev:720000000,   sp:82000000,   ord:12800,  vis:158000 },
  { c:'Amerta', ch:'tiktok_store',    p:'2026-02', rev:1280000000,  sp:null,       ord:21000,  vis:null   },
  { c:'Amerta', ch:'tiktok_gmvmax',   p:'2026-02', rev:3400000000,  sp:312000000,  ord:72000,  vis:null   },
  { c:'Amerta', ch:'tiktok_ads',      p:'2026-02', sp:72000000,  reach:1100000, impr:2500000, results:165000 },
  { c:'Amerta', ch:'shopee_store',    p:'2026-03', rev:2380000000,  sp:null,       ord:38500,  vis:455000 },
  { c:'Amerta', ch:'shopee_ads',      p:'2026-03', rev:1920000000,  sp:212000000,  ord:33000,  vis:null   },
  { c:'Amerta', ch:'cpas',            p:'2026-03', rev:850000000,   sp:88000000,   ord:15000,  vis:182000 },
  { c:'Amerta', ch:'tiktok_store',    p:'2026-03', rev:1480000000,  sp:null,       ord:24500,  vis:null   },
  { c:'Amerta', ch:'tiktok_gmvmax',   p:'2026-03', rev:3850000000,  sp:328000000,  ord:82000,  vis:null   },
  { c:'Amerta', ch:'tiktok_ads',      p:'2026-03', sp:88000000,  reach:1380000, impr:3100000, results:210000 },
  // KREM
  { c:'KREM', ch:'shopee_store',      p:'2026-02', rev:680000000,   sp:null,       ord:9200,   vis:125000 },
  { c:'KREM', ch:'shopee_ads',        p:'2026-02', rev:520000000,   sp:88000000,   ord:8800,   vis:null   },
  { c:'KREM', ch:'cpas',              p:'2026-02', rev:210000000,   sp:58000000,   ord:3500,   vis:42000  },
  { c:'KREM', ch:'meta_ads',          p:'2026-02', sp:65000000,  reach:920000,  impr:2200000, results:28000  },
  { c:'KREM', ch:'shopee_store',      p:'2026-03', rev:590000000,   sp:null,       ord:7800,   vis:108000 },
  { c:'KREM', ch:'shopee_ads',        p:'2026-03', rev:445000000,   sp:92000000,   ord:7500,   vis:null   },
  { c:'KREM', ch:'cpas',              p:'2026-03', rev:165000000,   sp:62000000,   ord:2800,   vis:32000  },
  { c:'KREM', ch:'meta_ads',          p:'2026-03', sp:58000000,  reach:780000,  impr:1850000, results:22000  },
];

export const ACTIVITY = [
  { c:'Kalisha', d:'15 Mar 2026', t:'p' as const, n:'Flash sale 50% koleksi hijab instan, target 10.000 orders dalam 24 jam' },
  { c:'Kalisha', d:'05 Mar 2026', t:'l' as const, n:'Launching koleksi Ramadan 2026, 25 SKU baru live di semua channel serentak' },
  { c:'Kalisha', d:'20 Feb 2026', t:'c' as const, n:'Kolaborasi 5 kreator TikTok untuk boost GMV Max, estimasi reach 3 juta' },
  { c:'Kalisha', d:'10 Feb 2026', t:'e' as const, n:'Campaign Valentine, bundle Bergo + inner spesial limited edition' },
  { c:'Raecca',  d:'01 Mar 2026', t:'p' as const, n:'Promo awal Ramadan, diskon 30% semua produk andalan' },
  { c:'Raecca',  d:'10 Feb 2026', t:'l' as const, n:'Launching koleksi baru, 15 SKU ready stock dengan campaign TikTok' },
  { c:'HTTP',    d:'20 Mar 2026', t:'e' as const, n:'Event offline Jakarta, boost campaign semua channel serentak' },
  { c:'HTTP',    d:'15 Feb 2026', t:'c' as const, n:'Konten video series 10 video TikTok, anggaran iklan ditingkatkan 40%' },
  { c:'Amerta',  d:'12 Mar 2026', t:'p' as const, n:'Promo Ramadan, bundle produk + free ongkir seluruh Indonesia' },
  { c:'Amerta',  d:'01 Feb 2026', t:'l' as const, n:'Launching varian baru, campaign TikTok GMV Max ditingkatkan' },
  { c:'KREM',    d:'25 Mar 2026', t:'p' as const, n:'Flash sale akhir bulan, diskon 40% SKU terpilih' },
];
