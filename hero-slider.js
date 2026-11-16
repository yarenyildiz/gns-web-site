const INTERVAL_MS = 6500;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initHeroSlider(root = document.querySelector('[data-slider]')) {
  if (!root) return;

  const backgrounds = [...root.querySelectorAll('[data-slide]')];
  const texts = [...root.querySelectorAll('[data-slide-text]')];
  const controls = [...root.querySelectorAll('[data-slide-to]')];
  const count = backgrounds.length;
  if (count < 2) return;

  let index = 0;
  let timer = null;

  const show = (next) => {
    index = (next + count) % count;

    backgrounds.forEach((el, i) => el.classList.toggle('is-active', i === index));
    texts.forEach((el, i) => {
      const active = i === index;
      el.classList.toggle('is-active', active);
      if (active) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    controls.forEach((el, i) => {
      const active = i === index;
      el.classList.toggle('is-active', active);
      if (active) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (REDUCED_MOTION.matches || document.hidden) return;
    timer = window.setInterval(() => show(index + 1), INTERVAL_MS);
  };

  controls.forEach((button) => {
    button.addEventListener('click', () => {
      show(Number(button.dataset.slideTo));
      start();
    });
  });

  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', start);
  REDUCED_MOTION.addEventListener('change', start);

  start();
}
