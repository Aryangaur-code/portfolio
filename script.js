/* =============================================
   ARYAN GAUR — 3D MODERNIST PORTFOLIO
   script.js — Three.js WebGL, 3D Deck & Morph Transitions
   ============================================= */
(function () {
  'use strict';
  /* ── 1. CUSTOM CURSOR & CLICK RIPPLES ── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (cursor && cursorRing) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();
    const hoverTargets = 'a, button, .modern-card, .skill-card-modern, .ach-item-modern, .contact-card-modern, .stat-block, .hero-3d-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
    // 3D Click Spark Effect
    document.addEventListener('click', (e) => {
      const spark = document.createElement('div');
      spark.className = 'cursor-spark';
      spark.style.cssText = `
        position: fixed; left: ${e.clientX}px; top: ${e.clientY}px;
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--gold); pointer-events: none; z-index: 9997;
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 0 0 14px var(--gold);
        transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s ease-out;
      `;
      document.body.appendChild(spark);
      requestAnimationFrame(() => {
