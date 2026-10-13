/* =============================================
   ARYAN GAUR — PORTFOLIO
   script.js — Apple-Minimalist Interactions & Tinted Neural Canvases
   ============================================= */

(function () {
  'use strict';

  /* ── 1. TINTED MONOCHROME NEURAL NETWORK CANVAS (HERO & FOOTER ONLY) ── */
  function initNeuralCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;

    const parent = canvas.parentElement;
    let width = parent.clientWidth || window.innerWidth;
    let height = parent.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle nodes setup (Monochrome subtle grey)
    const particleCount = 55;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const spreadX = 65, spreadY = 40, spreadZ = 20;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.008
      });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circle Sprite in subtle monochrome white/grey
    const canvasPoint = document.createElement('canvas');
    canvasPoint.width = 32; canvasPoint.height = 32;
    const ctx = canvasPoint.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(0.5, 'rgba(200, 200, 210, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const pointTexture = new THREE.CanvasTexture(canvasPoint);
    const particleMaterial = new THREE.PointsMaterial({
      size: 1.8,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // Dynamic Connections
    const maxConnections = particleCount * (particleCount - 1);
    const linePositions = new Float32Array(maxConnections * 3);
    const lineColors    = new Float32Array(maxConnections * 3);
    const lineGeometry  = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Subtle parallax tracking
    let targetCameraX = 0, targetCameraY = 0;
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetCameraX = normX * 6;
      targetCameraY = -normY * 4;
    }, { passive: true });

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) animate();
    });

    const maxDistance = 12;
    function animate() {
      if (!isVisible) return;

      const pos = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3]     += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(pos[i * 3])     > spreadX / 2) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > spreadY / 2) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > spreadZ / 2) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      let lineIndex = 0;
      let colorIndex = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3]     - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = 1 - (dist / maxDistance);
            linePositions[lineIndex++] = pos[i * 3];
            linePositions[lineIndex++] = pos[i * 3 + 1];
            linePositions[lineIndex++] = pos[i * 3 + 2];
            linePositions[lineIndex++] = pos[j * 3];
            linePositions[lineIndex++] = pos[j * 3 + 1];
            linePositions[lineIndex++] = pos[j * 3 + 2];

            // Subtle tinted grey line colors
            const val = 0.5 * alpha;
            lineColors[colorIndex++] = val; lineColors[colorIndex++] = val; lineColors[colorIndex++] = val;
            lineColors[colorIndex++] = val; lineColors[colorIndex++] = val; lineColors[colorIndex++] = val;
          }
        }
      }
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      camera.position.x += (targetCameraX - camera.position.x) * 0.025;
      camera.position.y += (targetCameraY - camera.position.y) * 0.025;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  // Initialize strictly at Start (Hero) and End (Contact/Footer)
  initNeuralCanvas('hero-bg-canvas');
  initNeuralCanvas('footer-bg-canvas');

  /* ── 2. STAT COUNTER ANIMATION (8.50 CGPA & 9.50 SGPA) ── */
  function animateCounter(el, target, suffix, decimals) {
    const duration = 1200;
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

  document.querySelectorAll('.kpi-value, .score-num').forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const text = el.textContent.trim();
        if (text === '8.50' || text === '8.94') animateCounter(el, 8.50, '', 2);
        else if (text === '9.50') animateCounter(el, 9.50, '', 2);
        else if (text === '7×' || text === '5×') animateCounter(el, 7, '×', 0);
        else if (text === '3×')   animateCounter(el, 3,    '×', 0);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── 3. MOBILE MENU TOGGLE ── */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open') ? 'ri-close-line' : 'ri-menu-4-line';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-4-line';
      });
    });
  }

  /* ── 4. ACTIVE NAVIGATION LINK ON SCROLL ── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }, { passive: true });

  /* ── 5. NATIVE SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 64,
          behavior: 'smooth'
        });
      }
    });
  });

})();
