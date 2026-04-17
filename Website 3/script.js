/* ============================================
   LANDMARK BAPTIST CHURCH - SCRIPTS
   GSAP Animations, Lenis Smooth Scroll, Interactions
   ============================================ */

// ============================================
// SMOOTH SCROLLING WITH LENIS
// ============================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Header scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section[id]');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// ============================================
// GSAP ANIMATIONS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Hero animations on page load
window.addEventListener('load', () => {
  const heroTimeline = gsap.timeline();
  
  heroTimeline
    .from('.hero__title', {
      duration: 1,
      y: 60,
      opacity: 0,
      ease: 'power3.out'
    })
    .from('.hero__subtitle', {
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero__card', {
      duration: 1,
      y: 60,
      opacity: 0,
      scale: 0.95,
      ease: 'back.out(1.2)'
    }, '-=0.4')
    .from('.hero__scroll', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.4');
});

// Fade-in animations for sections
const fadeInElements = document.querySelectorAll('.fade-in');

fadeInElements.forEach((element, index) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay: index * 0.1,
    ease: 'power3.out',
    onComplete: () => {
      element.classList.add('active');
    }
  });
});

// Parallax effect for hero background
gsap.to('.hero__bg', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  y: 200,
  opacity: 0.5,
  ease: 'none'
});

// Stats counter animation
const statNumbers = document.querySelectorAll('.stat-card__number');

statNumbers.forEach(stat => {
  const finalText = stat.textContent;
  
  ScrollTrigger.create({
    trigger: stat,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      // Simple text reveal for non-numeric stats
      gsap.from(stat, {
        duration: 1,
        scale: 0.5,
        opacity: 0,
        ease: 'back.out(1.5)'
      });
    }
  });
});

// Service time cards stagger animation
const serviceTimes = document.querySelectorAll('.service-time');

gsap.from(serviceTimes, {
  scrollTrigger: {
    trigger: '.hero__card',
    start: 'top 70%',
  },
  y: 30,
  opacity: 0,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out'
});

// Team cards hover effect
const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// FAQ cards animation
const faqCards = document.querySelectorAll('.faq-card');

gsap.from(faqCards, {
  scrollTrigger: {
    trigger: '.faq',
    start: 'top 70%',
  },
  y: 60,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'back.out(1.2)'
});

// Ministry cards stagger
const ministryCards = document.querySelectorAll('.ministry-card');

gsap.from(ministryCards, {
  scrollTrigger: {
    trigger: '.ministries__grid',
    start: 'top 75%',
  },
  y: 50,
  opacity: 0,
  stagger: 0.12,
  duration: 0.7,
  ease: 'power3.out'
});

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================
const accordionHeaders = document.querySelectorAll('.accordion__header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentElement;
    const isActive = accordionItem.classList.contains('active');
    
    // Close all accordion items
    document.querySelectorAll('.accordion__item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      accordionItem.classList.add('active');
      
      // GSAP animation for smooth opening
      const content = accordionItem.querySelector('.accordion__content');
      gsap.from(content.querySelector('p'), {
        duration: 0.4,
        y: -20,
        opacity: 0,
        ease: 'power2.out'
      });
    }
  });
});

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show success message (replace with actual form submission)
    gsap.to(contactForm, {
      duration: 0.4,
      scale: 0.95,
      opacity: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        
        gsap.to(contactForm, {
          duration: 0.4,
          scale: 1,
          opacity: 1,
          ease: 'power2.out'
        });
      }
    });
  });
}

// ============================================
// INTERSECTION OBSERVER FOR LAZY ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============================================
// BUTTON HOVER ANIMATIONS
// ============================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    gsap.to(btn, {
      scale: 1.05,
      duration: 0.3,
      ease: 'back.out(2)'
    });
  });
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// ============================================
// SMOOTH SCROLL TO ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      lenis.scrollTo(targetElement, {
        offset: -80,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  });
});

// ============================================
// CARD HOVER EFFECTS
// ============================================
const neuCards = document.querySelectorAll('.neu-card');

neuCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    gsap.to(card, {
      duration: 0.3,
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: 'power2.out'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out'
    });
  });
});

// ============================================
// SECTION REVEAL ANIMATIONS
// ============================================
const sections = document.querySelectorAll('.section');

sections.forEach(section => {
  gsap.from(section.querySelector('.section__header'), {
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// ============================================
// ENTRANCE ANIMATIONS FOR SPECIFIC ELEMENTS
// ============================================

// Salvation steps animation
const salvationSteps = document.querySelectorAll('.salvation__step');

gsap.from(salvationSteps, {
  scrollTrigger: {
    trigger: '.salvation',
    start: 'top 70%',
  },
  x: -50,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out'
});

// Class cards animation
const classCards = document.querySelectorAll('.class-card');

gsap.from(classCards, {
  scrollTrigger: {
    trigger: '.adult-classes',
    start: 'top 75%',
  },
  y: 60,
  opacity: 0,
  stagger: 0.1,
  duration: 0.7,
  ease: 'back.out(1.5)'
});

// Info cards animation
const infoCards = document.querySelectorAll('.info-card');

gsap.from(infoCards, {
  scrollTrigger: {
    trigger: '.connect__cards',
    start: 'top 75%',
  },
  scale: 0.8,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'back.out(1.5)'
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  
  gsap.to(document.body, {
    duration: 0.6,
    opacity: 1,
    ease: 'power2.out'
  });
});

// ============================================
// SCROLL PROGRESS INDICATOR (OPTIONAL)
// ============================================
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  // You can create a progress bar element and update it here
  // For now, this is just tracking the scroll progress
});

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🏔️ Landmark Baptist Church', 'font-size: 20px; font-weight: bold; color: #D47B5A;');
console.log('%cWebsite built with love in Grand Junction, Colorado', 'font-size: 12px; color: #5B7C8A;');
console.log('%cLooking Forward to Great Things', 'font-style: italic; color: #3D2817;');
