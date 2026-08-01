---
name: add-page
description: Add a new page to the Similia website (a course/program landing page, a blog post, or a standalone page) from a raw HTML draft (e.g. AI-generated or client-supplied) or from scratch. Converts drafts to match the site's real design system, wires up working forms, adds schema, links it from the right place, and updates the sitemap. Use when the user says "add a new course/page/blog post using <file>.html" or similar.
---

# Add a new page to Similia

Client-supplied or AI-generated page drafts (dropped in `/Volumes/Extreme SSD/similia-website/fixes/`) arrive as **fully self-contained, bespoke-styled HTML** — their own color palette, their own fonts, sometimes a non-functional lead form, placeholder phone numbers, and broken/Hebrew-named image references. They are never used as-is. This skill converts one into a real page consistent with the rest of similia.co.il.

First, work out **what kind of page this is** — it changes where it gets linked from and what schema it needs:

| Page type | Example | Schema | Linked from |
|---|---|---|---|
| Course / program landing page | `ritual-constellation`, `past-life-regression`, `lucid-dreaming` | `Course` + `FAQPage` | `#consciousness-courses` or `#programs` card grid on the homepage |
| Blog post | `blog/homeopathy-and-kabbalah` | `BlogPosting` | `#blog` teaser grid on the homepage (+ cross-links from other posts if relevant) |
| Standalone/other page | — | judgment call | ask the user where it should be linked from if not obvious |

Steps 1–3 and 8 apply to every page type. Steps 4–7 differ — follow the course or blog track as appropriate.

## 0. Read the source file first

Read the whole draft before touching anything. Note:
- The actual topic/title and any real copy worth preserving — **keep the substantive content, don't rewrite it**
- Placeholder values that need real ones (phone numbers like `YOUR_PHONE_NUMBER`, Hebrew-named or missing image files, invented prices)
- Whether it has a form, and whether that form actually submits anywhere
- Any images referenced but not supplied, or supplied separately by the user

## 1. Pick a URL slug

English, kebab-case, 2–3 words, matching existing folders: `ritual-constellation`, `past-life-regression`, `adam-part-in-the-world`, `homeo-family-pack`, `lucid-dreaming` (courses); `blog/<slug>` for posts. Create the folder.

## 2. Use the site's real template, not the draft's own header/theme

**Don't just swap the header and leave the rest of the draft's bespoke styling** — a mismatched header-vs-body looks broken. Re-theme the whole page to the site's actual design tokens.

**Reference file for course/standalone pages**: `past-life-regression/index.html`.
**Reference file for blog posts**: `blog/homeopathy-and-kabbalah/index.html` (has its own separate template — see the blog track below).

### Site-wide design tokens (course/standalone template)

`<head>` boilerplate every page needs:
- Standard meta (charset, viewport, title, description, canonical `https://similia.co.il/<slug>/`)
- OG tags + `twitter:card`, `og:image` → `https://similia.co.il/logo-similia.jpg` unless the page has its own hero image
- Favicons: the standard 4 `<link>` tags (`/favicon.ico`, 32x32, 16x16, apple-touch-icon) — always these exact paths
- Fonts (exact Google Fonts URL — the whole site, including every blog post, standardized on a single family, Miriam Libre, as of 2026-08-01):
  ```
  https://fonts.googleapis.com/css2?family=Miriam+Libre:wght@400;700&display=swap
  ```
  Miriam Libre only ships weights 400/700 and no italic — CSS asking for other weights/italic will be browser-synthesized, which is accepted site-wide.
- `<script src="https://cdn.tailwindcss.com"></script>` + this exact Tailwind config (the site's real design tokens):
  ```js
  tailwind.config = {
    theme: { extend: {
      colors: { similia: {
        darkBlue: '#20436d', midBlue: '#2b5c8f', lightBlue: '#ebf1f7',
        gold: '#c5a059', goldDark: '#7a5e24', cream: '#fbfaf6', charcoal: '#1d232a'
      } },
      fontFamily: {
        sans: ['Miriam Libre', 'serif'], serif: ['Miriam Libre', 'serif'], decorative: ['Miriam Libre', 'serif']
      }
    } }
  }
  ```
- `body { background-color: #fbfaf6; color: #1d232a; scroll-behavior: smooth; } p { font-weight: 600; }`
- Font Awesome for icons: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- reCAPTCHA script if the page has a form (see step 4)
- JSON-LD (see step 5)

**Header** (exact pattern, adapt copy only):
```html
<header id="main-content" class="pt-10 pb-16 md:py-24 bg-gradient-to-b from-similia-lightBlue/30 to-similia-cream">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
    <a href="https://similia.co.il/" class="inline-block">
      <img src="/logo-similia.jpg" alt="סימיליה לוגו" class="h-16 w-16 object-contain rounded-full shadow-inner border border-similia-gold/20 mx-auto mb-2">
    </a>
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-similia-gold/10 border border-similia-gold/30 text-similia-goldDark font-semibold text-xs">
      <i class="fa-solid fa-ICON" aria-hidden="true"></i>
      <span>SHORT BADGE TEXT</span>
    </div>
    <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl text-similia-darkBlue font-bold leading-tight">PAGE TITLE</h1>
    <p class="text-base sm:text-lg text-similia-charcoal leading-relaxed max-w-2xl mx-auto">DESCRIPTION</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-2">
      <a href="https://wa.me/972524472017?text=..." target="_blank" class="px-8 py-3.5 bg-[#25d366] text-white hover:brightness-110 font-bold rounded-lg shadow-lg transition-all text-center">
        <i class="fa-brands fa-whatsapp ml-2"></i>דברו איתנו בוואטסאפ
      </a>
      <a href="#about-course" class="px-8 py-3.5 bg-similia-darkBlue hover:bg-similia-gold hover:text-similia-darkBlue text-white font-bold rounded-lg shadow-lg transition-all text-center">
        לתוכן ומחקר הקורס
      </a>
    </div>
  </div>
</header>
```

**Body sections**: keep the draft's actual sections but re-theme every class:

| Draft's classes (varies per file) | Replace with |
|---|---|
| its navy/blue tone | `similia-darkBlue` |
| its gold tone | `similia-gold` (solid bg) / `similia-goldDark` (text on light bg) |
| its light/bg tone | `similia-cream` or `similia-lightBlue/20` |
| its muted/dark text tone | `similia-charcoal` |
| body font (Rubik, Open Sans, Assistant, etc.) | `Miriam Libre` |
| heading font (Frank Ruhl Libre, Secular One, etc.) | `Miriam Libre` (via `font-serif`) |
| any "handwriting"/decorative/quote font | `Miriam Libre` (via `font-decorative`) — no true italic face exists, so drop `italic` or let the browser fake it |

Section wrapper convention: alternate `bg-white` / `bg-similia-cream`, each `border-y border-similia-gold/10`, `py-16 md:py-20`.

Also check for **hardcoded hex colors** outside the Tailwind config (inline `<style>` rules like checkbox/accent colors) — the config swap won't touch those; grep for the draft's old hex values after re-theming to make sure none survived.

## 3. Fix what's broken in the draft

- **Placeholder phone/WhatsApp**: replace with the real number `972524472017` everywhere (`wa.me/972524472017?text=...`)
- **Missing or Hebrew-named images**: Hebrew filenames break on Netlify (known site gotcha). If a draft references a generic "instructor photo" and the page features Mariel, reuse `ritual-constellation/instructor-photo.png` (her real transparent-background photo) rather than inventing one
- **Any user-supplied replacement images**: optimize before use — resize to ~1200–1600px on the long edge for full-width images, ~500px for small avatars/badges (never ship a multi-MB source image), convert PNG→JPEG at quality 85–88 for photos (keep PNG only if transparency is required), verify visually after resizing. If a circular photo has a black/white background outside the circle instead of transparency, build a precise circular alpha mask (geometric, not color-threshold — color thresholding risks punching holes in a subject's dark hair/clothing) rather than just cropping tighter, if the goal is to preserve full framing.
- **Non-functional form**: drafts often have a form with no `action`, no JS handler, no reCAPTCHA — it would silently do nothing on submit. Replace with the site's real working pattern (copied from `ritual-constellation/index.html`): reCAPTCHA v2 invisible (site key `6LdiDhctAAAAANEkYgIU9kSHUm8baLT79r3bhBEE`) + `submitToBackend()` from `../js/form-utils.js` (or `js/form-utils.js` for blog posts one level shallower), which posts to the real backend. Set the payload's `program`/`message` field to identify this page. Keep a WhatsApp fallback CTA alongside it, and the floating WhatsApp button (bottom-left, fixed) matching other pages. If a form's fake data is only ever stored in `localStorage` and never reaches the school, that's the same problem — remove it, don't keep it.
- **Invented pricing**: only put a price in visible copy or schema if the draft actually states one. If no price is given, omit the `offers` block entirely.

## 4. JSON-LD schema

**Course/program page** — match the simple pattern used by the standalone course pages:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "name": "...", "description": "...",
      "provider": { "@type": "EducationalOrganization", "name": "סימיליה", "sameAs": "https://similia.co.il/" },
      "url": "https://similia.co.il/<slug>/"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [ { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }, ... ]
    }
  ]
}
```

**Blog post** — match the pattern used by the 3 existing posts (`BlogPosting` with inline author/publisher, not the `@graph` style):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...", "description": "...",
  "datePublished": "YYYY-MM-DD", "dateModified": "YYYY-MM-DD",
  "mainEntityOfPage": "https://similia.co.il/blog/<slug>/",
  "image": "https://similia.co.il/logo-similia.jpg",
  "author": { "@type": "Person", "name": "מריאל טהר אלדמע", "jobTitle": "מייסדת  ומנהלת את סימליה ,בית להומאופתיה ותודעה גבוה, הומאופתית קלאסית" },
  "publisher": {
    "@type": "EducationalOrganization", "name": "סימיליה",
    "alternateName": "Similia - Homeopathy, Growth, Self-Development",
    "disambiguatingDescription": "Similia is a center for Classical Homeopathy, Kabbalistic wisdom, and conscious development, founded by classical homeopath Mariel Tahar Eldema. We offer professional certification courses for practitioners, practical natural family-medicine programs, and transformative experiential seminars - including Past Life Regression and Ritual Constellation, a unique practice combining Hebrew shamanic cards with Kabbalah. Our programs are designed for anyone seeking to deepen their understanding of health, consciousness, and the connection between body, mind, and soul - grounded in the parallel between homeopathy's law of similars and the Kabbalistic wisdom of tzimtzum and reflected light. Whether you are looking to study Classical Homeopathy, learn natural family medicine, or explore reincarnation and consciousness through Kabbalah, Similia provides practical knowledge and meaningful tools for everyday life.",
    "knowsAbout": ["Classical Homeopathy", "Homeopathy Courses", "Natural Medicine", "Family Homeopathy", "Homeopathic Remedies", "Kabbalah", "Kabbalah and Homeopathy", "Ritual Constellation", "Past Life Regression", "Consciousness Development", "Personal Growth", "Self-Development", "Natural Healing", "Online Homeopathy Courses"],
    "logo": { "@type": "ImageObject", "url": "https://similia.co.il/logo-similia.jpg" },
    "sameAs": ["https://www.instagram.com/similia.home", "https://www.facebook.com/share/1Chr5vAW7a/"]
  }
}
```
Keep the `publisher` block identical across all blog posts — it's the same entity everywhere, and consistency is what makes it useful for AI/search entity resolution (this exact block was added deliberately across all 3 posts for that reason — don't let a new post drift from it).

Use the draft's real FAQ/content if it has any. Validate the JSON before moving on (parse every `<script type="application/ld+json">` block with `python3 -c "import json,re; ..."`).

## 5. Footer

Standard site footer for course/standalone pages:
```html
<footer class="py-10 bg-similia-cream border-t border-similia-gold/20 text-center text-sm text-similia-charcoal">
    <p class="mb-2"><a href="https://similia.co.il" class="text-similia-goldDark underline font-bold">סימיליה - בית להומאופתיה קלאסית, צמיחה והתפתחות</a></p>
    <p>&copy; 2026 סימיליה - כל הזכויות שמורות. בית הספר שומר לעצמו את הזכות לבצע שינויים במחיר הקורס, במועדים, בסילבוס ובפרטי המנהלה בכל עת.</p>
</footer>
```
For a blog post, use the blog-family footer instead (see `blog/homeopathy-and-kabbalah/index.html`'s footer) — it includes the "‹ חזרה לעמוד הבית" home link, which every blog post should have.

## 6. Link it from the right place

**Course/program**: find the `#consciousness-courses` section in `index.html` (higher-consciousness courses grid — `תפקידו של האדם בעולם`, `קורס שחזורי גלגולים`, `קונסטלציה טקסית`, `לפרוץ את גבולות התודעה`). Add a new card copying the exact existing card markup (badge / icon circle / title / subtitle / description / CTA button, `onclick="window.location='/<slug>/'"` on the outer div, `href="/<slug>/"` on the button). If it's a professional-training track instead of a consciousness/experiential course, it belongs in `#programs` — check which fits before adding.

**Blog post**: find the `#blog` section in `index.html` (teaser card grid). Add a new teaser card matching the existing 3 (category label, title, 2-line description, "קרא את המאמר" link to `/blog/<slug>/`). Consider whether the new post should be cross-linked from the closing paragraph of related existing posts, the way the 3 current posts reference each other.

## 7. Update `sitemap.xml`

Add a `<url>` entry matching the pattern of similar existing pages (courses: `priority 0.8, changefreq monthly`; blog posts: `priority 0.6, changefreq yearly`), `lastmod` = today.

## 8. Verify before reporting done

- Validate all JSON-LD blocks parse
- `curl` the new page, its images, and `js/form-utils.js` (adjust relative path for depth) for 200s via the local dev server (`npx serve . -p 8080` from repo root if not already running)
- Load it in the browser (claude-in-chrome) and actually look at: hero, at least one content section, the form if present (reCAPTCHA widget should render), and the homepage card/teaser
- Never commit or push without explicit user approval, per this repo's standing rule
