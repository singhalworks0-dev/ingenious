# ingenious

A responsive React + Vite recreation of the Ingenious Life homepage, using locally stored reference images, typefaces, and styles.

## Run

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production output is in `dist/`.

## Features

- Original homepage sections, imagery, typography, and responsive styling
- Mobile navigation, ingredient tabs, information accordions, and carousels
- Product selection, quantity controls, and a shopping bag persisted in localStorage
- Review videos loaded on interaction
- Newsletter form UI

## Integration boundaries

This is a frontend recreation. Checkout displays a demo notice. Account and informational page links open the original website. Newsletter submissions show a local confirmation; they are not sent to a mailing service. Subscription selection is a UI preference; billing requires a store integration. Video media streams from the reference CDN; images and fonts are local.

`src/reference-main.html` and `src/reference-footer.html` preserve the reference section structure, rendered as React elements through html-react-parser. `src/main.jsx` implements interactive components. `src/reference.css` preserves reference styles; `src/app.css` contains React component styling and compatibility fixes.

Validated in Chrome at 1440px desktop and 390px mobile widths, including product selection, add to bag, ingredient tabs, and absence of browser errors or horizontal overflow.

## Reference interaction updates

- Signup offer opens after six seconds, using the original product artwork. Closing it suppresses it for the current browser session. Email validation and a local confirmation are included; no mailing provider is connected.
- Clinical result numbers and circular rings animate together from zero over two seconds when they enter the viewport. They run once per page load and respect reduced motion preferences.
- The hamburger opens the full navigation with product thumbnails, Learn and Account links, and the rewards photograph. It supports desktop and mobile, product selection, and Escape to close.

