/* ============================================
   MINISTRIES PAGE — ministries.js
   GSAP + ScrollTrigger + Lenis animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   MOBILE NAV + HEADER SCROLL STATE
   (self-contained for standalone page)
   ============================================ */
function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('active');
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        menu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.pageYOffset > 100);
        }, { passive: true });
    }
}

/* ============================================
   PAGE HERO — staggered entrance timeline
   ============================================ */
function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.page-hero__eyebrow', { y: 22, opacity: 0, duration: 0.65 })
      .from('.page-hero__title',   { y: 44, opacity: 0, duration: 0.9  }, '-=0.4')
      .from('.page-hero__sub',     { y: 28, opacity: 0, duration: 0.7  }, '-=0.55')
      .from('.pill', {
          y: 20, opacity: 0, stagger: 0.1,
          duration: 0.6, ease: 'back.out(1.6)',
      }, '-=0.4')
      .from('.page-hero__scroll-hint', { opacity: 0, y: 12, duration: 0.55 }, '-=0.3');
}

/* ============================================
   PAGE HERO BG — smooth parallax on scroll
   ============================================ */
function initHeroParallax() {
    const bg = document.getElementById('minHeroBg');
    if (!bg) return;

    gsap.to(bg, {
        y: 180,
        ease: 'none',
        scrollTrigger: {
            trigger: '.min-hero',
            start: 'top top',
            end:   'bottom top',
            scrub: 1.5,
        },
    });
}

/* ============================================
   PILL HOVER — magnetic bounce
   ============================================ */
function initPillHover() {
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('mouseenter', () =>
            gsap.to(pill, { scale: 1.07, duration: 0.28, ease: 'back.out(2)' }));
        pill.addEventListener('mouseleave', () =>
            gsap.to(pill, { scale: 1,    duration: 0.28, ease: 'power2.out' }));
    });
}

/* ============================================
   STAGGERED SCROLL REVEALS — .mst-reveal
   ============================================ */
function initScrollReveals() {
    /* --- Grouped stagger sets --- */
    const groups = [
        { selector: '.ru__meta-cards .ru__meta-item', stagger: 0.12 },
        { selector: '.school-section__cards .school-card', stagger: 0.1 },
        { selector: '.other-grid .other-card:not(.other-card--wide)', stagger: 0.1 },
    ];

    groups.forEach(({ selector, stagger }) => {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        gsap.from(els, {
            scrollTrigger: {
                trigger: els[0].closest('section') || els[0].parentElement,
                start: 'top 78%',
                toggleActions: 'play none none reverse',
            },
            y: 45,
            opacity: 0,
            stagger,
            duration: 0.75,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
        });
    });

    /* --- Singleton .mst-reveal elements --- */
    const grouped = groups.map(g => g.selector).join(', ');

    document.querySelectorAll('.mst-reveal').forEach(el => {
        if (el.matches(grouped)) return; // already handled above

        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
            },
            y: 48,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
        });
    });
}

/* ============================================
   RU LOGO WRAP — scale-in reveal
   ============================================ */
function initRuLogoReveal() {
    gsap.from('.ru__logo-wrap', {
        scrollTrigger: {
            trigger: '.ru__grid',
            start: 'top 78%',
        },
        scale: 0.88,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.4)',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   RU VERSE — slide up with slight delay
   ============================================ */
function initRuVerseReveal() {
    gsap.from('.ru__verse', {
        scrollTrigger: {
            trigger: '.ru__verse',
            start: 'top 82%',
        },
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   SCHOOL BAND — dramatic slide from left
   ============================================ */
function initSchoolBandReveal() {
    const band = document.querySelector('.school-section__band-inner');
    if (!band) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.school-section__band',
            start: 'top 75%',
        },
    });

    tl.from('.school-section__logo-wrap', {
        scale: 0.7, opacity: 0, rotation: -8,
        duration: 0.9, ease: 'back.out(1.5)',
    })
    .from('.school-section__band-eyebrow', {
        x: -30, opacity: 0, duration: 0.55, ease: 'power3.out',
    }, '-=0.5')
    .from('.school-section__band-title', {
        x: -40, opacity: 0, duration: 0.65, ease: 'power3.out',
    }, '-=0.4')
    .from('.school-section__band-sub', {
        x: -24, opacity: 0, duration: 0.55, ease: 'power3.out',
    }, '-=0.4');
}

/* ============================================
   SCHOOL CTA BUTTON — pulse on hover
   (CSS handles transform; GSAP adds shadow pulse)
   ============================================ */
function initSchoolCtaHover() {
    const btn = document.querySelector('.school-section__cta-btn');
    if (!btn) return;

    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            boxShadow: '0 10px 40px rgba(107,26,46,0.5)',
            duration: 0.35, ease: 'power2.out',
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            boxShadow: '0 4px 22px rgba(107,26,46,0.3)',
            duration: 0.35, ease: 'power2.out',
        });
    });
}

/* ============================================
   OTHER MINISTRY CARDS — icon rotation on hover
   ============================================ */
function initOtherCardHover() {
    document.querySelectorAll('.other-card').forEach(card => {
        const icon = card.querySelector('.other-card__icon-wrap');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -6, duration: 0.32, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.32, ease: 'power2.out' });
        });
    });
}

/* ============================================
   DISCIPLESHIP WIDE CARD — stagger schedule items
   ============================================ */
function initDiscipleshipReveal() {
    const items = document.querySelectorAll('.other-card__schedule-item');
    if (!items.length) return;

    gsap.from(items, {
        scrollTrigger: {
            trigger: '.other-card--wide',
            start: 'top 78%',
        },
        x: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   CLOSING CTA — sequential text + buttons
   ============================================ */
function initCtaReveal() {
    const inner = document.querySelector('.min-cta__inner');
    if (!inner) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: inner,
            start: 'top 82%',
        },
    })
    .from('.min-cta__title',  { y: 32, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from('.min-cta__sub',    { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45')
    .from('.min-cta__actions .btn', {
        y: 20, opacity: 0, stagger: 0.12, duration: 0.55, ease: 'back.out(1.4)',
    }, '-=0.35');
}

/* ============================================
   SECTION LABEL SLIDE-IN
   ============================================ */
function initLabelSlide() {
    document.querySelectorAll('.section__label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: { trigger: label, start: 'top 86%' },
            x: -28, opacity: 0, duration: 0.6, ease: 'power3.out',
        });
    });
}

/* ============================================
   SMOOTH ANCHOR SCROLLING — uses Lenis
   ============================================ */
function initAnchorScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();

            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(target, { offset: -90, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================
   BOOT — run everything on load
   ============================================ */
window.addEventListener('load', () => {
    initNav();
    initHeroEntrance();
    initHeroParallax();
    initPillHover();
    initLabelSlide();
    initRuLogoReveal();
    initRuVerseReveal();
    initSchoolBandReveal();
    initSchoolCtaHover();
    initScrollReveals();
    initOtherCardHover();
    initDiscipleshipReveal();
    initCtaReveal();
    initAnchorScrolling();

    // Let ScrollTrigger recalculate after all assets have painted
    ScrollTrigger.refresh();

    console.log('%c🏔️ Ministries Page Ready', 'font-size:14px;font-weight:bold;color:#6B1A2E;');
});
