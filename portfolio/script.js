// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
  });
}
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
    navLinks.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-expanded', 'false');
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenu?.classList.remove('active');
        mobileMenu?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Theme toggle (keeps existing body classes)
const themeToggle = document.getElementById('theme-toggle');
const setTheme = (mode) => {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(mode);
  localStorage.setItem('theme', mode);
};
setTheme(localStorage.getItem('theme') || 'light-mode');
themeToggle?.addEventListener('click', () => {
  const next = document.body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
  setTheme(next);
});

// Cart badge demo
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
let cart = 0;
const updateCount = () => {
  if (!cartCount) return;
  cartCount.textContent = cart;
  cartCount.style.visibility = cart > 0 ? 'visible' : 'hidden';
};
updateCount();
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => { cart += 1; updateCount(); });
});
cartBtn?.addEventListener('click', () => alert(`Cart items (demo): ${cart}`));

// Scroll reveal
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Contact form submit inline success
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name')?.value || 'Friend';
  const email = document.getElementById('email')?.value || '';
  alert(`Thank you ${name}! I'll reach out at ${email}.`);
  contactForm.reset();
});

// Coming soon form (inline success)
const comingSoonForm = document.getElementById('comingSoonForm');
const comingSuccess = document.getElementById('comingSoonSuccess');
comingSoonForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (comingSuccess) {
    comingSuccess.textContent = 'You are in! Check your inbox for early access details.';
  }
  comingSoonForm.reset();
});
