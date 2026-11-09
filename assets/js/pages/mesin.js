(function () {
  const { MACHINES, formatKg } = window.SirkulaData;
  let activeScope = 'all';
  let activeView = 'grid';
  let selectedMachine = null;
  let isMapInitialized = false;

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
        <div class="kpi-sub"><span>3 Online · 1 Offline</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Muatan Wadah PET</span><span class="kpi-icon"><i data-lucide="package"></i></span></div>
        <div class="kpi-value">${formatKg(totalPetKg)}</div>
        <div class="kpi-sub"><span>472 / 800 botol</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Muatan Wadah Aluminium</span><span class="kpi-icon"><i data-lucide="cylinder"></i></span></div>
        <div class="kpi-value">${formatKg(totalAluKg)}</div>
        <div class="kpi-sub"><span>330 / 600 kaleng</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Rata-Rata Uptime</span><span class="kpi-icon"><i data-lucide="activity"></i></span></div>
        <div class="kpi-value">${avgUptime}%</div>
        <div class="kpi-sub"><span>Heartbeat berkala</span></div>
      </div>
    `;
  }

  function renderCards() {
    const filtered = MACHINES.filter(m => {
      if (activeScope === 'attention') return m.status !== 'online';
      return true;
    });

    const grid = document.getElementById('machine-cards-grid');
    grid.style.gridTemplateColumns = filtered.length === 1 ? 'minmax(0, 760px)' : '';

    grid.innerHTML = filtered.map(m => {
      const totalCount = m.petCount + m.aluCount;
      const totalCap = m.petCap + m.aluCap;
      const totalPct = Math.round((totalCount / totalCap) * 100);
      const pingText = m.latencyMs ? `${m.latencyMs} ms` : 'RTO';
      const signalText = m.status === 'offline' ? 'Terputus' : `${m.wifiRssi.split(' ')[0]} dBm`;

      return `
        <article class="card">
          <div class="card-header">
            <div>
              <div class="row-gap-sm">
                <span class="mono text-xs font-semibold" style="color:hsl(var(--muted-foreground));">${m.id}</span>
              </div>
              <h2 class="card-title" style="font-size:1.05rem;margin-top:0.25rem;">${m.name}</h2>
              <p class="card-description">${m.zone}</p>
            </div>
            ${getBadge(m.status, m.statusLabel)}
          </div>

          <div class="card-content stack" style="gap:0.75rem;">
            <!-- Clean Unified Storage Meter -->
            <div style="padding:0.75rem 0.85rem;border-radius:var(--radius);background-color:hsl(var(--muted)/0.4);border:1px solid hsl(var(--border));">
              <div class="row-between text-xs" style="margin-bottom:0.35rem;">
                <span class="font-medium">Kapasitas Wadah</span>
                <span class="mono font-semibold">${totalPct}% (${totalCount}/${totalCap} unit)</span>
              </div>
              <div class="progress">
                <div class="progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}" style="width:${totalPct}%"></div>
              </div>
              <div class="row-between text-xs text-muted mono" style="margin-top:0.35rem;">
                <span>PET: ${m.petCount}/${m.petCap}</span>
                <span>Alu: ${m.aluCount}/${m.aluCap}</span>
              </div>
            </div>

            <!-- Single Minimalist Status Line -->
            <div class="row-between text-xs mono text-muted" style="padding:0.2rem;">
              <span>Ping: <strong>${pingText}</strong></span>
              <span>Sinyal: <strong>${signalText}</strong></span>
              <span>Hari Ini: <strong>${m.todayTx} tx</strong></span>
              <span>Suhu: <strong>${m.tempC}°C</strong></span>
            </div>
          </div>

          <div class="card-footer">
            <span class="text-xs text-muted mono">${m.lastSync}</span>
            <div class="row-gap-sm">
              ${m.status === 'warning' ? `<a href="pengumpulan.html" class="btn btn-outline btn-sm">Jadwal Angkut</a>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" data-diag="${m.id}">Diagnostik</button>
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
    document.getElementById('diag-loc').textContent = m.zone;

    const isOffline = m.status === 'offline';

    document.getElementById('diag-body').innerHTML = `
      <div class="label" style="margin-bottom:0.5rem;">Status Sub-Modul Hardware</div>
      <div class="kv-list">
        <div class="kv-row">
          <span class="kv-key">A. Input Section</span>
          <span class="badge badge-success">Normal · IR Aktif</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">B. Modul Kamera</span>
          <span class="mono text-xs">OV2640 · ${m.cvModel}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">C. Sensor Berat</span>
          <span class="mono text-xs">Load Cell HX711 (Akurasi Tinggi · Kalibrasi Normal)</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">D. Pemrosesan</span>
          <span class="mono text-xs">ESP32-S3 · ${m.tempC}°C</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">E. Servo Pemilah</span>
          <span class="text-xs">2 Arah (PET / Alu)</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">F. Wadah Penyimpanan</span>
          <span class="badge ${m.status === 'warning' ? 'badge-warning' : 'badge-success'}">PET ${m.petCount}/${m.petCap} · Alu ${m.aluCount}/${m.aluCap}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">G. Jaringan &amp; IP</span>
          <span class="mono text-xs ${isOffline ? 'text-danger' : 'text-success'}">${m.ip} · ${m.wifiRssi}</span>
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
        'Unit belum merespons. Buffer lokal aman.'
      );
    } else {
      window.SirkulaLayout.showToast(
        `Heartbeat ${selectedMachine.id} Normal`,
        'Respons HTTP 200 OK diterima dalam 28 ms.'
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

  const viewTabs = document.querySelectorAll('#machine-view-tabs .tab-trigger');
  const gridSection = document.getElementById('machine-cards-grid');
  const mapSection = document.getElementById('machine-map-section');

  function setView(view) {
    activeView = view;
    viewTabs.forEach(b => b.classList.toggle('active', b.getAttribute('data-view') === view));

    if (activeView === 'map') {
      gridSection.style.display = 'none';
      mapSection.style.display = 'block';
      if (!isMapInitialized && window.SirkulaMap) {
        window.SirkulaMap.initMap('machine-map-canvas');
        isMapInitialized = true;
      } else if (window.SirkulaMap && window.SirkulaMap.invalidateSize) {
        setTimeout(() => { window.SirkulaMap.invalidateSize(); }, 50);
        setTimeout(() => { window.SirkulaMap.invalidateSize(); }, 200);
      }
    } else {
      gridSection.style.display = 'grid';
      mapSection.style.display = 'none';
    }
  }

  viewTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      setView(btn.getAttribute('data-view'));
    });
  });

  // Check URL parameter or default to map view
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'grid') {
    setView('grid');
  } else {
    setView('map');
  }

  renderStrip();
  renderCards();
  window.SirkulaLayout.refreshIcons();
})();
