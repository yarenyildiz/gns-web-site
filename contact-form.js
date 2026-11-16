import { t, onLanguageChange } from './i18n.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field labels in the outgoing email stay in Turkish: the recipient is the agency.
const MAIL_FIELDS = [
  ['name', 'Ad Soyad'],
  ['email', 'E-posta'],
  ['company', 'Firma / Gemi'],
  ['phone', 'Telefon'],
  ['service', 'Hizmet'],
  ['eta', 'ETA / Liman'],
];

function isFieldValid(field) {
  const value = field.value.trim();
  if (field.required && !value) return false;
  if (field.type === 'email' && value) return EMAIL_PATTERN.test(value);
  return true;
}

function buildMailto(recipient, form) {
  const data = new FormData(form);
  const value = (name) => String(data.get(name) ?? '').trim();

  const serviceSelect = form.elements.namedItem('service');
  const serviceLabel = serviceSelect?.value ? serviceSelect.selectedOptions[0].textContent.trim() : '';

  const subject = `Web Talebi: ${serviceLabel || 'Genel'} — ${value('company') || value('name')}`;
  const lines = MAIL_FIELDS.map(([name, label]) => `${label}: ${name === 'service' ? serviceLabel : value(name)}`);
  const body = [...lines, '', value('message')].join('\n');

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The site is static, so submission hands off to the visitor's mail client.
 * Swap `buildMailto` for a fetch() to a form endpoint when a backend exists.
 */
export function initContactForm(form = document.querySelector('[data-contact-form]')) {
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const recipient = form.dataset.recipient;
  const fields = [...form.querySelectorAll('input, select, textarea')];

  const setStatus = (state, key) => {
    if (!status) return;
    status.dataset.state = state ?? '';
    status.textContent = key ? t(key) : '';
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && isFieldValid(field)) {
        field.removeAttribute('aria-invalid');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = fields.filter((field) => !isFieldValid(field));
    fields.forEach((field) => {
      if (invalid.includes(field)) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    });

    if (invalid.length) {
      setStatus('error', 'form.error');
      invalid[0].focus();
      return;
    }

    window.location.href = buildMailto(recipient, form);
    setStatus('success', 'form.success');
  });

  onLanguageChange(() => setStatus(null, null));
}
