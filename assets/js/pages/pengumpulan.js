(function () {
  const { MACHINES, COLLECTION_BATCHES, formatRupiah, formatKg } = window.SirkulaData;
  const batches = JSON.parse(JSON.stringify(COLLECTION_BATCHES));

  window.SirkulaLayout.renderShell('pengumpulan', 'Pengumpulan & Batch');

  function renderKpis() {
    const totalBatchVal = batches.reduce((s, b) => s + b.estimatedValueRp, 0);
    const totalBatchKg = batches.reduce((s, b) => s + b.petKg + b.aluKg, 0);

    document.getElementById('collection-kpis').innerHTML = `
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Unit Perlu Pengangkutan</span><span class="kpi-icon"><i data-lucide="alert-circle"></i></span></div>
        <div class="kpi-value">1 <span class="text-muted" style="font-size:0.9rem;font-weight:500;">mesin</span></div>
        <div class="kpi-sub"><span class="trend-warn">RVM-UNS-02</span><span>(Wadah PET 89% penuh)</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Batch Tercatat Bulan Ini</span><span class="kpi-icon"><i data-lucide="boxes"></i></span></div>
        <div class="kpi-value">${batches.length} <span class="text-muted" style="font-size:0.9rem;font-weight:500;">batch</span></div>
        <div class="kpi-sub"><span>100% memiliki ID keterlacakan unik</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Massa Batch Tersalurkan</span><span class="kpi-icon"><i data-lucide="scale"></i></span></div>
        <div class="kpi-value">${formatKg(totalBatchKg)}</div>
        <div class="kpi-sub"><span>Terpilah bersih sejak dari mesin</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Estimasi Nilai Penyaluran</span><span class="kpi-icon"><i data-lucide="banknote"></i></span></div>
        <div class="kpi-value">${formatRupiah(totalBatchVal)}</div>
        <div class="kpi-sub"><span>Mitra: Bank Sampah &amp; Pengepul Lokal</span></div>
      </div>
    `;
  }

  function renderPriorityQueue() {
    const priorityMachines = [MACHINES[1], MACHINES[0]]; // RVM-UNS-02 (89%) & RVM-UNS-01 (68%)
    const grid = document.getElementById('pickup-priority-grid');

    grid.innerHTML = priorityMachines.map(m => {
      const petPct = Math.round((m.petCount / m.petCap) * 100);
      const aluPct = Math.round((m.aluCount / m.aluCap) * 100);
      const urgent = petPct >= 85;

      return `
        <div style="padding:1rem;border:1px solid hsl(var(--border));border-radius:var(--radius-lg);display:flex;flex-direction:column;gap:0.75rem;">
          <div class="row-between">
            <div>
              <div class="row-gap-sm">
                <span class="mono text-xs font-semibold text-muted">${m.id}</span>
                <span class="badge ${urgent ? 'badge-warning' : 'badge-outline'}">${urgent ? 'Segera Angkut' : 'Siaga Berikutnya'}</span>
              </div>
              <div class="font-semibold" style="margin-top:2px;">${m.name}</div>
              <div class="text-xs text-muted">${m.zone}</div>
            </div>
            <button type="button" class="btn ${urgent ? 'btn-primary' : 'btn-outline'} btn-sm btn-dispatch" data-id="${m.id}">
              <i data-lucide="check-check"></i>
              <span>Konfirmasi Angkut</span>
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div>
              <div class="row-between text-xs" style="margin-bottom:3px;">
                <span>PET (${m.petCount} unit)</span>
                <span class="mono font-semibold">${petPct}% · ${formatKg(m.petKg)}</span>
              </div>
              <div class="progress"><div class="progress-bar ${urgent ? 'warn' : 'pet'}" style="width:${petPct}%"></div></div>
            </div>
            <div>
              <div class="row-between text-xs" style="margin-bottom:3px;">
                <span>Aluminium (${m.aluCount} unit)</span>
                <span class="mono font-semibold">${aluPct}% · ${formatKg(m.aluKg)}</span>
              </div>
              <div class="progress"><div class="progress-bar alu" style="width:${aluPct}%"></div></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-dispatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const targetBatch = batches.find(b => b.machineId === id && b.status === 'scheduled');
        if (targetBatch) {
          targetBatch.status = 'delivered';
          targetBatch.statusLabel = 'Disalurkan ke Mitra';
          renderBatches();
        }
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="check"></i><span>Sudah Dijemput</span>`;
        window.SirkulaLayout.refreshIcons();
        window.SirkulaLayout.showToast(
          `Pengangkutan ${id} Dikonfirmasi`,
          'Status batch diperbarui menjadi Disalurkan ke Mitra.'
        );
      });
    });
  }

  function statusBadge(st, label) {
    if (st === 'verified') return `<span class="badge badge-success"><span class="badge-dot"></span>${label}</span>`;
    if (st === 'delivered') return `<span class="badge badge-info"><span class="badge-dot"></span>${label}</span>`;
    return `<span class="badge badge-warning"><span class="badge-dot"></span>${label}</span>`;
  }

  function renderBatches() {
    const tbody = document.getElementById('batch-table-body');
    tbody.innerHTML = batches.map(b => `
      <tr>
        <td>
          <div class="mono font-semibold" style="font-size:0.8125rem;">${b.batchId}</div>
          <div class="text-xs text-muted">${b.date}</div>
        </td>
        <td>
          <div class="mono text-xs font-semibold">${b.machineId}</div>
          <div class="text-xs text-muted">${b.machineName}</div>
        </td>
        <td class="mono text-xs">
          <div class="font-medium">${b.petUnits} botol</div>
          <div class="text-muted">${formatKg(b.petKg)}</div>
        </td>
        <td class="mono text-xs">
          <div class="font-medium">${b.aluUnits} kaleng</div>
          <div class="text-muted">${formatKg(b.aluKg)}</div>
        </td>
        <td>
          <div class="font-medium text-sm">${b.partner}</div>
          <div class="text-xs text-muted">${b.collectorOfficer}</div>
        </td>
        <td>${statusBadge(b.status, b.statusLabel)}</td>
        <td class="text-right mono font-semibold">${formatRupiah(b.estimatedValueRp)}</td>
      </tr>
    `).join('');
  }

  document.getElementById('btn-create-pickup').addEventListener('click', () => {
    const newBatch = {
      batchId: 'BATCH-SRK-2611-0' + (batches.length + 1),
      date: '08 Nov 2026 · 09:00 WIB',
      machineId: 'RVM-UNS-01',
      machineName: 'Perpustakaan Pusat UNS',
      petUnits: 136,
      petKg: 2.65,
      aluUnits: 78,
      aluKg: 1.12,
      partner: 'Bank Sampah Induk Surakarta',
      collectorOfficer: 'Tim Operasional Sirkula #1',
      status: 'scheduled',
      statusLabel: 'Terjadwal Besok',
      estimatedValueRp: 47670
    };
    batches.unshift(newBatch);
    renderKpis();
    renderBatches();
    window.SirkulaLayout.refreshIcons();
    window.SirkulaLayout.showToast(
      `Jadwal ${newBatch.batchId} Dibuat`,
      'Penjemputan RVM-UNS-01 telah ditambahkan ke daftar batch.'
    );
  });

  renderKpis();
  renderPriorityQueue();
  renderBatches();
  window.SirkulaLayout.refreshIcons();
})();
