/* =========================================================
   Viralaya — Enhanced interactions
   - Mobile menu
   - Sticky topbar shadow on scroll
   - Dark / light theme with localStorage + system preference
   - Scroll-reveal using IntersectionObserver
   - Footer year
   - Quote form friendly ack (no backend)
   ========================================================= */

(() => {
  const body = document.body;
  const topbar = document.querySelector(".topbar");
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");
  const yearEl = document.querySelector("#year");
  const themeToggle = document.getElementById("theme-toggle");
  const revealEls = document.querySelectorAll(".reveal");
  const quoteForm = document.getElementById("quote-form");

  /* -------- Mobile nav -------- */
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("nav-open");
    });
  }
  navLinks.forEach((link) =>
    link.addEventListener("click", () => body.classList.remove("nav-open"))
  );

  /* -------- Sticky topbar border on scroll -------- */
  if (topbar) {
    const onScroll = () => {
      topbar.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Footer year -------- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------- Theme toggle -------- */
  const STORAGE_KEY = "viralaya:theme";

  const getPreferredTheme = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {
      /* localStorage unavailable */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#15110d" : "#fbf7f3");
  };

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (_) {
        /* ignore */
      }
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });
  }

  // React to system theme changes if the user hasn't picked one yet
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener?.("change", (e) => {
      let userPicked = false;
      try {
        userPicked = !!localStorage.getItem(STORAGE_KEY);
      } catch (_) {
        userPicked = false;
      }
      if (!userPicked) applyTheme(e.matches ? "dark" : "light");
    });

  /* -------- Scroll reveal -------- */
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings =
              entry.target.parentElement?.querySelectorAll(".reveal") || [];
            const idx = Array.from(siblings).indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx, 4) * 80}ms`;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------- Quote form (no backend; friendly ack) -------- */
  if (quoteForm) {
    const status = document.createElement("p");
    status.className = "quote-status";
    status.setAttribute("role", "status");
    quoteForm.appendChild(status);

    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const button = quoteForm.querySelector('button[type="submit"]');
      const original = button.textContent;
      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }
      const data = Object.fromEntries(new FormData(quoteForm).entries());
      button.textContent = "Sending…";
      button.disabled = true;
      [...quoteForm.elements].forEach((el) => (el.disabled = true));

      // Simulated submission. Replace with a real POST to your backend
      // (e.g. fetch('/api/quote', { method:'POST', body: JSON.stringify(data) }))
      setTimeout(() => {
        status.textContent = `Thanks ${data.name?.split(" ")[0] || ""} — we've received your enquiry and will reply within one business day.`;
        status.classList.add("is-success");
        button.textContent = "Sent ✓";
        setTimeout(() => {
          button.textContent = original;
          button.disabled = false;
          [...quoteForm.elements].forEach((el) => {
            if (el !== status) el.disabled = false;
          });
        }, 3500);
      }, 600);
    });
  }
})();
