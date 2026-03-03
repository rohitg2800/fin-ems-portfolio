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

// Smooth scroll
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
  refreshCharts();
});

// Navbar style on scroll + active section highlighting
const navbar = document.getElementById('navbar');
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
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
    if (id === activeId) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
};

const updateNavbarState = () => {
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  navbar?.classList.toggle('scrolled', y > 10);

  // Choose the section whose top is closest but not greater than scroll position.
  const offset = 110; // account for fixed nav + breathing room
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
  if (!bestId) {
    // fallback: home when at very top
    if (document.getElementById('home')) bestId = 'home';
  }
  if (bestId) setActiveNav(bestId);
};
window.addEventListener('scroll', updateNavbarState, { passive: true });
window.addEventListener('resize', updateNavbarState);
updateNavbarState();

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

// "Show more projects" toggle (if extra items exist)
const expandBtn = document.querySelector('.expand-button');
const extraProjects = document.querySelector('.project-grid.extra-projects');
const setExpanded = (expanded) => {
  if (!expandBtn) return;
  expandBtn.classList.toggle('active', expanded);
  expandBtn.setAttribute('aria-expanded', String(expanded));
  const label = expandBtn.querySelector('span');
  if (label) label.textContent = expanded ? 'Show Less Projects' : 'Show More Projects';
  if (extraProjects) extraProjects.classList.toggle('is-visible', expanded);
};
if (expandBtn) {
  expandBtn.setAttribute('type', 'button');
  expandBtn.setAttribute('aria-expanded', 'false');
  expandBtn.addEventListener('click', () => {
    if (!extraProjects) {
      // graceful fallback if there are no extra projects in HTML
      expandBtn.disabled = true;
      const label = expandBtn.querySelector('span');
      if (label) label.textContent = 'All Projects Shown';
      return;
    }
    setExpanded(!expandBtn.classList.contains('active'));
  });
}

// Charts (Chart.js via CDN in index.html)
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
    try { c.destroy(); } catch { /* no-op */ }
  });
  chartInstances = [];
};

const maybeCreateCharts = () => {
  if (typeof window.Chart !== 'function') return;

  const theme = getChartTheme();
  const common = {
    plugins: { legend: { labels: { color: theme.text } } },
  };

  const webDevEl = document.getElementById('webDevChart');
  if (webDevEl) {
    // Radar chart for web dev skills
    chartInstances.push(new window.Chart(webDevEl, {
      type: 'radar',
      data: {
        labels: ['HTML/CSS', 'React', 'Node/Express', 'Vue'],
        datasets: [{
          label: 'Web Development',
          data: [95, 88, 85, 80],
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
        ...common,
        responsive: true,
        scales: {
          r: {
            angleLines: { color: theme.grid },
            grid: { color: theme.grid },
            pointLabels: { color: theme.text },
            ticks: { color: theme.text, backdropColor: 'transparent' },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    }));
  }

  const devopsEl = document.getElementById('devopsChart');
  if (devopsEl) {
    chartInstances.push(new window.Chart(devopsEl, {
      type: 'bar',
      data: {
        labels: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'IaC', 'Monitoring'],
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
        ...common,
        responsive: true,
        scales: {
          x: { ticks: { color: theme.text }, grid: { color: 'transparent' } },
          y: { ticks: { color: theme.text }, grid: { color: theme.grid }, suggestedMin: 0, suggestedMax: 100 },
        },
      },
    }));
  }

  const summaryEl = document.getElementById('summaryChart');
  if (summaryEl) {
    chartInstances.push(new window.Chart(summaryEl, {
      type: 'doughnut',
      data: {
        labels: ['Full‑Stack', 'DevOps', 'Data Science', 'Cybersecurity'],
        datasets: [{
          label: 'Overall',
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
        ...common,
        responsive: true,
        cutout: '62%',
      },
    }));
  }
};

const refreshCharts = () => {
  destroyCharts();
  maybeCreateCharts();
};

// Create charts once DOM is ready
const initCharts = () => refreshCharts();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
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
