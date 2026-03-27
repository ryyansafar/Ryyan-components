// cursor-spring.js — spring-physics macOS cursor, zero dependencies
// github.com/ryyansafar/Ryyan-components
(function () {
  // Only run on pointer-fine devices (hides on touch automatically)
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  // ─── Cursor element ───────────────────────────────────────────────
  const el = document.createElement('div');
  el.id = 'spring-cursor';
  el.style.cssText =
    'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;' +
    'will-change:transform;transform-origin:0 0;display:none;';

  el.innerHTML = `<svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
    <defs>
      <filter id="cur-mb" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur id="cur-blur" stdDeviation="0 0" in="SourceGraphic" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cur-mb)">
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="rgba(0,0,0,0.45)" transform="translate(1.5,1.5)"/>
      <path d="M2 2 L2 26 L7.5 20.5 L12.5 29 L15.2 27.5 L10.2 19 L18 19 Z"
        fill="white" stroke="rgba(0,0,0,0.55)" stroke-width="1" stroke-linejoin="round"/>
    </g>
  </svg>`;

  document.body.appendChild(el);

  // ─── Hide native cursor ───────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = '@media(hover:hover)and(pointer:fine){html,body,body *{cursor:none!important}}';
  document.head.appendChild(style);

  // ─── Physics constants (tweak these) ─────────────────────────────
  const PS      = 240;  // position stiffness  — lower = more lag
  const PD      = 27;   // position damping    — lower = bouncier
  const SS      = 330;  // scale stiffness     — click snap speed
  const SD      = 30;   // scale damping       — click snap smooth
  const HB_MAX  = 1.2;  // hover blur max      — blur on buttons/links
  const HB_STIFF = 180;
  const HB_DAMP  = 22;

  // ─── State ───────────────────────────────────────────────────────
  let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0;
  let sc = 1, st = 1, sv = 0;
  let hbc = 0, hbt = 0, hbv = 0;
  let lt = performance.now();

  // ─── Events ──────────────────────────────────────────────────────
  window.addEventListener('pointermove', e => {
    if (el.style.display === 'none') { x = e.clientX; y = e.clientY; }
    el.style.display = 'block';
    mx = e.clientX; my = e.clientY;
  }, { capture: true, passive: true });

  window.addEventListener('touchstart', () => el.style.display = 'none', { passive: true });

  document.addEventListener('pointerdown', () => st = 0.65, { capture: true, passive: true });
  document.addEventListener('pointerup',   () => st = 1,    { capture: true, passive: true });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) { st = 1.3; hbt = HB_MAX; }
  });
  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget?.closest('a, button')) { st = 1; hbt = 0; }
  });

  // ─── Animation loop ──────────────────────────────────────────────
  (function tick() {
    const now = performance.now();
    const dt  = Math.min((now - lt) / 1000, 0.033);
    lt = now;

    // Position spring
    vx += ((mx - x) * PS - vx * PD) * dt;
    vy += ((my - y) * PS - vy * PD) * dt;
    x  += vx * dt;
    y  += vy * dt;

    // Scale spring (hover 1.3×, click 0.65×)
    sv += ((st - sc) * SS - sv * SD) * dt;
    sc += sv * dt;

    // Hover blur spring
    hbv += ((hbt - hbc) * HB_STIFF - hbv * HB_DAMP) * dt;
    hbc += hbv * dt;
    if (hbc < 0) hbc = 0;

    el.style.transform = `translate(${x}px,${y}px) scale(${sc})`;

    // Directional motion blur + hover blur
    const speed     = Math.sqrt(vx * vx + vy * vy);
    const blurEl    = el.querySelector('#cur-blur');
    if (blurEl) {
      const motionAmt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
      const angle     = motionAmt > 0 ? Math.atan2(vy, vx) : 0;
      const bx        = Math.abs(Math.cos(angle)) * motionAmt + hbc;
      const by        = Math.abs(Math.sin(angle)) * motionAmt + hbc;
      blurEl.setAttribute('stdDeviation',
        bx > 0.05 || by > 0.05 ? `${bx.toFixed(2)} ${by.toFixed(2)}` : '0 0');
    }

    requestAnimationFrame(tick);
  })();
})();
