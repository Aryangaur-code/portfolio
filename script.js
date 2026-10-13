/* =============================================
   ARYAN GAUR — 3D CYBERNETIC AI-ML PORTFOLIO
   script.js — Center 3D Neon Blue Core, 3D Rolling Wheel & Morph Transitions
   ============================================= */

(function () {
  'use strict';

  /* ── 1. CYBERNETIC CURSOR & NEON SPARK BURSTS ── */
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

    const hoverTargets = 'a, button, .modern-card, .skill-card-modern, .ach-item-modern, .contact-card-modern, .hud-stat-box, .stage-frame, .wheel-hud-node';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    // 3D Neon Blue Click Spark Effect
    document.addEventListener('click', (e) => {
      const spark = document.createElement('div');
      spark.className = 'cursor-spark';
      spark.style.cssText = `
        position: fixed; left: ${e.clientX}px; top: ${e.clientY}px;
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--neon-blue); pointer-events: none; z-index: 9997;
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 0 0 16px var(--neon-blue), 0 0 28px var(--neon-azure);
        transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s ease-out;
      `;
      document.body.appendChild(spark);
      requestAnimationFrame(() => {
        spark.style.transform = 'translate(-50%, -50%) scale(5)';
        spark.style.opacity = '0';
      });
      setTimeout(() => spark.remove(), 450);
    });
  }

  /* ── 2. THREE.JS 3D AMBIENT BACKGROUND (NEON BLUE NEURAL MESH) ── */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 55;

    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle nodes setup
    const particleCount = 85;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const spreadX = 80, spreadY = 60, spreadZ = 35;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

      velocities.push({
        x: (Math.random() - 0.5) * 0.025,
        y: (Math.random() - 0.5) * 0.025,
        z: (Math.random() - 0.5) * 0.015
      });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circle Sprite Material in Neon Cyan
    const canvasPoint = document.createElement('canvas');
    canvasPoint.width = 32; canvasPoint.height = 32;
    const ctx = canvasPoint.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
    grad.addColorStop(0, 'rgba(0, 243, 255, 1)');
    grad.addColorStop(0.5, 'rgba(0, 119, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0, 243, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const pointTexture = new THREE.CanvasTexture(canvasPoint);
    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // Dynamic Synaptic Lines in Cyan Blue
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

    // Mouse parallax tracking
    let targetCameraX = 0, targetCameraY = 0;
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetCameraX = normX * 12;
      targetCameraY = -normY * 10;
    }, { passive: true });

    // Scroll parallax tracking
    let scrollYOffset = 0;
    window.addEventListener('scroll', () => {
      scrollYOffset = window.scrollY * 0.02;
    }, { passive: true });

    // Animation Loop
    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) animateBg();
    });

    const maxDistance = 14;
    function animateBg() {
      if (!isTabVisible) return;

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

            // Neon Blue RGB: (0, 0.95*alpha, 1.0*alpha)
            const r = 0.0, g = 0.95 * alpha, b = 1.0 * alpha;
            lineColors[colorIndex++] = r; lineColors[colorIndex++] = g; lineColors[colorIndex++] = b;
            lineColors[colorIndex++] = r; lineColors[colorIndex++] = g; lineColors[colorIndex++] = b;
          }
        }
      }
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      camera.position.x += (targetCameraX - camera.position.x) * 0.035;
      camera.position.y += ((targetCameraY - scrollYOffset) - camera.position.y) * 0.035;
      camera.lookAt(0, -scrollYOffset * 0.5, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animateBg);
    }
    animateBg();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ── 3. HERO CENTER STAGE 3D NEON BLUE NEURAL CORE ── */
  const hero3dContainer = document.getElementById('hero3dCanvas');
  if (hero3dContainer && typeof THREE !== 'undefined') {
    const width  = hero3dContainer.clientWidth || 400;
    const height = hero3dContainer.clientHeight || 280;

    const sceneHero = new THREE.Scene();
    const cameraHero = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraHero.position.z = 4.6;

    const rendererHero = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererHero.setSize(width, height);
    rendererHero.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hero3dContainer.appendChild(rendererHero.domElement);

    // Cyan Ambient & Directional Lighting
    const ambLight = new THREE.AmbientLight(0x00f3ff, 0.85);
    sceneHero.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0x00f3ff, 2.5);
    dirLight.position.set(5, 5, 5);
    sceneHero.add(dirLight);
    const bluePointLight = new THREE.PointLight(0x0077ff, 3.0, 10);
    bluePointLight.position.set(-3, -3, 2);
    sceneHero.add(bluePointLight);

    // 3D Core Group
    const coreGroup = new THREE.Group();
    sceneHero.add(coreGroup);

    // 1. Outer Icosahedron Wireframe in Electric Neon Blue
    const icoGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // 2. Vertex Node Points on Icosahedron
    const vertexPositions = icoGeo.attributes.position;
    const vertexPointsGeo = new THREE.BufferGeometry();
    vertexPointsGeo.setAttribute('position', vertexPositions);
    const vertexPointsMat = new THREE.PointsMaterial({
      color: 0x80f9ff,
      size: 0.14,
      transparent: true,
      opacity: 0.95
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, vertexPointsMat);
    coreGroup.add(vertexPoints);

    // 3. Glowing Inner Crystalline Dodecahedron Core in Deep Neon Azure
    const innerGeo = new THREE.DodecahedronGeometry(0.74);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x003366,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 4. Orbiting Multi-Axis Cybernetic Rings
    const ring1Geo = new THREE.TorusGeometry(1.72, 0.018, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.8 });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.0, 0.014, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x0099ff, transparent: true, opacity: 0.55 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // Interactive Drag to Orbit with Damping Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0.006, y: 0.009 };

    function onPointerDown(clientX, clientY) {
      isDragging = true;
      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerMove(clientX, clientY) {
      if (!isDragging) return;
      const deltaX = clientX - prevMousePos.x;
      const deltaY = clientY - prevMousePos.y;

      rotVelocity.y = deltaX * 0.009;
      rotVelocity.x = deltaY * 0.009;

      coreGroup.rotation.y += rotVelocity.y;
      coreGroup.rotation.x += rotVelocity.x;

      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerUp() { isDragging = false; }

    hero3dContainer.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    hero3dContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    function animateHeroCore() {
      requestAnimationFrame(animateHeroCore);

      if (!isDragging) {
        rotVelocity.x += (0.004 - rotVelocity.x) * 0.04;
        rotVelocity.y += (0.008 - rotVelocity.y) * 0.04;

        coreGroup.rotation.x += rotVelocity.x;
        coreGroup.rotation.y += rotVelocity.y;
      }

      ring1.rotation.z += 0.012;
      ring2.rotation.z -= 0.009;
      innerMesh.rotation.y -= 0.006;

      rendererHero.render(sceneHero, cameraHero);
    }
    animateHeroCore();

    window.addEventListener('resize', () => {
      const w = hero3dContainer.clientWidth;
      const h = hero3dContainer.clientHeight;
      if (w && h) {
        cameraHero.aspect = w / h;
        cameraHero.updateProjectionMatrix();
        rendererHero.setSize(w, h);
      }
    });
  }

  /* ── 4. 3D ROLLING CARD WHEEL ON SCROLL ── */
  const wheelSections = document.querySelectorAll('.wheel-card-section');
  const wheelDial     = document.getElementById('wheelDial');
  const hudNodes      = document.querySelectorAll('.wheel-hud-node');

  function updateRollingWheel() {
    const vh = window.innerHeight;
    const centerY = vh / 2;

    wheelSections.forEach((section, idx) => {
      const rect = section.getBoundingClientRect();
      const secCenterY = rect.top + rect.height / 2;
      const distFromCenter = secCenterY - centerY;

      // Cylindrical 3D pitch angle (clamped between -26deg and 26deg)
      const maxAngle = 26;
      const angle = Math.max(-maxAngle, Math.min(maxAngle, (distFromCenter / vh) * 32));
      const zOffset = -Math.abs(distFromCenter) * 0.12;
      const opacity = 1 - Math.min(0.45, Math.abs(distFromCenter) / (vh * 1.6));

      section.style.setProperty('--wheel-rot', `${angle}deg`);
      section.style.setProperty('--wheel-z', `${zOffset}px`);
      section.style.opacity = opacity.toFixed(2);
      section.classList.add('rolling-wheel-active');

      // Update active gauge indicator if section is in prime view
      if (Math.abs(distFromCenter) < rect.height / 2) {
        if (wheelDial) {
          const displayIdx = String(idx + 1).padStart(2, '0');
          wheelDial.textContent = `${displayIdx}/07`;
        }
        hudNodes.forEach((node, nodeIdx) => {
          node.classList.toggle('active', nodeIdx === idx);
        });
      }
    });
  }

  window.addEventListener('scroll', updateRollingWheel, { passive: true });
  window.addEventListener('resize', updateRollingWheel);
  updateRollingWheel();

  /* ── 5. 3D DECK VIEW TOGGLE ── */
  const decks = document.querySelectorAll('.modern-card-deck');
  decks.forEach(deck => {
    const cards = deck.querySelectorAll('.modern-card');
    cards.forEach((card, idx) => {
      card.style.setProperty('--card-index', idx);
    });
  });

  const deckModeToggle = document.getElementById('deckModeToggle');
  if (deckModeToggle) {
    let isDeckMode = false;
    deckModeToggle.addEventListener('click', () => {
      isDeckMode = !isDeckMode;
      deckModeToggle.classList.toggle('active', isDeckMode);
      deckModeToggle.innerHTML = isDeckMode
        ? '<span class="mode-icon">▥</span> GRID VIEW'
        : '<span class="mode-icon">◎</span> 3D CARD WHEEL';

      decks.forEach(deck => deck.classList.toggle('deck-active', isDeckMode));
    });
  }

  /* ── 6. 3D CARD PERSPECTIVE TILT & SPECULAR GLARE ── */
  const cardsToTilt = document.querySelectorAll('.modern-card, .skill-card-modern, .ach-item-modern, .contact-card-modern, .bit-image-container');
  cardsToTilt.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (card.closest('.deck-active')) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;

      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle 220px at ${x}px ${y}px, rgba(0, 243, 255, 0.22), transparent 75%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.closest('.deck-active')) return;
      card.style.transform = '';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.opacity = '0';
    });
  });

  /* ── 7. MORPH DETAIL MODAL CONTROLLER ── */
  const morphModal     = document.getElementById('morphModal');
  const morphContent   = document.getElementById('morphContent');
  const morphCloseBtn  = document.getElementById('morphCloseBtn');

  function openCardMorph(card) {
    if (!morphModal || !morphContent) return;

    const topBar = card.querySelector('.card-top-bar');
    const heading = card.querySelector('.card-heading, .card-org-name');
    const orgName = card.querySelector('.card-org-name, .card-title-code, .venue-pill');
    const bullets = card.querySelector('.card-bullets');
    const abstract = card.querySelector('.pub-abstract, .card-desc');
    const methodGrid = card.querySelector('.pub-method-grid');
    const tagRow = card.querySelector('.card-tag-row');
    const authBox = card.querySelector('.auth-box');
    const bitCampus = card.querySelector('.bit-campus-img');

    let expandedHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(0,243,255,0.25); padding-bottom:1rem; margin-bottom:1.5rem;">
        <div>
          <span style="font-family:'DM Mono',monospace; font-size:9px; color:var(--neon-blue); letter-spacing:.16em; text-transform:uppercase;">
            ${topBar ? topBar.querySelector('.card-code').textContent : 'TECHNICAL TELEMETRY'}
          </span>
          <h2 style="font-family:'DM Serif Display',serif; font-size:2rem; color:#ffffff; margin-top:4px; line-height:1.2;">
            ${heading ? heading.textContent : (orgName ? orgName.textContent : 'Architecture Breakdown')}
          </h2>
        </div>
      </div>
    `;

    if (bitCampus) {
      expandedHtml += `
        <div style="margin-bottom:1.5rem; border-radius:14px; overflow:hidden; border:1px solid var(--neon-blue-border); box-shadow:0 0 20px rgba(0,243,255,0.2);">
          <img src="bit_mesra.png" alt="BIT Mesra Campus" style="width:100%; height:260px; object-fit:cover; display:block;" />
          <div style="padding:10px 14px; background:rgba(5,5,8,0.9); font-family:'DM Mono',monospace; font-size:8px; color:var(--neon-blue);">
            ✦ BIRLA INSTITUTE OF TECHNOLOGY, MESRA · MAIN ACADEMIC BUILDING &amp; RESEARCH CAMPUS
          </div>
        </div>
      `;
    }

    if (authBox) {
      expandedHtml += `
        <div style="background:rgba(0,243,255,0.08); border:1px solid var(--neon-blue); border-radius:10px; padding:12px 18px; margin-bottom:1.5rem; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <span style="font-family:'DM Mono',monospace; font-size:8px; color:var(--neon-blue); letter-spacing:.12em;">PEER-REVIEWED STATUS:</span>
            <div style="font-size:13px; color:#ffffff; font-weight:600; margin-top:2px;">Aryan Gaur (Lead Author &amp; Primary Researcher)</div>
          </div>
          <span style="font-family:'DM Mono',monospace; font-size:8.5px; background:var(--neon-blue); color:#050508; padding:4px 10px; border-radius:99px; font-weight:700;">
            VERIFIED PAPER
          </span>
        </div>
      `;
    }

    if (methodGrid) {
      expandedHtml += `
        <div style="margin-bottom:1.5rem;">
          <span style="font-family:'DM Mono',monospace; font-size:8px; color:var(--ink-dim); letter-spacing:.12em; text-transform:uppercase; display:block; margin-bottom:8px;">
            MODEL INFERENCE &amp; BENCHMARKS
          </span>
          ${methodGrid.outerHTML}
        </div>
      `;
    }

    if (abstract) {
      expandedHtml += `
        <div style="margin-bottom:1.5rem;">
          <span style="font-family:'DM Mono',monospace; font-size:8px; color:var(--ink-dim); letter-spacing:.12em; text-transform:uppercase; display:block; margin-bottom:8px;">
            TECHNICAL ARCHITECTURE ABSTRACT
          </span>
          <p style="font-size:13.5px; color:#c5bcac; line-height:1.8; font-weight:300;">
            ${abstract.innerHTML}
          </p>
        </div>
      `;
    }

    if (bullets) {
      expandedHtml += `
        <div style="margin-bottom:1.5rem;">
          <span style="font-family:'DM Mono',monospace; font-size:8px; color:var(--ink-dim); letter-spacing:.12em; text-transform:uppercase; display:block; margin-bottom:8px;">
            SYSTEM IMPLEMENTATION &amp; BENCHMARKS
          </span>
          <ul style="list-style:none; padding-left:0;">
            ${bullets.innerHTML}
          </ul>
        </div>
      `;
    }

    if (tagRow) {
      expandedHtml += `
        <div style="margin-top:1.5rem; padding-top:1.2rem; border-top:1px solid rgba(255,255,255,0.06);">
          <span style="font-family:'DM Mono',monospace; font-size:8px; color:var(--ink-dim); letter-spacing:.12em; text-transform:uppercase; display:block; margin-bottom:8px;">
            TECHNOLOGY STACK
          </span>
          ${tagRow.outerHTML}
        </div>
      `;
    }

    morphContent.innerHTML = expandedHtml;
    morphModal.classList.add('open');
    morphModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCardMorph() {
    if (!morphModal) return;
    morphModal.classList.remove('open');
    morphModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modern-card').forEach(card => {
    card.addEventListener('click', () => openCardMorph(card));
  });

  if (morphCloseBtn) morphCloseBtn.addEventListener('click', closeCardMorph);
  if (morphModal) {
    morphModal.addEventListener('click', (e) => {
      if (e.target === morphModal) closeCardMorph();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && morphModal && morphModal.classList.contains('open')) {
      closeCardMorph();
    }
  });

  /* ── 8. STAT COUNTER ANIMATION (CGPA 8.50 & SGPA 9.50) ── */
  function animateCounter(el, target, suffix, decimals) {
    const duration = 1350;
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

  document.querySelectorAll('.hud-stat-num, .score-digit').forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const text = el.textContent.trim();
        if (text === '8.50' || text === '8.94') animateCounter(el, 8.50, '', 2);
        else if (text === '9.50') animateCounter(el, 9.50, '', 2);
        else if (text === '5×')   animateCounter(el, 5,    '×', 0);
        else if (text === '3×')   animateCounter(el, 3,    '×', 0);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── 9. NAV SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.style.background = window.scrollY > 60
        ? 'rgba(5, 5, 8, 0.98)'
        : 'rgba(5, 5, 8, 0.94)';
    }
  }, { passive: true });

  /* ── 10. MOBILE MENU ── */
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

  /* ── 11. ACTIVE NAV HIGHLIGHT ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  sections.forEach(sec => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(sec);
  });

  /* ── 12. SMOOTH SCROLL ── */
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

  /* ── 13. MARQUEE PAUSE ON HOVER ── */
  const strip = document.querySelector('.strip-inner');
  if (strip) {
    strip.addEventListener('mouseenter', () => { strip.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { strip.style.animationPlayState = 'running'; });
  }

})();
