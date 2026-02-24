/* =========================================
   VIDYALAYA ERP — MAIN JS (Public Pages)
   ========================================= */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  // Inner pages start with 'scrolled' — keep it always; only toggle on the home page
  const alwaysScrolled = navbar.classList.contains('scrolled');
  if (!alwaysScrolled) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }
}

/* ---- Mobile menu toggle ---- */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const ham   = document.getElementById('hamburger');
  if (!links) return;
  links.classList.toggle('open');
  // Animate hamburger → X
  const spans = ham.querySelectorAll('span');
  if (links.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target) return;
  let current = 0;
  const step  = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + (target >= 100 ? '+' : '');
    if (current >= target) clearInterval(timer);
  }, 20);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---- Close mobile menu on link click ---- */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.remove('open');
  });
});

/* ---- Page transitions (overlay — no white flash) ---- */
// Inject a full-screen dark overlay that covers between pages
const overlay = document.createElement('div');
overlay.id = 'page-overlay';
Object.assign(overlay.style, {
  position:   'fixed',
  inset:      '0',
  background: '#0D1B4B',
  zIndex:     '99999',
  opacity:    '1',
  transition: 'opacity .35s ease',
  pointerEvents: 'none',
});
document.body.appendChild(overlay);

// Also keep html background dark so no white ever shows
document.documentElement.style.background = '#0D1B4B';

// Fade the overlay OUT on load (reveal page)
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
  });
});

// Fade overlay IN before navigating away
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    link.target === '_blank'
  ) return;

  e.preventDefault();
  overlay.style.opacity = '1';
  setTimeout(() => { window.location.href = href; }, 320);
});
