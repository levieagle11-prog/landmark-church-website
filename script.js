/*
  LANDMARK BAPTIST CHURCH — MASTER SCRIPT
  Features: Lenis smooth scroll · GSAP hero animations · scroll reveals
            hamburger nav · accordion · contact form
*/

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. LENIS SMOOTH SCROLLING ─────────────────────────────────
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // ── 2. HEADER SCROLL STATE ────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 3. HAMBURGER NAV ──────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── 4. SCROLL REVEALS (.sr) ───────────────────────────────────
  const srEls = document.querySelectorAll('.sr');
  if (srEls.length) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      srEls.forEach(el => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        });
      });
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      srEls.forEach(el => io.observe(el));
    }
  }

  // ── 5. HERO ENTRANCE ANIMATION ────────────────────────────────
  if (typeof gsap !== 'undefined') {
    if (document.querySelector('.hero__title')) {
      gsap.from('.hero__title',    { opacity: 0, y: 55, duration: 1.4, ease: 'power4.out', delay: 0.3 });
      gsap.from('.hero__subtitle', { opacity: 0, y: 35, duration: 1.2, ease: 'power3.out', delay: 0.55 });
      gsap.from('.hero__card',     { opacity: 0, y: 40, duration: 1.1, ease: 'back.out(1.5)', delay: 0.8 });
      gsap.from('.hero__scroll',   { opacity: 0, duration: 1, delay: 1.6 });
    }
    if (document.querySelector('.page-hero__title')) {
      gsap.from('.page-hero__eyebrow', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', delay: 0.2 });
      gsap.from('.page-hero__title',   { opacity: 0, y: 40, duration: 1.1, ease: 'power4.out', delay: 0.4 });
      gsap.from('.page-hero__sub',     { opacity: 0, y: 25, duration: 1.0, ease: 'power3.out', delay: 0.6 });
      gsap.from('.page-hero__pills .pill', {
        opacity: 0, y: 15, stagger: 0.1, duration: 0.7, ease: 'back.out(1.7)', delay: 0.8,
      });
    }
    if (document.querySelector('.mem-hero__title')) {
      gsap.from('.mem-hero__eyebrow', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', delay: 0.2 });
      gsap.from('.mem-hero__title',   { opacity: 0, y: 40, duration: 1.1, ease: 'power4.out', delay: 0.4 });
      gsap.from('.mem-hero__sub',     { opacity: 0, y: 25, duration: 1.0, ease: 'power3.out', delay: 0.6 });
    }
  }

  // ── 6. ACCORDION ──────────────────────────────────────────────
  document.querySelectorAll('.accordion__header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.accordion__item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion__item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── 7. CONTACT FORM ───────────────────────────────────────────
  const form       = document.getElementById('contact-form');
  const formWrap   = document.getElementById('form-wrap');
  const successMsg = document.getElementById('form-success');

  if (form) {
    const textarea = form.querySelector('textarea');
    const counter  = form.querySelector('.fld__counter');
    if (textarea && counter) {
      textarea.addEventListener('input', () => {
        counter.textContent = `${textarea.value.length} / 1000`;
      });
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.con-form__submit');
      btn.classList.add('loading');
      btn.disabled = true;
      setTimeout(() => {
        if (formWrap)   formWrap.style.display = 'none';
        if (successMsg) successMsg.removeAttribute('hidden');
      }, 1500);
    });
  }

  // ── 8. COFFEE NAV SCROLL STATE ────────────────────────────────
  const ccNav = document.querySelector('.cc-nav');
  if (ccNav) {
    window.addEventListener('scroll', () => {
      ccNav.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });
  }

});
