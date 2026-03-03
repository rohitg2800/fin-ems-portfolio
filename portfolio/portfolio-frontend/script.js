const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-expanded', 
mobileMenu.classList.contains('active'));
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navLinks &&
    navLinks.classList.contains('active') &&
    !navLinks.contains(e.target) &&
    (!mobileMenu || !mobileMenu.contains(e.target))
  ) {
    navLinks.classList.remove('active');
    mobileMenu?.classList.remove('active');
    mobileMenu?.setAttribute('aria-expanded', 'false');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    
    let target = null;
    try {
      target = document.querySelector(href);
    } catch {
      return;
    }
    
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Close mobile menu after navigation
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenu?.classList.remove('active');
        mobileMenu?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const setTheme = (mode) => {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(mode);
  localStorage.setItem('theme', mode);
  
  // Refresh charts to match theme
  refreshCharts();
};

// Initialize theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark-mode';
setTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const next = document.body.classList.contains('dark-mode') ? 'light-mode' : 
'dark-mode';
  setTheme(next);
});

// Navbar styling and active section highlighting
const navbar = document.getElementById('navbar');
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

// Map section IDs to their elements for performance
const sectionById = new Map(
  navAnchors
    .map(a => (a.getAttribute('href') || '').slice(1))
    .filter(Boolean)
    .map(id => [id, document.getElementById(id)])
);

const setActiveNav = (activeId) => {
  navAnchors.forEach(a => {
    const id = (a.getAttribute('href') || '').slice(1);
    a.classList.toggle('active', id === activeId);
    if (id === activeId) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
};

const updateNavbarState = () => {
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  
  // Add scrolled class to navbar
  if (navbar) {
    navbar.classList.toggle('scrolled', y > 10);
  }

  // Determine active section based on scroll position
  const offset = 110; // Account for fixed nav + breathing room
  let bestId = null;
  let bestTop = -Infinity;
  
  for (const [id, el] of sectionById.entries()) {
    if (!el) continue;
    const top = el.getBoundingClientRect().top + y;
    if (top <= y + offset && top > bestTop) {
      bestTop = top;
      bestId = id;
    }
  }
  
  // Fallback to home section if at top of page
  if (!bestId && document.getElementById('home')) {
    bestId = 'home';
  }
  
  if (bestId) {
    setActiveNav(bestId);
  }
};

// Throttle scroll events for better performance
let ticking = false;
const scrollHandler = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateNavbarState();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener('scroll', scrollHandler, { passive: true });
window.addEventListener('resize', updateNavbarState);
updateNavbarState();

// Cart functionality
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
let cart = 0;

const updateCartCount = () => {
  if (!cartCount) return;
  cartCount.textContent = cart;
  cartCount.style.visibility = cart > 0 ? 'visible' : 'hidden';
};

// Initialize cart count
updateCartCount();

// Add to cart buttons
document.querySelectorAll('.btn-cart, .add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    cart += 1;
    updateCartCount();
    
    // Visual feedback
    btn.textContent = 'Added!';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
    }, 1000);
  });
});

// Cart button click handler
cartBtn?.addEventListener('click', () => {
  if (cart > 0) {
    alert(`Cart items: ${cart}\nThis is a demo - no actual purchase will be 
made.`);
  } else {
    alert('Your cart is empty!');
  }
});

// Scroll reveal animations
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, { 
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters 
viewport
  });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// "Show more projects" functionality
const expandBtn = document.querySelector('.expand-button');
const extraProjects = document.querySelector('.project-grid.extra-projects');

const setExpanded = (expanded) => {
  if (!expandBtn) return;
  
  expandBtn.classList.toggle('active', expanded);
  expandBtn.setAttribute('aria-expanded', String(expanded));
  
  const label = expandBtn.querySelector('span');
  if (label) {
    label.textContent = expanded ? 'Show Less Projects' : 'Show More Projects';
  }
  
  if (extraProjects) {
    extraProjects.classList.toggle('is-visible', expanded);
  }
};

if (expandBtn) {
  expandBtn.setAttribute('type', 'button');
  expandBtn.setAttribute('aria-expanded', 'false');
  
  expandBtn.addEventListener('click', () => {
    if (!extraProjects) {
      // Handle case where extra projects don't exist
      expandBtn.disabled = true;
      const label = expandBtn.querySelector('span');
      if (label) label.textContent = 'All Projects Shown';
      return;
    }
    setExpanded(!expandBtn.classList.contains('active'));
  });
}

// Chart.js functionality
let chartInstances = [];

const getChartTheme = () => {
  const isDark = document.body.classList.contains('dark-mode');
  return {
    text: isDark ? 'rgba(245,245,245,0.92)' : 'rgba(33,33,33,0.88)',
    grid: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
    gold: '#D4AF37',
    brown: '#5C4033',
    cocoa: '#3A2010',
  };
};

const destroyCharts = () => {
  chartInstances.forEach(c => {
    try { 
      c.destroy(); 
    } catch { 
      /* no-op */ 
    }
  });
  chartInstances = [];
};

const maybeCreateCharts = () => {
  // Check if Chart.js is loaded
  if (typeof window.Chart !== 'function') {
    console.warn('Chart.js not loaded - charts will not be displayed');
    return;
  }

  const theme = getChartTheme();
  const commonOptions = {
    plugins: { 
      legend: { 
        labels: { 
          color: theme.text,
          font: {
            family: "'Inter', sans-serif"
          }
        } 
      } 
    },
  };

  // Web Development Radar Chart
  const webDevEl = document.getElementById('webDevChart');
  if (webDevEl) {
    chartInstances.push(new window.Chart(webDevEl, {
      type: 'radar',
      data: {
        labels: ['HTML/CSS', 'JavaScript', 'React', 'Node/Express', 'Vue.js'],
        datasets: [{
          label: 'Proficiency %',
          data: [95, 85, 88, 85, 80],
          backgroundColor: 'rgba(212,175,55,0.18)',
          borderColor: theme.gold,
          pointBackgroundColor: theme.gold,
          pointBorderColor: theme.cocoa,
          pointHoverBackgroundColor: theme.cocoa,
          pointHoverBorderColor: theme.gold,
          borderWidth: 2,
        }],
      },
      options: {
        ...commonOptions,
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: { color: theme.grid },
            grid: { color: theme.grid },
            pointLabels: { 
              color: theme.text,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              }
            },
            ticks: { 
              color: theme.text, 
              backdropColor: 'transparent',
              stepSize: 20
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          ...commonOptions.plugins,
          tooltip: {
            backgroundColor: theme.cocoa,
            titleColor: theme.gold,
            bodyColor: theme.text,
            borderColor: theme.gold,
            borderWidth: 1
          }
        }
      },
    }));
  }

  // DevOps Bar Chart
  const devopsEl = document.getElementById('devopsChart');
  if (devopsEl) {
    chartInstances.push(new window.Chart(devopsEl, {
      type: 'bar',
      data: {
        labels: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 
'Monitoring'],
        datasets: [{
          label: 'DevOps Proficiency',
          data: [90, 80, 85, 88, 75, 78],
          backgroundColor: 'rgba(92,64,51,0.75)',
          borderColor: theme.brown,
          borderWidth: 1,
          borderRadius: 8,
        }],
      },
      options: {
        ...commonOptions,
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: { 
            ticks: { 
              color: theme.text,
              font: {
                family: "'Inter', sans-serif"
              }
            }, 
            grid: { color: 'transparent' } 
          },
          y: { 
            ticks: { 
              color: theme.text,
              font: {
                family: "'Inter', sans-serif"
              }
            }, 
            grid: { color: theme.grid }, 
            suggestedMin: 0, 
            suggestedMax: 100 
          },
        },
        plugins: {
          ...commonOptions.plugins,
          tooltip: {
            backgroundColor: theme.cocoa,
            titleColor: theme.gold,
            bodyColor: theme.text,
            borderColor: theme.gold,
            borderWidth: 1
          }
        }
      },
    }));
  }

  // Summary Doughnut Chart
  const summaryEl = document.getElementById('summaryChart');
  if (summaryEl) {
    chartInstances.push(new window.Chart(summaryEl, {
      type: 'doughnut',
      data: {
        labels: ['Full-Stack', 'DevOps', 'Data Science', 'Cybersecurity'],
        datasets: [{
          label: 'Overall Proficiency',
          data: [88, 82, 85, 75],
          backgroundColor: [
            'rgba(212,175,55,0.85)',
            'rgba(92,64,51,0.85)',
            'rgba(141,110,99,0.85)',
            'rgba(215,204,200,0.85)',
          ],
          borderColor: theme.cocoa,
          borderWidth: 2,
        }],
      },
      options: {
        ...commonOptions,
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          ...commonOptions.plugins,
          tooltip: {
            backgroundColor: theme.cocoa,
            titleColor: theme.gold,
            bodyColor: theme.text,
            borderColor: theme.gold,
            borderWidth: 1
          }
        }
      },
    }));
  }
};

const refreshCharts = () => {
  destroyCharts();
  maybeCreateCharts();
};

// Initialize charts when DOM is ready
const initCharts = () => {
  // Add a small delay to ensure Chart.js is fully loaded
  setTimeout(() => {
    refreshCharts();
  }, 100);
};

// Handle Chart.js loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}

// Form submission handlers
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name')?.value.trim() || 'Friend';
  const email = document.getElementById('email')?.value.trim() || '';
  
  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  alert(`Thank you ${name}! I'll reach out at ${email}. This is a demo form - no 
actual email will be sent.`);
  contactForm.reset();
});

// Coming soon form handler
const comingSoonForm = document.getElementById('comingSoonForm');
const comingSuccess = document.getElementById('comingSoonSuccess');

comingSoonForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('comingEmail')?.value.trim() || '';
  
  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (comingSuccess) {
      comingSuccess.textContent = 'Please enter a valid email address.';
      comingSuccess.style.color = '#ef4444';
    }
    return;
  }
  
  if (comingSuccess) {
    comingSuccess.textContent = 'Success! You are in! Check your inbox for early access details.';
    comingSuccess.style.color = '#22c55e';
  }
  
  comingSoonForm.reset();
});

// Add loading state for forms
const setLoadingState = (form, isLoading) => {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending...' : 'Send Message';
  }
};

// Enhanced form handling with loading states
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    setLoadingState(form, true);
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setLoadingState(form, false);
    }, 2000);
  });
});
