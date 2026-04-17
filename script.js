/* ============================================
   MEMBERS PAGE — members.js
   Verse of the Day · Greeting · GSAP Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   KJV VERSE POOL
   Rotates by day-of-year so it changes daily
   without needing a backend.
   ============================================ */
const DAILY_VERSES = [
    { text: "The LORD is my shepherd; I shall not want.",                          ref: "Psalm 23:1 KJV" },
    { text: "I can do all things through Christ which strengtheneth me.",           ref: "Philippians 4:13 KJV" },
    { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5 KJV" },
    { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", ref: "John 3:16 KJV" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", ref: "Joshua 1:9 KJV" },
    { text: "Thy word is a lamp unto my feet, and a light unto my path.",           ref: "Psalm 119:105 KJV" },
    { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28 KJV" },
    { text: "And we know that all things work together for good to them that love God.", ref: "Romans 8:28 KJV" },
    { text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", ref: "Philippians 4:6 KJV" },
    { text: "The LORD is my light and my salvation; whom shall I fear?",            ref: "Psalm 27:1 KJV" },
    { text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", ref: "Jeremiah 29:11 KJV" },
    { text: "Cast thy burden upon the LORD, and he shall sustain thee.",            ref: "Psalm 55:22 KJV" },
    { text: "This is the day which the LORD hath made; we will rejoice and be glad in it.", ref: "Psalm 118:24 KJV" },
    { text: "O taste and see that the LORD is good: blessed is the man that trusteth in him.", ref: "Psalm 34:8 KJV" },
    { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", ref: "Isaiah 40:31 KJV" },
    { text: "For whosoever shall call upon the name of the Lord shall be saved.",   ref: "Romans 10:13 KJV" },
    { text: "The LORD bless thee, and keep thee: the LORD make his face shine upon thee, and be gracious unto thee.", ref: "Numbers 6:24-25 KJV" },
    { text: "Delight thyself also in the LORD; and he shall give thee the desires of thine heart.", ref: "Psalm 37:4 KJV" },
    { text: "Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another.", ref: "Hebrews 10:25 KJV" },
    { text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", ref: "Romans 6:23 KJV" },
    { text: "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.", ref: "II Timothy 2:15 KJV" },
    { text: "In everything give thanks: for this is the will of God in Christ Jesus concerning you.", ref: "I Thessalonians 5:18 KJV" },
    { text: "God is our refuge and strength, a very present help in trouble.",      ref: "Psalm 46:1 KJV" },
    { text: "What shall we then say to these things? If God be for us, who can be against us?", ref: "Romans 8:31 KJV" },
    { text: "Seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", ref: "Matthew 6:33 KJV" },
    { text: "I have been young, and now am old; yet have I not seen the righteous forsaken, nor his seed begging bread.", ref: "Psalm 37:25 KJV" },
    { text: "Greater love hath no man than this, that a man lay down his life for his friends.", ref: "John 15:13 KJV" },
    { text: "The name of the LORD is a strong tower: the righteous runneth into it, and is safe.", ref: "Proverbs 18:10 KJV" },
    { text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.", ref: "II Corinthians 12:9 KJV" },
    { text: "Every word of God is pure: he is a shield unto them that put their trust in him.", ref: "Proverbs 30:5 KJV" },
    { text: "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.", ref: "Proverbs 9:10 KJV" },
    { text: "Now unto him that is able to do exceeding abundantly above all that we ask or think, according to the power that worketh in us.", ref: "Ephesians 3:20 KJV" },
    { text: "Create in me a clean heart, O God; and renew a right spirit within me.", ref: "Psalm 51:10 KJV" },
    { text: "Train up a child in the way he should go: and when he is old, he will not depart from it.", ref: "Proverbs 22:6 KJV" },
    { text: "Jesus said unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", ref: "John 14:6 KJV" },
    { text: "And ye shall know the truth, and the truth shall make you free.",      ref: "John 8:32 KJV" },
    { text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", ref: "James 1:5 KJV" },
];

/* ============================================
   VERSE OF THE DAY — renders today's verse
   ============================================ */
function initVerseOfTheDay() {
    const textEl = document.getElementById('verseText');
    const refEl  = document.getElementById('verseRef');
    const dateEl = document.getElementById('verseDate');

    if (!textEl || !refEl) return;

    const now         = new Date();
    const dayOfYear   = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const verse       = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];

    // Format today's date for display
    const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
    });

    // Fade in text
    gsap.set([textEl, refEl], { opacity: 0, y: 12 });

    textEl.textContent = `"${verse.text}"`;
    refEl.textContent  = `— ${verse.ref}`;
    if (dateEl) dateEl.textContent = formatted;

    gsap.to([textEl, refEl], {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        delay: 0.3,
    });
}

/* ============================================
   GREETING BADGE — time-of-day salutation
   ============================================ */
function initGreeting() {
    const el = document.getElementById('heroGreeting');
    if (!el) return;

    const hour = new Date().getHours();
    let emoji, text;

    if (hour < 12)      { emoji = '☀️'; text = 'Good Morning';   }
    else if (hour < 17) { emoji = '🌤️'; text = 'Good Afternoon'; }
    else                { emoji = '🌙'; text = 'Good Evening';    }

    el.innerHTML = `<span aria-hidden="true">${emoji}</span> ${text}, Church Family`;
}

/* ============================================
   HERO — entrance timeline
   ============================================ */
function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.mem-hero__greeting', { y: -20, opacity: 0, duration: 0.5 })
      .from('.mem-hero__eyebrow',  { y: 22,  opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.mem-hero__title',    { y: 48,  opacity: 0, duration: 0.9 }, '-=0.45')
      .from('.mem-hero__sub',      { y: 28,  opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.mem-hero__scroll-hint', { opacity: 0, y: 10, duration: 0.5 }, '-=0.3');
}

/* ============================================
   HERO PARALLAX
   ============================================ */
function initHeroParallax() {
    const bg = document.getElementById('memHeroBg');
    if (!bg) return;

    gsap.to(bg, {
        y: 160,
        ease: 'none',
        scrollTrigger: {
            trigger: '.mem-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        },
    });
}

/* ============================================
   VERSE CARD — scroll reveal
   ============================================ */
function initVerseReveal() {
    gsap.from('.mem-verse__card', {
        scrollTrigger: {
            trigger: '.mem-verse',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   DASHBOARD TILES — staggered reveal
   ============================================ */
function initTileReveals() {
    /* Primary bento tiles — stagger in order */
    const tiles = document.querySelectorAll('.mem-tile');

    gsap.from(tiles, {
        scrollTrigger: {
            trigger: '.mem-bento',
            start: 'top 78%',
        },
        y: 60,
        opacity: 0,
        stagger: 0.14,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });

    /* Secondary grid items */
    const secondary = document.querySelectorAll(
        '.mem-portal, .mem-quick, .mem-school-card'
    );

    gsap.from(secondary, {
        scrollTrigger: {
            trigger: '.mem-secondary__grid',
            start: 'top 78%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });

    /* Quick-list items slide in from right */
    gsap.from('.mem-quick__list li', {
        scrollTrigger: {
            trigger: '.mem-quick',
            start: 'top 80%',
        },
        x: 24,
        opacity: 0,
        stagger: 0.06,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   GIVING TILE — ring pulse GSAP override
   (syncs ring animations with tile hover)
   ============================================ */
function initGivingTile() {
    const tile  = document.querySelector('.mem-tile--giving');
    const rings = document.querySelectorAll('.mem-tile__giving-ring');

    if (!tile || !rings.length) return;

    tile.addEventListener('mouseenter', () => {
        gsap.to(rings, {
            scale: 1.1,
            opacity: 0.9,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
        });
    });

    tile.addEventListener('mouseleave', () => {
        gsap.to(rings, {
            scale: 1,
            opacity: 0.5,
            duration: 0.5,
            ease: 'power2.out',
        });
    });
}

/* ============================================
   CALENDAR IMAGE — zoom-in reveal
   ============================================ */
function initCalendarReveal() {
    gsap.from('.mem-tile__calendar-img', {
        scrollTrigger: {
            trigger: '.mem-tile--calendar',
            start: 'top 75%',
        },
        scale: 0.92,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
    });
}

/* ============================================
   STREAM TILE — waveform pause/play on hover
   (GSAP controls bar animation speed)
   ============================================ */
function initStreamTile() {
    const tile = document.querySelector('.mem-tile--stream');
    const bars = document.querySelectorAll('.mem-tile__wave span');

    if (!tile || !bars.length) return;

    tile.addEventListener('mouseenter', () => {
        gsap.to(bars, {
            scaleY: 1,
            opacity: 0.6,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });

    tile.addEventListener('mouseleave', () => {
        // Resume normal animation by clearing overrides
        gsap.set(bars, { clearProps: 'scaleY,opacity' });
    });
}

/* ============================================
   CLOSING STRIP — verse slide-in
   ============================================ */
function initClosingReveal() {
    const inner = document.querySelector('.mem-closing__inner');
    if (!inner) return;

    gsap.timeline({
        scrollTrigger: { trigger: inner, start: 'top 82%' },
    })
    .from('.mem-closing__verse', {
        x: -40, opacity: 0, duration: 0.85, ease: 'power3.out',
    })
    .from('.mem-closing__actions .btn', {
        y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'back.out(1.4)',
    }, '-=0.45');
}

/* ============================================
   GENERAL SCROLL REVEAL — singleton .mbd-reveal
   ============================================ */
function initScrollReveals() {
    const grouped = [
        '.mem-tile', '.mem-portal', '.mem-quick',
        '.mem-school-card', '.mem-verse__card',
    ].join(', ');

    document.querySelectorAll('.mbd-reveal').forEach(el => {
        if (el.matches(grouped)) return; // handled by dedicated functions

        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 83%' },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
        });
    });
}

/* ============================================
   MOBILE NAV + HEADER SCROLL
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
   BOOT
   ============================================ */
window.addEventListener('load', () => {
    initNav();
    initGreeting();
    initVerseOfTheDay();
    initHeroEntrance();
    initHeroParallax();
    initVerseReveal();
    initTileReveals();
    initGivingTile();
    initCalendarReveal();
    initStreamTile();
    initScrollReveals();
    initClosingReveal();
    initAnchorScrolling();

    ScrollTrigger.refresh();

    console.log('%c🏔️ Members Page Ready', 'font-size:14px;font-weight:bold;color:#AF5C33;');
});
