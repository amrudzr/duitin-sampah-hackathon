(function () {
  const savedTheme = localStorage.getItem('sirkula_theme') || 'light';
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');

  const themeBtn = document.getElementById('login-theme-btn');
  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    if (themeBtn) {
      themeBtn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('sirkula_theme', next ? 'dark' : 'light');
      updateThemeIcon();
    });
  }

  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  updateThemeIcon();
})();
