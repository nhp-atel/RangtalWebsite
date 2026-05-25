# Rangtaal — Feel the Rhythm of Garba

A premium, cinematic website for **Rangtaal**, a modern Garba & Dandiya community
based in Naperville, IL. Founded in 2025 by Nik Patel, Rangtaal runs a weekly
Garba class — every Tuesday, 7:30–9:30 PM — and a growing community of 150+ dancers.

Built as a fast, single-page static site with rich motion and hand-crafted visuals.

## Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS v3** (custom Rangtaal color system & fonts)
- **Framer Motion 11** (loading screen, scroll reveals, parallax, micro-interactions)
- **Google Identity Services** (member sign-in)

No backend — all content is static and all imagery is local.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Project structure

```
public/                 Brand assets & photos (logo, GarbaIcon, GR1–GR7, workshop photo)
src/
  main.jsx              App entry
  App.jsx               Page composition + loading-screen gate
  styles/index.css      Tailwind layers + global styles, buttons, utilities
  config/members.js     Member login config (Google Client ID, allowed emails, Drive URL)
  components/           Navbar, Logo, Footer, LoadingScreen, MemberLoginModal,
                        Particles, HeroArtwork, MobileStickyCTA
  sections/             Hero, Workshops, Gallery, Community, About, Countdown, Registration
tailwind.config.js      Color palette, fonts, keyframes/animations
render.yaml             Render static-site blueprint
```

## Sections

Loading screen → Hero → Workshops (June batch) → Gallery → Community stories →
About → Navratri countdown → Registration → Footer, plus a glassmorphic navbar,
a mobile sticky CTA, and a Members login modal.

## Configuration — values to fill in

A few real-world details are left as clearly-marked placeholders:

### 1. Zelle payment — `src/sections/Registration.jsx`
The payment step shows: *send Zelle to **Riya Shah** at `(630) 555-0150`.*
Replace the number with Riya's real Zelle phone/email.

### 2. Member login — `src/config/members.js`
Google sign-in gated by an approved-emails list:
- `GOOGLE_CLIENT_ID` — create an OAuth **Web** client at
  [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
  Add every site origin (e.g. `http://localhost:5173` and the live Render URL)
  under *Authorized JavaScript origins*.
- `ALLOWED_EMAILS` — paid members' Google emails (lowercase).
- `MEMBER_DRIVE_URL` — the Drive folder with recordings/photos. **Also share that
  folder in Drive with the same emails** — that sharing is the real lock; the
  in-code list only drives the on-site experience.

### 3. Registration → Google Form — `src/sections/Registration.jsx`
The multi-step form can pipe submissions into the live Google Form once you paste
each field's `entry.XXXX` ID into the `GOOGLE_FORM.entries` map (open the live form
→ ⋮ → *Get pre-filled link*). Until then, the form just shows the confirmation screen.

## Deploying to Render

This repo includes `render.yaml`, so Render configures itself automatically.

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint**
   (or **New → Static Site**).
2. Connect GitHub and select this repository.
3. Settings (auto-detected from the blueprint):
   - **Build command:** `npm ci && npm run build`
   - **Publish directory:** `dist`
4. Deploy. You'll get a `*.onrender.com` URL; pushes to `main` auto-deploy.

After deploy, remember to add the live URL to the Google OAuth client's authorized
origins so member sign-in works in production.
