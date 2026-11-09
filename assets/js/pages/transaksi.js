(function () {
  const {
    formatRupiah,
    getTransactions,
    saveTransactions,
    getRewardRules,
    simulateIncomingTransaction
  } = window.SirkulaData;

  window.SirkulaLayout.renderShell('transaksi', 'Manajemen Transaksi');

  const searchInput = document.getElementById('tx-search');
  const statusSelect = document.getElementById('tx-filter-status');
  const matSelect = document.getElementById('tx-filter-material');

  function statusBadge(status, label) {
    if (status === 'accepted') return `<span class="badge badge-success"><span class="badge-dot"></span>${label}</span>`;
    if (status === 'pending') return `<span class="badge badge-warning"><span class="badge-dot"></span>${label}</span>`;
    return `<span class="badge badge-destructive"><span class="badge-dot"></span>${label}</span>`;
  }

  function matBadge(mat, label) {
    if (mat === 'PET') return `<span class="text-xs font-medium">Botol PET</span>`;
    if (mat === 'ALU') return `<span class="text-xs font-medium">Kaleng Alu</span>`;
    return `<span class="text-xs text-muted">${label}</span>`;
  }

  function renderTable() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const st = statusSelect.value;
    const mt = matSelect.value;

    const all = getTransactions();
    const filtered = all.filter(tx => {
      if (st !== 'all' && tx.status !== st) return false;
      if (mt !== 'all' && tx.material !== mt) return false;
      if (q) {
        const hay = `${tx.id} ${tx.user} ${tx.userNim} ${tx.machineId} ${tx.machineName} ${tx.materialLabel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    document.getElementById('tx-count-label').textContent = `Menampilkan ${filtered.length} dari ${all.length} transaksi`;

    const tbody = document.getElementById('tx-table-body');
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:2rem;" class="text-muted">
            Tidak ada transaksi yang cocok dengan filter pencarian.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(tx => `
      <tr class="clickable" data-id="${tx.id}">
        <td style="white-space:nowrap;">
          <span class="mono font-medium">${tx.id}</span>
          <span class="text-xs text-muted" style="margin-left:0.35rem;">${tx.timestamp.split(', ')[1] || tx.timestamp}</span>
        </td>
        <td class="font-medium">${tx.user}</td>
        <td>
          <span class="text-xs text-muted">${tx.machineName.replace(' UNS', '')}</span>
        </td>
        <td>${matBadge(tx.material, tx.materialLabel)}</td>
        <td class="mono font-medium text-xs">${tx.weightGram} g</td>
        <td>${statusBadge(tx.status, tx.statusLabel)}</td>
        <td class="text-right mono font-semibold">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0'}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.addEventListener('click', () => openDetail(tr.getAttribute('data-id')));
    });
  }

  function openDetail(txId) {
    const txs = getTransactions();
    const tx = txs.find(t => t.id === txId);
    if (!tx) return;

    document.getElementById('detail-id').textContent = tx.id;
    document.getElementById('detail-status-badge').innerHTML = statusBadge(tx.status, tx.statusLabel);
    document.getElementById('detail-subtitle').textContent = `${tx.timestamp} · ${tx.machineId} (${tx.machineName})`;

    const cvOk = tx.material !== 'UNKNOWN' && tx.aiConfidence >= 75;
    const sensorOk = !tx.sensorCheck.startsWith('Gagal') && tx.material !== 'UNKNOWN';
    const sortState = tx.servoConfirm ? 'ok' : (tx.status === 'pending' ? 'wait' : 'fail');

    document.getElementById('detail-body').innerHTML = `
      <div class="kv-list">
        <div class="kv-row"><span class="kv-key">Akun Pengguna</span><span class="kv-val">${tx.user} (${tx.userNim})</span></div>
        <div class="kv-row"><span class="kv-key">Kode Unik Anti-Duplikasi</span><span class="kv-val mono text-xs">${tx.idempotencyKey}</span></div>
        <div class="kv-row"><span class="kv-key">Wadah Pemilahan</span><span class="kv-val">${tx.sortingBin}</span></div>
        <div class="kv-row"><span class="kv-key">Saldo Ditambahkan</span><span class="kv-val mono font-semibold">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0'}</span></div>
      </div>

      <div>
        <div class="label" style="margin-bottom:0.65rem;">Jejak Pemeriksaan 5 Tahap</div>
        <div class="pipeline-steps">
          <div class="pipeline-step">
            <div class="pipeline-dot ok"><i data-lucide="qr-code"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>1. Autentikasi Sesi QR</span><span class="mono text-xs">Valid</span></div>
              <div class="pipeline-desc">Sesi pengguna ditautkan ke ${tx.machineId}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${cvOk ? 'ok' : 'fail'}"><i data-lucide="camera"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>2. Identification (Computer Vision)</span><span class="mono text-xs">${tx.aiConfidence}%</span></div>
              <div class="pipeline-desc">Prediksi objek: ${tx.materialLabel}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${sensorOk ? 'ok' : 'fail'}"><i data-lucide="scale"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>3. Validation (Sensor Berat &amp; IR)</span><span class="mono text-xs">${tx.weightGram} g</span></div>
              <div class="pipeline-desc">${tx.sensorCheck}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${sortState}"><i data-lucide="git-branch"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>4. Sorting (Aktuator Servo)</span><span class="mono text-xs">${tx.servoConfirm ? 'Terkonfirmasi' : (tx.status === 'pending' ? 'Tertunda' : 'Dibatalkan')}</span></div>
              <div class="pipeline-desc">Arah mekanik: ${tx.sortingBin}.</div>
            </div>
          </div>
          <div class="pipeline-step">
            <div class="pipeline-dot ${tx.rewardRp > 0 ? 'ok' : (tx.status === 'pending' ? 'wait' : 'fail')}"><i data-lucide="wallet"></i></div>
            <div class="pipeline-info">
              <div class="pipeline-title"><span>5. Rewarding &amp; Traceability</span><span class="mono text-xs">${tx.rewardRp > 0 ? '+' + formatRupiah(tx.rewardRp) : 'Rp0'}</span></div>
              <div class="pipeline-desc">${tx.note}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const footer = document.getElementById('detail-footer');
    if (tx.status === 'pending') {
      footer.innerHTML = `
        <button type="button" class="btn btn-outline btn-sm" id="btn-verify-pending">
          <i data-lucide="check"></i>
          <span>Konfirmasi Sinkron Ulang</span>
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="btn-detail-done">Tutup</button>
      `;
      document.getElementById('btn-verify-pending').addEventListener('click', () => {
        const rules = getRewardRules();
        const rule = rules.find(r => r.code === tx.material) || { rewardRp: 100 };
        tx.status = 'accepted';
        tx.statusLabel = 'Diterima';
        tx.servoConfirm = true;
        tx.sortingBin = tx.material === 'ALU' ? 'Wadah Aluminium #B' : 'Wadah PET #A';
        tx.rewardRp = rule.rewardRp;
        tx.note = 'Sinkronisasi log lokal ESP32 berhasil diverifikasi; saldo virtual diperbarui.';
        saveTransactions(txs);
        renderTable();
        openDetail(tx.id);
        window.SirkulaLayout.showToast(
          `Transaksi ${tx.id} Terverifikasi`,
          `ACK pemilahan dikonfirmasi. Saldo +${formatRupiah(tx.rewardRp)} ditambahkan.`
        );
      });
    } else {
      footer.innerHTML = `<button type="button" class="btn btn-primary btn-sm" id="btn-detail-done">Tutup</button>`;
    }

    document.getElementById('btn-detail-done').addEventListener('click', closeDetail);

    document.getElementById('detail-backdrop').classList.add('open');
    document.getElementById('detail-panel').classList.add('open');
    window.SirkulaLayout.refreshIcons();
  }

  function closeDetail() {
    document.getElementById('detail-backdrop').classList.remove('open');
    document.getElementById('detail-panel').classList.remove('open');
  }

  document.getElementById('detail-backdrop').addEventListener('click', closeDetail);
  document.getElementById('btn-close-detail').addEventListener('click', closeDetail);

  searchInput.addEventListener('input', renderTable);
  statusSelect.addEventListener('change', renderTable);
  matSelect.addEventListener('change', renderTable);

  const simBtn = document.getElementById('btn-tx-simulate');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      const tx = simulateIncomingTransaction();
      renderTable();
      window.SirkulaLayout.showToast(
        `Transaksi ${tx.id} Tercatat`,
        `${tx.materialLabel} (${tx.weightGram} g) diterima pada ${tx.machineId}.`
      );
    });
  }

  renderTable();
  window.SirkulaLayout.refreshIcons();
})();
