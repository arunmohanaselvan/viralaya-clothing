// ============================================================
// Viralaya — Fabric / Loom Theme interactions
// ============================================================

// --- Mobile menu toggle ---
const toggleButton = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

function setTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('viralaya-theme', theme);
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

// --- Festival Section Initialization ---
function initFestivalSection() {
  const config = window.VIRALAYA_FESTIVAL;
  if (!config || !config.enabled) {
    return; // Section stays hidden via HTML 'hidden' attribute
  }

  const section = document.getElementById('festival');
  if (!section) return;

  // Show the section
  section.hidden = false;

  // Populate content
  const img = document.getElementById('festival-section-img');
  const badge = document.getElementById('festival-badge');
  const heading = document.getElementById('festival-heading');
  const tagline = document.getElementById('festival-tagline');
  const desc = document.getElementById('festival-description');
  const cta = document.getElementById('festival-cta');

  if (img) {
    img.src = config.image || '';
    img.alt = config.alt || '';
  }
  if (badge) {
    badge.textContent = config.name || 'Festival';
  }
  if (heading) {
    heading.textContent = `${config.name || 'Festival'} Collection`;
  }
  if (tagline) {
    tagline.textContent = `${config.name || 'Festival'} Edition`;
  }
  if (desc) {
    desc.textContent = config.description || 'Discover our curated festive edit — thoughtful pieces for the season.';
  }
  if (cta) {
    cta.querySelector('span').textContent = config.ctaText || 'Explore Collection';
    cta.href = config.ctaLink || '#craft';
  }
}

// Initialize festival section when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFestivalSection);
} else {
  initFestivalSection();
}

// --- Photo Slider ---
const photoSlider = document.querySelector('.photo-slider');
if (photoSlider) {
  const track = photoSlider.querySelector('.photo-track');
  const prevBtn = photoSlider.querySelector('.slider-nav.prev');
  const nextBtn = photoSlider.querySelector('.slider-nav.next');
  const items = track.querySelectorAll('.photo-item');

  let currentIndex = 0;
  const totalItems = items.length;

  function updateSlider() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // Handle image loading for slider
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (img) {
      if (img.complete) {
        img.classList.add('loaded');
        item.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
          item.classList.add('loaded');
        });
        img.addEventListener('error', () => {
          img.classList.add('loaded');
          item.classList.add('loaded');
        });
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateSlider();
    });
  }

  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) {
      prevBtn.click();
    } else if (e.key === 'ArrowRight' && nextBtn) {
      nextBtn.click();
    }
  });
}

// --- Festival image loading ---
const festivalImg = document.getElementById('festival-section-img');
if (festivalImg) {
  const wrapper = festivalImg.closest('.festival-image-wrapper');
  if (festivalImg.complete) {
    festivalImg.classList.add('loaded');
    if (wrapper) wrapper.classList.add('loaded');
  } else {
    festivalImg.addEventListener('load', () => {
      festivalImg.classList.add('loaded');
      if (wrapper) wrapper.classList.add('loaded');
    });
    festivalImg.addEventListener('error', () => {
      festivalImg.classList.add('loaded');
      if (wrapper) wrapper.classList.add('loaded');
    });
  }
}