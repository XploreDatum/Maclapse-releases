// Maclapse · landing page · v7
//
// Theme handling is a single class swap on <html> (`dark` / `light`). Both
// screenshot variants are present in the DOM, and CSS hides the off-theme
// one — so toggling the theme is instant (no fetch, no JS image work).
(function theme() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const resolvedMode = () => {
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';
    return mq.matches ? 'dark' : 'light';
  };

  const setMode = (mode) => {
    root.classList.remove('dark', 'light');
    root.classList.add(mode);
    try { localStorage.setItem('theme', mode); } catch (e) {}
  };

  if (btn) {
    btn.addEventListener('click', () => {
      setMode(resolvedMode() === 'dark' ? 'light' : 'dark');
    });
  }

  // No manual override → follow the system live.
  mq.addEventListener('change', () => {
    try {
      if (!localStorage.getItem('theme')) {
        root.classList.remove('dark', 'light');
      }
    } catch (e) {}
  });

  // Mark each screenshot `.loaded` after its bytes decode so the skeleton
  // shimmer stops cleanly. Both light + dark variants are loaded eagerly
  // in this layout — we don't care which one paints first, just that the
  // shimmer ends when its own pixels arrive.
  document.querySelectorAll('img.shot').forEach((img) => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else if (typeof img.decode === 'function') {
      img.decode().then(markLoaded).catch(markLoaded);
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });
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
