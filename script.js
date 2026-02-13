/* ═══════════════════════════════════════════════════════
   AI HISTORY — INTERACTIVE TIMELINE · SCRIPT
   ═══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Theme Toggle ───────────────────────────────────── */
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  /* ── Typing animation for hero title ──────────────── */
  const heroTitle = document.getElementById("heroTitle");
  const titleText = "The History of Artificial Intelligence";
  let charIndex = 0;

  // Create a cursor element
  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  heroTitle.appendChild(cursor);

  function typeChar() {
    if (charIndex < titleText.length) {
      // Insert text before the cursor
      const textNode = document.createTextNode(titleText.charAt(charIndex));
      heroTitle.insertBefore(textNode, cursor);
      charIndex++;
      setTimeout(typeChar, 55 + Math.random() * 35);
    } else {
      // Remove cursor after a pause
      setTimeout(() => cursor.remove(), 1800);
    }
  }

  // Start typing after a brief delay
  setTimeout(typeChar, 600);

  /* ── Hero CTA smooth scroll ───────────────────────── */
  const ctaBtn = document.getElementById("ctaBtn");
  ctaBtn.addEventListener("click", () => {
    document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
  });

  /* ── Interactive Canvas Background ─────────────────── */
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  let mouse = { x: 0, y: 0 };
  const particleCount = 60;
  const connectionDistance = 150;
  const mouseInfluenceRadius = 200;

  // Resize handler
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Mouse tracking
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
    }

    update() {
      // Move particle
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseInfluenceRadius) {
        const force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 0.5;
        this.vy += Math.sin(angle) * force * 0.5;
        this.radius = this.baseRadius * (1 + force);
      } else {
        this.radius += (this.baseRadius - this.radius) * 0.1;
      }

      // Limit velocity
      const maxSpeed = 2.5;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
    }

    draw() {
      const isDark = html.getAttribute("data-theme") === "dark";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(0, 229, 255, ${0.5 + Math.random() * 0.3})`
        : `rgba(0, 168, 181, ${0.4 + Math.random() * 0.2})`;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    const isDark = html.getAttribute("data-theme") === "dark";
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / connectionDistance) * 0.3;
          ctx.strokeStyle = isDark
            ? `rgba(0, 229, 255, ${opacity})`
            : `rgba(0, 168, 181, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw mouse connection
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseInfluenceRadius) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        const opacity = (1 - dist / mouseInfluenceRadius) * 0.4;
        ctx.strokeStyle = isDark
          ? `rgba(168, 85, 247, ${opacity})`
          : `rgba(147, 51, 234, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  /* ── Floating particles overlay ────────────────────── */
  const particlesContainer = document.getElementById("particles");
  const floatingParticleCount = 35;

  for (let i = 0; i < floatingParticleCount; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 4 + 2;
    const hue = Math.random() > 0.5 ? "180" : "270"; // cyan or purple
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${60 + Math.random() * 40}%;
      background: hsla(${hue}, 100%, 70%, ${0.3 + Math.random() * 0.4});
      animation-delay: ${Math.random() * 12}s;
      animation-duration: ${10 + Math.random() * 8}s;
    `;
    particlesContainer.appendChild(p);
  }

  /* ── Intersection Observer for timeline cards ─────── */
  const timelineItems = document.querySelectorAll(".timeline__item");
  const timelineDots = document.querySelectorAll(".timeline__dot");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, observerOptions);

  timelineItems.forEach((item) => itemObserver.observe(item));

  /* ── Active dot tracking on scroll ────────────────── */
  const dotObserverOptions = {
    root: null,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0,
  };

  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const dot = entry.target.querySelector(".timeline__dot");
      if (dot) {
        if (entry.isIntersecting) {
          // Deactivate all dots then activate this one
          timelineDots.forEach((d) => d.classList.remove("is-active"));
          dot.classList.add("is-active");
        }
      }
    });
  }, dotObserverOptions);

  timelineItems.forEach((item) => dotObserver.observe(item));

  /* ── "Read more" toggle ───────────────────────────── */
  const toggleButtons = document.querySelectorAll(".timeline__card-toggle");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const details = document.getElementById(targetId);
      const textSpan = btn.querySelector(".toggle-text");

      if (details.classList.contains("is-open")) {
        // Collapse
        details.style.maxHeight = "0px";
        details.classList.remove("is-open");
        btn.classList.remove("is-open");
        textSpan.textContent = "Read more";
      } else {
        // Expand
        details.classList.add("is-open");
        details.style.maxHeight = details.scrollHeight + "px";
        btn.classList.add("is-open");
        textSpan.textContent = "Read less";
      }
    });
  });

  /* ── Footer year ──────────────────────────────────── */
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ── Subtle parallax on hero ──────────────────────── */
  const hero = document.getElementById("hero");
  const heroContent = document.querySelector(".hero__content");

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const heroH = hero.offsetHeight;

      if (scrollY < heroH) {
        const ratio = scrollY / heroH;
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - ratio * 1.2;
      }
    },
    { passive: true },
  );
});
