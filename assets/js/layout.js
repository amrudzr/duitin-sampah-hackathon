/* ==========================================================================
   Sirkula Intelligence — Shared App Shell (Sidebar, Header, Theme, Toast)
   ========================================================================== */

(function () {
  const NAV_GROUPS = [
    {
      label: 'Operasional Utama',
      items: [
        { id: 'dashboard', title: 'Ringkasan', href: 'dashboard.html', icon: 'layout-dashboard' },
        { id: 'mesin', title: 'Monitoring Mesin', href: 'mesin.html', icon: 'cpu', machineCount: true },
        { id: 'transaksi', title: 'Manajemen Transaksi', href: 'transaksi.html', icon: 'arrow-left-right' },
        { id: 'analitik', title: 'Analitik Material', href: 'analitik.html', icon: 'bar-chart-3' }
      ]
    },
    {
      label: 'Tata Kelola & Keterlacakan',
      items: [
        { id: 'reward', title: 'Manajemen Reward', href: 'reward.html', icon: 'coins' },
        { id: 'pengumpulan', title: 'Pengumpulan & Batch', href: 'pengumpulan.html', icon: 'truck' },
        { id: 'anomali', title: 'Deteksi Anomali', href: 'anomali.html', icon: 'shield-alert', alertCount: true }
      ]
    }
  ];

  function applyStoredPreferences() {
    const theme = localStorage.getItem('sirkula_theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');

    const cleanMode = localStorage.getItem('sirkula_clean_mode') === '1';
    if (document.body) {
      document.body.classList.toggle('clean-mode', cleanMode);
    }
  }

  // Apply theme immediately to avoid FOUC
  const initialTheme = localStorage.getItem('sirkula_theme') || 'light';
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  function renderShell(activePageId, pageBreadcrumb) {
    applyStoredPreferences();

    const anomalies = window.SirkulaData ? window.SirkulaData.getAnomalies() : [];
    const openAnomalies = anomalies.filter(a => a.actionStatus === 'Dibuka').length;
    const machines = window.SirkulaData ? window.SirkulaData.MACHINES : [];
    const onlineMachines = machines.filter(m => m.status !== 'offline').length || 3;

    const sidebarEl = document.getElementById('app-sidebar');
    if (sidebarEl) {
      sidebarEl.innerHTML = `
        <div class="sidebar-header">
          <img src="assets/img/logo.svg" alt="Logo Sirkula" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">Sirkula Intelligence</span>
            <span class="brand-sub">Admin &amp; Material Hub</span>
          </div>
        </div>

        <div class="sidebar-content">
          ${NAV_GROUPS.map(group => `
            <div>
              <div class="nav-group-label">${group.label}</div>
              <ul class="nav-list">
                ${group.items.map(item => {
                  const isActive = item.id === activePageId;
                  let rightBadge = '';
                  if (item.alertCount && openAnomalies > 0) {
                    rightBadge = `<span class="nav-count nav-count-danger">${openAnomalies}</span>`;
                  } else if (item.machineCount) {
                    rightBadge = `<span class="nav-count nav-count-success">${onlineMachines}</span>`;
                  } else if (item.badge) {
                    rightBadge = `<span class="nav-count">${item.badge}</span>`;
                  }
                  return `
                    <li>
                      <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}">
                        <span class="nav-link-left">
                          <i data-lucide="${item.icon}"></i>
                          <span>${item.title}</span>
                        </span>
                        ${rightBadge}
                      </a>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="sidebar-footer">
          <div class="admin-profile">
            <div class="admin-avatar">SR</div>
            <div class="admin-meta">
              <div class="admin-name">Operator Kampus UNS</div>
              <div class="admin-role">admin@sirkula.id</div>
            </div>
          </div>
          <a href="index.html" class="btn btn-ghost btn-icon" title="Keluar ke halaman Login">
            <i data-lucide="log-out"></i>
          </a>
        </div>
      `;
    }

    const topbarEl = document.getElementById('app-topbar');
    if (topbarEl) {
      const isDark = document.documentElement.classList.contains('dark');
      const isClean = document.body.classList.contains('clean-mode');
      topbarEl.innerHTML = `
        <div class="topbar-left">
          <button type="button" class="btn btn-ghost btn-icon mobile-menu-btn" id="btn-mobile-menu" aria-label="Buka navigasi">
            <i data-lucide="panel-left"></i>
          </button>
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <span>Sirkula Admin</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">${pageBreadcrumb || 'Ringkasan'}</span>
          </nav>
        </div>

        <div class="topbar-right">
          <span class="badge badge-outline" title="Prototipe UNS Innovation Hackathon 2026">
            <span class="badge-dot" style="color:hsl(var(--primary));"></span>
            Data Ilustrasi Prototipe
          </span>

          <button type="button" class="btn btn-outline btn-icon" id="btn-theme-toggle" title="Ganti tema Terang / Gelap" aria-label="Ganti tema">
            <i data-lucide="${isDark ? 'sun' : 'moon'}"></i>
          </button>
        </div>
      `;
    }

    // Ensure toast container exists
    if (!document.getElementById('toast-container')) {
      const tc = document.createElement('div');
      tc.id = 'toast-container';
      tc.className = 'toast-container';
      document.body.appendChild(tc);
    }

    bindShellEvents();
    refreshIcons();
  }

  function bindShellEvents() {
    const mobileBtn = document.getElementById('btn-mobile-menu');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          sidebar.classList.toggle('open');
        } else {
          document.body.classList.toggle('sidebar-collapsed');
        }
      });
    }

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextDark = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', nextDark);
        localStorage.setItem('sirkula_theme', nextDark ? 'dark' : 'light');
        themeBtn.innerHTML = `<i data-lucide="${nextDark ? 'sun' : 'moon'}"></i>`;
        refreshIcons();
        window.dispatchEvent(new CustomEvent('sirkula:themechange', { detail: { dark: nextDark } }));
      });
    }
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function showToast(title, description) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <i data-lucide="check-circle-2"></i>
      <div>
        <div class="toast-title">${title}</div>
        ${description ? `<div class="toast-desc">${description}</div>` : ''}
      </div>
    `;
    container.appendChild(el);
    refreshIcons();

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'all 0.18s ease';
      setTimeout(() => el.remove(), 200);
    }, 3400);
  }

  window.SirkulaLayout = {
    renderShell,
    refreshIcons,
    showToast
  };
})();
