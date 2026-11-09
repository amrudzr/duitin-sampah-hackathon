(function () {
  const { formatRupiah, formatNumber, formatKg, getRewardRules, saveRewardRules } = window.SirkulaData;

  window.SirkulaLayout.renderShell('reward', 'Manajemen Reward');

  let rules = getRewardRules();

  function formatThousands(val) {
    const num = parseInt(String(val).replace(/\D/g, ''), 10);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  }

  function parseFormatted(val) {
    const num = parseInt(String(val).replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  function setupInputSeparator(inputEl, onUpdate) {
    inputEl.type = 'text';
    inputEl.value = formatThousands(inputEl.value);

    inputEl.addEventListener('input', () => {
      const parsed = parseFormatted(inputEl.value);
      inputEl.value = formatThousands(parsed);
      if (onUpdate) onUpdate(parsed);
    });
  }

  function renderRulesTable() {
    const tbody = document.getElementById('reward-rules-tbody');
    tbody.innerHTML = rules.map((r, idx) => `
      <tr style="${r.locked ? 'opacity:0.65;' : ''}">
        <td>
          <label class="switch" title="${r.locked ? 'Pengembangan lanjutan' : 'Aktifkan kategori'}">
            <input type="checkbox" data-idx="${idx}" class="rule-active-toggle" ${r.active ? 'checked' : ''} ${r.locked ? 'disabled' : ''} />
            <span class="switch-track"></span>
          </label>
        </td>
        <td>
          <div class="font-medium">${r.name}</div>
          <div class="text-xs text-muted">${r.scientific}</div>
        </td>
        <td class="mono text-xs">${r.minWeightG}–${r.maxWeightG} g <span class="text-muted">(rerata ${r.avgWeightG} g)</span></td>
        <td>
          <input type="text" data-idx="${idx}" class="input input-sm mono rule-price-input" value="${formatThousands(r.collectorPricePerKg)}" style="width:110px;" ${r.locked ? 'disabled' : ''} />
        </td>
        <td>
          <div class="row-gap-sm">
            <span class="text-xs text-muted mono">Rp</span>
            <input type="text" data-idx="${idx}" class="input input-sm mono rule-reward-input" value="${formatThousands(r.rewardRp)}" style="width:90px;" ${r.locked ? 'disabled' : ''} />
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.rule-reward-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const i = Number(inp.getAttribute('data-idx'));
        const val = parseFormatted(inp.value);
        inp.value = formatThousands(val);
        rules[i].rewardRp = Math.max(0, val);
        renderMarginProjection();
      });
    });

    tbody.querySelectorAll('.rule-price-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const i = Number(inp.getAttribute('data-idx'));
        const val = parseFormatted(inp.value);
        inp.value = formatThousands(val);
        rules[i].collectorPricePerKg = Math.max(0, val);
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

    const petUnits = petRule.active ? parseFormatted(document.getElementById('sim-pet-units').value) : 0;
    const aluUnits = aluRule.active ? parseFormatted(document.getElementById('sim-alu-units').value) : 0;
    const opsCost = parseFormatted(document.getElementById('sim-ops-cost').value);
    const csrSupport = parseFormatted(document.getElementById('sim-csr-support').value);

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
      healthEl.innerHTML = `<span class="badge badge-destructive"><span class="badge-dot"></span>Defisit</span>`;
    }

    document.getElementById('margin-breakdown-box').innerHTML = `
      <div class="grid-kpi-3">
        <div style="padding:0.75rem 0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);">
          <div class="text-xs text-muted">Penjualan Material</div>
          <div class="mono font-semibold" style="font-size:1.15rem;margin-top:0.2rem;">${formatRupiah(materialRevenue)}</div>
          <div class="text-xs text-muted mono" style="margin-top:0.2rem;">${formatKg(petKg)} PET + ${formatKg(aluKg)} Alu</div>
        </div>
        <div style="padding:0.75rem 0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);">
          <div class="text-xs text-muted">Insentif Reward</div>
          <div class="mono font-semibold" style="font-size:1.15rem;margin-top:0.2rem;">${formatRupiah(totalRewardCost)}</div>
          <div class="text-xs text-muted mono" style="margin-top:0.2rem;">${formatNumber(petUnits + aluUnits)} kemasan</div>
        </div>
        <div style="padding:0.75rem 0.85rem;border:1px solid hsl(var(--border));border-radius:var(--radius);background-color:${netMargin >= 0 ? 'hsl(var(--primary-soft)/0.5)' : 'hsl(var(--destructive-soft)/0.5)'};">
          <div class="text-xs text-muted">Margin Bersih / Bulan</div>
          <div class="mono font-semibold" style="font-size:1.15rem;margin-top:0.2rem;color:${netMargin >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'};">
            ${netMargin >= 0 ? '+' : '-'}${formatRupiah(Math.abs(netMargin))}
          </div>
          <div class="text-xs text-muted" style="margin-top:0.2rem;">Setelah subsidi mitra &amp; operasional</div>
        </div>
      </div>

      <div class="kv-list">
        <div class="kv-row">
          <span class="kv-key">Penjualan Botol PET (${formatKg(petKg)} × ${formatRupiah(petRule.collectorPricePerKg)})</span>
          <span class="kv-val mono">+${formatRupiah(petRevenue)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Penjualan Kaleng Aluminium (${formatKg(aluKg)} × ${formatRupiah(aluRule.collectorPricePerKg)})</span>
          <span class="kv-val mono">+${formatRupiah(aluRevenue)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Selisih Material vs Reward</span>
          <span class="kv-val mono">${materialOnlySpread >= 0 ? '+' : '-'}${formatRupiah(Math.abs(materialOnlySpread))}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Dukungan Mitra / CSR</span>
          <span class="kv-val mono">+${formatRupiah(csrSupport)}</span>
        </div>
        <div class="kv-row">
          <span class="kv-key">Biaya Operasional Mesin</span>
          <span class="kv-val mono">-${formatRupiah(opsCost)}</span>
        </div>
      </div>
    `;

    document.getElementById('margin-per-kg-note').textContent =
      `Total massa: ${formatKg(petKg + aluKg)} / bulan`;
  }

  ['sim-pet-units', 'sim-alu-units', 'sim-ops-cost', 'sim-csr-support'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      setupInputSeparator(el, () => renderMarginProjection());
    }
  });

  document.getElementById('btn-save-rewards').addEventListener('click', () => {
    saveRewardRules(rules);
    window.SirkulaLayout.showToast(
      'Konfigurasi Reward Disimpan',
      `PET: ${formatRupiah(rules[0].rewardRp)} · Aluminium: ${formatRupiah(rules[1].rewardRp)}.`
    );
  });

  renderRulesTable();
  renderMarginProjection();
  window.SirkulaLayout.refreshIcons();
})();
