/**
 * script.js — Landmark Baptist Church · Master Animation File
 * Lenis smooth scroll · GSAP timelines · ScrollTrigger stagger reveals
 * Accordion · Mobile nav · Parallax · Members ticker
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   INIT — wait for all CDN scripts to load
   ═══════════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  initLenis();
  initNav();
  initHeroTimeline();
  initScrollReveals();
  initAccordion();
  initParallax();
  initTicker();
  initDashboardHovers();
  setFooterYear();
});

/* ═══════════════════════════════════════════════════════════════════════════
   1. LENIS SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════════════════════ */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    lerp: 0.08,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
  });

  // Sync with GSAP ticker if available
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  } else {
    // Fallback RAF
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */
function initNav() {
  const header      = document.getElementById('siteHeader');
  const hamburger   = document.getElementById('hamburger');
  const overlay     = document.getElementById('mobileOverlay');
  const closeBtn    = document.getElementById('mobileClose');

  if (!header) return;

  // Scroll-based header glass effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  if (hamburger && overlay) {
    const openMenu = () => {
      overlay.classList.add('nav__mobile-overlay--open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      if (typeof gsap !== 'undefined') {
        gsap.from(overlay.querySelectorAll('.nav__mobile-links li'), {
          opacity: 0,
          y: 40,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.15,
        });
      }
    };

    const closeMenu = () => {
      overlay.classList.remove('nav__mobile-overlay--open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on overlay link click
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('nav__mobile-overlay--open')) {
        closeMenu();
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. HERO ENTRANCE TIMELINE (index.html)
   ═══════════════════════════════════════════════════════════════════════════ */
function initHeroTimeline() {
  if (typeof gsap === 'undefined') return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ delay: 0.3 });

  // Eyebrow
  if (hero.querySelector('.eyebrow')) {
    tl.from(hero.querySelector('.eyebrow'), {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
    });
  }

  // H1 — split by line if possible
  if (hero.querySelector('h1')) {
    tl.from(hero.querySelector('h1'), {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.3');
  }

  // Subheading
  if (hero.querySelector('.hero__sub')) {
    tl.from(hero.querySelector('.hero__sub'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');
  }

  // CTA buttons
  const ctaBtns = hero.querySelectorAll('.btn');
  if (ctaBtns.length) {
    tl.from(ctaBtns, {
      opacity: 0,
      y: 24,
      stagger: 0.12,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4');
  }

  // Scroll hint
  if (hero.querySelector('.hero__scroll-hint')) {
    tl.from(hero.querySelector('.hero__scroll-hint'), {
      opacity: 0,
      duration: 0.6,
    }, '-=0.2');
  }

  // Mountain parallax: move up as user scrolls
  const mountain = hero.querySelector('.hero__mountain');
  if (mountain) {
    gsap.to(mountain, {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  // Hero background subtle upward drift
  const heroBg = hero.querySelector('.hero__bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. SCROLL REVEAL — all .sr elements
   ═══════════════════════════════════════════════════════════════════════════ */
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: just show elements
    document.querySelectorAll('.sr').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Group elements by their parent container for stagger effect
  const srElements = document.querySelectorAll('.sr');

  // Track which elements have been animated (skip hero children — handled above)
  const heroEl = document.querySelector('.hero');

  srElements.forEach(el => {
    // Skip elements inside the hero — they're handled by the hero timeline
    if (heroEl && heroEl.contains(el)) return;

    // Check if element is part of a stagger group (siblings with .sr in same parent)
    const parent = el.parentElement;
    const siblings = parent ? [...parent.querySelectorAll(':scope > .sr')] : [];

    if (siblings.length > 1 && siblings.indexOf(el) === 0) {
      // Animate entire sibling group as a stagger
      gsap.fromTo(siblings,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    } else if (siblings.length <= 1) {
      // Animate individually
      gsap.fromTo(el,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  });

  // Special: pastor cards — cascade from left
  const pastorCards = document.querySelectorAll('.pastor-card');
  if (pastorCards.length) {
    gsap.fromTo(pastorCards,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pastorCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Bento grid tiles stagger
  const bentoTiles = document.querySelectorAll('.bento-tile');
  if (bentoTiles.length) {
    gsap.fromTo(bentoTiles,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { amount: 0.6, from: 'start' },
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bentoTiles[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Ministries grid cards
  const minCards = document.querySelectorAll('.min-card');
  if (minCards.length) {
    gsap.fromTo(minCards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        stagger: { amount: 0.5, from: 'start' },
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: minCards[0],
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Dashboard tiles
  const dashTiles = document.querySelectorAll('.dash-tile');
  if (dashTiles.length) {
    gsap.fromTo(dashTiles,
      { opacity: 0, scale: 0.94, y: 32 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: { amount: 0.55, from: 'start' },
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: dashTiles[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Service time cards
  const stCards = document.querySelectorAll('.service-time-card');
  if (stCards.length) {
    gsap.fromTo(stCards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stCards[0],
          start: 'top 87%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Section headings — slide up with slight rotation
  document.querySelectorAll('.section-title').forEach(heading => {
    if (heroEl && heroEl.contains(heading)) return;
    gsap.fromTo(heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Blockquotes
  document.querySelectorAll('blockquote').forEach(bq => {
    gsap.fromTo(bq,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bq,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Salvation strip CTA
  const salvationStrip = document.querySelector('.salvation-strip');
  if (salvationStrip) {
    gsap.fromTo(salvationStrip,
      { opacity: 0, scale: 0.97 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: salvationStrip,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. ACCORDION — What We Believe (index.html)
   ═══════════════════════════════════════════════════════════════════════════ */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const body    = item.querySelector('.accordion__body');
    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all
      items.forEach(other => {
        other.classList.remove('accordion__item--open');
        const otherTrigger = other.querySelector('.accordion__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('accordion__item--open');
        trigger.setAttribute('aria-expanded', 'true');

        // GSAP animate body if available
        if (typeof gsap !== 'undefined' && body) {
          const inner = body.querySelector('.accordion__inner');
          if (inner) {
            gsap.from(inner, {
              opacity: 0,
              y: 12,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        }
      }
    });

    // Keyboard support
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. PARALLAX EFFECTS
   ═══════════════════════════════════════════════════════════════════════════ */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // RU Recovery logo float
  const ruLogo = document.querySelector('.ru-logo-img');
  if (ruLogo) {
    gsap.to(ruLogo, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: ruLogo.closest('section') || ruLogo,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  // School image gentle drift
  const schoolImg = document.querySelector('.school-img');
  if (schoolImg) {
    gsap.to(schoolImg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: schoolImg.closest('section') || schoolImg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  // History section image
  const historyImg = document.querySelector('.history__img');
  if (historyImg) {
    gsap.to(historyImg, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: historyImg.closest('.history') || historyImg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. MEMBERS TICKER
   ═══════════════════════════════════════════════════════════════════════════ */
function initTicker() {
  const ticker = document.querySelector('.ticker__track');
  if (!ticker) return;

  // Pause on hover
  ticker.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. DASHBOARD TILE HOVER DEPTH (members.html)
   ═══════════════════════════════════════════════════════════════════════════ */
function initDashboardHovers() {
  if (typeof gsap === 'undefined') return;

  const tiles = document.querySelectorAll('.dash-tile');
  tiles.forEach(tile => {
    tile.addEventListener('mouseenter', () => {
      gsap.to(tile, { scale: 1.025, duration: 0.3, ease: 'power2.out' });
    });
    tile.addEventListener('mouseleave', () => {
      gsap.to(tile, { scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  // Bento tile hover too
  const bentoTiles = document.querySelectorAll('.bento-tile');
  bentoTiles.forEach(tile => {
    tile.addEventListener('mouseenter', () => {
      gsap.to(tile, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });
    tile.addEventListener('mouseleave', () => {
      gsap.to(tile, { scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. FOOTER YEAR
   ═══════════════════════════════════════════════════════════════════════════ */
function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. CONTACT FORM FLOATING LABEL POLISH
   ═══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure floating labels work correctly for selects and pre-filled fields
  document.querySelectorAll('.form-input').forEach(input => {
    const checkFilled = () => {
      if (input.value && input.value.trim()) {
        input.classList.add('form-input--filled');
      } else {
        input.classList.remove('form-input--filled');
      }
    };
    input.addEventListener('input', checkFilled);
    input.addEventListener('change', checkFilled);
    checkFilled();
  });

  // Smooth reveal for .sr elements without GSAP (CSS fallback)
  if (typeof gsap === 'undefined') {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.85s ease, transform 0.85s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.sr').forEach(el => {
      observer.observe(el);
    });
  }
});
