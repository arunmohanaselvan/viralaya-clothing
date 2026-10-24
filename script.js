// ============================================================
// Viralaya — Fabric / Loom Theme interactions
// ============================================================

// --- Mobile menu toggle ---
const toggleButton = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

function setTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('viralaya-theme', theme);
  if (themeIcon) {
    themeIcon.textContent = isDark ? '☀' : '☾';
  }
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('viralaya-theme');
setTheme(savedTheme || 'light');

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
  });
}

// Close mobile menu when a nav link is clicked
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
});

// --- Scroll reveal animations ---
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: show everything
  revealElements.forEach((el) => el.classList.add('visible'));
}

// --- Active nav link highlighting on scroll ---
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY;
  let currentId = '';

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - 120;
    if (scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute('href').slice(1);
    if (href === currentId) {
      anchor.classList.add('active');
    } else {
      anchor.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// --- Footer year ---
const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}