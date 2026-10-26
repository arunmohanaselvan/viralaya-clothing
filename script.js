// ============================================================
// Viralaya — Fabric / Loom Theme interactions
// ============================================================

// --- Curtain page-load reveal ---
const curtain = document.querySelector('.curtain');
if (curtain) {
  // Remove curtain after animation completes
  curtain.addEventListener('animationend', (e) => {
    if (e.animationName === 'curtain-close') {
      curtain.remove();
    }
  });
  // Fallback: remove after 1.5s
  setTimeout(() => curtain.remove(), 1500);
}

// --- Mobile menu toggle ---
const toggleButton = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

function getSavedTheme() {
  try {
    return window.localStorage.getItem('viralaya-theme');
  } catch (error) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      console.warn('Theme preference storage is unavailable; using the default theme.');
      return null;
    }
    throw error;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem('viralaya-theme', theme);
  } catch (error) {
    if (error instanceof DOMException && ['SecurityError', 'QuotaExceededError'].includes(error.name)) {
      console.warn('Theme preference could not be saved; the theme will apply for this visit.');
      return;
    }
    throw error;
  }
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-theme', isDark);
  saveTheme(theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = getSavedTheme();
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

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

// Fallback: ensure elements become visible after a timeout
// in case IntersectionObserver doesn't fire for already-visible elements
setTimeout(() => {
  revealElements.forEach((el) => {
    if (!el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
}, 1000);

// Immediate fallback: check if elements are already in viewport on load
setTimeout(() => {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
}, 100);

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

// --- Hero Slider Initialization ---
function initHeroSlider() {
  const slider = document.querySelector('.photo-slider-hero');
  if (!slider) return;

  const track = slider.querySelector('.photo-track-hero');
  const items = slider.querySelectorAll('.photo-item-hero');
  const prevBtn = slider.querySelector('.slider-nav-hero.prev');
  const nextBtn = slider.querySelector('.slider-nav-hero.next');
  const paginationBtns = slider.querySelectorAll('.pagination-btn-hero');

  if (!track || items.length === 0) return;

  let currentIndex = 0;
  const totalItems = items.length;
  let autoSlideInterval;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update pagination
    paginationBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentIndex);
      btn.setAttribute('aria-selected', i === currentIndex);
    });

    // Preload next image
    const nextIndex = (currentIndex + 1) % totalItems;
    const nextImg = items[nextIndex].querySelector('img');
    if (nextImg && !nextImg.src.includes('loaded')) {
      // Trigger load
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalItems) % totalItems;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

  paginationBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => { goToSlide(i); startAutoSlide(); });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoSlide(); }
    if (e.key === 'ArrowRight') { nextSlide(); startAutoSlide(); }
  });

  // Touch swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      startAutoSlide();
    }
  }, { passive: true });

  // IntersectionObserver to pause when not visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAutoSlide();
        else stopAutoSlide();
      });
    }, { threshold: 0.5 });
    observer.observe(slider);
  }

  // Initialize
  updateSlider();
  startAutoSlide();
}

// Initialize hero slider after the markup is available.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSlider, { once: true });
} else {
  initHeroSlider();
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
  const paginationBtns = photoSlider.querySelectorAll('.pagination-btn');

  let currentIndex = 0;
  const totalItems = items.length;

  function updateSlider() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update pagination buttons
    paginationBtns.forEach((btn, index) => {
      btn.classList.toggle('active', index === currentIndex);
      btn.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });
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

  // Pagination button clicks
  paginationBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });

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
