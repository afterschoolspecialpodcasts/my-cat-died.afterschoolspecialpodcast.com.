/* =================================================================
   MY CAT DIED — Interactions (Vanilla JS only)
   After School with Friends Collective
   ================================================================= */
(function () {
  'use strict';

  // ---------- Year stamp ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Nav: scrolled state ----------
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu toggle ----------
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
  function openMenu() {
    if (!toggle || !menu) return;
    toggle.classList.add('open');
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ---------- Smooth scroll with nav offset ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Form: async submit to Formspree ----------
  var form = document.querySelector('.submit-form');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (note) {
        note.textContent = 'Sending\u2026';
        note.classList.remove('error');
      }

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          if (note) note.textContent = 'Thank you — your thought has been sent.';
          return;
        }
        return res.json().then(function (d) {
          if (note) {
            var msg = (d && d.errors && d.errors.map(function (x) { return x.message; }).join(', ')) ||
                      'Something went wrong. Try again.';
            note.textContent = msg;
            note.classList.add('error');
          }
        });
      })
      .catch(function () {
        if (note) {
          note.textContent = 'Network error. Please try again.';
          note.classList.add('error');
        }
      });
    });
  }

  // ---------- Hero video: ensure autoplay on iOS ----------
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    var p = heroVideo.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* autoplay blocked — poster will show */ });
    }
  }
})();
