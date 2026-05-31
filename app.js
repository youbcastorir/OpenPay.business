// ============================================================
// OpenPay.business — Landing Page JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Toggle ──────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme  = localStorage.getItem('op_theme');
  const initTheme   = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initTheme);
  updateThemeIcon(initTheme);

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('op_theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ── Mobile Nav ────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', e => {
    if (mobileNav?.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== hamburger) {
      mobileNav.classList.remove('open');
    }
  });

  // ── Scroll Animations ─────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Sticky Header ─────────────────────────────────────────
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Counter Animation ─────────────────────────────────────
  function animateCount(el) {
    const target  = parseFloat(el.dataset.target);
    const prefix  = el.dataset.prefix || '';
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const start   = performance.now();
    const isFloat = target % 1 !== 0;

    (function tick(now) {
      const elapsed = Math.min((now - start) / dur, 1);
      const ease    = 1 - Math.pow(1 - elapsed, 3);
      const val     = target * ease;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
    })(start);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── Pricing Tabs ──────────────────────────────────────────
  const pricingBtns = document.querySelectorAll('.pricing-toggle button');
  const prices = {
    monthly: { free: '0',  pro: '29',  enterprise: '99'  },
    annual:  { free: '0',  pro: '23',  enterprise: '79'  },
  };

  pricingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pricingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period;
      document.querySelectorAll('.price-val').forEach(el => {
        const plan = el.dataset.plan;
        el.textContent = prices[period]?.[plan] ?? el.textContent;
      });
      document.querySelectorAll('.price-period').forEach(el => {
        el.textContent = period === 'annual' ? '/mo, billed annually' : '/month';
      });
    });
  });

  // ── Upgrade / Signup Modals ───────────────────────────────
  document.querySelectorAll('[data-plan-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.planCta;
      showSignupModal(plan);
    });
  });

  function showSignupModal(plan) {
    const modal = document.getElementById('signupModal');
    if (!modal) return;
    document.getElementById('modalPlanName').textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('closeSignup')?.addEventListener('click', closeModals);
  document.getElementById('signupModal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModals();
  });

  document.getElementById('signupForm')?.addEventListener('submit', e => {
    e.preventDefault();
    closeModals();
    Toast.show('Account created! Redirecting to dashboard…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1800);
  });

  function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('visible'));
    document.body.style.overflow = '';
  }

  // ── FAQ Accordion ─────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q?.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open);
    });
  });

  // ── Live ticker ───────────────────────────────────────────
  const ticker = document.getElementById('liveTicker');
  if (ticker) {
    const msgs = [
      '💳 Payment received · $1,240.00',
      '📄 Invoice paid · Acme Corp · $4,800',
      '🔗 Payment link clicked · 3 new',
      '💳 Payment received · $149.00',
      '📊 Monthly revenue hit $38K',
      '🔗 New checkout completed · $299',
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % msgs.length;
      ticker.style.opacity = '0';
      setTimeout(() => {
        ticker.textContent = msgs[i];
        ticker.style.opacity = '1';
      }, 300);
    }, 3500);
  }

  // ── Smooth Scroll ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileNav?.classList.remove('open');
      }
    });
  });

});

// ── Toast System ──────────────────────────────────────────
const Toast = (() => {
  let container;
  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }
    return container;
  }
  function show(msg, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
    getContainer().appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
  return { show };
})();

window.Toast = Toast;
