import { t, onLanguageChange } from './i18n.js';

const SCROLL_THRESHOLD = 40;
const DESKTOP_QUERY = window.matchMedia('(min-width: 901px)');

export function initHeader() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const burger = document.querySelector('[data-burger]');
  if (!header || !nav || !burger) return;

  const updateShadow = () => header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  window.addEventListener('scroll', updateShadow, { passive: true });
  updateShadow();

  const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

  const syncBurgerLabel = () => burger.setAttribute('aria-label', t(isOpen() ? 'nav.close' : 'nav.open'));

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    syncBurgerLabel();
  };

  burger.addEventListener('click', () => setOpen(!isOpen()));

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  });

  DESKTOP_QUERY.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  onLanguageChange(syncBurgerLabel);
  syncBurgerLabel();
}
