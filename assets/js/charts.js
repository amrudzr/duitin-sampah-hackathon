/* ==========================================================================
   Sirkula Intelligence — Shadcn-Themed Chart.js Helper
   ========================================================================== */

(function () {
  const registry = [];

  function getThemePalette() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      isDark,
      textMuted: isDark ? '#a1a1aa' : '#71717a',
      textPrimary: isDark ? '#fafafa' : '#09090b',
      grid: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(9, 9, 11, 0.06)',
      tooltipBg: isDark ? '#18181b' : '#ffffff',
      tooltipBorder: isDark ? '#27272a' : '#e4e4e7',
      pet: isDark ? '#38bdf8' : '#0ea5e9',
      petFill: isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.12)',
      alu: isDark ? '#22c55e' : '#16a34a',
      aluFill: isDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(22, 163, 74, 0.13)',
      reject: isDark ? '#f87171' : '#ef4444',
      pending: isDark ? '#fbbf24' : '#f59e0b'
    };
  }

  function createThemedChart(canvasId, builderFn) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof window.Chart === 'undefined') return null;

    const existingIdx = registry.findIndex(item => item.canvasId === canvasId);
    if (existingIdx !== -1) {
      registry[existingIdx].instance.destroy();
      registry.splice(existingIdx, 1);
    }

    const palette = getThemePalette();
    const config = builderFn(palette);

    // Apply shared shadcn-like defaults
    config.options = config.options || {};
    config.options.responsive = true;
    config.options.maintainAspectRatio = false;
    config.options.plugins = config.options.plugins || {};
    config.options.plugins.legend = config.options.plugins.legend || { display: false };
    config.options.plugins.tooltip = Object.assign({
      backgroundColor: palette.tooltipBg,
      titleColor: palette.textPrimary,
      bodyColor: palette.textMuted,
      borderColor: palette.tooltipBorder,
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      titleFont: { family: 'Geist, sans-serif', size: 12, weight: '600' },
      bodyFont: { family: 'Geist, sans-serif', size: 12 },
      boxPadding: 4
    }, config.options.plugins.tooltip || {});

    const instance = new window.Chart(canvas, config);
    registry.push({ canvasId, builderFn, instance });
    return instance;
  }

  window.addEventListener('sirkula:themechange', () => {
    const snapshot = registry.slice();
    snapshot.forEach(item => {
      createThemedChart(item.canvasId, item.builderFn);
    });
  });

  window.SirkulaCharts = {
    getThemePalette,
    createThemedChart
  };
})();
