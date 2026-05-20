# Maclapse · releases & website

This repo is the **public** target for Maclapse's release artifacts and its marketing site.

> Source code for the app itself lives in a separate private repo. This one only ships the binary and the homepage.

## What's here

```
.
├── index.html        ← single-page marketing site
├── styles.css        ← all visual design (custom, no framework)
├── main.js           ← hero counters, scroll reveal, download-link resolver
├── favicon.svg
├── vercel.json       ← deployment config
├── screenshots/      ← PNGs referenced by index.html
└── README.md
```

The site is plain HTML / CSS / vanilla JS. No build step, no framework. Deploy as-is.

## Deploying to Vercel

The fastest path:

```bash
npm i -g vercel       # one-time
cd Maclapse-releases
vercel                # follow the prompts: link to a Vercel account, project name, etc.
vercel --prod         # promote to production once happy with the preview
```

The first run will ask you to log in via your browser and link a project. Settings to confirm:

- **Framework Preset:** *Other* (or leave on auto-detect)
- **Build Command:** *(none)*
- **Output Directory:** *(root)*
- **Install Command:** *(none)*

Or connect this repo to Vercel from <https://vercel.com/new> for git-push auto-deploys.

## Cutting a release

1. **Build & notarize the DMG** (in the source repo):
   ```bash
   TEAM_ID=ABCD123456 Scripts/notarize.sh
   # → produces build/Maclapse-<version>.dmg, signed + notarized + stapled
   ```

2. **Tag and create a GitHub release**:
   ```bash
   gh release create v0.1.1 build/Maclapse-0.1.1.dmg \
     --repo XploreDatum/Maclapse-releases \
     --title "Maclapse v0.1.1" \
     --notes "See release notes."
   ```

3. **The website updates automatically.** `main.js` resolves the latest DMG via GitHub's API at page load (`/repos/XploreDatum/Maclapse-releases/releases/latest`) and rewrites the download button's `href` to point at it. The version chip in the download card updates too.

## Replacing the CSS mockups with real screenshots

Drop PNGs into `screenshots/` using the filenames in `screenshots/README.md`. The site picks them up automatically — no rebuild needed.

## License

Site source: MIT. The DMG itself is proprietary © XploreDatum.

---

Developed with ♥ in Keralam. An [XploreDatum](https://xploredatum.com) project.

<!-- redeploy-trigger 2026-05-20T13:14:05Z -->
