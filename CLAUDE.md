# Similia Website

## Project Structure

- `index.html` — static frontend (single page)
- `server.js` — Node.js backend (Express, reCAPTCHA v2, Resend email API)
- `netlify.toml` — Netlify deployment config (frontend)
- `render.yaml` — Render deployment config (backend)

## Hosting

| Layer | Platform | Live URL | Dashboard |
|-------|----------|----------|-----------|
| Frontend | Netlify | https://similia.co.il | https://app.netlify.com |
| Frontend (fallback) | Netlify | https://similia-website.netlify.app | — |
| Backend | Render | https://similia-website.onrender.com | https://dashboard.render.com |

## Domain

- Domain: `similia.co.il` — registered at box.co.il
- DNS managed at box.co.il, pointing to Netlify
- SSL certificate provisioned via Netlify (Let's Encrypt)

## Deployment

- Netlify linked to GitHub repo `skulas/similia-website`, branch `main`, publish dir `.` — auto-deploys on push
- Render linked to same repo, branch `main` — auto-deploys on push

## Environment Variables

### Render (backend)
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://similia.co.il`
- `RECAPTCHA_SECRET_KEY` = Google reCAPTCHA v2 invisible secret key
- `RECIPIENT_EMAIL` = `similiaschool.info@gmail.com` (contact form destination)
- `RESEND_API_KEY` = Resend API key (resend.com dashboard)

## Contact Form

- Protected by Google reCAPTCHA v2 invisible (site key in `index.html`)
- On submit: reCAPTCHA token sent to `/api/contact` → verified server-side → email sent via Resend
- Sends from `info@similia.co.il` (domain verified in Resend) with reply-to `RECIPIENT_EMAIL`
- Frontend retries silently after 60s on network failure (handles Render cold starts)
- Frontend pings `/api/heartbeat` on load and every 60s to keep backend warm

## Backend Endpoints

- `GET /api/heartbeat` — keep-alive ping, returns `{ok: true}`
- `POST /api/contact` — contact form submission (reCAPTCHA + email)
- `POST /api/login` — student portal demo login (always returns 401)

## Known Gotchas

- **Render free tier blocks outbound SMTP** (ports 587/465) — use HTTP-based APIs only (Resend uses port 443)
- **Render free tier has no IPv6** — would need `dns.setDefaultResultOrder('ipv4first')` if using any socket-based outbound connections
- **Render free tier spins down** after ~15min inactivity — frontend heartbeat mitigates this for active visitors
- **Template literals in index.html** — the file historically had `\`` (backslash+backtick) instead of real backticks, silently breaking all JS. Always verify JS syntax after edits.

## Status (2026-06-10)

- Site live at https://similia.co.il
- Contact form fully working: reCAPTCHA → backend → Resend → email delivered to `similiaschool.info@gmail.com`
- Netlify and Render both auto-deploy on push to `main`
