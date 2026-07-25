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

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}
