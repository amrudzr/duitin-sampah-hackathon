(function () {
  const { formatNumber, formatKg, getSummaryMetrics } = window.SirkulaData;

  window.SirkulaLayout.renderShell('analitik', 'Analitik Material');

  const m = getSummaryMetrics();

  const divertedEl = document.getElementById('analytics-diverted-kg');
  if (divertedEl) divertedEl.textContent = formatKg(m.totalKg);

  document.getElementById('analytics-kpis').innerHTML = `
    <div class="card kpi-card">
      <div class="kpi-top"><span class="kpi-label">Akumulasi Botol PET</span><span class="kpi-icon"><i data-lucide="droplets"></i></span></div>
      <div class="kpi-value">${formatKg(m.petKg)}</div>
      <div class="kpi-sub"><span>${formatNumber(m.petUnits)} botol diterima · 65,1% unit</span></div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-top"><span class="kpi-label">Akumulasi Kaleng Aluminium</span><span class="kpi-icon"><i data-lucide="cylinder"></i></span></div>
      <div class="kpi-value">${formatKg(m.aluKg)}</div>
      <div class="kpi-sub"><span>${formatNumber(m.aluUnits)} kaleng diterima · 34,9% unit</span></div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-top"><span class="kpi-label">Akurasi Uji Klasifikasi CV</span><span class="kpi-icon"><i data-lucide="scan-eye"></i></span></div>
      <div class="kpi-value">95,8%</div>
      <div class="kpi-sub"><span>Uji sampel PET vs Aluminium vs Non-kategori</span></div>
    </div>
    <div class="card kpi-card">
      <div class="kpi-top"><span class="kpi-label">Intersepsi Kontaminasi Cairan</span><span class="kpi-icon"><i data-lucide="shield"></i></span></div>
      <div class="kpi-value">54 <span class="text-muted" style="font-size:0.9rem;font-weight:500;">objek</span></div>
      <div class="kpi-sub"><span>Tertahan oleh ambang berat load cell</span></div>
    </div>
  `;

  window.SirkulaCharts.createThemedChart('chart-weekly-material', (p) => ({
    type: 'bar',
    data: {
      labels: ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4 (Berjalan)'],
      datasets: [
        {
          label: 'Botol Plastik PET (unit)',
          data: [420, 515, 580, 630],
          backgroundColor: p.pet,
          borderRadius: 5,
          barPercentage: 0.72
        },
        {
          label: 'Kaleng Aluminium (unit)',
          data: [215, 270, 315, 350],
          backgroundColor: p.alu,
          borderRadius: 5,
          barPercentage: 0.72
        }
      ]
    },
    options: {
      scales: {
        x: { grid: { display: false }, ticks: { color: p.textMuted } },
        y: { beginAtZero: true, grid: { color: p.grid }, ticks: { color: p.textMuted } }
      }
    }
  }));

  window.SirkulaCharts.createThemedChart('chart-location-dist', (p) => ({
    type: 'bar',
    data: {
      labels: ['Perpustakaan Pusat (MVP)', 'Gedung B FMIPA', 'Kantin Fak. Teknik', 'Student Center'],
      datasets: [
        {
          label: 'Botol PET (kg)',
          data: [13.8, 15.2, 8.4, 4.4],
          backgroundColor: p.pet,
          borderRadius: 4
        },
        {
          label: 'Kaleng Aluminium (kg)',
          data: [5.1, 6.0, 3.6, 1.6],
          backgroundColor: p.alu,
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { stacked: true, grid: { color: p.grid }, ticks: { color: p.textMuted } },
        y: { stacked: true, grid: { display: false }, ticks: { color: p.textMuted } }
      }
    }
  }));

  window.SirkulaLayout.refreshIcons();
})();
