/**
 * script.js — Landmark Baptist Church
 * Vanilla JS only — hamburger menu + header scroll + accordion
 * Zero external libraries. No GSAP. No Lenis. No ScrollTrigger.
 */

(function () {
  'use strict';

  /* ── ELEMENTS ─────────────────────────────────────────────── */
  var header    = document.getElementById('header');
  var hamburger = document.getElementById('navHamburger');
  var panel     = document.getElementById('navPanel');
  var overlay   = document.getElementById('navOverlay');
  var closeBtn  = document.getElementById('navPanelClose');

  /* ── HEADER SCROLL SHADOW ─────────────────────────────────── */
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER / SIDE PANEL ───────────────────────────────── */
  function openPanel() {
    if (!panel || !hamburger || !overlay) return;
    panel.hidden = false;
    // Force reflow so CSS transition fires
    panel.getBoundingClientRect();
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus the close button for accessibility
    if (closeBtn) {
      setTimeout(function () { closeBtn.focus(); }, 50);
    }
  }

  function closePanel() {
    if (!panel || !hamburger || !overlay) return;
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Hide after transition completes (500ms matches --t-slow)
    setTimeout(function () {
      if (!panel.classList.contains('is-open')) {
        panel.hidden = true;
      }
    }, 520);
    hamburger.focus();
  }

  if (hamburger) {
    hamburger.addEventListener('click', openPanel);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  if (overlay) {
    overlay.addEventListener('click', closePanel);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  // Trap focus inside panel when open
  if (panel) {
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ── ACCORDION ────────────────────────────────────────────── */
  var accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion__trigger');
    var body    = item.querySelector('.accordion__body');
    if (!trigger || !body) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('accordion__item--open');

      // Close all open items
      accordionItems.forEach(function (other) {
        other.classList.remove('accordion__item--open');
        var t = other.querySelector('.accordion__trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('accordion__item--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard: Enter / Space
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  /* ── FOOTER YEAR ──────────────────────────────────────────── */
  var yearEl = document.getElementById('yr');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
