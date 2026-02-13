/* ═══════════════════════════════════════════════════════
   AI HISTORY — INTERACTIVE TIMELINE · SCRIPT
   ═══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
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

  /* ── Particle generator ───────────────────────────── */
  const particlesContainer = document.getElementById("particles");
  const particleCount = 35;

  for (let i = 0; i < particleCount; i++) {
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
