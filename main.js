// Maclapse · landing page · v6

// ─── Theme toggle (defaults to system; manual override persists) ───
//     Doubles as the screenshot swapper — every <img data-light="..."> gets
//     its src flipped to the light-mode asset when the resolved theme is
//     light, and back to the dark asset otherwise. Resolved theme = explicit
//     class on <html> > stored preference > system preference.
(function themeAndScreenshots() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const resolvedMode = () => {
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';
    return mq.matches ? 'dark' : 'light';
  };

  // Cache each screenshot's original (dark) src so we can restore it cleanly.
  const shots = Array.from(document.querySelectorAll('img[data-light]'));
  shots.forEach((img) => { img.dataset.dark = img.getAttribute('src'); });

  const applyTheme = () => {
    const mode = resolvedMode();
    shots.forEach((img) => {
      const target = mode === 'light' ? img.dataset.light : img.dataset.dark;
      if (target && img.getAttribute('src') !== target) img.setAttribute('src', target);
    });
  };

  const setMode = (mode) => {
    root.classList.remove('dark', 'light');
    root.classList.add(mode);
    try { localStorage.setItem('theme', mode); } catch (e) {}
    applyTheme();
  };

  if (btn) {
    btn.addEventListener('click', () => {
      setMode(resolvedMode() === 'dark' ? 'light' : 'dark');
    });
  }

  // If user hasn't explicitly chosen, follow the system live.
  mq.addEventListener('change', () => {
    try {
      if (!localStorage.getItem('theme')) {
        root.classList.remove('dark', 'light');
      }
    } catch (e) {}
    applyTheme();
  });

  applyTheme();
})();


(function resolveDownload() {
  const btn = document.getElementById('download-btn');
  if (!btn) return;
  fetch('https://api.github.com/repos/XploreDatum/DisplayMovie-releases/releases/latest', {
    headers: { 'Accept': 'application/vnd.github+json' },
    cache: 'no-store'
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.assets)) return;
      const dmg = data.assets.find((a) => /\.dmg$/i.test(a.name));
      if (!dmg) return;
      btn.href = dmg.browser_download_url;
      const v = document.getElementById('dl-version');
      if (v && data.tag_name) {
        v.textContent = `${data.tag_name} · Apple Silicon · ${(dmg.size / 1024 / 1024).toFixed(1)} MB`;
      }
    })
    .catch(() => {});
})();
