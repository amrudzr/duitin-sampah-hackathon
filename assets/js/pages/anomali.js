(function () {
  const { getAnomalies, saveAnomalies } = window.SirkulaData;
  let filterMode = 'all';

  window.SirkulaLayout.renderShell('anomali', 'Deteksi Anomali');

  function severityBadge(sev, label) {
    if (sev === 'high') return `<span class="badge badge-destructive"><span class="badge-dot"></span>${label}</span>`;
    if (sev === 'medium') return `<span class="badge badge-warning"><span class="badge-dot"></span>${label}</span>`;
    return `<span class="badge badge-outline">${label}</span>`;
  }

  function renderAll() {
    const list = getAnomalies();
    const openCount = list.filter(a => a.actionStatus === 'Dibuka').length;
    const autoCount = list.length - openCount;

    document.getElementById('anomaly-kpis').innerHTML = `
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Kejadian Perlu Tinjauan</span><span class="kpi-icon"><i data-lucide="shield-alert"></i></span></div>
        <div class="kpi-value">${openCount} <span class="text-muted" style="font-size:0.9rem;font-weight:500;">insiden</span></div>
        <div class="kpi-sub"><span>Termasuk timeout koneksi &amp; indikasi stringing</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Dimitigasi Otomatis</span><span class="kpi-icon"><i data-lucide="shield-check"></i></span></div>
        <div class="kpi-value">${autoCount} <span class="text-muted" style="font-size:0.9rem;font-weight:500;">insiden</span></div>
        <div class="kpi-sub"><span>Ditolak pada level mesin atau Idempotency API</span></div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-top"><span class="kpi-label">Kebocoran Reward Ganda</span><span class="kpi-icon"><i data-lucide="lock"></i></span></div>
        <div class="kpi-value">Rp0</div>
        <div class="kpi-sub"><span class="trend-up">0 kasus</span><span>pencairan tanpa konfirmasi pemilahan</span></div>
      </div>
    `;

    const filtered = list.filter(a => {
      if (filterMode === 'open') return a.actionStatus === 'Dibuka';
      if (filterMode === 'resolved') return a.actionStatus !== 'Dibuka';
      return true;
    });

    const tbody = document.getElementById('anomaly-table-body');
    tbody.innerHTML = filtered.map(a => {
      const isOpen = a.actionStatus === 'Dibuka';
      return `
        <tr>
          <td>
            <div class="mono font-semibold text-xs">${a.id}</div>
            <div class="text-xs text-muted">${a.time}</div>
            <div class="mono text-xs text-muted">${a.machineId}</div>
          </td>
          <td>${severityBadge(a.severity, a.severityLabel)}</td>
          <td style="max-width:430px;">
            <div class="font-semibold">${a.type} <span class="mono text-xs text-muted">(${a.txId})</span></div>
            <div class="text-xs text-muted" style="margin-top:3px;line-height:1.45;">${a.detail}</div>
          </td>
          <td><span class="badge badge-info">${a.layer}</span></td>
          <td>
            <span class="badge ${isOpen ? 'badge-warning' : 'badge-success'}">${a.actionStatus}</span>
          </td>
          <td class="text-right">
            ${isOpen
              ? `<button type="button" class="btn btn-outline btn-sm btn-resolve" data-id="${a.id}">Tandai Selesai</button>`
              : `<span class="text-xs text-muted">Terverifikasi</span>`
            }
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-resolve').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const updated = getAnomalies().map(item => {
          if (item.id === id) {
            item.actionStatus = 'Ditinjau Operator';
          }
          return item;
        });
        saveAnomalies(updated);
        window.SirkulaLayout.renderShell('anomali', 'Deteksi Anomali');
        renderAll();
        window.SirkulaLayout.showToast(`Anomali ${id} Diselesaikan`, 'Status insiden telah ditandai selesai oleh operator.');
      });
    });

    window.SirkulaLayout.refreshIcons();
  }

  document.querySelectorAll('#anomaly-filter-tabs .tab-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#anomaly-filter-tabs .tab-trigger').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMode = btn.getAttribute('data-filter');
      renderAll();
    });
  });

  renderAll();
})();
