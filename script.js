// =========================================================
//  KANNADA RAJYOTSAVA 2026 — PBEL CITY
//  script.js (Interactive Portal)
// =========================================================

// ─── Floating Particles ───────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#CC0000', '#E6A800', '#FF6B35', '#FFD700', '#FF4444'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 14 + 9}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

// ─── Build Bunting ────────────────────────────────────────
function buildBunting(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  const colors = ['#CC0000', '#FFD700'];
  for (let i = 0; i < 20; i++) {
    const f = document.createElement('div');
    f.className = 'bunting-flag';
    f.style.setProperty('--c', colors[i % 2]);
    el.appendChild(f);
  }
}
buildBunting('bunting-top');
buildBunting('footer-bunting');

// ─── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ─── Hamburger menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ─── Active nav link on scroll ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => observer.observe(s));

// ─── Countdown Timer (Target: 1st Nov 2026) ───────────────
const TARGET = new Date('2026-11-01T09:30:00');
function updateCountdown() {
  const diff = TARGET - Date.now();
  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if (daysEl) daysEl.textContent  = String(d).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
  if (minsEl) minsEl.textContent  = String(m).padStart(2, '0');
  if (secsEl) secsEl.textContent  = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ─── Scroll-reveal animations ─────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.style.getPropertyValue('--delay') || '0s';
      setTimeout(() => e.target.classList.add('visible'), parseFloat(delay) * 1000);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

// ─── Back to top ──────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── FAQ Accordion ────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Gallery lightbox ─────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img   = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay span')?.textContent || '';
    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      cursor:zoom-out;padding:1.5rem;
    `;
    const i = document.createElement('img');
    i.src = img.src;
    i.style.cssText = 'max-width:90vw;max-height:80vh;border-radius:1rem;object-fit:contain;box-shadow:0 8px 32px rgba(0,0,0,.5);';
    const cap = document.createElement('p');
    cap.textContent = label;
    cap.style.cssText = 'color:#fff;margin-top:1.2rem;font-size:1.1rem;font-weight:700;letter-spacing:0.02em;';
    lb.appendChild(i);
    lb.appendChild(cap);
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  });
});

// ─── Resident Registration Form ───────────────────────────
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name  = document.getElementById('inp-name').value.trim();
    const tower = document.getElementById('inp-tower').value.trim();
    const phone = document.getElementById('inp-phone').value.trim();
    if (!name || !tower || !phone) {
      alert('Please fill in your Name, Tower/Flat Number, and Contact Number.');
      return;
    }
    const btn = document.getElementById('form-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Registration...';
    setTimeout(() => {
      btn.style.display = 'none';
      document.getElementById('form-success').classList.add('show');
      this.reset();
    }, 1200);
  });
}

// ─── Smooth scroll for all anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
