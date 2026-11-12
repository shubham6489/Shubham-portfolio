/**
 * SHUBHAM KUMAR - PREMIUM CINEMATIC PORTFOLIO JAVASCRIPT
 * Features:
 *  - Cinematic preloader with counter
 *  - Interactive swarm cursor with trailing physics
 *  - Neural/Constellation canvas interactive background
 *  - Scroll-triggered reveal animations
 *  - Filterable portfolio grid
 *  - Interactive interactive card tilt
 *  - Smooth communications form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  initPreloader();
  initHeader();
  initSwarmCursor();
  initNeuralCanvas();
  initScrollReveals();
  initPortfolioFilters();
  initCardTilt();
  initContactForm();
});

/* ==========================================================================
   1. Cinematic Preloader
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('loaderBar');
  const counter = document.getElementById('loaderCounter');

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    if (count > 100) count = 100;

    if (bar) bar.style.width = `${count}%`;
    if (counter) counter.textContent = `${count < 10 ? '0' : ''}${count}%`;

    if (count === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 400);
    }
  }, 22);
}

/* ==========================================================================
   2. Header Scroll & Mobile Nav
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   3. Custom Cursor & Multi-Particle Swarm Animation
   ========================================================================== */
function initSwarmCursor() {
  if (window.innerWidth <= 768) return; // Disabled on touch devices

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const swarmContainer = document.getElementById('cursorSwarm');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  // Track cursor
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    }
  });

  // Smooth Ring Follower
  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (ring) {
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover states for active tags & buttons
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .ai-card, .portfolio-card');
  interactives.forEach((item) => {
    item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Swarm Particles (Orbiting Cluster following cursor)
  const SWARM_COUNT = 8;
  const swarmParticles = [];

  for (let i = 0; i < SWARM_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'swarm-dot';
    const size = Math.random() * 4 + 2;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    swarmContainer.appendChild(el);

    swarmParticles.push({
      el,
      x: mouseX,
      y: mouseY,
      angle: (i / SWARM_COUNT) * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      radius: 18 + Math.random() * 22,
      lag: 0.08 + (i * 0.015)
    });
  }

  function updateSwarm() {
    swarmParticles.forEach((p) => {
      p.angle += p.speed;
      const targetX = mouseX + Math.cos(p.angle) * p.radius;
      const targetY = mouseY + Math.sin(p.angle) * p.radius;

      p.x += (targetX - p.x) * p.lag;
      p.y += (targetY - p.y) * p.lag;

      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
    });
    requestAnimationFrame(updateSwarm);
  }
  requestAnimationFrame(updateSwarm);
}

/* ==========================================================================
   4. Neural Constellation Canvas (Hero Background)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 55;
  const CONNECTION_DIST = 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 1.8 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1a35';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff1a35';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = 1 - dist / CONNECTION_DIST;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 26, 53, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   5. Scroll Triggered Reveals (Intersection Observer)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. Portfolio Filter Mechanism
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. 3D Card Tilt on Mouse Move
   ========================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   8. Contact Transmission Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = '// TRANSMISSION FAILED: Fill in all parameters.';
      feedback.className = 'form-feedback error';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = '// TRANSMISSION FAILED: Invalid signal frequency (Email).';
      feedback.className = 'form-feedback error';
      return;
    }

    // Success State Simulation
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Encrypting & Transmitting...';

    setTimeout(() => {
      feedback.textContent = 'Transmission received. Shubham Kumar will respond shortly.';
      feedback.className = 'form-feedback success';
      submitBtn.querySelector('.btn-text').textContent = 'Transmission Delivered';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Transmit Signal';
      }, 5000);
    }, 1200);
  });
}