/* ========================================
   ArcticCool HVAC — Animations JS
   Scroll Reveal | Counters | Hero Slider | Parallax | Particles
   ======================================== */

'use strict';

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-zoom, .stagger'
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── Animated Counters ── */
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
  const start = performance.now();
  const startNum = 0;

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.count);
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        const duration = parseInt(entry.target.dataset.duration || '2000');
        animateCounter(entry.target, target, duration, prefix, suffix);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Hero Slider ── */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const track = slider.querySelector('.slides-track');
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!slides.length) return;

  let current = 0;
  let autoplay;
  let isTransitioning = false;

  function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current]?.classList.add('active');

    if (track) track.style.transform = `translateX(-${current * 100}%)`;

    setTimeout(() => { isTransitioning = false; }, 800);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    autoplay = setInterval(next, 5500);
  }

  function stopAutoplay() { clearInterval(autoplay); }

  // Init
  slides[0].classList.add('active');
  dots[0]?.classList.add('active');
  startAutoplay();

  // Controls
  prevBtn?.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  // Touch / swipe
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      diff > 0 ? next() : prev();
      startAutoplay();
    }
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
}

/* ── Progress Bars ── */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close siblings in same group
      const group = item.closest('.faq-list, .faq-group');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) openItem.classList.remove('open');
        });
      }

      item.classList.toggle('open', !isOpen);
    });

    // Keyboard
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/* ── Particles / Snow ── */
function initParticles(containerId = 'particles') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * -20}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(particle);
  }
}

/* ── Tilt Effect ── */
function initTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Parallax ── */
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

/* ── Typing Effect ── */
function initTyping() {
  document.querySelectorAll('[data-typing]').forEach(el => {
    const words = el.dataset.typing.split('|');
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const word = words[wordIndex];
      if (!deleting) {
        el.textContent = word.slice(0, ++charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        el.textContent = word.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 100);
    }

    type();
  });
}

/* ── Testimonial Carousel ── */
function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonial-track');
  const items = carousel.querySelectorAll('.testimonial-card');
  const dots = carousel.querySelectorAll('.carousel-dot');
  let current = 0;
  let autoplay;

  function goTo(index) {
    current = (index + items.length) % items.length;
    const perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    if (track) track.style.transform = `translateX(-${current * (100 / perView)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function start() { autoplay = setInterval(() => goTo(current + 1), 4000); }
  function stop() { clearInterval(autoplay); }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { stop(); goTo(i); start(); }));
  start();

  // Swipe
  let sx = 0;
  carousel.addEventListener('touchstart', e => { sx = e.touches[0].clientX; stop(); }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    start();
  });
}

/* ── Init All ── */
function initAnimations() {
  initScrollReveal();
  initCounters();
  initHeroSlider();
  initProgressBars();
  initFAQ();
  initTilt();
  initParallax();
  initTyping();
  initTestimonialCarousel();
  initParticles('particles');
}

document.addEventListener('DOMContentLoaded', initAnimations);
