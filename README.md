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

## More components

More coming soon — star this repo to follow along.

Built in public at [ryyansafar.site](https://ryyansafar.site).
