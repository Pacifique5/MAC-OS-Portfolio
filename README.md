# macOS Portfolio — Mugisha Pacifique

An interactive portfolio that looks and behaves like a macOS desktop. Live at **[mfique5.vercel.app](https://mfique5.vercel.app/)**.

## Features

- **Desktop** — draggable, focusable windows with traffic lights, a menu bar with working menus, Control Center, Notification Center, Spotlight (`Ctrl/⌘ + Space`), Launchpad and a magnifying Dock.
- **Apps**
  - **About Me** — contact card, stats and CV download
  - **Projects** — real GitHub repositories with live links, categories and search
  - **Skills**, **Experience**, **Testimonials**, **Contact** (opens your email app with the message filled in)
  - **Photos** — certificates and badges from `public/Photos`
  - **Terminal** — cyber-themed shell with real crypto tools, simulated recon and an endless live ops feed
- **Responsive** — adapts from phones to large desktops.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · react-icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

## Project structure

```
app/
  page.tsx                 Desktop: window manager, wallpaper, desktop icons
  layout.tsx, globals.css  Fonts, design tokens, macOS surfaces
  components/
    apps.tsx               App registry (Dock, Launchpad, Spotlight) and social links
    MenuBar.tsx, Dock.tsx, ControlCenter.tsx, SystemOverlays.tsx
    MacWindow.tsx          Window frame + shared window layout
    sections/              One file per app window
    terminal/commands.ts   Terminal command engine and live feed
    icons/                 SF Symbols–style glyphs and Big Sur–style app icons
    ui/mac.tsx             Shared macOS controls
    photos-data.ts         Generated — see below
    projects-data.ts       Projects shown in the Projects app
scripts/generate-photos.mjs
```

## Updating content

| What | Where |
| --- | --- |
| Photos | Add images to `public/Photos`, then run `npm run photos` |
| Projects | `app/components/projects-data.ts` |
| CV | Replace the PDF in `public/` and update `CV_URL` in `app/components/apps.tsx` |
| Social links | `SOCIAL_LINKS` in `app/components/apps.tsx` |
