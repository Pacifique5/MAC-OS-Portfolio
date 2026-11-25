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
  - **Calendar** — book a 30-minute call: live availability, no double bookings, and an instant email to me
  - **Trash** — habits left behind across software engineering, cybersecurity and robotics
- **CV** — one-click download from the "My CV" folder on the desktop, Spotlight or the Terminal (`cv`).
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
    booking-config.ts      Call booking rules: times, days, timezone
    trash-data.ts          Items in the Trash
  api/bookings/            Booking API: availability, booking, email
scripts/generate-photos.mjs
```

## Call booking setup

The Calendar app books calls through `/api/bookings`. It needs two free services in production:

1. **Upstash Redis** (stores bookings, so every visitor sees the same availability).
   In Vercel: *Storage → Marketplace → Upstash → Redis*, connect it to this project. This adds
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. **Resend** (sends the email). Sign up at [resend.com](https://resend.com) **with the address that should
   receive bookings**, create an API key and add it in Vercel as `RESEND_API_KEY`.

Then redeploy. Optional variables are listed in `.env.example`.

Until both are set, the live site falls back to "send your request by email". In local development
it works without them: bookings are kept in memory and the email is printed in the terminal.

To cancel a booking, delete its field from the `bookings:YYYY-MM` hash in the Upstash console.
Change the offered times, working days or notice period in `app/components/booking-config.ts`.

## Updating content

| What | Where |
| --- | --- |
| Photos | Add images to `public/Photos`, then run `npm run photos` |
| Projects | `app/components/projects-data.ts` |
| CV | Replace the PDF in `public/` and update `CV_URL` in `app/components/apps.tsx` |
| Social links | `SOCIAL_LINKS` in `app/components/apps.tsx` |
