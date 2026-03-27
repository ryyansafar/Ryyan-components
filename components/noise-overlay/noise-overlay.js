// noise-overlay.js — drop into any project, zero dependencies
(function () {
  const OPACITY = 0.12;       // canvas opacity 0–1
  const GRAIN   = 1;          // pixel block size (1 = per-px, 2 = 2×2 blocks, etc.)
  const SPEED   = 1;          // refresh every N frames (1 = every frame, 2 = slower flicker)
  const BLEND   = 'overlay';  // CSS mix-blend-mode: overlay | screen | soft-light | multiply

  const main = document.createElement('canvas');
  main.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9998;' +
    'opacity:' + OPACITY + ';mix-blend-mode:' + BLEND + ';';
  document.body.appendChild(main);

  const mctx = main.getContext('2d');
  if (!mctx) return;
  mctx.imageSmoothingEnabled = false;

  // Low-res noise canvas — scaled up to full size for grain effect
  const small = document.createElement('canvas');
  const sctx  = small.getContext('2d');
  if (!sctx) return;

  let mw = 0, mh = 0, img = null, frame = 0;

  function resize() {
    mw = main.width  = window.innerWidth;
    mh = main.height = window.innerHeight;
    small.width  = Math.ceil(mw / GRAIN);
    small.height = Math.ceil(mh / GRAIN);
    img = sctx.createImageData(small.width, small.height);
  }

  function tick() {
    frame++;
    if (frame % SPEED === 0 && img) {
      // Fill imageData with random grayscale — backward loop is faster
      const d = img.data;
      let i = d.length;
      while (i > 0) {
        const v = (Math.random() * 256) | 0;
        d[--i] = 255;   // alpha
        d[--i] = v;     // blue
        d[--i] = v;     // green
        d[--i] = v;     // red
      }
      sctx.putImageData(img, 0, 0);
      mctx.clearRect(0, 0, mw, mh);
      // drawImage scales the small noise canvas up to full viewport
      mctx.drawImage(small, 0, 0, mw, mh);
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(tick);
})();
