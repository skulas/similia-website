# Similia Website

## Project Structure

- `index.html` — static frontend (single page)
- `server.js` — Node.js backend
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

## Environment Variables

### Render (backend)
- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://similia.co.il`
- `RECAPTCHA_SECRET_KEY` = Google reCAPTCHA v2 secret key (from console.cloud.google.com/security/recaptcha)
- `RECIPIENT_EMAIL` = `gargerim@gmail.com` (contact form destination)
- `SMTP_USER` = Gmail address used to send emails
- `SMTP_PASS` = Gmail app password (generated at myaccount.google.com/apppasswords)
- `SMTP_HOST` = `smtp.gmail.com` (optional, default)
- `SMTP_PORT` = `587` (optional, default)

## Status (2026-06-10)

- Site is live and fully connected at https://similia.co.il
- SSL active
- Backend FRONTEND_URL updated to production domain in both render.yaml and Render dashboard
- Netlify linked to GitHub repo `skulas/similia-website`, branch `main` — auto-deploys on push
