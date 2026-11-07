(function () {
  const { formatRupiah, formatNumber, formatKg, getRewardRules, saveRewardRules } = window.SirkulaData;

  window.SirkulaLayout.renderShell('reward', 'Manajemen Reward');

  let rules = getRewardRules();

  function renderRulesTable() {
    const tbody = document.getElementById('reward-rules-tbody');
    tbody.innerHTML = rules.map((r, idx) => `
      <tr style="${r.locked ? 'opacity:0.65;' : ''}">
        <td>
          <label class="switch" title="${r.locked ? 'Direncanakan pada Pengembangan Tahap 2' : 'Aktifkan/nonaktifkan kategori'}">
            <input type="checkbox" data-idx="${idx}" class="rule-active-toggle" ${r.active ? 'checked' : ''} ${r.locked ? 'disabled' : ''} />
            <span class="switch-track"></span>
          </label>
        </td>
        <td>
          <div class="font-semibold">${r.name}</div>
          <div class="text-xs text-muted">${r.scientific}</div>
        </td>
        <td>
          <span class="badge ${r.locked ? 'badge-outline' : 'badge-success'}">${r.stage}</span>
        </td>
        <td class="mono text-xs">${r.minWeightG} – ${r.maxWeightG} g <span class="text-muted">(rerata ${r.avgWeightG} g)</span></td>
        <td>
          <input type="number" data-idx="${idx}" class="input input-sm mono rule-price-input" value="${r.collectorPricePerKg}" style="width:120px;" ${r.locked ? 'disabled' : ''} step="500" />
        </td>
        <td>
          <div class="row-gap-sm">
            <span class="text-xs text-muted mono">Rp</span>
            <input type="number" data-idx="${idx}" class="input input-sm mono rule-reward-input" value="${r.rewardRp}" style="width:95px;" ${r.locked ? 'disabled' : ''} step="25" />
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.rule-reward-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const i = Number(inp.getAttribute('data-idx'));
        rules[i].rewardRp = Math.max(0, Number(inp.value) || 0);
        renderMarginProjection();
      });
    });

    tbody.querySelectorAll('.rule-price-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const i = Number(inp.getAttribute('data-idx'));
        rules[i].collectorPricePerKg = Math.max(0, Number(inp.value) || 0);
        renderMarginProjection();
      });
    });

    tbody.querySelectorAll('.rule-active-toggle').forEach(chk => {
      chk.addEventListener('change', () => {
        const i = Number(chk.getAttribute('data-idx'));
        rules[i].active = chk.checked;
        renderMarginProjection();
      });
    });
  }

  function renderMarginProjection() {
    const petRule = rules.find(r => r.code === 'PET');
    const aluRule = rules.find(r => r.code === 'ALU');

    const petUnits = petRule.active ? (Number(document.getElementById('sim-pet-units').value) || 0) : 0;
    const aluUnits = aluRule.active ? (Number(document.getElementById('sim-alu-units').value) || 0) : 0;
    const opsCost = Number(document.getElementById('sim-ops-cost').value) || 0;
    const csrSupport = Number(document.getElementById('sim-csr-support').value) || 0;

    const petKg = (petUnits * petRule.avgWeightG) / 1000;
    const aluKg = (aluUnits * aluRule.avgWeightG) / 1000;

    const petRevenue = Math.round(petKg * petRule.collectorPricePerKg);
    const aluRevenue = Math.round(aluKg * aluRule.collectorPricePerKg);
    const materialRevenue = petRevenue + aluRevenue;

    const petRewardCost = petUnits * petRule.rewardRp;
    const aluRewardCost = aluUnits * aluRule.rewardRp;
    const totalRewardCost = petRewardCost + aluRewardCost;

    const materialOnlySpread = materialRevenue - totalRewardCost;
    const netMargin = materialRevenue + csrSupport - (totalRewardCost + opsCost);

    const healthEl = document.getElementById('margin-health-badge');
    if (netMargin >= 0) {
      healthEl.innerHTML = `<span class="badge badge-success"><span class="badge-dot"></span>Surplus Operasional</span>`;
    } else {
      healthEl.innerHTML = `<span class="badge badge-destructive"><span class="badge-dot"></span>Defisit (Sesuaikan Reward/Mitra)</span>`;
    }

    document.getElementById('margin-breakdown-box').innerHTML = `
      <div class="grid-kpi-3">
        <div style="padding:0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);">
          <div class="text-xs text-muted">Pendapatan Penjualan Material</div>
          <div class="mono font-semibold" style="font-size:1.2rem;margin-top:0.2rem;">${formatRupiah(materialRevenue)}</div>
          <div class="text-xs text-muted mono" style="margin-top:0.2rem;">${formatKg(petKg)} PET + ${formatKg(aluKg)} Alu</div>
        </div>
        <div style="padding:0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);">
          <div class="text-xs text-muted">Total Insentif Reward Pengguna</div>
          <div class="mono font-semibold" style="font-size:1.2rem;margin-top:0.2rem;">${formatRupiah(totalRewardCost)}</div>
          <div class="text-xs text-muted mono" style="margin-top:0.2rem;">${formatNumber(petUnits + aluUnits)} kemasan</div>
        </div>
        <div style="padding:0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);background-color:${netMargin >= 0 ? 'hsl(var(--primary-soft)/0.5)' : 'hsl(var(--destructive-soft)/0.5)'};">
          <div class="text-xs text-muted">Estimasi Margin Bersih / Bulan</div>
          <div class="mono font-semibold" style="font-size:1.2rem;margin-top:0.2rem;color:${netMargin >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'};">
            ${netMargin >= 0 ? '+' : '-'}${formatRupiah(Math.abs(netMargin))}
          </div>
          <div class="text-xs text-muted" style="margin-top:0.2rem;">Termasuk dukungan CSR &amp; biaya ops</div>
        </div>
      </div>

      <div class="kv-list">
        <div class="kv-row">
          <span class="kv-key">Penjualan Botol PET ke Mitra (${formatKg(petKg)} × ${formatRupiah(petRule.collectorPricePerKg)})</span>
          <span class="kv-val mono">+${formatRupiah(petRevenue)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Penjualan Kaleng Aluminium ke Mitra (${formatKg(aluKg)} × ${formatRupiah(aluRule.collectorPricePerKg)})</span>
          <span class="kv-val mono">+${formatRupiah(aluRevenue)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Selisih Nilai Material vs Reward (Tanpa Subsidi)</span>
          <span class="kv-val mono">${materialOnlySpread >= 0 ? '+' : '-'}${formatRupiah(Math.abs(materialOnlySpread))}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Dukungan Kemitraan / CSR Lingkungan</span>
          <span class="kv-val mono">+${formatRupiah(csrSupport)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Biaya Pengangkutan &amp; Operasional Mesin</span>
          <span class="kv-val mono">-${formatRupiah(opsCost)}</span>
        </div>
      </div>
    `;

    document.getElementById('margin-per-kg-note').textContent =
      `Total massa terkelola: ${formatKg(petKg + aluKg)} / bulan`;
  }

  ['sim-pet-units', 'sim-alu-units', 'sim-ops-cost', 'sim-csr-support'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderMarginProjection);
  });

  document.getElementById('btn-save-rewards').addEventListener('click', () => {
    saveRewardRules(rules);
    window.SirkulaLayout.showToast(
      'Konfigurasi Reward Disimpan',
      `PET: ${formatRupiah(rules[0].rewardRp)}/unit · Aluminium: ${formatRupiah(rules[1].rewardRp)}/unit.`
    );
  });

  renderRulesTable();
  renderMarginProjection();
  window.SirkulaLayout.refreshIcons();
})();
