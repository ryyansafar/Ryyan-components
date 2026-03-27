'use client';
// cursor-spring.tsx — React / Next.js component
// github.com/ryyansafar/Ryyan-components
//
// Zero runtime dependencies beyond React.
// Drop into any React project — see README for usage.

import { useEffect, useRef } from 'react';

interface SpringCursorProps {
  /** Position spring stiffness. Higher = snappier follow. Default: 240 */
  posStiff?: number;
  /** Position spring damping. Lower = more bounce. Default: 27 */
  posDamp?: number;
  /** Scale spring stiffness (click/hover snap). Default: 330 */
  sclStiff?: number;
  /** Scale spring damping. Default: 30 */
  sclDamp?: number;
  /** Blur intensity when hovering buttons/links. 0 = off. Default: 1.2 */
  hoverBlur?: number;
}

export default function SpringCursor({
  posStiff  = 240,
  posDamp   = 27,
  sclStiff  = 330,
  sclDamp   = 30,
  hoverBlur = 1.2,
}: SpringCursorProps) {
  const elRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Only activate on fine-pointer devices
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    // Hide native cursor
    const style = document.createElement('style');
    style.textContent = '@media(hover:hover)and(pointer:fine){html,body,body *{cursor:none!important}}';
    document.head.appendChild(style);

    const HB_MAX   = hoverBlur;
    const HB_STIFF = 180;
    const HB_DAMP  = 22;

    let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0;
    let sc = 1, st = 1, sv = 0;
    let hbc = 0, hbt = 0, hbv = 0;
    let lt = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (el.style.display === 'none') { x = e.clientX; y = e.clientY; }
      el.style.display = 'block';
      mx = e.clientX; my = e.clientY;
    };
    const onTouch  = () => { el.style.display = 'none'; };
    const onDown   = () => { st = 0.65; };
    const onUp     = () => { st = 1; };
    const onOver   = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) { st = 1.3; hbt = HB_MAX; }
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest('a, button')) { st = 1; hbt = 0; }
    };

    window.addEventListener('pointermove', onMove, { capture: true, passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointerup', onUp, { capture: true, passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    const tick = () => {
      const now = performance.now();
      const dt  = Math.min((now - lt) / 1000, 0.033);
      lt = now;

      vx += ((mx - x) * posStiff - vx * posDamp) * dt;
      vy += ((my - y) * posStiff - vy * posDamp) * dt;
      x  += vx * dt; y += vy * dt;

      sv += ((st - sc) * sclStiff - sv * sclDamp) * dt;
      sc += sv * dt;

      hbv += ((hbt - hbc) * HB_STIFF - hbv * HB_DAMP) * dt;
      hbc += hbv * dt;
      if (hbc < 0) hbc = 0;

      el.style.transform = `translate(${x}px,${y}px) scale(${sc})`;

      const speed = Math.sqrt(vx * vx + vy * vy);
      const blurEl = el.querySelector<SVGFEGaussianBlurElement>('#cur-blur');
      if (blurEl) {
        const motionAmt = speed > 20 ? Math.min(speed * 0.005, 2.8) : 0;
        const angle     = motionAmt > 0 ? Math.atan2(vy, vx) : 0;
        const bx        = Math.abs(Math.cos(angle)) * motionAmt + hbc;
        const by        = Math.abs(Math.sin(angle)) * motionAmt + hbc;
        blurEl.setAttribute('stdDeviation',
          bx > 0.05 || by > 0.05 ? `${bx.toFixed(2)} ${by.toFixed(2)}` : '0 0');
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchstart', onTouch);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.head.removeChild(style);
    };
  }, [posStiff, posDamp, sclStiff, sclDamp, hoverBlur]);

  return (
    <div
      ref={elRef}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, willChange: 'transform', transformOrigin: '0 0', display: 'none' }}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" overflow="visible" fill="none">
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
            fill="white" stroke="rgba(0,0,0,0.55)" strokeWidth={1} strokeLinejoin="round"/>
        </g>
      </svg>
    </div>
  );
}
