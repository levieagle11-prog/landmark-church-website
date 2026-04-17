/* ============================================
   CONTACT PAGE — contact.js
   GSAP + ScrollTrigger + Form Validation
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   NAV + HEADER SCROLL STATE
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
   HERO ENTRANCE TIMELINE
   ============================================ */
function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.page-hero__eyebrow', { y: 20,  opacity: 0, duration: 0.6  })
      .from('.page-hero__title',   { y: 48,  opacity: 0, duration: 1.0  }, '-=0.4')
      .from('.page-hero__sub',     { y: 28,  opacity: 0, duration: 0.7  }, '-=0.55')
      .from('.con-hero__mark',     { scale: 0, opacity: 0, stagger: 0.1,
                                     duration: 0.6, ease: 'back.out(2)' }, '-=0.5')
      .from('.page-hero__scroll-hint', { opacity: 0, y: 10, duration: 0.5 }, '-=0.3');
}

/* ============================================
   HERO PARALLAX
   ============================================ */
function initHeroParallax() {
    const bg = document.getElementById('conHeroBg');
    if (!bg) return;

    gsap.to(bg, {
        y: 160,
        ease: 'none',
        scrollTrigger: {
            trigger: '.con-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
        },
    });
}

/* ============================================
   SCROLL REVEALS — .cnt-reveal
   ============================================ */
function initScrollReveals() {
    /* Detail list items — staggered */
    gsap.from('.con-detail-list .con-detail', {
        scrollTrigger: {
            trigger: '.con-detail-list',
            start: 'top 80%',
        },
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });

    /* Con-times + livestream — slide up */
    ['.con-times', '.con-livestream'].forEach((sel, i) => {
        gsap.from(sel, {
            scrollTrigger: { trigger: sel, start: 'top 82%' },
            y: 36,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
        });
    });

    /* Form wrapper — scale-in from slightly small */
    gsap.from('.con-form-wrap', {
        scrollTrigger: {
            trigger: '.con-form-wrap',
            start: 'top 78%',
        },
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });

    /* Intro text */
    gsap.from('.con-info__intro', {
        scrollTrigger: {
            trigger: '.con-info__intro',
            start: 'top 82%',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });

    /* Map strip */
    gsap.from('.con-map-strip__inner', {
        scrollTrigger: {
            trigger: '.con-map-strip',
            start: 'top 80%',
        },
        y: 44,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   FORM FIELDS — floating label micro-animations
   GSAP adds a subtle scale-up on focus that
   the pure-CSS transition can't do smoothly.
   ============================================ */
function initFieldAnimations() {
    const fields = document.querySelectorAll('.fld__input');

    fields.forEach(input => {
        const wrapper = input.closest('.fld');
        const line    = wrapper?.querySelector('.fld__line');

        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.005,
                duration: 0.25,
                ease: 'power2.out',
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.25,
                ease: 'power2.out',
            });
        });
    });
}

/* ============================================
   CHARACTER COUNTER — textarea
   ============================================ */
function initCharCounter() {
    const textarea = document.getElementById('message');
    const counter  = document.getElementById('charCount');
    if (!textarea || !counter) return;

    const max = parseInt(textarea.getAttribute('maxlength'), 10) || 1000;
    const counterWrap = document.getElementById('message-count');

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = len;

        // Warn when approaching limit
        if (counterWrap) {
            counterWrap.classList.toggle('fld__counter--warn', len >= max * 0.9);
        }
    });
}

/* ============================================
   INLINE VALIDATION
   Shows error messages on blur for required fields.
   ============================================ */
const validationRules = {
    firstName: { test: v => v.trim().length >= 2,    msg: 'Please enter your first name.' },
    lastName:  { test: v => v.trim().length >= 2,    msg: 'Please enter your last name.' },
    email:     { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
                              msg: 'Please enter a valid email address.' },
    message:   { test: v => v.trim().length >= 10,   msg: 'Please write a message (at least 10 characters).' },
};

function validateField(input) {
    const name = input.name;
    const rule = validationRules[name];
    if (!rule) return true; // optional field — always passes

    const errEl = document.getElementById(`${name}-err`);
    const valid = rule.test(input.value);

    if (!valid && input.value.length > 0) {
        if (errEl) errEl.textContent = rule.msg;
        input.setAttribute('aria-invalid', 'true');
    } else {
        if (errEl) errEl.textContent = '';
        input.removeAttribute('aria-invalid');
    }

    return valid;
}

function initInlineValidation() {
    const inputs = document.querySelectorAll('.fld__input[required]');

    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            if (input.value.length > 0) validateField(input);
        });

        // Clear error as soon as user starts correcting
        input.addEventListener('input', () => {
            const errEl = document.getElementById(`${input.name}-err`);
            if (input.value.length === 0 && errEl) {
                errEl.textContent = '';
                input.removeAttribute('aria-invalid');
            }
        });
    });
}

/* ============================================
   FORM SUBMISSION HANDLER
   Front-end only — shows loading state then
   transitions to success card with GSAP.
   ============================================ */
function initFormSubmission() {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const successEl  = document.getElementById('formSuccess');
    const resetBtn   = document.getElementById('resetBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check
        const honeypot = form.querySelector('input[name="_honeypot"]');
        if (honeypot && honeypot.value) return; // silently drop bot submissions

        // Full validation pass
        const requiredInputs = [...form.querySelectorAll('.fld__input[required]')];
        const allValid = requiredInputs.every(input => {
            const valid = validateField(input);
            if (!valid) {
                // Shake invalid field
                gsap.fromTo(input, { x: -8 }, {
                    x: 0, duration: 0.5,
                    ease: 'elastic.out(1, 0.3)',
                });
            }
            return valid;
        });

        if (!allValid) return;

        // Loading state
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        // Simulated async delay (replace with real fetch() to your backend)
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Transition form → success
        gsap.to(form, {
            opacity: 0,
            y: -20,
            duration: 0.45,
            ease: 'power2.in',
            onComplete: () => {
                form.hidden = true;
                submitBtn.classList.remove('is-loading');
                submitBtn.disabled = false;

                successEl.hidden = false;

                // Animate success card in
                gsap.from(successEl, {
                    opacity: 0,
                    scale: 0.94,
                    y: 20,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                });

                // Animate the check icon
                gsap.from('.con-success__icon', {
                    scale: 0,
                    rotation: -90,
                    duration: 0.8,
                    delay: 0.2,
                    ease: 'back.out(1.6)',
                });
            },
        });
    });

    // Reset: return to blank form
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            gsap.to(successEl, {
                opacity: 0,
                y: -16,
                duration: 0.35,
                ease: 'power2.in',
                onComplete: () => {
                    successEl.hidden = true;
                    form.reset();
                    form.hidden = false;

                    // Clear all error messages and aria-invalid
                    form.querySelectorAll('.fld__error').forEach(el => el.textContent = '');
                    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));

                    // Reset char counter
                    const charCount = document.getElementById('charCount');
                    if (charCount) charCount.textContent = '0';

                    gsap.from(form, {
                        opacity: 0,
                        y: 20,
                        duration: 0.5,
                        ease: 'power3.out',
                    });
                },
            });
        });
    }
}

/* ============================================
   SUBMIT BUTTON — enhanced hover
   ============================================ */
function initSubmitHover() {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;

    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            boxShadow: '0 14px 44px rgba(175,92,51,0.5)',
            duration: 0.3, ease: 'power2.out',
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            boxShadow: '0 6px 24px rgba(175,92,51,0.3)',
            duration: 0.3, ease: 'power2.out',
        });
    });
}

/* ============================================
   DETAIL CARDS — horizontal lift on hover
   ============================================ */
function initDetailHover() {
    document.querySelectorAll('.con-detail').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { x: 6, duration: 0.3, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { x: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
}

/* ============================================
   MAP PIN — pulse animation on load
   ============================================ */
function initMapPin() {
    const pin = document.querySelector('.con-map-strip__pin');
    if (!pin) return;

    gsap.from(pin, {
        scrollTrigger: {
            trigger: '.con-map-strip',
            start: 'top 80%',
            once: true,
        },
        scale: 0,
        rotation: -30,
        duration: 0.8,
        ease: 'back.out(1.8)',
    });
}

/* ============================================
   SMOOTH ANCHOR SCROLLING
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
   STAGGER SERVICE TIME ROWS on scroll
   ============================================ */
function initServiceTimesReveal() {
    gsap.from('.con-times__service', {
        scrollTrigger: {
            trigger: '.con-times',
            start: 'top 80%',
        },
        x: -24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   BOOT
   ============================================ */
window.addEventListener('load', () => {
    initNav();
    initHeroEntrance();
    initHeroParallax();
    initScrollReveals();
    initFieldAnimations();
    initCharCounter();
    initInlineValidation();
    initFormSubmission();
    initSubmitHover();
    initDetailHover();
    initServiceTimesReveal();
    initMapPin();
    initAnchorScrolling();

    ScrollTrigger.refresh();

    console.log('%c🏔️ Contact Page Ready', 'font-size:14px;font-weight:bold;color:#4A6D7C;');
});
