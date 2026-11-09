/* ==========================================================================
   Sirkula Intelligence — Shared Illustrative Dataset & State Store
   UNS Innovation Hackathon 2026
   ========================================================================== */

(function () {
  const STORAGE_KEYS = {
    THEME: 'sirkula_theme',
    CLEAN_MODE: 'sirkula_clean_mode',
    TRANSACTIONS: 'sirkula_transactions_v1',
    REWARD_RULES: 'sirkula_reward_rules_v1',
    ANOMALIES: 'sirkula_anomalies_v1'
  };

  const CENTRAL_HUB = {
    id: 'HUB-UNS-HQ',
    name: 'Pusat Kendali Sirkula & Server IoT',
    zone: 'Gedung Rektorat dr. Prakosa UNS',
    lat: -7.55872,
    lng: 110.85625,
    ip: '10.200.0.1',
    status: 'online',
    statusLabel: 'Pusat Aktif',
    role: 'Central Ingestion Gateway & Broker'
  };

  const MACHINES = [
    {
      id: 'RVM-UNS-01',
      name: 'Perpustakaan Pusat UNS',
      zone: 'Kampus Kentingan · Lantai 1 Lobby',
      lat: -7.55835,
      lng: 110.85602,
      ip: '192.168.10.21',
      latencyMs: 14,
      packetLoss: '0%',
      tier: 'Prototipe MVP',
      isMvp: true,
      status: 'online',
      statusLabel: 'Online',
      controller: 'ESP32-S3 + Cam OV2640',
      cvModel: 'SirkulaCV-MobileNetV3 v1.2',
      sensors: 'Load Cell HX711 + IR Proximity',
      wifiRssi: '-54 dBm (Stabil)',
      lastSync: 'Baru saja',
      tempC: 31.4,
      petCount: 136,
      petCap: 200,
      petKg: 2.65,
      aluCount: 78,
      aluCap: 150,
      aluKg: 1.12,
      todayTx: 64,
      uptimePct: 99.4
    },
    {
      id: 'RVM-UNS-02',
      name: 'Gedung B FMIPA UNS',
      zone: 'Kampus Kentingan · Koridor Utama',
      lat: -7.55985,
      lng: 110.85420,
      ip: '192.168.10.22',
      latencyMs: 22,
      packetLoss: '0%',
      tier: 'Simulasi Jaringan',
      isMvp: false,
      status: 'warning',
      statusLabel: 'Hampir Penuh',
      controller: 'ESP32-S3 + Cam OV2640',
      cvModel: 'SirkulaCV-MobileNetV3 v1.2',
      sensors: 'Load Cell HX711 + IR Proximity',
      wifiRssi: '-61 dBm (Baik)',
      lastSync: '1 menit lalu',
      tempC: 32.8,
      petCount: 178,
      petCap: 200,
      petKg: 3.47,
      aluCount: 114,
      aluCap: 150,
      aluKg: 1.63,
      todayTx: 89,
      uptimePct: 98.9
    },
    {
      id: 'RVM-UNS-03',
      name: 'Kantin Fakultas Teknik UNS',
      zone: 'Kampus Kentingan · Area Kantin',
      lat: -7.56205,
      lng: 110.85805,
      ip: '192.168.10.23',
      latencyMs: 19,
      packetLoss: '0%',
      tier: 'Simulasi Jaringan',
      isMvp: false,
      status: 'online',
      statusLabel: 'Online',
      controller: 'ESP32-S3 + Cam OV2640',
      cvModel: 'SirkulaCV-MobileNetV3 v1.2',
      sensors: 'Load Cell HX711 + IR Proximity',
      wifiRssi: '-58 dBm (Stabil)',
      lastSync: '2 menit lalu',
      tempC: 31.9,
      petCount: 88,
      petCap: 200,
      petKg: 1.72,
      aluCount: 96,
      aluCap: 150,
      aluKg: 1.38,
      todayTx: 52,
      uptimePct: 99.1
    },
    {
      id: 'RVM-UNS-04',
      name: 'Student Center UNS',
      zone: 'Kampus Kentingan · Plaza Barat',
      lat: -7.55648,
      lng: 110.85478,
      ip: '192.168.10.24',
      latencyMs: null,
      packetLoss: '100%',
      tier: 'Simulasi Jaringan',
      isMvp: false,
      status: 'offline',
      statusLabel: 'Gangguan Koneksi',
      controller: 'ESP32-S3 + Cam OV2640',
      cvModel: 'SirkulaCV-MobileNetV3 v1.1',
      sensors: 'Load Cell HX711 + IR Proximity',
      wifiRssi: 'Terputus (Timeout)',
      lastSync: '19 menit lalu',
      tempC: 30.5,
      petCount: 70,
      petCap: 200,
      petKg: 1.37,
      aluCount: 42,
      aluCap: 150,
      aluKg: 0.60,
      todayTx: 23,
      uptimePct: 92.6
    }
  ];

  const DEFAULT_TRANSACTIONS = [
    {
      id: 'TX-SRK-261107-0914',
      idempotencyKey: 'esp32_01_99f3a2c1',
      timestamp: '07 Nov 2026, 21:42:18',
      user: 'Nadia Putri',
      userNim: 'M0523041',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      material: 'PET',
      materialLabel: 'Botol Plastik PET',
      aiConfidence: 96.8,
      weightGram: 19.4,
      sensorCheck: 'Valid (12–45 g, kosong)',
      sortingBin: 'Wadah PET #A',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 100,
      note: 'Verifikasi CV & load cell sesuai kriteria penerimaan PET.'
    },
    {
      id: 'TX-SRK-261107-0913',
      idempotencyKey: 'esp32_01_99f3a1b8',
      timestamp: '07 Nov 2026, 21:41:05',
      user: 'Rizky Pratama',
      userNim: 'I0122088',
      machineId: 'RVM-UNS-03',
      machineName: 'Kantin Fakultas Teknik UNS',
      material: 'ALU',
      materialLabel: 'Kaleng Aluminium',
      aiConfidence: 98.2,
      weightGram: 14.2,
      sensorCheck: 'Valid (10–28 g, kosong)',
      sortingBin: 'Wadah Aluminium #B',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 300,
      note: 'Kaleng minuman 330 ml tervalidasi kosong & diarahkan ke Wadah B.'
    },
    {
      id: 'TX-SRK-261107-0912',
      idempotencyKey: 'esp32_02_88c1d402',
      timestamp: '07 Nov 2026, 21:36:49',
      user: 'Dimas Arya',
      userNim: 'M0123019',
      machineId: 'RVM-UNS-02',
      machineName: 'Gedung B FMIPA UNS',
      material: 'PET',
      materialLabel: 'Botol Plastik PET',
      aiConfidence: 93.5,
      weightGram: 186.0,
      sensorCheck: 'Gagal (>45 g, indikasi cairan)',
      sortingBin: 'Jalur Tolak / Retur',
      servoConfirm: false,
      status: 'rejected',
      statusLabel: 'Ditolak',
      rewardRp: 0,
      note: 'AI mengenali botol PET, namun load cell mendeteksi berat 186 g (masih berisi cairan).'
    },
    {
      id: 'TX-SRK-261107-0911',
      idempotencyKey: 'esp32_01_99f39e40',
      timestamp: '07 Nov 2026, 21:29:12',
      user: 'Aulia Rahma',
      userNim: 'K7123055',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      material: 'ALU',
      materialLabel: 'Kaleng Aluminium',
      aiConfidence: 97.4,
      weightGram: 13.8,
      sensorCheck: 'Valid (10–28 g, kosong)',
      sortingBin: 'Wadah Aluminium #B',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 300,
      note: 'Konfirmasi pemilahan diterima oleh backend, saldo virtual diperbarui.'
    },
    {
      id: 'TX-SRK-261107-0910',
      idempotencyKey: 'esp32_04_77a0c119',
      timestamp: '07 Nov 2026, 21:18:33',
      user: 'Bagas Setiawan',
      userNim: 'F0222104',
      machineId: 'RVM-UNS-04',
      machineName: 'Student Center UNS',
      material: 'PET',
      materialLabel: 'Botol Plastik PET',
      aiConfidence: 95.1,
      weightGram: 20.1,
      sensorCheck: 'Valid (12–45 g, kosong)',
      sortingBin: 'Menunggu ACK Servo',
      servoConfirm: false,
      status: 'pending',
      statusLabel: 'Menunggu Verifikasi',
      rewardRp: 0,
      note: 'Koneksi Wi-Fi RVM-UNS-04 terputus sebelum paket konfirmasi sorting diterima.'
    },
    {
      id: 'TX-SRK-261107-0909',
      idempotencyKey: 'esp32_01_99f39812',
      timestamp: '07 Nov 2026, 21:10:04',
      user: 'Salsabila Nur',
      userNim: 'M0524012',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      material: 'UNKNOWN',
      materialLabel: 'Tidak Dikenali (Cup PP)',
      aiConfidence: 41.2,
      weightGram: 11.6,
      sensorCheck: 'Objek terdeteksi (11.6 g)',
      sortingBin: 'Jalur Tolak / Retur',
      servoConfirm: false,
      status: 'rejected',
      statusLabel: 'Ditolak',
      rewardRp: 0,
      note: 'Gelas cup plastik PP belum termasuk kategori penerimaan MVP Tahap 1.'
    },
    {
      id: 'TX-SRK-261107-0908',
      idempotencyKey: 'esp32_02_88c1cf81',
      timestamp: '07 Nov 2026, 20:58:41',
      user: 'Fajar Nugroho',
      userNim: 'I0323062',
      machineId: 'RVM-UNS-02',
      machineName: 'Gedung B FMIPA UNS',
      material: 'PET',
      materialLabel: 'Botol Plastik PET',
      aiConfidence: 96.0,
      weightGram: 18.9,
      sensorCheck: 'Valid (12–45 g, kosong)',
      sortingBin: 'Wadah PET #A',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 100,
      note: 'Botol PET 600 ml jernih diterima.'
    },
    {
      id: 'TX-SRK-261107-0907',
      idempotencyKey: 'esp32_03_66b9a024',
      timestamp: '07 Nov 2026, 20:49:17',
      user: 'Intan Permata',
      userNim: 'I0722031',
      machineId: 'RVM-UNS-03',
      machineName: 'Kantin Fakultas Teknik UNS',
      material: 'ALU',
      materialLabel: 'Kaleng Aluminium',
      aiConfidence: 97.9,
      weightGram: 14.5,
      sensorCheck: 'Valid (10–28 g, kosong)',
      sortingBin: 'Wadah Aluminium #B',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 300,
      note: 'Kaleng aluminium diterima dan tercatat pada batch aktif.'
    },
    {
      id: 'TX-SRK-261107-0906',
      idempotencyKey: 'esp32_01_99f39104',
      timestamp: '07 Nov 2026, 20:35:29',
      user: 'Hendra Wijaya',
      userNim: 'M0522073',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      material: 'PET',
      materialLabel: 'Botol Plastik PET',
      aiConfidence: 94.7,
      weightGram: 21.3,
      sensorCheck: 'Valid (12–45 g, kosong)',
      sortingBin: 'Wadah PET #A',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 100,
      note: 'Verifikasi multi-modal berhasil dalam 1.8 detik.'
    },
    {
      id: 'TX-SRK-261107-0905',
      idempotencyKey: 'esp32_02_88c1ca10',
      timestamp: '07 Nov 2026, 20:21:50',
      user: 'Larasati Dewi',
      userNim: 'M0223049',
      machineId: 'RVM-UNS-02',
      machineName: 'Gedung B FMIPA UNS',
      material: 'ALU',
      materialLabel: 'Kaleng Aluminium',
      aiConfidence: 98.6,
      weightGram: 13.9,
      sensorCheck: 'Valid (10–28 g, kosong)',
      sortingBin: 'Wadah Aluminium #B',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: 300,
      note: 'Kaleng minuman 250 ml diterima.'
    },
    {
      id: 'TX-SRK-261107-0904',
      idempotencyKey: 'esp32_04_77a0b902',
      timestamp: '07 Nov 2026, 20:14:08',
      user: 'Bagas Setiawan',
      userNim: 'F0222104',
      machineId: 'RVM-UNS-04',
      machineName: 'Student Center UNS',
      material: 'ALU',
      materialLabel: 'Kaleng Aluminium',
      aiConfidence: 96.3,
      weightGram: 14.1,
      sensorCheck: 'Valid (10–28 g, kosong)',
      sortingBin: 'Menunggu ACK Servo',
      servoConfirm: false,
      status: 'pending',
      statusLabel: 'Menunggu Verifikasi',
      rewardRp: 0,
      note: 'Menunggu sinkronisasi ulang dari buffer lokal ESP32 RVM-UNS-04.'
    },
    {
      id: 'TX-SRK-261107-0903',
      idempotencyKey: 'esp32_03_66b99871',
      timestamp: '07 Nov 2026, 19:57:42',
      user: 'Yoga Prakoso',
      userNim: 'I0123015',
      machineId: 'RVM-UNS-03',
      machineName: 'Kantin Fakultas Teknik UNS',
      material: 'UNKNOWN',
      materialLabel: 'Tidak Dikenali (Botol Kaca)',
      aiConfidence: 28.4,
      weightGram: 245.0,
      sensorCheck: 'Gagal (>45 g & non-kategori)',
      sortingBin: 'Jalur Tolak / Retur',
      servoConfirm: false,
      status: 'rejected',
      statusLabel: 'Ditolak',
      rewardRp: 0,
      note: 'Objek kaca berat 245 g ditolak otomatis oleh aturan keselamatan & kategori.'
    }
  ];

  // 14-day trend for clean readable charts
  const DAILY_TREND_14D = [
    { date: '25 Okt', pet: 112, alu: 58, rejected: 9 },
    { date: '26 Okt', pet: 98,  alu: 49, rejected: 7 },
    { date: '27 Okt', pet: 134, alu: 72, rejected: 11 },
    { date: '28 Okt', pet: 148, alu: 81, rejected: 10 },
    { date: '29 Okt', pet: 142, alu: 76, rejected: 8 },
    { date: '30 Okt', pet: 165, alu: 92, rejected: 12 },
    { date: '31 Okt', pet: 128, alu: 64, rejected: 6 },
    { date: '01 Nov', pet: 119, alu: 61, rejected: 7 },
    { date: '02 Nov', pet: 156, alu: 85, rejected: 9 },
    { date: '03 Nov', pet: 174, alu: 94, rejected: 11 },
    { date: '04 Nov', pet: 169, alu: 88, rejected: 8 },
    { date: '05 Nov', pet: 188, alu: 103, rejected: 10 },
    { date: '06 Nov', pet: 196, alu: 109, rejected: 9 },
    { date: '07 Nov', pet: 214, alu: 118, rejected: 11 }
  ];

  const DEFAULT_REWARD_RULES = [
    {
      code: 'PET',
      name: 'Botol Plastik PET',
      scientific: 'Polyethylene Terephthalate (Kode #1)',
      stage: 'MVP Tahap 1',
      active: true,
      locked: false,
      rewardRp: 100,
      minWeightG: 12,
      maxWeightG: 45,
      avgWeightG: 19.5,
      collectorPricePerKg: 7000,
      criteria: 'Botol minuman jernih/berwarna, kosong tanpa sisa cairan, tidak penyok ekstrem.'
    },
    {
      code: 'ALU',
      name: 'Kaleng Minuman Aluminium',
      scientific: 'Aluminium Alloy Beverage Can (UBC)',
      stage: 'MVP Tahap 1',
      active: true,
      locked: false,
      rewardRp: 300,
      minWeightG: 10,
      maxWeightG: 28,
      avgWeightG: 14.2,
      collectorPricePerKg: 26000,
      criteria: 'Kaleng minuman 250–500 ml kosong, bebas benda asing di bagian dalam.'
    },
    {
      code: 'PP_CUP',
      name: 'Cup Minuman Plastik',
      scientific: 'Polypropylene (Kode #5)',
      stage: 'Tahap 2 (Roadmap)',
      active: false,
      locked: true,
      rewardRp: 50,
      minWeightG: 7,
      maxWeightG: 20,
      avgWeightG: 10.5,
      collectorPricePerKg: 4500,
      criteria: 'Ditangguhkan pada MVP karena variasi bentuk, tutup sealer, sedotan, dan residu cairan.'
    },
    {
      code: 'HDPE',
      name: 'Botol Plastik HDPE',
      scientific: 'High-Density Polyethylene (Kode #2)',
      stage: 'Tahap 2 (Roadmap)',
      active: false,
      locked: true,
      rewardRp: 150,
      minWeightG: 20,
      maxWeightG: 65,
      avgWeightG: 32.0,
      collectorPricePerKg: 6500,
      criteria: 'Rencana ekspansi pasca validasi model CV dua kategori utama.'
    }
  ];

  const COLLECTION_BATCHES = [
    {
      batchId: 'BATCH-SRK-2611-04',
      date: '07 Nov 2026 · 16:00 WIB',
      machineId: 'RVM-UNS-02',
      machineName: 'Gedung B FMIPA UNS',
      petUnits: 178,
      petKg: 3.47,
      aluUnits: 114,
      aluKg: 1.63,
      partner: 'Bank Sampah Induk Surakarta',
      collectorOfficer: 'Tim Operasional Sirkula #2',
      status: 'scheduled',
      statusLabel: 'Terjadwal Hari Ini',
      estimatedValueRp: 66670
    },
    {
      batchId: 'BATCH-SRK-2611-03',
      date: '06 Nov 2026 · 16:30 WIB',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      petUnits: 184,
      petKg: 3.59,
      aluUnits: 126,
      aluKg: 1.79,
      partner: 'Bank Sampah Induk Surakarta',
      collectorOfficer: 'Tim Operasional Sirkula #1',
      status: 'delivered',
      statusLabel: 'Disalurkan ke Mitra',
      estimatedValueRp: 71670
    },
    {
      batchId: 'BATCH-SRK-2611-02',
      date: '05 Nov 2026 · 17:00 WIB',
      machineId: 'RVM-UNS-03',
      machineName: 'Kantin Fakultas Teknik UNS',
      petUnits: 172,
      petKg: 3.35,
      aluUnits: 138,
      aluKg: 1.96,
      partner: 'UD Sirkular Mandiri Mojosongo',
      collectorOfficer: 'Tim Operasional Sirkula #1',
      status: 'verified',
      statusLabel: 'Terverifikasi Mitra',
      estimatedValueRp: 74410
    },
    {
      batchId: 'BATCH-SRK-2611-01',
      date: '03 Nov 2026 · 16:15 WIB',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      petUnits: 190,
      petKg: 3.71,
      aluUnits: 119,
      aluKg: 1.69,
      partner: 'Bank Sampah Induk Surakarta',
      collectorOfficer: 'Tim Operasional Sirkula #2',
      status: 'verified',
      statusLabel: 'Terverifikasi Mitra',
      estimatedValueRp: 69910
    }
  ];

  const DEFAULT_ANOMALIES = [
    {
      id: 'ANM-2611-019',
      time: '07 Nov 2026, 21:36',
      machineId: 'RVM-UNS-02',
      txId: 'TX-SRK-261107-0912',
      type: 'Indikasi Sisa Cairan (Overweight)',
      severity: 'medium',
      severityLabel: 'Sedang',
      detail: 'Kamera mengenali Botol PET (93.5%), namun load cell mengukur 186.0 g (batas maks 45 g). Kemasan ditolak otomatis sebelum masuk pemilah.',
      actionStatus: 'Dibuka',
      layer: 'Sensor Load Cell HX711'
    },
    {
      id: 'ANM-2611-018',
      time: '07 Nov 2026, 21:18',
      machineId: 'RVM-UNS-04',
      txId: 'TX-SRK-261107-0910',
      type: 'Timeout Konfirmasi Pemilahan',
      severity: 'high',
      severityLabel: 'Tinggi',
      detail: 'Koneksi Wi-Fi terputus sebelum ESP32 mengirim konfirmasi posisi servo. Saldo ditahan (status Menunggu Verifikasi) sesuai prinsip anti-manipulasi.',
      actionStatus: 'Dibuka',
      layer: 'Protokol Konfirmasi Backend'
    },
    {
      id: 'ANM-2611-017',
      time: '07 Nov 2026, 20:44',
      machineId: 'RVM-UNS-01',
      txId: 'TX-SRK-261107-0906',
      type: 'Duplikasi Pengiriman Paket (Idempotency)',
      severity: 'low',
      severityLabel: 'Rendah',
      detail: 'Request kedua dengan kunci esp32_01_99f39104 terdeteksi akibat retry jaringan. Duplikat diabaikan sehingga reward Rp100 tidak tercatat ganda.',
      actionStatus: 'Ditangani Otomatis',
      layer: 'Idempotency Key API'
    },
    {
      id: 'ANM-2611-016',
      time: '07 Nov 2026, 19:57',
      machineId: 'RVM-UNS-03',
      txId: 'TX-SRK-261107-0903',
      type: 'Benda Asing / Material Non-MVP',
      severity: 'medium',
      severityLabel: 'Sedang',
      detail: 'Objek botol kaca (245.0 g, confidence CV 28.4%) dimasukkan ke lubang input. Aktuator mengarahkan ke jalur retur tanpa pemberian saldo.',
      actionStatus: 'Ditangani Otomatis',
      layer: 'Multi-Modal CV + Sensor'
    },
    {
      id: 'ANM-2611-015',
      time: '07 Nov 2026, 18:12',
      machineId: 'RVM-UNS-02',
      txId: 'TX-SRK-261107-0884',
      type: 'Percobaan Tarik-Ulang Kemasan (Stringing)',
      severity: 'high',
      severityLabel: 'Tinggi',
      detail: 'Sensor IR mendeteksi pergerakan mundur pada jalur input sebelum gerbang pemilah menutup pada akun M0123094 (3x berturut-turut). Sesi dikunci 15 menit.',
      actionStatus: 'Dibuka',
      layer: 'Sensor IR Proximity Ganda'
    }
  ];

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return JSON.parse(JSON.stringify(fallback));
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore storage quota errors
    }
  }

  function formatRupiah(amount) {
    const n = Math.round(Number(amount) || 0);
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatNumber(num) {
    const n = Number(num) || 0;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatKg(num) {
    return Number(num).toFixed(2).replace('.', ',') + ' kg';
  }

  function getTransactions() {
    return loadJson(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
  }

  function saveTransactions(list) {
    saveJson(STORAGE_KEYS.TRANSACTIONS, list);
  }

  function getRewardRules() {
    return loadJson(STORAGE_KEYS.REWARD_RULES, DEFAULT_REWARD_RULES);
  }

  function saveRewardRules(rules) {
    saveJson(STORAGE_KEYS.REWARD_RULES, rules);
  }

  function getAnomalies() {
    return loadJson(STORAGE_KEYS.ANOMALIES, DEFAULT_ANOMALIES);
  }

  function saveAnomalies(list) {
    saveJson(STORAGE_KEYS.ANOMALIES, list);
  }

  function resetDemoState() {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.REWARD_RULES);
    localStorage.removeItem(STORAGE_KEYS.ANOMALIES);
  }

  // Generate 1 simulated live transaction from RVM-UNS-01 or RVM-UNS-03
  function simulateIncomingTransaction() {
    const txs = getTransactions();
    const rules = getRewardRules();
    const petRule = rules.find(r => r.code === 'PET') || { rewardRp: 100 };
    const aluRule = rules.find(r => r.code === 'ALU') || { rewardRp: 300 };

    const sampleUsers = [
      { name: 'Raka Mahendra', nim: 'M0523067' },
      { name: 'Putri Maharani', nim: 'H0923018' },
      { name: 'Aldi Kurniawan', nim: 'I0124033' },
      { name: 'Nabila Azzahra', nim: 'K3323029' }
    ];
    const u = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    const isAlu = Math.random() > 0.58;
    const machine = Math.random() > 0.35 ? MACHINES[0] : MACHINES[2];
    const seq = 915 + txs.length;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const newTx = {
      id: 'TX-SRK-261107-0' + seq,
      idempotencyKey: 'esp32_live_' + Math.random().toString(16).slice(2, 10),
      timestamp: '07 Nov 2026, ' + hh + ':' + mm + ':' + ss,
      user: u.name,
      userNim: u.nim,
      machineId: machine.id,
      machineName: machine.name,
      material: isAlu ? 'ALU' : 'PET',
      materialLabel: isAlu ? 'Kaleng Aluminium' : 'Botol Plastik PET',
      aiConfidence: Number((95.2 + Math.random() * 3.8).toFixed(1)),
      weightGram: isAlu
        ? Number((13.4 + Math.random() * 1.6).toFixed(1))
        : Number((18.2 + Math.random() * 3.4).toFixed(1)),
      sensorCheck: isAlu ? 'Valid (10–28 g, kosong)' : 'Valid (12–45 g, kosong)',
      sortingBin: isAlu ? 'Wadah Aluminium #B' : 'Wadah PET #A',
      servoConfirm: true,
      status: 'accepted',
      statusLabel: 'Diterima',
      rewardRp: isAlu ? aluRule.rewardRp : petRule.rewardRp,
      note: 'Simulasi transaksi real-time: QR sesi aktif → CV + load cell valid → servo memilah → saldo virtual ditambahkan.'
    };

    txs.unshift(newTx);
    saveTransactions(txs);
    return newTx;
  }

  // Compute aggregate KPIs dynamically based on baseline + added simulated txs
  function getSummaryMetrics() {
    const txs = getTransactions();
    const extraCount = Math.max(0, txs.length - DEFAULT_TRANSACTIONS.length);
    const extraTx = txs.slice(0, extraCount);

    let petUnits = 2145;
    let aluUnits = 1150;
    let totalRewardRp = 559500;
    let rejectedUnits = 128;

    extraTx.forEach(t => {
      if (t.status === 'accepted') {
        if (t.material === 'PET') petUnits += 1;
        if (t.material === 'ALU') aluUnits += 1;
        totalRewardRp += Number(t.rewardRp || 0);
      } else if (t.status === 'rejected') {
        rejectedUnits += 1;
      }
    });

    const acceptedUnits = petUnits + aluUnits;
    const totalTx = acceptedUnits + rejectedUnits + 2; // +2 pending
    const petKg = petUnits * 0.0195;
    const aluKg = aluUnits * 0.0142;
    const totalKg = petKg + aluKg;

    return {
      totalTx,
      acceptedUnits,
      petUnits,
      aluUnits,
      rejectedUnits,
      pendingUnits: txs.filter(t => t.status === 'pending').length,
      petKg,
      aluKg,
      totalKg,
      totalRewardRp,
      acceptanceRatePct: ((acceptedUnits / totalTx) * 100).toFixed(1)
    };
  }

  window.SirkulaData = {
    STORAGE_KEYS,
    CENTRAL_HUB,
    MACHINES,
    DAILY_TREND_14D,
    COLLECTION_BATCHES,
    formatRupiah,
    formatNumber,
    formatKg,
    getTransactions,
    saveTransactions,
    getRewardRules,
    saveRewardRules,
    getAnomalies,
    saveAnomalies,
    simulateIncomingTransaction,
    getSummaryMetrics,
    resetDemoState
  };
})();
