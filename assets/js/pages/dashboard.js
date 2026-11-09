(function () {
  const {
    MACHINES,
    DAILY_TREND_14D,
    formatRupiah,
    formatNumber,
    formatKg,
    getTransactions,
    getSummaryMetrics,
    simulateIncomingTransaction,
    resetDemoState
  } = window.SirkulaData;

  let currentTrendMode = 'unit';

  window.SirkulaLayout.renderShell('dashboard', 'Ringkasan Operasional');

  function statusBadgeHtml(status, label) {
    if (status === 'accepted') {
      return `<span class="badge badge-success"><span class="badge-dot"></span>${label}</span>`;
    }
    if (status === 'pending') {
      return `<span class="badge badge-warning"><span class="badge-dot"></span>${label}</span>`;
    }
    return `<span class="badge badge-destructive"><span class="badge-dot"></span>${label}</span>`;
  }

  function materialBadgeHtml(material, label) {
    if (material === 'PET') return `<span class="badge badge-info">PET</span>`;
    if (material === 'ALU') return `<span class="badge badge-success">Aluminium</span>`;
    return `<span class="badge badge-outline">${label || 'Non-MVP'}</span>`;
  }

  function renderKpis() {
    const m = getSummaryMetrics();
    const el = document.getElementById('kpi-container');
    if (!el) return;

    el.innerHTML = `
      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Kemasan Terverifikasi</span>
          <span class="kpi-icon"><i data-lucide="package-check"></i></span>
        </div>
        <div class="kpi-value">${formatNumber(m.acceptedUnits)} <span style="font-size:0.9rem;font-weight:500;" class="text-muted">unit</span></div>
        <div class="kpi-sub">
          <span class="text-success font-medium">+128 unit</span>
          <span>hari ini</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Total Berat Terpilah</span>
          <span class="kpi-icon"><i data-lucide="scale"></i></span>
        </div>
        <div class="kpi-value">${formatKg(m.totalKg)}</div>
        <div class="kpi-sub">
          <span>Material bersih tervalidasi</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Saldo Reward Disalurkan</span>
          <span class="kpi-icon"><i data-lucide="wallet"></i></span>
        </div>
        <div class="kpi-value">${formatRupiah(m.totalRewardRp)}</div>
        <div class="kpi-sub">
          <span>1.130 klaim berhasil</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Tingkat Penerimaan</span>
          <span class="kpi-icon"><i data-lucide="cpu"></i></span>
        </div>
        <div class="kpi-value">${m.acceptanceRatePct.replace('.', ',')}%</div>
        <div class="kpi-sub">
          <span>${formatNumber(m.rejectedUnits)} unit ditolak</span>
        </div>
      </div>
    `;
    window.SirkulaLayout.refreshIcons();
  }

  function renderCharts() {
    const m = getSummaryMetrics();

    window.SirkulaCharts.createThemedChart('chart-daily-trend', (p) => {
      const labels = DAILY_TREND_14D.map(d => d.date);
      const petData = DAILY_TREND_14D.map(d =>
        currentTrendMode === 'unit' ? d.pet : Number((d.pet * 0.0195).toFixed(2))
      );
      const aluData = DAILY_TREND_14D.map(d =>
        currentTrendMode === 'unit' ? d.alu : Number((d.alu * 0.0142).toFixed(2))
      );

      return {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: currentTrendMode === 'unit' ? 'Botol PET (unit)' : 'Botol PET (kg)',
              data: petData,
              borderColor: p.pet,
              backgroundColor: p.petFill,
              borderWidth: 2,
              tension: 0.32,
              fill: true,
              pointRadius: 2.5,
              pointHoverRadius: 5
            },
            {
              label: currentTrendMode === 'unit' ? 'Kaleng Aluminium (unit)' : 'Kaleng Aluminium (kg)',
              data: aluData,
              borderColor: p.alu,
              backgroundColor: p.aluFill,
              borderWidth: 2,
              tension: 0.32,
              fill: true,
              pointRadius: 2.5,
              pointHoverRadius: 5
            }
          ]
        },
        options: {
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: p.textMuted, font: { size: 11 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: p.grid },
              ticks: { color: p.textMuted, font: { size: 11 } }
            }
          }
        }
      };
    });

    window.SirkulaCharts.createThemedChart('chart-material-split', (p) => ({
      type: 'doughnut',
      data: {
        labels: ['Botol Plastik PET', 'Kaleng Aluminium'],
        datasets: [{
          data: [m.petUnits, m.aluUnits],
          backgroundColor: [p.pet, p.alu],
          borderColor: p.tooltipBg,
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: { display: false }
        }
      }
    }));

    const summaryEl = document.getElementById('material-split-summary');
    if (summaryEl) {
      const petPct = ((m.petUnits / m.acceptedUnits) * 100).toFixed(1).replace('.', ',');
      const aluPct = ((m.aluUnits / m.acceptedUnits) * 100).toFixed(1).replace('.', ',');
      summaryEl.innerHTML = `
        <div class="kv-row">
          <span class="row-gap-sm"><span class="legend-dot pet"></span> Botol PET (${petPct}%)</span>
          <span class="kv-val mono">${formatNumber(m.petUnits)} unit</span>
        </div>
        <div class="kv-row">
          <span class="row-gap-sm"><span class="legend-dot alu"></span> Aluminium (${aluPct}%)</span>
          <span class="kv-val mono">${formatNumber(m.aluUnits)} unit</span>
        </div>
      `;
    }
  }

  function renderRecentTransactions() {
    const tbody = document.getElementById('recent-tx-tbody');
    if (!tbody) return;

    const recent = getTransactions().slice(0, 5);
    tbody.innerHTML = recent.map(tx => `
      <tr class="clickable" data-tx-id="${tx.id}">
        <td>
          <span class="mono font-medium">${tx.id}</span>
          <span class="text-xs text-muted" style="margin-left:0.35rem;">${tx.timestamp.split(', ')[1] || ''}</span>
        </td>
        <td class="font-medium">${tx.user}</td>
        <td>
          <span class="text-xs text-muted">${tx.machineName.replace(' UNS', '')}</span>
        </td>
        <td>${materialBadgeHtml(tx.material, tx.materialLabel)}</td>
        <td>${statusBadgeHtml(tx.status, tx.statusLabel)}</td>
        <td class="text-right mono font-semibold">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0'}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('tr[data-tx-id]').forEach(row => {
      row.addEventListener('click', () => openTxSheet(row.getAttribute('data-tx-id')));
    });
  }

  function renderMachineQuickStatus() {
    const container = document.getElementById('machine-quick-list');
    if (!container) return;

    container.innerHTML = MACHINES.map(m => {
      const totalCount = m.petCount + m.aluCount;
      const totalCap = m.petCap + m.aluCap;
      const totalPct = Math.round((totalCount / totalCap) * 100);
      let badgeClass = 'badge-success';
      if (m.status === 'warning') badgeClass = 'badge-warning';
      if (m.status === 'offline') badgeClass = 'badge-destructive';

      return `
        <div style="padding:0.65rem 0.8rem;border:1px solid hsl(var(--border));border-radius:var(--radius);background:hsl(var(--card));">
          <div class="row-between">
            <span class="font-medium text-sm">${m.name}</span>
            <span class="badge ${badgeClass}"><span class="badge-dot"></span>${m.statusLabel}</span>
          </div>
          <div style="margin-top:0.45rem;">
            <div class="row-between text-xs mono text-muted" style="margin-bottom:3px;">
              <span>Kapasitas: ${totalPct}%</span>
              <span>${totalCount}/${totalCap} unit</span>
            </div>
            <div class="progress">
              <div class="progress-bar ${totalPct >= 80 ? 'warn' : 'primary'}" style="width:${totalPct}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function openTxSheet(txId) {
    const tx = getTransactions().find(t => t.id === txId);
    if (!tx) return;

    document.getElementById('sheet-tx-id').textContent = tx.id;
    document.getElementById('sheet-tx-badge').innerHTML = statusBadgeHtml(tx.status, tx.statusLabel);
    document.getElementById('sheet-tx-time').textContent = `${tx.timestamp} · ${tx.machineId} (${tx.machineName})`;

    const cvOk = tx.material !== 'UNKNOWN' && tx.aiConfidence >= 75;
    const sensorOk = tx.status !== 'rejected' && !tx.sensorCheck.startsWith('Gagal');
    const sortState = tx.servoConfirm ? 'ok' : (tx.status === 'pending' ? 'wait' : 'fail');

    document.getElementById('sheet-tx-body').innerHTML = `
      <div class="kv-list">
        <div class="kv-row"><span class="kv-key">Pengguna</span><span class="kv-val">${tx.user} <span class="mono text-muted">(${tx.userNim})</span></span></div>
        <div class="kv-row"><span class="kv-key">Idempotency Key</span><span class="kv-val mono text-xs">${tx.idempotencyKey}</span></div>
        <div class="kv-row"><span class="kv-key">Kategori Terdeteksi</span><span class="kv-val">${tx.materialLabel}</span></div>
        <div class="kv-row"><span class="kv-key">Reward Virtual</span><span class="kv-val mono font-semibold">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0 (Tidak diberikan)'}</span></div>
      </div>

      <div>
        <div class="label" style="margin-bottom:0.65rem;">Alur Verifikasi Material Intelligence</div>
        <div class="pipeline-steps">
          <div class="pipeline-step">
            <div class="pipeline-dot ok"><i data-lucide="qr-code"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>1. Sesi QR Mesin Valid</span><span class="mono text-xs text-muted">OK</span></div>
              <div class="pipeline-desc">Sesi pengguna terhubung dengan unit ${tx.machineId}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${cvOk ? 'ok' : 'fail'}"><i data-lucide="camera"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>2. Klasifikasi Computer Vision</span><span class="mono text-xs">${tx.aiConfidence}%</span></div>
              <div class="pipeline-desc">Hasil model: ${tx.materialLabel}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${sensorOk ? 'ok' : 'fail'}"><i data-lucide="scale"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>3. Pemeriksaan Fisik Sensor</span><span class="mono text-xs">${tx.weightGram} g</span></div>
              <div class="pipeline-desc">${tx.sensorCheck}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${sortState}"><i data-lucide="git-branch"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>4. Aktuator Pemilah &amp; Konfirmasi</span><span class="mono text-xs">${tx.servoConfirm ? 'ACK' : (tx.status === 'pending' ? 'WAIT' : 'NACK')}</span></div>
              <div class="pipeline-desc">Tujuan mekanik: ${tx.sortingBin}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${tx.rewardRp > 0 ? 'ok' : (tx.status === 'pending' ? 'wait' : 'fail')}"><i data-lucide="coins"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>5. Pencatatan Saldo Virtual</span><span class="mono text-xs">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0'}</span></div>
              <div class="pipeline-desc">${tx.note}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('tx-sheet-backdrop').classList.add('open');
    document.getElementById('tx-sheet-panel').classList.add('open');
    window.SirkulaLayout.refreshIcons();
  }

  function closeTxSheet() {
    document.getElementById('tx-sheet-backdrop').classList.remove('open');
    document.getElementById('tx-sheet-panel').classList.remove('open');
  }

  document.getElementById('tx-sheet-backdrop').addEventListener('click', closeTxSheet);
  document.getElementById('btn-close-sheet').addEventListener('click', closeTxSheet);
  document.getElementById('btn-close-sheet-footer').addEventListener('click', closeTxSheet);

  // Trend mode tabs
  document.querySelectorAll('#trend-mode-tabs .tab-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trend-mode-tabs .tab-trigger').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTrendMode = btn.getAttribute('data-mode');
      renderCharts();
    });
  });

  // Simulate button
  const simBtn = document.getElementById('btn-simulate-tx');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      const tx = simulateIncomingTransaction();
      renderKpis();
      renderCharts();
      renderRecentTransactions();
      window.SirkulaLayout.showToast(
        `Transaksi ${tx.id} Diterima`,
        `${tx.user} menyetor 1 ${tx.materialLabel} (${tx.weightGram} g) di ${tx.machineId} → +${formatRupiah(tx.rewardRp)}`
      );
    });
  }

  const resetBtn = document.getElementById('btn-reset-demo');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDemoState();
      renderKpis();
      renderCharts();
      renderRecentTransactions();
      window.SirkulaLayout.showToast('Data Simulasi Direset', 'Seluruh metrik dan riwayat transaksi kembali ke data awal proposal.');
    });
  }

  renderKpis();
  renderCharts();
  renderRecentTransactions();
  renderMachineQuickStatus();
})();
