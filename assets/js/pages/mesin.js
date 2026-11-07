(function () {
  const { MACHINES, formatKg } = window.SirkulaData;
  let activeScope = 'all';
  let selectedMachine = null;

  window.SirkulaLayout.renderShell('mesin', 'Monitoring Mesin');

  function getBadge(status, label) {
    if (status === 'online') return `<span class="badge badge-success"><span class="badge-dot"></span>${label}</span>`;
    if (status === 'warning') return `<span class="badge badge-warning"><span class="badge-dot"></span>${label}</span>`;
    return `<span class="badge badge-destructive"><span class="badge-dot"></span>${label}</span>`;
  }

  function renderStrip() {
    const onlineCount = MACHINES.filter(m => m.status !== 'offline').length;
    const totalPetKg = MACHINES.reduce((acc, m) => acc + m.petKg, 0);
    const totalAluKg = MACHINES.reduce((acc, m) => acc + m.aluKg, 0);
    const avgUptime = (MACHINES.reduce((acc, m) => acc + m.uptimePct, 0) / MACHINES.length).toFixed(1).replace('.', ',');

    document.getElementById('machine-kpi-strip').innerHTML = `
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Konektivitas Unit</span><span class="kpi-icon"><i data-lucide="wifi"></i></span></div>
        <div class="kpi-value">${onlineCount} / ${MACHINES.length} <span class="text-muted" style="font-size:0.9rem;font-weight:500;">aktif</span></div>
        <div class="kpi-sub"><span>1 prototipe MVP · 3 unit simulasi klaster</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Muatan Wadah PET Saat Ini</span><span class="kpi-icon"><i data-lucide="package"></i></span></div>
        <div class="kpi-value">${formatKg(totalPetKg)}</div>
        <div class="kpi-sub"><span>472 / 800 kapasitas botol agregat</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Muatan Wadah Aluminium</span><span class="kpi-icon"><i data-lucide="cylinder"></i></span></div>
        <div class="kpi-value">${formatKg(totalAluKg)}</div>
        <div class="kpi-sub"><span>330 / 600 kapasitas kaleng agregat</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Rata-Rata Uptime Mesin</span><span class="kpi-icon"><i data-lucide="activity"></i></span></div>
        <div class="kpi-value">${avgUptime}%</div>
        <div class="kpi-sub"><span>Heartbeat HTTP API setiap 30 detik</span></div>
      </div>
    `;
  }

  function renderCards() {
    const banner = document.getElementById('machine-alert-banner');
    if (banner) {
      banner.style.display = activeScope === 'mvp' ? 'none' : 'flex';
    }

    const filtered = MACHINES.filter(m => {
      if (activeScope === 'mvp') return m.isMvp;
      if (activeScope === 'attention') return m.status !== 'online';
      return true;
    });

    const grid = document.getElementById('machine-cards-grid');
    grid.style.gridTemplateColumns = filtered.length === 1 ? 'minmax(0, 760px)' : '';

    grid.innerHTML = filtered.map(m => {
      const petPct = Math.round((m.petCount / m.petCap) * 100);
      const aluPct = Math.round((m.aluCount / m.aluCap) * 100);

      return `
        <article class="card">
          <div class="card-header">
            <div>
              <div class="row-gap-sm" style="flex-wrap:wrap;">
                <span class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${m.id}</span>
                <span class="badge ${m.isMvp ? 'badge-info' : 'badge-outline'}">${m.tier}</span>
              </div>
              <h2 class="card-title" style="font-size:1.05rem;margin-top:0.25rem;">${m.name}</h2>
              <p class="card-description">${m.zone}</p>
            </div>
            ${getBadge(m.status, m.statusLabel)}
          </div>

          <div class="card-content stack" style="gap:0.95rem;">
            <!-- Separated Storage Section -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;padding:0.85rem;border-radius:var(--radius);background-color:hsl(var(--muted)/0.45);border:1px solid hsl(var(--border));">
              <div>
                <div class="row-between text-xs" style="margin-bottom:0.35rem;">
                  <span class="font-medium">Wadah PET #A</span>
                  <span class="mono font-semibold">${petPct}%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar ${petPct >= 85 ? 'warn' : 'pet'}" style="width:${petPct}%"></div>
                </div>
                <div class="row-between text-xs text-muted mono" style="margin-top:0.35rem;">
                  <span>${m.petCount}/${m.petCap} unit</span>
                  <span>${formatKg(m.petKg)}</span>
                </div>
              </div>

              <div>
                <div class="row-between text-xs" style="margin-bottom:0.35rem;">
                  <span class="font-medium">Wadah Aluminium #B</span>
                  <span class="mono font-semibold">${aluPct}%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar ${aluPct >= 85 ? 'warn' : 'alu'}" style="width:${aluPct}%"></div>
                </div>
                <div class="row-between text-xs text-muted mono" style="margin-top:0.35rem;">
                  <span>${m.aluCount}/${m.aluCap} unit</span>
                  <span>${formatKg(m.aluKg)}</span>
                </div>
              </div>
            </div>

            <!-- Hardware Telemetry -->
            <div class="kv-list">
              <div class="kv-row">
                <span class="kv-key">Pengendali &amp; Kamera</span>
                <span class="kv-val mono text-xs">${m.controller}</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Modul Sensor Fisik</span>
                <span class="kv-val text-xs">${m.sensors}</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Koneksi Wi-Fi &amp; Sinkron</span>
                <span class="kv-val mono text-xs">${m.wifiRssi} · ${m.lastSync}</span>
              </div>
              <div class="kv-row">
                <span class="kv-key">Aktivitas Hari Ini</span>
                <span class="kv-val mono text-xs">${m.todayTx} transaksi · Suhu ${m.tempC}°C</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="text-xs mono">Model: ${m.cvModel}</span>
            <div class="row-gap-sm">
              ${m.status === 'warning' ? `<a href="pengumpulan.html" class="btn btn-outline btn-sm"><i data-lucide="truck"></i><span>Jadwal Angkut</span></a>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" data-diag="${m.id}">
                <i data-lucide="sliders-horizontal"></i>
                <span>Diagnostik Modul</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('button[data-diag]').forEach(btn => {
      btn.addEventListener('click', () => openDiag(btn.getAttribute('data-diag')));
    });

    window.SirkulaLayout.refreshIcons();
  }

  function openDiag(machineId) {
    const m = MACHINES.find(x => x.id === machineId);
    if (!m) return;
    selectedMachine = m;

    document.getElementById('diag-id').textContent = `${m.id} — ${m.name}`;
    document.getElementById('diag-badge').innerHTML = getBadge(m.status, m.statusLabel);
    document.getElementById('diag-loc').textContent = `${m.zone} · ${m.tier}`;

    const isOffline = m.status === 'offline';

    document.getElementById('diag-body').innerHTML = `
      <div class="label">Status 7 Sub-Modul Perangkat Keras (§5.2 Rancangan RVM)</div>
      <div class="kv-list">
        <div class="kv-row">
          <span class="kv-key">A. Input Section (1 Kemasan/Waktu)</span>
          <span class="badge badge-success">Normal · Tidak Macet</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">B. Camera Module (OV2640 + LED Putih)</span>
          <span class="badge badge-success">Aktif · 640×480 px</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">C. Sensor Module (Load Cell + IR)</span>
          <span class="badge badge-success">Terkalibrasi (±0,4 g)</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">D. Processing Unit (ESP32-S3)</span>
          <span class="badge badge-success">Stabil · ${m.tempC}°C</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">E. Sorting Mechanism (Servo Pemilah)</span>
          <span class="badge badge-success">2 Arah (PET / Alu)</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">F. Storage Section</span>
          <span class="badge ${m.status === 'warning' ? 'badge-warning' : 'badge-success'}">PET ${Math.round(m.petCount/m.petCap*100)}% · Alu ${Math.round(m.aluCount/m.aluCap*100)}%</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">G. Connectivity Module (Wi-Fi HTTP)</span>
          <span class="badge ${isOffline ? 'badge-destructive' : 'badge-success'}">${m.wifiRssi}</span>
        </div>
      </div>

      <div class="alert alert-info">
        <i data-lucide="info"></i>
        <div>
          <div class="alert-title">Catatan Batasan Teknis Sensor</div>
          <div class="alert-desc">
            Kamera dan sensor dasar memeriksa kategori visual serta indikator berat fisik (mis. mendeteksi sisa cairan berlebih), namun tidak mengklaim pengukuran kemurnian kimia polimer.
          </div>
        </div>
      </div>
    `;

    document.getElementById('diag-backdrop').classList.add('open');
    document.getElementById('diag-panel').classList.add('open');
    window.SirkulaLayout.refreshIcons();
  }

  function closeDiag() {
    document.getElementById('diag-backdrop').classList.remove('open');
    document.getElementById('diag-panel').classList.remove('open');
  }

  document.getElementById('diag-backdrop').addEventListener('click', closeDiag);
  document.getElementById('btn-close-diag').addEventListener('click', closeDiag);
  document.getElementById('btn-close-diag-footer').addEventListener('click', closeDiag);

  document.getElementById('btn-ping-diag').addEventListener('click', () => {
    if (!selectedMachine) return;
    if (selectedMachine.status === 'offline') {
      window.SirkulaLayout.showToast(
        `Ping ${selectedMachine.id} Timeout`,
        'Unit belum merespons. Transaksi pada buffer lokal tetap berstatus Menunggu Verifikasi.'
      );
    } else {
      window.SirkulaLayout.showToast(
        `Heartbeat ${selectedMachine.id} Normal`,
        'Respons HTTP 200 OK diterima dalam 42 ms.'
      );
    }
  });

  document.querySelectorAll('#machine-scope-tabs .tab-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#machine-scope-tabs .tab-trigger').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeScope = btn.getAttribute('data-scope');
      renderCards();
    });
  });

  renderStrip();
  renderCards();
  window.SirkulaLayout.refreshIcons();
})();
