/* ========================================
   ArcticCool HVAC — Core JS
   Theme | RTL | Navbar | Back-to-Top | Toast | Loader
   ======================================== */

'use strict';

/* ── Preferences from LocalStorage ── */
const Prefs = {
  get theme() { return localStorage.getItem('ac_theme') || 'light'; },
  set theme(v){ localStorage.setItem('ac_theme', v); },
  get dir()   { return localStorage.getItem('ac_dir') || 'ltr'; },
  set dir(v)  { localStorage.setItem('ac_dir', v); },
};

/* ── Theme Toggle ── */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function toggleTheme() {
  const next = Prefs.theme === 'dark' ? 'light' : 'dark';
  Prefs.theme = next;
  applyTheme(next);
}

/* ── RTL Toggle ── */
function applyDir(dir) {
  document.documentElement.dir = dir;
  document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  });
}

function toggleDir() {
  const next = Prefs.dir === 'rtl' ? 'ltr' : 'rtl';
  Prefs.dir = next;
  applyDir(next);
}

/* ── Navbar ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const burger = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (!navbar) return;

  // Scroll handler
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (burger && mobileNav) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a:not([data-sub])').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Mobile sub-menus
    mobileNav.querySelectorAll('.nav-mobile-link[data-sub]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const sub = document.getElementById(link.dataset.sub);
        if (sub) sub.classList.toggle('open');
        const chevron = link.querySelector('.chevron');
        if (chevron) chevron.style.transform = sub?.classList.contains('open') ? 'rotate(180deg)' : '';
      });
    });
  }

  // Theme & RTL toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.addEventListener('click', toggleDir);
  });

  // Profile menu
  document.querySelectorAll('.profile-wrap').forEach(wrap => {
    const toggle = wrap.querySelector('.profile-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', wrap.classList.contains('open'));
    });
    wrap.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => wrap.classList.remove('open'));
    });
  });

  // Active link
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Toast Notifications ── */
const ToastManager = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    const icons = { info: '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>', success: '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', error: '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>', warning: '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span>${icons[type] || '<svg class="ac-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'}</span><span>${message}</span>`;
    this.container.appendChild(toast);
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

/* ── Page Loader ── */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
}

/* ── Smooth page transitions ── */
function initPageLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', e => {
      // Allow normal navigation; future: could add transition overlay
    });
  });
}

/* ── Mobile Menu Close on Outside Click ── */
function initOutsideClick() {
  document.addEventListener('click', e => {
    const burger = document.querySelector('.nav-burger');
    const mobileNav = document.querySelector('.nav-mobile');
    if (!burger || !mobileNav) return;
    if (burger.classList.contains('open') && !burger.contains(e.target) && !mobileNav.contains(e.target)) {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    document.querySelectorAll('.profile-wrap.open').forEach(wrap => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        wrap.querySelector('.profile-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ── Keyboard navigation ── */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // Close modals, menus
      document.querySelector('.nav-burger.open')?.click();
      document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
    }
  });
}

/* ── Modal ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('[data-close-modal]')?.addEventListener('click', () => closeModal(id));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(id); });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Lazy Images ── */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  images.forEach(img => observer.observe(img));
}

/* ── Form Validation ── */
function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');
  const minLength = input.getAttribute('minlength');
  let error = '';

  if (required && !value) {
    error = 'This field is required.';
  } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = 'Please enter a valid email address.';
  } else if (type === 'tel' && value && !/^[\d\s\+\-\(\)]{7,15}$/.test(value)) {
    error = 'Please enter a valid phone number.';
  } else if (minLength && value.length < parseInt(minLength)) {
    error = `Must be at least ${minLength} characters.`;
  }

  const errorEl = input.parentElement.querySelector('.form-error');
  input.classList.toggle('error', !!error);
  if (errorEl) errorEl.textContent = error;
  return !error;
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
    if (!validateField(input)) valid = false;
  });
  return valid;
}

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = btn.dataset.label || 'Submit';
            ToastManager.show('Message sent successfully!', 'success');
            form.reset();
          }, 1800);
        }
      }
    });
  });
}

/* ── Init All ── */
function initCore() {
  applyTheme(Prefs.theme);
  applyDir(Prefs.dir);
  initNavbar();
  initBackToTop();
  initLoader();
  initPageLinks();
  initOutsideClick();
  initKeyboard();
  initLazyImages();
  initForms();
  ToastManager.init();
}

document.addEventListener('DOMContentLoaded', initCore);

// Expose globals
window.ArcticCool = { ToastManager, openModal, closeModal, toggleTheme, toggleDir };
