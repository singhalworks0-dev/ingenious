# ingenious

Responsive React + Vite demo of Ingenious Life, with local navigation and locally stored reference imagery, fonts, and page content.

## Development

```sh
npm install
npm run dev
```

## Build and Vercel

```sh
npm run build
npm run preview
```

Deploy with Vercel's Vite preset (`npm run build`, output directory `dist`). The included `vercel.json` serves the React application for direct page visits and refreshes while preserving static assets and page-data files.

## Pages and navigation

The demo includes the homepage, product pages, shop, story, ingredients and ingredient detail pages, clinical research, FAQs, sustainability, policies, all eight blog listing pages, and their linked articles. Page content is loaded locally from `public/pages-data`, using `src/route-manifest.json`.

Internal links stay on the current demo origin. Legacy reference URLs are normalized by `src/routing.js`. Account, registration, rewards, region selection, order tracking, and checkout have local demo screens. Genuine external social links remain external.

## Interactions

- Full desktop and mobile hamburger navigation
- Signup popup, ingredient tabs, accordions, review videos and carousels
- Scroll-triggered percentage and ring animations with reduced-motion support
- Product image galleries, purchase plans, quantity controls and a persistent local shopping bag
- Local collagen quiz and product recommendation
- Local account/contact/tracking form validation and demo feedback

## Integration boundaries

This is a frontend demo. It does not authenticate customers, submit messages to the original store, track live orders, bill subscriptions, send newsletter emails, or accept payments. No account credentials are saved. The shopping bag uses localStorage. Video media may stream from the reference CDN; page images, styles and fonts are served locally.

## Verification

```sh
node scripts/verify-demo.mjs
```

Set `DEMO_URL` to the running preview origin (default `http://127.0.0.1:5175`). `CHROME_PATH` may override the local Chrome executable. Verification covers all direct routes, links staying in the demo, menu navigation, direct refreshes, product gallery and bag, quiz, checkout and mobile overflow.

`scripts/import-pages.py` imports reference content and its public assets. React renders the sanitized markup through `html-react-parser`; interactive components live in `src/Enhancements.jsx` and `src/DemoPages.jsx`.
