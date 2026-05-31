// ============================================================
// OpenPay.business — Dashboard Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  OpenPayData.init();

  // ── Theme ──────────────────────────────────────────────────
  const savedTheme = localStorage.getItem('op_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('themeToggle');
  themeBtn?.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('op_theme', next);
    themeBtn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    Charts.redraw();
  });
  if (themeBtn) themeBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';

  // ── Sidebar Navigation ────────────────────────────────────
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('.dash-section');
  const sidebarEl  = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');

  menuToggle?.addEventListener('click', () => {
    sidebarEl?.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (sidebarEl?.classList.contains('open') && !sidebarEl.contains(e.target) && e.target !== menuToggle) {
      sidebarEl.classList.remove('open');
    }
  });

  function showSection(id) {
    sections.forEach(s => s.classList.toggle('active', s.id === id));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    localStorage.setItem('op_dash_section', id);
    sidebarEl?.classList.remove('open');
    window.scrollTo(0, 0);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  const lastSection = localStorage.getItem('op_dash_section') || 'overview';
  showSection(lastSection);

  // ── Overview Cards ────────────────────────────────────────
  function renderOverview() {
    const s = OpenPayData.getSummary();
    setVal('cardBalance',  '$' + s.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    setVal('cardIncome',   '$' + s.income.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    setVal('cardExpenses', '$' + s.expenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    setVal('cardPending',  '$' + s.pending.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));

    const recentEl = document.getElementById('recentTxns');
    if (recentEl) {
      const txns = OpenPayData.getTransactions().slice(0, 5);
      recentEl.innerHTML = txns.map(txn => txnRow(txn)).join('');
    }
    Charts.draw();
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function txnRow(txn) {
    const sign  = txn.type === 'income' ? '+' : '-';
    const cls   = txn.type === 'income' ? 'income' : 'expense';
    const icons = { card: '💳', bank: '🏦', link: '🔗' };
    return `
      <div class="txn-row">
        <span class="txn-icon">${icons[txn.method] || '💳'}</span>
        <div class="txn-info">
          <span class="txn-label">${escHtml(txn.label)}</span>
          <span class="txn-date">${formatDate(txn.date)}</span>
        </div>
        <div class="txn-right">
          <span class="txn-amount ${cls}">${sign}$${txn.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
          <span class="txn-status status-${txn.status}">${txn.status}</span>
        </div>
      </div>`;
  }

  // ── Transactions Section ──────────────────────────────────
  let txnFilter = { type: 'all', status: 'all', search: '' };

  function renderTransactions() {
    let txns = OpenPayData.getTransactions();
    if (txnFilter.type   !== 'all')  txns = txns.filter(t => t.type === txnFilter.type);
    if (txnFilter.status !== 'all')  txns = txns.filter(t => t.status === txnFilter.status);
    if (txnFilter.search)            txns = txns.filter(t => t.label.toLowerCase().includes(txnFilter.search.toLowerCase()));

    const el = document.getElementById('txnList');
    if (!el) return;
    if (!txns.length) { el.innerHTML = '<div class="empty-state">No transactions found.</div>'; return; }
    el.innerHTML = txns.map(txn => txnRow(txn)).join('');
  }

  document.getElementById('txnFilterType')?.addEventListener('change', e => {
    txnFilter.type = e.target.value; renderTransactions();
  });
  document.getElementById('txnFilterStatus')?.addEventListener('change', e => {
    txnFilter.status = e.target.value; renderTransactions();
  });
  document.getElementById('txnSearch')?.addEventListener('input', e => {
    txnFilter.search = e.target.value; renderTransactions();
  });

  // Add Transaction Modal
  document.getElementById('addTxnBtn')?.addEventListener('click', () => openModal('addTxnModal'));
  document.getElementById('addTxnForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    OpenPayData.addTransaction({
      label:    fd.get('label'),
      amount:   parseFloat(fd.get('amount')),
      type:     fd.get('type'),
      method:   fd.get('method'),
      status:   fd.get('status'),
      category: fd.get('category') || 'other',
      currency: 'USD',
      date:     new Date().toISOString().split('T')[0],
    });
    e.target.reset();
    closeModal('addTxnModal');
    renderTransactions();
    renderOverview();
    Toast.show('Transaction added!', 'success');
  });

  // ── Payment Links ─────────────────────────────────────────
  function renderLinks() {
    const el = document.getElementById('linksList');
    if (!el) return;
    const links = OpenPayData.getPaymentLinks();
    if (!links.length) { el.innerHTML = '<div class="empty-state">No payment links yet.</div>'; return; }
    el.innerHTML = links.map(link => `
      <div class="link-card ${link.status}">
        <div class="link-card-header">
          <span class="link-name">${escHtml(link.name)}</span>
          <span class="link-status status-${link.status}">${link.status}</span>
        </div>
        <div class="link-amount">$${link.amount.toFixed(2)} ${link.currency}</div>
        <div class="link-url-row">
          <input class="link-url-input" value="${link.url}" readonly>
          <button class="btn-icon copy-btn" data-url="${link.url}" title="Copy link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
        <div class="link-meta">
          <span>Used: ${link.uses}${link.maxUses ? '/' + link.maxUses : ''} times</span>
          <span>Created: ${formatDate(link.created)}</span>
        </div>
        <div class="link-actions">
          <button class="btn btn-sm btn-ghost toggle-link" data-id="${link.id}">${link.status === 'active' ? 'Deactivate' : 'Activate'}</button>
        </div>
      </div>`).join('');

    el.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(btn.dataset.url).catch(() => {});
        Toast.show('Payment link copied!', 'success');
      });
    });
    el.querySelectorAll('.toggle-link').forEach(btn => {
      btn.addEventListener('click', () => {
        OpenPayData.togglePaymentLink(btn.dataset.id);
        renderLinks();
        Toast.show('Link status updated', 'info');
      });
    });
  }

  document.getElementById('createLinkBtn')?.addEventListener('click', () => openModal('createLinkModal'));
  document.getElementById('createLinkForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    OpenPayData.addPaymentLink({
      name:     fd.get('linkName'),
      amount:   parseFloat(fd.get('linkAmount')),
      currency: 'USD',
      maxUses:  fd.get('maxUses') ? parseInt(fd.get('maxUses')) : null,
      status:   'active',
    });
    e.target.reset();
    closeModal('createLinkModal');
    renderLinks();
    Toast.show('Payment link created!', 'success');
  });

  // ── Invoices ─────────────────────────────────────────────
  function renderInvoices() {
    const el = document.getElementById('invoicesList');
    if (!el) return;
    const invs = OpenPayData.getInvoices();
    if (!invs.length) { el.innerHTML = '<div class="empty-state">No invoices yet.</div>'; return; }
    el.innerHTML = invs.map(inv => `
      <div class="invoice-row">
        <div class="inv-id">${inv.id.replace('inv_', '#')}</div>
        <div class="inv-client">${escHtml(inv.client)}</div>
        <div class="inv-amount">$${inv.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
        <div class="inv-due">${formatDate(inv.due)}</div>
        <div class="inv-status"><span class="status-${inv.status}">${inv.status}</span></div>
        <div class="inv-actions">
          <button class="btn btn-sm btn-outline preview-inv" data-id="${inv.id}">Preview</button>
        </div>
      </div>`).join('');

    el.querySelectorAll('.preview-inv').forEach(btn => {
      btn.addEventListener('click', () => previewInvoice(btn.dataset.id));
    });
  }

  document.getElementById('createInvoiceBtn')?.addEventListener('click', () => openModal('createInvoiceModal'));
  document.getElementById('createInvoiceForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const inv = OpenPayData.addInvoice({
      client:      fd.get('client'),
      email:       fd.get('email'),
      amount:      parseFloat(fd.get('amount')),
      description: fd.get('description'),
      due:         fd.get('due'),
      status:      'pending',
    });
    e.target.reset();
    closeModal('createInvoiceModal');
    renderInvoices();
    Toast.show('Invoice created!', 'success');
    previewInvoice(inv.id);
  });

  function previewInvoice(id) {
    const inv  = OpenPayData.getInvoices().find(i => i.id === id);
    if (!inv) return;
    const preview = document.getElementById('invoicePreview');
    if (!preview) return;
    preview.innerHTML = `
      <div class="invoice-doc">
        <div class="inv-doc-header">
          <div class="inv-brand"><span class="logo-mark">OP</span><span>OpenPay.business</span></div>
          <div class="inv-meta-block">
            <div class="inv-title">INVOICE</div>
            <div class="inv-number">${inv.id.replace('inv_', '#')}</div>
          </div>
        </div>
        <div class="inv-doc-body">
          <div class="inv-doc-from">
            <strong>From</strong><br>
            Your Business Name<br>
            your@email.com<br>
            salatrir@gmail.com
          </div>
          <div class="inv-doc-to">
            <strong>Bill To</strong><br>
            ${escHtml(inv.client)}<br>
            ${escHtml(inv.email)}<br>
          </div>
          <div class="inv-doc-dates">
            <div><strong>Issued:</strong> ${formatDate(inv.issued)}</div>
            <div><strong>Due:</strong> ${formatDate(inv.due)}</div>
            <div class="inv-doc-status"><strong>Status:</strong> <span class="status-${inv.status}">${inv.status}</span></div>
          </div>
        </div>
        <div class="inv-doc-items">
          <div class="inv-item-header"><span>Description</span><span>Amount</span></div>
          <div class="inv-item-row"><span>${escHtml(inv.description)}</span><span>$${inv.amount.toFixed(2)}</span></div>
          <div class="inv-item-total"><span>Total (USD)</span><span>$${inv.amount.toFixed(2)}</span></div>
        </div>
        <div class="inv-doc-footer">
          <p>Thank you for your business. Questions? Contact us at salatrir@gmail.com</p>
          <div class="inv-secure-badge">🔒 Secured by OpenPay.business</div>
        </div>
      </div>`;
    openModal('invoicePreviewModal');
  }

  document.getElementById('downloadInvoiceBtn')?.addEventListener('click', () => {
    Toast.show('PDF export simulated — integrate jsPDF for production use.', 'info', 4000);
  });

  // ── Analytics ────────────────────────────────────────────
  const Charts = (() => {
    function draw() {
      drawBarChart();
      drawLineChart();
      drawDonut();
    }

    function redraw() { requestAnimationFrame(draw); }

    function drawBarChart() {
      const canvas = document.getElementById('barChart');
      if (!canvas) return;
      const ctx    = canvas.getContext('2d');
      const stats  = OpenPayData.getMonthlyStats();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const W = canvas.width = canvas.offsetWidth || 560;
      const H = canvas.height = 240;
      ctx.clearRect(0, 0, W, H);

      const pad    = { left: 50, right: 20, top: 20, bottom: 40 };
      const maxVal = Math.max(...stats.flatMap(s => [s.income, s.expenses])) * 1.15;
      const bw     = (W - pad.left - pad.right) / stats.length;
      const barW   = bw * 0.28;
      const textC  = isDark ? '#94a3b8' : '#64748b';
      const gridC  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      // Grid
      ctx.strokeStyle = gridC;
      ctx.lineWidth   = 1;
      for (let g = 0; g <= 4; g++) {
        const y = pad.top + ((H - pad.top - pad.bottom) / 4) * g;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        ctx.fillStyle = textC;
        ctx.font = '11px DM Sans, sans-serif';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * g).toLocaleString(), 2, y + 4);
      }

      stats.forEach((s, i) => {
        const x = pad.left + i * bw + bw / 2;
        const incH  = ((s.income   / maxVal) * (H - pad.top - pad.bottom));
        const expH  = ((s.expenses / maxVal) * (H - pad.top - pad.bottom));
        const baseY = H - pad.bottom;

        // Income bar
        const incGrad = ctx.createLinearGradient(0, baseY - incH, 0, baseY);
        incGrad.addColorStop(0, '#3b82f6');
        incGrad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = incGrad;
        roundRect(ctx, x - barW - 2, baseY - incH, barW, incH, 4);
        ctx.fill();

        // Expense bar
        const expGrad = ctx.createLinearGradient(0, baseY - expH, 0, baseY);
        expGrad.addColorStop(0, '#f97316');
        expGrad.addColorStop(1, '#ea580c');
        ctx.fillStyle = expGrad;
        roundRect(ctx, x + 2, baseY - expH, barW, expH, 4);
        ctx.fill();

        // Label
        ctx.fillStyle = textC;
        ctx.font = '11px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.month, x, H - 10);
      });
    }

    function drawLineChart() {
      const canvas = document.getElementById('lineChart');
      if (!canvas) return;
      const ctx    = canvas.getContext('2d');
      const stats  = OpenPayData.getMonthlyStats();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const W = canvas.width = canvas.offsetWidth || 560;
      const H = canvas.height = 200;
      ctx.clearRect(0, 0, W, H);

      const pad    = { left: 50, right: 20, top: 20, bottom: 36 };
      const maxVal = Math.max(...stats.map(s => s.income)) * 1.15;
      const textC  = isDark ? '#94a3b8' : '#64748b';
      const gridC  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      // Grid
      ctx.strokeStyle = gridC; ctx.lineWidth = 1;
      for (let g = 0; g <= 4; g++) {
        const y = pad.top + ((H - pad.top - pad.bottom) / 4) * g;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        ctx.fillStyle = textC;
        ctx.font = '11px DM Sans, sans-serif';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * g).toLocaleString(), 2, y + 4);
      }

      function pointX(i) { return pad.left + (i / (stats.length - 1)) * (W - pad.left - pad.right); }
      function pointY(v) { return pad.top + (1 - v / maxVal) * (H - pad.top - pad.bottom); }

      // Fill
      const fill = ctx.createLinearGradient(0, pad.top, 0, H);
      fill.addColorStop(0, 'rgba(59,130,246,0.25)');
      fill.addColorStop(1, 'rgba(59,130,246,0.00)');
      ctx.beginPath();
      ctx.moveTo(pointX(0), H - pad.bottom);
      stats.forEach((s, i) => ctx.lineTo(pointX(i), pointY(s.income)));
      ctx.lineTo(pointX(stats.length - 1), H - pad.bottom);
      ctx.fillStyle = fill; ctx.fill();

      // Line
      ctx.beginPath();
      stats.forEach((s, i) => i === 0 ? ctx.moveTo(pointX(i), pointY(s.income)) : ctx.lineTo(pointX(i), pointY(s.income)));
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

      // Dots
      stats.forEach((s, i) => {
        ctx.beginPath(); ctx.arc(pointX(i), pointY(s.income), 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6'; ctx.fill();
        ctx.strokeStyle = isDark ? '#1e293b' : '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = textC; ctx.font = '11px DM Sans, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.month, pointX(i), H - 10);
      });
    }

    function drawDonut() {
      const canvas = document.getElementById('donutChart');
      if (!canvas) return;
      const ctx   = canvas.getContext('2d');
      const txns  = OpenPayData.getTransactions();
      const W = canvas.width = canvas.height = canvas.offsetWidth || 200;
      ctx.clearRect(0, 0, W, W);

      const cats  = {};
      txns.filter(t => t.type === 'income' && t.status === 'paid').forEach(t => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
      const total  = Object.values(cats).reduce((a, b) => a + b, 0);
      const colors = ['#3b82f6','#10b981','#f97316','#8b5cf6','#ec4899'];
      const cx = W / 2, cy = W / 2, r = W * 0.38, ir = W * 0.22;
      let angle = -Math.PI / 2;

      Object.entries(cats).forEach(([cat, val], i) => {
        const slice = (val / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        angle += slice;
      });

      // Hole
      ctx.beginPath(); ctx.arc(cx, cy, ir, 0, Math.PI * 2);
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#f8fafc';
      ctx.fill();

      // Center text
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
      ctx.font      = `bold ${W * 0.11}px DM Sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('$' + (total / 1000).toFixed(0) + 'K', cx, cy + W * 0.04);
      ctx.font      = `${W * 0.075}px DM Sans, sans-serif`;
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText('revenue', cx, cy + W * 0.15);

      // Legend
      const legendEl = document.getElementById('donutLegend');
      if (legendEl) {
        legendEl.innerHTML = Object.entries(cats).map(([cat, val], i) => `
          <div class="legend-item">
            <span class="legend-dot" style="background:${colors[i % colors.length]}"></span>
            <span class="legend-label">${cat.replace('_', ' ')}</span>
            <span class="legend-val">$${val.toLocaleString()}</span>
          </div>`).join('');
      }
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    return { draw, redraw };
  })();

  window.Charts = Charts;

  // ── Modal System ─────────────────────────────────────────
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('visible'); document.body.style.overflow = 'hidden'; }
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('visible'); document.body.style.overflow = ''; }
  }

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal').id));
  });

  // ── Helpers ───────────────────────────────────────────────
  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function formatDate(d) {
    if (!d) return '—';
    try { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d)); }
    catch { return d; }
  }

  // ── Toast ────────────────────────────────────────────────
  const Toast = window.Toast || (() => {
    let c;
    function getC() { if (!c) { c = document.createElement('div'); c.id = 'toastContainer'; document.body.appendChild(c); } return c; }
    function show(msg, type = 'info', duration = 3500) {
      const t = document.createElement('div'); t.className = `toast toast-${type}`;
      const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
      t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ'}</span><span>${msg}</span>`;
      getC().appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
    }
    return { show };
  })();

  window.Toast = Toast;

  // ── Init Render ──────────────────────────────────────────
  renderOverview();
  renderTransactions();
  renderLinks();
  renderInvoices();

  // Redraw charts on resize
  let rto;
  window.addEventListener('resize', () => { clearTimeout(rto); rto = setTimeout(() => Charts.redraw(), 200); });

  // Welcome toast
  setTimeout(() => Toast.show('Welcome back! Your dashboard is ready.', 'success'), 500);
});
