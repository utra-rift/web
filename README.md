# RIFT landing page

The hero for RIFT, the University of Toronto Robotics Association (UTRA) team at the ARC Championships, plus a living design system page.

- `/`: the hero, built from the approved `reference/hero.html` in the design handoff.
- `/design`: the RIFT design system. Tokens, type, spacing, logos, components and motion, with a Light / Arena theme switch.

Built with TanStack Start, Tailwind CSS v4 and shadcn/ui. The project was already a TanStack Start app, and SSR means the hero markup, poster and fonts arrive in the first response.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm preview`, `pnpm check` (Biome).

## Deploy

`pnpm build` produces a Nitro server in `.output/`:

```bash
pnpm build
node .output/server/index.mjs     # PORT=8080 to change the port
```

For a managed host, set a Nitro preset at build time, for example `NITRO_PRESET=vercel pnpm build`, `netlify` or `cloudflare-pages`. Everything in `public/` (video, fonts, logos) is served as static files. Give `/video/*` and `/fonts/*` long cache headers.

## Open TODOs

- **Font licence.** Widescreen, Widescreen Ex and Widescreen UEx are **trial / demo** files from Befonts (<https://befonts.com/widescreen-font-family.html>). Buy a commercial licence before launch and swap the files in `public/fonts/`. `tokens.json` also lists WidescreenEx Regular (400), which wasn't in the handoff and isn't used.
- **Link destinations.** ROBOTS, TEAM, SPONSORS, Join and Join the team all point to `#`. They're defined once at the top of `src/components/hero/RiftHero.tsx` (`NAV_LINKS`, `JOIN_HREF`).
- **Error colour.** The brand has no error colour. `--destructive` in `src/design/tokens.css` is a placeholder so form validation has something to use.
- **Primary button in Arena.** Navy vanishes on the `#07101F` ground, so in the dark theme the primary button uses ice with navy text. Confirm this with design.
- **Image rights.** The arena photos in `public/images/` show other teams' robots (e.g. ARUW) at RoboMaster events. Confirm permission and credits before using them outside `/design`.
- **Social preview URL.** `og:image` is relative (`/og-image.jpg`). Make it absolute once the domain is set (`src/routes/index.tsx`).
- **threejs-rift licence.** The repo has no licence file. Confirm with its author (RunTheBot) that the shaders and GLB can ship on the site.
- **Rift look.** The WebGL port is close to the Cycles video but not identical: its arm seams are thinner and dimmer, and the centre glows a little more. Bloom and exposure are tuned in `LOOK`. Closer matching would mean editing the port's shaders.
- **Sharper video (only if switching back to it).** The WebGL rift renders at screen resolution, so this only applies to `HERO_MEDIA = "video"`. The source was rendered at 1280x800 with 20 samples and upscaled to 1440x900, so it looks soft on large and Retina screens. Re-render at 2880x1800 (or at least 1920x1200) with `render/` from the handoff. That needs the `.blend` file, which isn't in the handoff, and Blender 5.x. Then re-run the encodes below.

## How the hero works

- **Rift (WebGL).** The rift renders live with Three.js from [RunTheBot/threejs-rift](https://github.com/RunTheBot/threejs-rift). Its `rift-shaders.js` and `rift-curves.js` are vendored in `src/components/hero/threejs-rift/` (commit 56e54fd). The only local patches, noted at the top of the file, are the asset path and loading `rift.glb` through `loadRiftGltf` (the gzipped copy). To update, copy the new files over and re-apply those two changes, then re-run the optimize script on the new `rift.glb`. `src/components/hero/rift-scene.ts` wraps them. It adds a fixed front camera, framed to match the approved video within a few pixels (`CAMERA` zoom 0.78), and a final pass that reproduces `render/post.py`: the rift is rendered with alpha, bloomed with a blue tint, soft-clipped and laid over the same navy vignette. Tune the look with `LOOK` in `rift-scene.ts`. `idleSpeed` (0.4) slows the settled loop's shimmer; the opening always plays at full speed so the intro stays in sync. Mouse parallax: the camera orbits up to `parallax` (7) degrees around a point behind the rift, eased by `parallaxEase`. The rift drifts and turns toward the cursor, the R/FT letters move a little more (near layer), and the dot grid moves slightly against it (far layer). Touch devices stay centred. In dev, `window.__rift.tune({ exposure, bloomStrength, idleSpeed, parallax, ... })` adjusts it live.
- **Loading.** three.js is a lazy chunk (about 140 KB brotli) loaded after hydration. `public/rift/` holds the repo's assets. Upstream's `rift.glb` is already slimmed and meshopt-compressed (1.7 MB, lossless). `node scripts/optimize-rift-glb.mjs <rift.glb> <rift-effect-curves.json> public/rift/rift.glb` then snaps positions to a 1/256-unit grid (about 0.04 px), which lets it compress: 844 KB raw. It also writes `rift.glb.gz` (325 KB), which is what the hero loads. Vercel's CDN doesn't compress `.glb`, so the page inflates it itself with `DecompressionStream` (`load-rift-gltf.ts`). Browsers without it fall back to the plain `.glb`. The JSON files are copied as-is and are compressed by the CDN; `rift-effect-curves.json` is about 80 KB compressed. The model and curves are preloaded from the page head, skipped when reduced motion is on. The render budget is capped at 1.5x DPR and 3.2 MP, and rendering pauses while the hero is off-screen.
- **Dev server timing.** In `pnpm dev` the model can take about 1.8 s in DevTools. That's all waiting on the server, which is busy transforming about 180 modules on first load; the download itself takes about 14 ms. The production build serves the page in 22 requests, and the model arrives in about 10 ms locally.
- **Video (kept, not served).** Set `HERO_MEDIA = "video"` in `RiftHero.tsx` to switch back. The files are still in `public/video/`: `rift-hero.webm` (AV1 10-bit, 612 KB), `rift-hero-hevc.mp4` (HEVC 10-bit, 826 KB) and the original `rift-hero.mp4`. The encodes are debanded, with a keyframe at the 3.467 s loop point.
- **Intro timing.** The rift starts at Blender frame 46, one frame before the first ignition sparks. Starting at the video's frame 36 only added empty frames. The intro CSS is timed in video time (scene time = video time + 1.2 s): letters at 2.2 s, header at 2.9 s, copy and CTA at 3.1 s. The hero shifts it so the letters land as the tear finishes, 1.87 s after the rift starts. The intro holds while the rift loads. After 2.5 s it stops waiting and runs over the settled still, and the rift fades in and joins at the matching point.
- **Locked to the rift.** The letter size and gap are fractions of the rendered video width (`--media-w` in `hero.css`), using container query units on the hero box. This reproduces the handoff's `max(11.094vw, 17.75vh)` / `max(19.453vw, 31.125vh)`, and keeps them right once `min-height: 640px` kicks in. R and FT are set in Widescreen UEx Bold, the widest cut. FT is almost twice as wide as R, so the rift and letters shift left together (`--group-shift`, from the font's glyph metrics) until R ✦ FT is centred as a group. The rift frame is widened by the same amount so it still covers the screen.
- **Narrow or portrait screens** (container narrower than 640px, or aspect ratio below 1.15): the video scales down so R ✦ FT fits across the width and sits at 40% height, with its edges masked into the background. The copy, kickoff details and a full-width CTA stack below it. The nav moves into a menu sheet.
- **Reduced motion or no WebGL.** No rift, no animation: the still frame (loaded only when needed) with all UI in place.
- **Accessibility.** Real links and buttons, an sr-only `<h1>`, a 2px violet focus ring with 2px offset on every control, and decorative layers marked `aria-hidden`.
- **Fonts.** Widescreen converted from TTF to WOFF2 and self-hosted with `font-display: swap`; the Widescreen Ex Bold weight is preloaded. Lexend and JetBrains Mono are self-hosted through Fontsource (variable, latin subset loads on demand).

### Re-encoding the video

```bash
DB="format=yuv420p10le,deband=1thr=0.02:2thr=0.02:3thr=0.02:range=24:blur=1"
ffmpeg -i rift-hero.mp4 -an -vf "$DB" -c:v libsvtav1 -preset 4 -crf 20 -pix_fmt yuv420p10le \
  -svtav1-params tune=0:film-grain=6:film-grain-denoise=0:force-key-frames=1 \
  -g 120 -force_key_frames "expr:eq(n,104)" rift-hero.webm
ffmpeg -i rift-hero.mp4 -an -vf "$DB" -c:v libx265 -preset slow -crf 18 -pix_fmt yuv420p10le -tag:v hvc1 \
  -x265-params keyint=120:aq-mode=3 -force_key_frames "expr:eq(n,104)" -movflags +faststart rift-hero-hevc.mp4
```

Frame 104 is the 3.467 s loop point. With a new render, run these on the new master instead of `rift-hero.mp4`.

## Where things live

```
public/                   video, fonts (WOFF2), logos, images, favicon, icons, og-image
src/design/
  tokens.css              colour/shadow/spacing tokens + shadcn variable mapping
  tokens.data.ts          tokens.json from the handoff (drives /design)
  tokens.ts               typed accessors, resolveColor()
  brand-book.md           brand guidance from the handoff
src/styles.css            Tailwind theme (brand-only palette, fonts, radii, type utilities)
src/components/hero/      RiftHero.tsx + hero.css
src/components/brand/     Lockup (UTRA × RIFT)
src/components/ui/        shadcn components restyled to the brand
src/routes/               index (hero), design
```

Tailwind's default colour palette is switched off, so only brand colours exist as utilities (`bg-navy`, `text-ink-muted`, `bg-cyan-soft`, ...). The type styles from the tokens are utilities too: `type-display-xl`, `type-label`, `type-data`, etc. Add shadcn components with `pnpm dlx shadcn@latest add <name>`. The CLI currently mis-resolves the `#/lib/utils` alias (it writes `from "cn"` and installs an unrelated `cn` package), so fix the import and remove that package afterwards.
