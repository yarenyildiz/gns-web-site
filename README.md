# GNS Shipping Agency — Website

Corporate website I built for **GNS Gemi Acenteliği ve Lojistik Ltd. Şti.**, a ship agency and logistics company based in İskenderun, Türkiye.

The site is fully static. I deliberately kept it free of frameworks, bundlers and runtime dependencies: it is plain HTML, one stylesheet and native ES modules, so it loads fast, deploys anywhere and has nothing to keep updated.

## Features

- Bilingual (Turkish / English) with a small i18n module I wrote for this project
- Auto-playing hero slider that respects `prefers-reduced-motion` and pauses on focus or when the tab is hidden
- Scroll-spy navigation and scroll-triggered reveal animations via `IntersectionObserver`
- Responsive layout from wide desktop down to small phones, with an accessible mobile menu (`aria-expanded`, Escape to close, focus return)
- Client-side validated contact form
- `LocalBusiness` structured data (JSON-LD) and Open Graph tags for search and link previews

## Project structure

```
index.html              Markup, authored in Turkish, plus an inline SVG icon sprite
css/style.css           Design tokens, components and responsive rules
js/main.js              Entry point, wires up the modules
js/modules/
  i18n.js               Language switching, persistence, ?lang= support
  header.js             Sticky header and mobile navigation
  hero-slider.js        Hero carousel
  reveal.js             Scroll reveal animations
  scroll-spy.js         Active nav link tracking
  contact-form.js       Validation and mail hand-off
js/locales/             Translation dictionaries
img/                    Logo, favicon, touch icon
```

## Running locally

ES modules do not load over `file://`, so the site has to be served over HTTP:

```sh
make serve        # http://localhost:5173
```

Any static server works; the Makefile just wraps `python3 -m http.server`.

## How the i18n works

I didn't want to duplicate every Turkish string in a JSON file, so the HTML itself is the source for the default language:

- `data-i18n="key"` translates an element's text
- `data-i18n-attr="placeholder:key; aria-label:key"` translates attributes

On load, the module snapshots the authored Turkish content and keeps it as the fallback. English strings live in `js/locales/en.js`. `js/locales/tr.js` only holds strings that exist in JavaScript alone (form messages, menu labels).

The selected language is stored in `localStorage` and reflected in the URL (`?lang=en`), so English links can be shared directly. Missing translation keys are logged to the console.

To add a translated string:

1. Add `data-i18n="section.key"` to the element.
2. Add `'section.key'` to `js/locales/en.js`.

## Contact form

There is no backend, so on submit the form validates the fields and opens the visitor's mail client with a prefilled message addressed to `data-recipient` on the `<form>`. If the client later wants submissions stored server-side, the only change needed is replacing `buildMailto()` in `contact-form.js` with a `fetch()` to a form endpoint.

## Deployment

The site is hosted on Cloudflare as static assets.

```sh
make package      # creates dist/gns-site.zip
```

I upload the zip from **Workers & Pages → project → Create deployment**. Since there is no build step, the same zip works on Netlify, GitHub Pages or any static host.

## Browser support

All current evergreen browsers. The code uses ES2022 features (`Object.hasOwn`, optional catch binding) and degrades gracefully where `IntersectionObserver` is unavailable.

## Credits

Hero and section photos are from [Unsplash](https://unsplash.com). Font: [Manrope](https://fonts.google.com/specimen/Manrope).
