# Viralaya — Uniforms & Fabrics, Woven in Karur

A small marketing site for Viralaya, a Karur (Tamil Nadu) manufacturer of
**uniforms** (school, corporate, industrial) and **fabrics** (by the roll).
Built with plain HTML, CSS, and JavaScript — no build step, no dependencies.

## Highlights

- Light + dark theme with system preference detection
- Scroll-reveal animations (respects `prefers-reduced-motion`)
- B2B-oriented copy: capabilities, industries, process, quote request
- Quote form (frontend-only; submit handler is stubbed — wire to your backend
  by replacing the `setTimeout` in `script.js` with a real `fetch` call)
- Mobile-first responsive layout, accessible focus states

## Preview locally

Open `index.html` directly, or run a tiny static server:

```bash
# Python
python -m http.server 8000

# Node
npx http-server -p 8000
```

Then visit http://127.0.0.1:8000/

## Contact

- **Workshop:** 158/1, Othaiyur Road, T.Sellandipalayam, Karur – 639003, Tamil Nadu
- **Phone:** +91 96554 14567 · +91 99945 11361
- **Email:** viralayaclothings@gmail.com

## Publish to GitHub Pages

1. Push to a GitHub repository.
2. Settings → Pages → Source: `main` branch.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Project structure

- `index.html` — page structure and content
- `styles.css` — visual styling, themes, responsive layout
- `script.js` — mobile menu, theme toggle, scroll-reveal, quote form
