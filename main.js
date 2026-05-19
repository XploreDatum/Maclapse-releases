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
    // True only when the user has explicitly chosen a theme; otherwise we let
    // the <source media="(prefers-color-scheme: light)"> track the system.
    let override = null;
    try { override = localStorage.getItem('theme'); } catch (e) {}
    const isOverride = override === 'dark' || override === 'light';

    shots.forEach((img) => {
      const target = mode === 'light' ? img.dataset.light : img.dataset.dark;
      if (target && img.getAttribute('src') !== target) img.setAttribute('src', target);

      // <picture>'s <source> wins over <img> when its media query matches.
      // Setting img.src alone is therefore not enough — we must also rewrite
      // the source's media to either force-match or never-match the user's
      // explicit choice. When there's no override, restore the original
      // system-tracking media query.
      const picture = img.parentElement;
      if (picture && picture.tagName === 'PICTURE') {
        const source = picture.querySelector('source');
        if (source) {
          if (isOverride) {
            source.media = mode === 'light' ? 'all' : 'not all';
          } else {
            source.media = '(prefers-color-scheme: light)';
          }
        }
      }
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

  // Mark each screenshot as `.loaded` once the bytes decode, which stops the
  // skeleton animation. Use `decode()` when available so we don't toggle the
  // class until the bitmap is actually ready to paint.
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
