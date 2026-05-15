/* =============================================
   ARYAN GAUR — PORTFOLIO
   script.js — All Interactions
   ============================================= */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-card, .skill-card, .edu-card, .ach-item, .contact-link, .stat-block, .exp-item')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
      });
  }

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.style.background = window.scrollY > 60
        ? 'rgba(28,26,20,0.99)'
        : 'rgba(28,26,20,0.95)';
    }
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', closeMenu));
  }

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.closest('.hero')) {
        entry.target.style.animationPlayState = 'running';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up').forEach(el => {
    if (!el.closest('.hero')) {
      el.style.animationPlayState = 'paused';
      revealObserver.observe(el);
    }
  });

  /* ── ACTIVE NAV ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  sections.forEach(sec => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + entry.target.id
              ? 'var(--gold)' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(sec);
  });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 56,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── PROJECT CARD TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
      card.style.transform = `perspective(700px) rotateY(${dx * 3.5}deg) rotateX(${-dy * 3.5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── STAT COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix, decimals) {
    const duration = 1300;
    const startTime = performance.now();
    (function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = decimals
        ? (eased * target).toFixed(decimals) + suffix
        : Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  document.querySelectorAll('.stat-num').forEach(el => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const text = el.textContent.trim();
        if (text === '8.94') animateCounter(el, 8.94, '', 2);
        if (text === '5×')   animateCounter(el, 5,    '×', 0);
      });
    }, { threshold: 0.6 }).observe(el);
  });

  /* ── MARQUEE PAUSE ON HOVER ── */
  const strip = document.querySelector('.strip-inner');
  if (strip) {
    strip.addEventListener('mouseenter', () => { strip.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { strip.style.animationPlayState = 'running'; });
  }

})();
