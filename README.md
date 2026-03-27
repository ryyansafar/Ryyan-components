# Ryyan Components

Drop-in UI primitives. Copy-paste ready. Zero dependencies. Built by [Ryyan Safar](https://ryyansafar.site).

Live demos + docs → **[ryyansafar.site/design/components](https://ryyansafar.site/design/components)**

---

## cursor-spring

A spring-physics macOS arrow cursor with velocity-based directional motion blur. Grows on hover, shrinks on click. Auto-hides on touch devices.

**Features**
- Spring physics — smooth, natural follow with configurable stiffness/damping
- Directional motion blur — blur follows velocity direction
- Hover blur — soft glow when over buttons and links
- Scale on interaction — 1.3× on hover, 0.65× on click
- Touch-safe — auto-hides when touch is detected
- Zero dependencies — plain JS or React, nothing else needed

---

### Vanilla JS (any project)

Copy `cursor-spring.js` into your project and drop this before `</body>`:

```html
<script src="cursor-spring.js"></script>
```

Or inline the entire file — no build step needed.

---

### Next.js (App Router)

Copy `cursor-spring.js` → `/public/spring-cursor.js`, then in `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/spring-cursor.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

---

### React Component

Copy `cursor-spring.tsx` into your components folder and render it once at the root:

```tsx
// app/layout.tsx or _app.tsx
import SpringCursor from '@/components/cursor-spring';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <SpringCursor />
    </>
  );
}
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `posStiff` | `number` | `240` | Position spring stiffness. Higher = snappier. |
| `posDamp` | `number` | `27` | Position damping. Lower = more bounce. |
| `sclStiff` | `number` | `330` | Scale spring stiffness (click/hover snap). |
| `sclDamp` | `number` | `30` | Scale spring damping. |
| `hoverBlur` | `number` | `1.2` | Blur amount on buttons/links. `0` to disable. |

**Presets**

```tsx
<SpringCursor posStiff={80}  posDamp={12} /> {/* Floaty  */}
<SpringCursor posStiff={240} posDamp={27} /> {/* Default */}
<SpringCursor posStiff={500} posDamp={45} /> {/* Snappy  */}
```

---

### Physics constants (vanilla JS)

Edit these at the top of `cursor-spring.js`:

```js
const PS      = 240;  // position stiffness  — lower = more lag
const PD      = 27;   // position damping    — lower = bouncier
const SS      = 330;  // scale stiffness     — click snap speed
const SD      = 30;   // scale damping       — click snap smooth
const HB_MAX  = 1.2;  // hover blur max      — blur on buttons/links
```

---

---

## noise-overlay

Film-grain noise rendered on a `<canvas>` element fixed over the entire page. Adds tactile, cinematic texture to any UI. Configurable opacity, grain size, animation speed, and CSS blend mode. Zero dependencies.

**Features**
- Canvas API — zero dependencies, no SVG, no CSS hacks
- Two-canvas technique — low-res noise scaled up for chunky grain
- Configurable blend mode — `overlay`, `screen`, `soft-light`, `multiply`
- Speed control — refresh every N frames for slower, flickery grain
- Touch-safe — `pointer-events: none` so it never blocks interaction

---

### Vanilla JS (any project)

Copy `noise-overlay.js` into your project and drop this before `</body>`:

```html
<script src="noise-overlay.js"></script>
```

Edit the four constants at the top of the file to customise:

```js
const OPACITY = 0.12;       // canvas opacity 0–1
const GRAIN   = 1;          // pixel block size (1 = per-px, 2 = 2×2, etc.)
const SPEED   = 1;          // refresh every N frames
const BLEND   = 'overlay';  // CSS mix-blend-mode
```

---

### Next.js (App Router)

Copy `noise-overlay.js` → `/public/noise-overlay.js`, then in `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/noise-overlay.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

---

### React Component

Copy `noise-overlay.tsx` into your components folder and render it once at the root:

```tsx
import NoiseOverlay from '@/components/noise-overlay';

export default function App() {
  return (
    <>
      <YourContent />
      <NoiseOverlay opacity={0.12} grain={1} speed={1} blend="overlay" />
    </>
  );
}
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opacity` | `number` | `0.12` | Canvas opacity, 0–1. |
| `grain` | `number` | `1` | Pixel block size. 1 = finest, 8 = chunky. |
| `speed` | `number` | `1` | Refresh every N frames. 1 = every frame. |
| `blend` | `string` | `'overlay'` | CSS `mix-blend-mode`. |
| `zIndex` | `number` | `9998` | CSS `z-index`. |

**Blend mode guide**

| Mode | Effect |
|------|--------|
| `overlay` | Classic film grain — most natural |
| `screen` | Light, airy texture |
| `multiply` | Dark, grungy feel |
| `soft-light` | Subtle, gentle grain |

---

## More components

More coming soon — star this repo to follow along.

Built in public at [ryyansafar.site](https://ryyansafar.site).
