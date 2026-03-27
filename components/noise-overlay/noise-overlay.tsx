'use client';
import { useEffect, useRef } from 'react';

type BlendMode =
  | 'overlay'
  | 'screen'
  | 'soft-light'
  | 'multiply'
  | 'normal'
  | 'color-dodge'
  | 'color-burn';

interface NoiseOverlayProps {
  /** Canvas opacity — 0 to 1. Default: 0.12 */
  opacity?: number;
  /** Pixel block size — 1 = per-pixel, 2 = 2×2 blocks. Default: 1 */
  grain?: number;
  /** Refresh every N frames — 1 = every frame, 2 = slower flicker. Default: 1 */
  speed?: number;
  /** CSS mix-blend-mode. Default: 'overlay' */
  blend?: BlendMode;
  /** CSS z-index. Default: 9998 */
  zIndex?: number;
}

export default function NoiseOverlay({
  opacity = 0.12,
  grain   = 1,
  speed   = 1,
  blend   = 'overlay',
  zIndex  = 9998,
}: NoiseOverlayProps) {
  const mainRef  = useRef<HTMLCanvasElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const mctx = main.getContext('2d');
    if (!mctx) return;
    mctx.imageSmoothingEnabled = false;

    const small = document.createElement('canvas');
    const sctx  = small.getContext('2d');
    if (!sctx) return;

    let mw = 0, mh = 0, img: ImageData | null = null, frame = 0;

    function resize() {
      mw = main.width  = window.innerWidth;
      mh = main.height = window.innerHeight;
      small.width  = Math.ceil(mw / grain);
      small.height = Math.ceil(mh / grain);
      img = sctx.createImageData(small.width, small.height);
    }

    function tick() {
      frame++;
      if (frame % speed === 0 && img) {
        const d = img.data;
        let i = d.length;
        while (i > 0) {
          const v = (Math.random() * 256) | 0;
          d[--i] = 255;
          d[--i] = v;
          d[--i] = v;
          d[--i] = v;
        }
        sctx.putImageData(img, 0, 0);
        mctx.clearRect(0, 0, mw, mh);
        mctx.drawImage(small, 0, 0, mw, mh);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [grain, speed]);

  return (
    <canvas
      ref={mainRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        opacity,
        mixBlendMode: blend,
      }}
    />
  );
}
