import { initI18n } from './modules/i18n.js';
import { initHeader } from './modules/header.js';
import { initHeroSlider } from './modules/hero-slider.js';
import { initReveal } from './modules/reveal.js';
import { initScrollSpy } from './modules/scroll-spy.js';
import { initContactForm } from './modules/contact-form.js';

initI18n();
initHeader();
initHeroSlider();
initReveal();
initScrollSpy();
initContactForm();

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
