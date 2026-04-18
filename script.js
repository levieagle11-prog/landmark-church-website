/* ============================================================
   LANDMARK BAPTIST CHURCH — MASTER SCRIPT  v2
   script.js  |  Used by: index · connect · ministries · members · contact
   NOT used by selah.html (has its own isolated inline JS)
   ============================================================ */

/* ── GSAP ─────────────────────────────────────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── LENIS SMOOTH SCROLL ──────────────────────────────────── */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true, smoothTouch: false,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
}

/* ── PAGE DETECTION ───────────────────────────────────────── */
const PAGE = {
  isHome:       !!document.querySelector('.hero__title'),
  isConnect:    !!document.querySelector('.connect-section'),
  isMinistries: !!document.querySelector('.min-section'),
  isMembers:    !!document.querySelector('.mem-hero'),
  isContact:    !!document.querySelector('.con-form'),
};

/* ── UTILITY ──────────────────────────────────────────────── */
/* Returns array of elements, optionally excluding .sr class */
function qsa(sel, excludeSr = false) {
  const els = [...document.querySelectorAll(sel)];
  return excludeSr ? els.filter(el => !el.classList.contains('sr')) : els;
}

/* ── 1. NAVIGATION ────────────────────────────────────────── */
function initNav() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !header.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

/* ── 2. ANCHOR SCROLL ─────────────────────────────────────── */
function initAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -88, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── 3. SCROLL REVEAL (.sr) ───────────────────────────────── */
function initScrollReveal() {
  const els = qsa('.sr');
  if (!els.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    els.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: .82, ease: 'power3.out', clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' } }
      );
    });
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }
}

/* ── 4. HERO ENTRANCE ─────────────────────────────────────── */
function initHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  if (PAGE.isHome && document.querySelector('.hero__title')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__title',    { y: 52, opacity: 0, duration: 1.0 })
      .from('.hero__subtitle', { y: 32, opacity: 0, duration: 0.8 }, '-=0.55')
      .from('.hero__card',     { y: 40, opacity: 0, scale: 0.96, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.5')
      .from('.hero__scroll',   { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }

  if (document.querySelector('.page-hero__title')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.page-hero__eyebrow',    { y: 20, opacity: 0, duration: 0.6 })
      .from('.page-hero__title',      { y: 44, opacity: 0, duration: 0.95 }, '-=0.4')
      .from('.page-hero__sub',        { y: 26, opacity: 0, duration: 0.75 }, '-=0.52')
      .from('.pill',                  { y: 18, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.38')
      .from('.page-hero__scroll-hint',{ opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }

  if (PAGE.isMembers && document.querySelector('.mem-hero__title')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.mem-hero__greeting',    { y: -20, opacity: 0, duration: 0.5 })
      .from('.mem-hero__eyebrow',     { y: 22,  opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.mem-hero__title',       { y: 48,  opacity: 0, duration: 0.95 }, '-=0.44')
      .from('.mem-hero__sub',         { y: 26,  opacity: 0, duration: 0.75 }, '-=0.52')
      .from('.mem-hero__scroll-hint', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }
}

/* ── 5. HERO PARALLAX ─────────────────────────────────────── */
function initHeroParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  ['.hero__bg', '.page-hero__bg', '.mem-hero__bg'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.to(el, { y: 160, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: 1.4 } });
  });
}

/* ── 6. SECTION ANIMATIONS ────────────────────────────────── */
function initSectionAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* Stagger a group inside a trigger; excludes .sr elements */
  function stagger(triggerSel, itemSel, opts = {}) {
    const trigger = document.querySelector(triggerSel);
    if (!trigger) return;
    const items = [...trigger.querySelectorAll(itemSel)].filter(el => !el.classList.contains('sr'));
    if (!items.length) return;
    gsap.from(items, {
      scrollTrigger: { trigger, start: 'top 80%', toggleActions: 'play none none reverse' },
      y: 48, opacity: 0, stagger: 0.12, duration: 0.78, ease: 'power3.out', clearProps: 'transform,opacity',
      ...opts,
    });
  }

  /* Simple reveal */
  function reveal(sel, opts = {}) {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
      y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity',
      ...opts,
    });
  }

  /* ── HOME ── */
  if (PAGE.isHome) {
    const histGrid = document.querySelector('.history__grid');
    if (histGrid) {
      const content = histGrid.querySelector('.history__content');
      const stats   = histGrid.querySelector('.history__stats');
      if (content && !content.classList.contains('sr')) {
        gsap.from(content, { scrollTrigger: { trigger: histGrid, start: 'top 78%' }, x: -40, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
      if (stats) {
        const cards = [...stats.querySelectorAll('.stat-card')].filter(el => !el.classList.contains('sr'));
        if (cards.length) gsap.from(cards, { scrollTrigger: { trigger: histGrid, start: 'top 78%' }, x: 40, opacity: 0, stagger: 0.14, duration: 0.78, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
    }
    stagger('.faq__grid', '.faq-card', { stagger: 0.13 });
    stagger('.team__grid', '.team-card', { stagger: 0.14, y: 44 });
    const salvation = document.querySelector('.salvation');
    if (salvation && !salvation.classList.contains('sr')) reveal('.salvation', { y: 32 });
    stagger('.salvation__steps', '.salvation__step', { y: 28, stagger: 0.1 });
    const doctrine = document.querySelector('.doctrine');
    if (doctrine && !doctrine.classList.contains('sr')) reveal('.doctrine', { y: 30 });
    reveal('.spanish__content', { y: 32 });
    reveal('#contact-home', { y: 28 });
    qsa('.section__label').forEach(el => {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, x: -24, opacity: 0, duration: 0.6, ease: 'power3.out' });
    });
  }

  /* ── CONNECT ── */
  if (PAGE.isConnect) {
    qsa('.section__header').forEach(header => {
      const label = header.querySelector('.section__label');
      const title = header.querySelector('.section__title');
      const lead  = header.querySelector('.section__lead');
      const tl = gsap.timeline({ scrollTrigger: { trigger: header, start: 'top 80%' } });
      if (label) tl.from(label, { x: -22, opacity: 0, duration: 0.6,  ease: 'power3.out' });
      if (title) tl.from(title, { y: 28,  opacity: 0, duration: 0.75, ease: 'power3.out' }, label ? '-=0.35' : 0);
      if (lead)  tl.from(lead,  { y: 18,  opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.35');
    });
    reveal('.children__band', { y: 24, duration: 0.7 });
    stagger('.children__tiers', '.age-card', { stagger: 0.14, y: 44 });
    reveal('.children__reassurance', { y: 24, duration: 0.7 });
    const teensLayout = document.querySelector('.teens__layout');
    if (teensLayout) {
      const copy = teensLayout.querySelector('.teens__copy');
      const hl   = teensLayout.querySelector('.teens__highlights');
      if (copy) gsap.from(copy, { scrollTrigger: { trigger: teensLayout, start: 'top 78%' }, x: -36, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' });
      if (hl) {
        const cards = [...hl.querySelectorAll('.teen-highlight-card')];
        gsap.from(cards, { scrollTrigger: { trigger: teensLayout, start: 'top 78%' }, x: 36, opacity: 0, stagger: 0.14, duration: 0.78, ease: 'power3.out', clearProps: 'transform,opacity' });
      }
    }
    const ctxCallout = document.querySelector('.teens__ctx-callout');
    if (ctxCallout) {
      gsap.timeline({ scrollTrigger: { trigger: ctxCallout, start: 'top 82%' } })
        .from(ctxCallout.querySelector('.teens__ctx-callout-text'), { x: -30, opacity: 0, duration: 0.75, ease: 'power3.out' })
        .from(ctxCallout.querySelector('.btn'), { x: 30, opacity: 0, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.4');
    }
    const bentoGrid = document.querySelector('.bento');
    if (bentoGrid) {
      gsap.from([...bentoGrid.querySelectorAll('.bento__card')], {
        scrollTrigger: { trigger: bentoGrid, start: 'top 78%' },
        y: 52, opacity: 0, scale: 0.97, stagger: { amount: 0.5, grid: 'auto', from: 'start' },
        duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity',
      });
    }
    qsa('.section__label').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, x: -22, opacity: 0, duration: 0.6, ease: 'power3.out' }));
  }

  /* ── MINISTRIES ── */
  if (PAGE.isMinistries) {
    const ruLogo = document.querySelector('.ru__logo-wrap');
    if (ruLogo) gsap.from(ruLogo, { scrollTrigger: { trigger: '.ru__grid', start: 'top 78%' }, scale: 0.88, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    const ruContent = document.querySelector('.ru__content');
    if (ruContent) gsap.from([...ruContent.children], { scrollTrigger: { trigger: '.ru__grid', start: 'top 78%' }, y: 32, opacity: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity' });
    if (document.querySelector('.school-section__logo-wrap')) {
      gsap.timeline({ scrollTrigger: { trigger: '.school-section__band', start: 'top 75%' } })
        .from('.school-section__logo-wrap',   { scale: 0.72, opacity: 0, rotation: -6, duration: 0.9, ease: 'back.out(1.5)' })
        .from('.school-section__band-eyebrow',{ x: -28, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.5')
        .from('.school-section__band-title',  { x: -36, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.42')
        .from('.school-section__band-sub',    { x: -22, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4');
    }
    const schoolCards = qsa('.school-card');
    if (schoolCards.length) gsap.from(schoolCards, { scrollTrigger: { trigger: '.school-section__grid', start: 'top 78%' }, x: -22, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity' });
    const schoolCopy = document.querySelector('.school-section__copy');
    if (schoolCopy) gsap.from(schoolCopy, { scrollTrigger: { trigger: '.school-section__grid', start: 'top 78%' }, x: 22, opacity: 0, duration: 0.75, ease: 'power3.out', delay: 0.1, clearProps: 'transform,opacity' });
    stagger('.other-grid', '.other-card', { stagger: 0.13, y: 44 });
    const minCta = document.querySelector('.min-cta__inner');
    if (minCta) {
      gsap.timeline({ scrollTrigger: { trigger: minCta, start: 'top 82%' } })
        .from('.min-cta__title',        { y: 30, opacity: 0, duration: 0.7,  ease: 'power3.out' })
        .from('.min-cta__sub',          { y: 22, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .from('.min-cta__actions .btn', { y: 18, opacity: 0, stagger: 0.12, duration: 0.55, ease: 'back.out(1.4)' }, '-=0.35');
    }
    qsa('.section__label').forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, x: -22, opacity: 0, duration: 0.6, ease: 'power3.out' }));
  }

  /* ── MEMBERS ── */
  if (PAGE.isMembers) {
    const verseCard = document.querySelector('.mem-verse__card');
    if (verseCard) gsap.from(verseCard, { scrollTrigger: { trigger: '.mem-verse', start: 'top 82%' }, y: 32, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' });
    const tiles = qsa('.mem-tile');
    if (tiles.length) gsap.from(tiles, { scrollTrigger: { trigger: '.mem-bento', start: 'top 78%' }, y: 56, opacity: 0, stagger: 0.15, duration: 0.88, ease: 'power3.out', clearProps: 'transform,opacity' });
    const calImg = document.querySelector('.mem-tile__calendar-img');
    if (calImg) gsap.from(calImg, { scrollTrigger: { trigger: '.mem-tile--calendar', start: 'top 76%' }, scale: 0.92, opacity: 0, duration: 1.0, ease: 'power3.out', clearProps: 'transform,opacity' });
    const secGrid = document.querySelector('.mem-secondary__grid');
    if (secGrid) gsap.from([...secGrid.children], { scrollTrigger: { trigger: '.mem-secondary', start: 'top 78%' }, y: 44, opacity: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' });
    const memClose = document.querySelector('.mem-closing__inner');
    if (memClose) {
      gsap.timeline({ scrollTrigger: { trigger: memClose, start: 'top 82%' } })
        .from('.mem-closing__verse',        { x: -36, opacity: 0, duration: 0.85, ease: 'power3.out' })
        .from('.mem-closing__actions .btn', { y: 20, opacity: 0, stagger: 0.12, duration: 0.62, ease: 'back.out(1.4)' }, '-=0.44');
    }
  }

  /* ── CONTACT ── */
  if (PAGE.isContact) {
    const details = qsa('.con-detail');
    if (details.length) gsap.from(details, { scrollTrigger: { trigger: '.con-detail-list', start: 'top 78%' }, x: -28, opacity: 0, stagger: 0.12, duration: 0.72, ease: 'power3.out', clearProps: 'transform,opacity' });
    reveal('.con-times',      { x: -20, y: 0, duration: 0.75 });
    reveal('.con-livestream', { y: 20, duration: 0.65 });
    reveal('.con-form-wrap',  { y: 40, duration: 0.9 });
    const mapInner = document.querySelector('.con-map-strip__inner');
    if (mapInner) gsap.from(mapInner, { scrollTrigger: { trigger: '.con-map-strip', start: 'top 80%' }, y: 38, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
}

/* ── 7. ACCORDION ─────────────────────────────────────────── */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;
  items.forEach(item => {
    const header = item.querySelector('.accordion__header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
        if (typeof gsap !== 'undefined') {
          const p = item.querySelector('.accordion__content p');
          if (p) gsap.from(p, { y: -14, opacity: 0, duration: 0.38, ease: 'power2.out' });
        }
      }
    });
  });
}

/* ── 8. CARD HOVER ────────────────────────────────────────── */
function initCardHover() {
  if (typeof gsap === 'undefined') return;
  /* Exclude .bento__card — CSS hover already applies translateY; GSAP scale would fight it */
  qsa('.neu-card:not(.bento__card):not(.teen-highlight-card)').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.012, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1.0,   duration: 0.28, ease: 'power2.out', overwrite: 'auto' }));
  });
  const givingTile = document.querySelector('.mem-tile--giving');
  if (givingTile) {
    const rings = givingTile.querySelectorAll('.mem-tile__giving-ring');
    givingTile.addEventListener('mouseenter', () => gsap.to(rings, { scale: 1.12, opacity: 0.9, stagger: 0.08, duration: 0.45, ease: 'power2.out' }));
    givingTile.addEventListener('mouseleave', () => gsap.to(rings, { scale: 1.0,  opacity: 0.5, duration: 0.45, ease: 'power2.out' }));
  }
  qsa('.other-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y: 0,  duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
  });
}

/* ── 9. CONTACT FORM ──────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.querySelector('.con-form__submit');
  const successEl = document.getElementById('formSuccess');
  const resetBtn  = document.getElementById('resetBtn');
  const charCount = document.getElementById('charCount');
  const messageTA = document.getElementById('message');
  if (!form) return;

  if (messageTA && charCount) {
    messageTA.addEventListener('input', () => { charCount.textContent = messageTA.value.length; });
  }

  const rules = {
    firstName: v => v.trim().length >= 2,
    lastName:  v => v.trim().length >= 2,
    email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message:   v => v.trim().length >= 10,
  };
  const msgs = {
    firstName: 'Please enter your first name.',
    lastName:  'Please enter your last name.',
    email:     'Please enter a valid email address.',
    message:   'Please write a message (at least 10 characters).',
  };

  function validateField(input) {
    const rule  = rules[input.name];
    const errEl = document.getElementById(`${input.name}-err`);
    if (!rule) return true;
    const valid = rule(input.value);
    if (!valid && input.value.length > 0) { if (errEl) errEl.textContent = msgs[input.name]; input.setAttribute('aria-invalid', 'true'); }
    else { if (errEl) errEl.textContent = ''; input.removeAttribute('aria-invalid'); }
    return valid;
  }

  form.querySelectorAll('.fld__input[required]').forEach(input => {
    input.addEventListener('blur',  () => { if (input.value.length > 0) validateField(input); });
    input.addEventListener('input', () => {
      const errEl = document.getElementById(`${input.name}-err`);
      if (input.value.length === 0 && errEl) { errEl.textContent = ''; input.removeAttribute('aria-invalid'); }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const hp = form.querySelector('input[name="_honeypot"]');
    if (hp && hp.value) return;
    const reqInputs = [...form.querySelectorAll('.fld__input[required]')];
    const allValid = reqInputs.every(input => {
      const v = validateField(input);
      if (!v && typeof gsap !== 'undefined') gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.3)' });
      return v;
    });
    if (!allValid) return;
    if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.disabled = true; }
    await new Promise(r => setTimeout(r, 1200));
    if (typeof gsap !== 'undefined') {
      gsap.to(form, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in', onComplete: showSuccess });
    } else { showSuccess(); }

    function showSuccess() {
      form.hidden = true;
      if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
      if (successEl) {
        successEl.hidden = false;
        if (typeof gsap !== 'undefined') {
          gsap.from(successEl,            { opacity: 0, scale: 0.93, y: 20, duration: 0.6, ease: 'back.out(1.4)' });
          gsap.from('.con-success__icon', { scale: 0, rotation: -90, duration: 0.8, delay: 0.2, ease: 'back.out(1.6)' });
        }
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successEl) successEl.hidden = true;
      form.reset(); form.hidden = false;
      if (charCount) charCount.textContent = '0';
      form.querySelectorAll('.fld__error').forEach(el => { el.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(el => { el.removeAttribute('aria-invalid'); });
      if (typeof gsap !== 'undefined') gsap.from(form, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
    });
  }
}

/* ── 10. VERSE OF THE DAY ─────────────────────────────────── */
const DAILY_VERSES = [
  { text: 'The LORD is my shepherd; I shall not want.',                                                                                         ref: 'Psalm 23:1 KJV'           },
  { text: 'I can do all things through Christ which strengtheneth me.',                                                                         ref: 'Philippians 4:13 KJV'     },
  { text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',                                                 ref: 'Proverbs 3:5 KJV'         },
  { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', ref: 'John 3:16 KJV' },
  { text: 'Thy word is a lamp unto my feet, and a light unto my path.',                                                                         ref: 'Psalm 119:105 KJV'        },
  { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',                                                    ref: 'Matthew 11:28 KJV'        },
  { text: 'And we know that all things work together for good to them that love God.',                                                          ref: 'Romans 8:28 KJV'          },
  { text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',  ref: 'Philippians 4:6 KJV'      },
  { text: 'The LORD is my light and my salvation; whom shall I fear?',                                                                          ref: 'Psalm 27:1 KJV'           },
  { text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', ref: 'Jeremiah 29:11 KJV'       },
  { text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',                                                       ref: 'Psalm 118:24 KJV'         },
  { text: 'O taste and see that the LORD is good: blessed is the man that trusteth in him.',                                                    ref: 'Psalm 34:8 KJV'           },
  { text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.',                             ref: 'Isaiah 40:31 KJV'         },
  { text: 'For whosoever shall call upon the name of the Lord shall be saved.',                                                                 ref: 'Romans 10:13 KJV'         },
  { text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.',                                               ref: 'Psalm 37:4 KJV'           },
  { text: 'Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another.',                          ref: 'Hebrews 10:25 KJV'        },
  { text: 'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.',                                  ref: 'Romans 6:23 KJV'          },
  { text: 'Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.',            ref: 'II Timothy 2:15 KJV'      },
  { text: 'In everything give thanks: for this is the will of God in Christ Jesus concerning you.',                                             ref: 'I Thessalonians 5:18 KJV' },
  { text: 'God is our refuge and strength, a very present help in trouble.',                                                                    ref: 'Psalm 46:1 KJV'           },
  { text: 'Seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',                             ref: 'Matthew 6:33 KJV'         },
  { text: 'Greater love hath no man than this, that a man lay down his life for his friends.',                                                  ref: 'John 15:13 KJV'           },
  { text: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.',                                                ref: 'Proverbs 18:10 KJV'       },
  { text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.',                                 ref: 'II Corinthians 12:9 KJV'  },
  { text: 'The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.',                                   ref: 'Proverbs 9:10 KJV'        },
  { text: 'Now unto him that is able to do exceeding abundantly above all that we ask or think, according to the power that worketh in us.',    ref: 'Ephesians 3:20 KJV'       },
  { text: 'Create in me a clean heart, O God; and renew a right spirit within me.',                                                             ref: 'Psalm 51:10 KJV'          },
  { text: 'Train up a child in the way he should go: and when he is old, he will not depart from it.',                                         ref: 'Proverbs 22:6 KJV'        },
  { text: 'Jesus said unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',                             ref: 'John 14:6 KJV'            },
  { text: 'And ye shall know the truth, and the truth shall make you free.',                                                                    ref: 'John 8:32 KJV'            },
  { text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',   ref: 'James 1:5 KJV'            },
];

function initVerseOfTheDay() {
  const textEl = document.getElementById('verseText');
  const refEl  = document.getElementById('verseRef');
  const dateEl = document.getElementById('verseDate');
  if (!textEl || !refEl) return;
  const now       = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86_400_000);
  const verse     = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  textEl.textContent = `"${verse.text}"`;
  refEl.textContent  = `— ${verse.ref}`;
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  if (typeof gsap !== 'undefined') gsap.from([textEl, refEl], { opacity: 0, y: 14, stagger: 0.16, duration: 0.82, ease: 'power3.out', delay: 0.3 });
}

/* ── 11. GREETING ─────────────────────────────────────────── */
function initGreeting() {
  const el = document.getElementById('heroGreeting');
  if (!el) return;
  const h = new Date().getHours();
  const [emoji, label] = h < 12 ? ['☀️','Good Morning'] : h < 17 ? ['🌤️','Good Afternoon'] : ['🌙','Good Evening'];
  el.innerHTML = `<span aria-hidden="true">${emoji}</span> ${label}, Church Family`;
}

/* ── BOOT ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  initNav();
  initAnchorLinks();
  initHeroEntrance();
  initHeroParallax();
  initSectionAnimations();
  initScrollReveal();
  initAccordion();
  initCardHover();
  initContactForm();
  initGreeting();
  initVerseOfTheDay();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  console.log('%c🏔️ Landmark Baptist Church — Script v2', 'font-size:13px;font-weight:bold;color:#AF5C33;');
});
