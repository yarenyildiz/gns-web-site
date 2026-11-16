import en from '../locales/en.js';
import tr from '../locales/tr.js';

/**
 * Lightweight, dependency-free i18n.
 *
 * The HTML is authored in the default language (Turkish). Elements opt in with:
 *   data-i18n="key"                      -> translates textContent
 *   data-i18n-attr="attr:key; attr:key"  -> translates attributes
 * The authored markup is snapshotted on init and used as the default-language
 * source, so the Turkish dictionary only needs strings that exist in JS alone.
 */

const STORAGE_KEY = 'gns:lang';
const QUERY_PARAM = 'lang';
const DEFAULT_LANG = 'tr';
const dictionaries = { tr, en };

let currentLang = DEFAULT_LANG;
let textBindings = [];
let attrBindings = [];
const listeners = new Set();

const storage = {
  get() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  },
  set(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage unavailable (private mode) */ }
  },
};

const isSupported = (lang) => Object.hasOwn(dictionaries, lang);

function collectBindings(root) {
  textBindings = [...root.querySelectorAll('[data-i18n]')].map((el) => ({
    el,
    key: el.dataset.i18n,
    fallback: el.textContent.trim(),
  }));

  attrBindings = [...root.querySelectorAll('[data-i18n-attr]')].flatMap((el) =>
    el.dataset.i18nAttr.split(';').map((pair) => {
      const [attr, key] = pair.split(':').map((part) => part.trim());
      return { el, attr, key, fallback: el.getAttribute(attr) ?? '' };
    }),
  );
}

function lookup(key, fallback) {
  if (currentLang === DEFAULT_LANG) return fallback;
  const value = dictionaries[currentLang][key];
  if (value === undefined) {
    console.warn(`[i18n] Missing "${currentLang}" translation for "${key}"`);
    return fallback;
  }
  return value;
}

function render() {
  for (const { el, key, fallback } of textBindings) el.textContent = lookup(key, fallback);
  for (const { el, attr, key, fallback } of attrBindings) el.setAttribute(attr, lookup(key, fallback));
  document.documentElement.lang = currentLang;
}

function syncSwitcher() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function syncUrl() {
  const url = new URL(window.location.href);
  if (currentLang === DEFAULT_LANG) url.searchParams.delete(QUERY_PARAM);
  else url.searchParams.set(QUERY_PARAM, currentLang);
  window.history.replaceState(window.history.state, '', url);
}

/** Translate a runtime-only string (e.g. form feedback). */
export function t(key) {
  return dictionaries[currentLang][key] ?? dictionaries[DEFAULT_LANG][key] ?? key;
}

export function getLanguage() {
  return currentLang;
}

export function onLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLanguage(lang) {
  const next = isSupported(lang) ? lang : DEFAULT_LANG;
  const changed = next !== currentLang;
  currentLang = next;

  render();
  syncSwitcher();
  syncUrl();
  storage.set(currentLang);

  if (changed) listeners.forEach((listener) => listener(currentLang));
}

export function initI18n(root = document) {
  collectBindings(root);

  root.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  const requested = new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? storage.get();
  setLanguage(requested ?? DEFAULT_LANG);
}
