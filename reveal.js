const STAGGER_S = 0.1;
const STAGGER_GROUP = 3;

export function initReveal(selector = '[data-reveal]') {
  const elements = [...document.querySelectorAll(selector)];
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );

  elements.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${(i % STAGGER_GROUP) * STAGGER_S}s`);
    observer.observe(el);
  });
}
