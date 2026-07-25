const toggleButton = document.querySelector('.menu-toggle');
const body = document.body;

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    body.classList.toggle('nav-open');
  });
}

const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

/* Newsletter form submission */
const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    // Remove any existing messages
    const existingMessage = newsletterForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showMessage(newsletterForm, 'Please enter your email address', 'error');
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(newsletterForm, 'Please enter a valid email address', 'error');
      emailInput.focus();
      return;
    }

    // Simulate successful submission
    showMessage(newsletterForm, 'Thank you for subscribing!', 'success');
    emailInput.value = '';

    // Store email in localStorage for demo purposes
    const subscribers = JSON.parse(localStorage.getItem('viralaya_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('viralaya_subscribers', JSON.stringify(subscribers));
    }
  });
}

function showMessage(form, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  form.appendChild(messageDiv);

  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

/* Product actions: quick view, wishlist, share */
function initProductActions() {
  // Quick view functionality
  const quickViewButtons = document.querySelectorAll('.btn-quickview');
  const modal = document.getElementById('quickview-modal');
  const closeBtn = document.querySelector('.close-btn');
  const modalContent = document.querySelector('.modal-content-inner');

  if (quickViewButtons.length && modal && closeBtn) {
    // Sample product data (in a real app, this would come from an API or data attributes)
    const products = [
      {
        id: 1,
        name: "Core Flex Scrub Top",
        tag: "Performance Scrubs",
        price: "$34.99",
        description: "Moisture-wicking fabric with 4-way stretch and antimicrobial finish.",
        image: "https://images.unsplash.com/photo-1582719478250-8916315f864b?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        name: "Core Flex Scrub Pants",
        tag: "Performance Scrubs",
        price: "$39.99",
        description: "Jogger style with elastic waistband and multiple utility pockets.",
        image: "https://images.unsplash.com/photo-1581091887319-5c8d5a7ec6b1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        name: "Premium Lab Coat",
        tag: "Lab Wear",
        price: "$68.99",
        description: "Fluid-resistant with RFID pocket and button-free snap closure.",
        image: "https://images.unsplash.com/photo-1594736797933-d0301ba260e5?auto=format&fit=crop&w=800&q=80"
      }
    ];

    // Attach click handlers to quick view buttons
    quickViewButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = products[index] || products[0]; // Fallback to first product
        populateModal(product);
        modal.style.display = 'block';
        body.style.overflow = 'hidden'; // Prevent scrolling behind modal
      });
    });

    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        body.style.overflow = 'auto'; // Restore scrolling
      }
    });
  }

  // Wishlist functionality
  const wishlistButtons = document.querySelectorAll('.btn-wishlist');
  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering card click if any
      button.classList.toggle('active');

      // Toggle visual state
      const svg = button.querySelector('svg');
      if (button.classList.contains('active')) {
        svg.style.fill = 'var(--error)'; // Red when active
      } else {
        svg.style.fill = ''; // Reset to default
      }

      // Show feedback
      showToast(button, button.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });

  // Share functionality (simplified - just shows alert for demo)
  const shareButtons = document.querySelectorAll('.btn-share');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Share functionality would open share dialog in a real app');
      showToast(button, 'Share link copied!');
    });
  });
}

function populateModal(product) {
  const modalContent = document.querySelector('.modal-content-inner');
  if (!modalContent) return;

  modalContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="modal-info">
      <h2>${product.name}</h2>
      <p class="product-tag">${product.tag}</p>
      <p>${product.description}</p>
      <span class="price">${product.price}</span>
      <div class="modal-actions">
        <button class="button primary">Add to Cart</button>
        <button class="button secondary">Wishlist</button>
      </div>
    </div>
  `;

  // Add event listeners to buttons in modal
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    const addToCartBtn = modal.querySelector('.button.primary');
    const wishlistBtn = modal.querySelector('.button.secondary');

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        showToast(modal, 'Added to cart!');
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishlistBtn.classList.toggle('active');
        const svg = wishlistBtn.querySelector('svg');
        if (wishlistBtn.classList.contains('active')) {
          svg.style.fill = 'var(--error)';
        } else {
          svg.style.fill = '';
        }
        showToast(wishlistBtn, wishlistBtn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
      });
    }
  }
}

function showToast(element, message) {
  // Remove any existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  // Position relative to element
  const rect = element.getBoundingClientRect();
  toast.style.position = 'fixed';
  toast.style.top = `${rect.bottom + window.scrollY + 10}px`;
  toast.style.left = `${rect.left + window.scrollX + rect.width / 2 - 50}px`;
  toast.style.background = 'rgba(0,0,0,0.8)';
  toast.style.color = 'white';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '4px';
  toast.style.fontSize = '0.9rem';
  toast.style.zIndex = '1001';
  toast.style.transform = 'translateX(-50%)';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);

  // Trigger reflow to enable transition
  void toast.offsetWidth;

  // Fade in
  toast.style.opacity = '0.9';

  // Remove after 2 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  initProductActions();
});