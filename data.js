// ============================================================
// OpenPay.business — Mock Data Layer
// ============================================================

const OpenPayData = (() => {
  const STORAGE_KEYS = {
    transactions: 'op_transactions',
    paymentLinks: 'op_payment_links',
    invoices: 'op_invoices',
    settings: 'op_settings',
  };

  // ── Seed Transactions ──────────────────────────────────────
  const SEED_TRANSACTIONS = [
    { id: 'txn_001', type: 'income',  label: 'Acme Corp – Invoice #1042',   amount: 4800.00, currency: 'USD', status: 'paid',    date: '2026-05-28', method: 'card',   category: 'invoice' },
    { id: 'txn_002', type: 'income',  label: 'Stripe Payment Link',          amount: 149.00,  currency: 'USD', status: 'paid',    date: '2026-05-27', method: 'link',   category: 'payment_link' },
    { id: 'txn_003', type: 'expense', label: 'AWS Infrastructure',           amount: 320.50,  currency: 'USD', status: 'paid',    date: '2026-05-26', method: 'card',   category: 'software' },
    { id: 'txn_004', type: 'income',  label: 'NovaTech – Invoice #1041',    amount: 12500.00, currency: 'USD', status: 'paid',    date: '2026-05-25', method: 'bank',   category: 'invoice' },
    { id: 'txn_005', type: 'income',  label: 'Freelance Design Project',     amount: 2200.00, currency: 'USD', status: 'pending', date: '2026-05-24', method: 'link',   category: 'payment_link' },
    { id: 'txn_006', type: 'expense', label: 'SaaS Subscriptions Bundle',    amount: 89.00,   currency: 'USD', status: 'paid',    date: '2026-05-23', method: 'card',   category: 'software' },
    { id: 'txn_007', type: 'income',  label: 'GlobalRetail – Invoice #1040', amount: 7600.00, currency: 'USD', status: 'paid',    date: '2026-05-20', method: 'bank',   category: 'invoice' },
    { id: 'txn_008', type: 'income',  label: 'Payment Link – Consulting',    amount: 950.00,  currency: 'USD', status: 'paid',    date: '2026-05-18', method: 'link',   category: 'payment_link' },
    { id: 'txn_009', type: 'expense', label: 'Office Supplies',              amount: 145.20,  currency: 'USD', status: 'paid',    date: '2026-05-16', method: 'card',   category: 'operations' },
    { id: 'txn_010', type: 'income',  label: 'StartupXYZ – Invoice #1039',  amount: 3300.00, currency: 'USD', status: 'pending', date: '2026-05-14', method: 'bank',   category: 'invoice' },
    { id: 'txn_011', type: 'income',  label: 'Event Ticket Sales',           amount: 780.00,  currency: 'USD', status: 'paid',    date: '2026-05-12', method: 'link',   category: 'payment_link' },
    { id: 'txn_012', type: 'expense', label: 'Marketing – Meta Ads',         amount: 500.00,  currency: 'USD', status: 'paid',    date: '2026-05-10', method: 'card',   category: 'marketing' },
    { id: 'txn_013', type: 'income',  label: 'Retainer – BrightMind Co.',   amount: 5000.00, currency: 'USD', status: 'paid',    date: '2026-05-08', method: 'bank',   category: 'invoice' },
    { id: 'txn_014', type: 'income',  label: 'Digital Product Sale',         amount: 299.00,  currency: 'USD', status: 'paid',    date: '2026-05-05', method: 'link',   category: 'payment_link' },
    { id: 'txn_015', type: 'expense', label: 'Freelancer Payment – Dev',     amount: 1200.00, currency: 'USD', status: 'paid',    date: '2026-05-03', method: 'bank',   category: 'operations' },
  ];

  // ── Seed Payment Links ─────────────────────────────────────
  const SEED_PAYMENT_LINKS = [
    { id: 'lnk_001', name: 'Consulting Session – 1hr', amount: 150.00, currency: 'USD', uses: 12, maxUses: null, status: 'active',   created: '2026-05-01', url: 'https://pay.openpay.business/lnk_001' },
    { id: 'lnk_002', name: 'Design Package – Basic',   amount: 499.00, currency: 'USD', uses: 3,  maxUses: 10,   status: 'active',   created: '2026-05-10', url: 'https://pay.openpay.business/lnk_002' },
    { id: 'lnk_003', name: 'Workshop Ticket – May 30', amount: 65.00,  currency: 'USD', uses: 28, maxUses: 30,   status: 'active',   created: '2026-05-15', url: 'https://pay.openpay.business/lnk_003' },
    { id: 'lnk_004', name: 'Monthly Retainer',         amount: 2000.00,currency: 'USD', uses: 2,  maxUses: null, status: 'inactive', created: '2026-04-20', url: 'https://pay.openpay.business/lnk_004' },
  ];

  // ── Seed Invoices ──────────────────────────────────────────
  const SEED_INVOICES = [
    { id: 'inv_1042', client: 'Acme Corp',       email: 'billing@acme.com',    amount: 4800.00, description: 'Web Development Services – April 2026', status: 'paid',    due: '2026-05-28', issued: '2026-05-14' },
    { id: 'inv_1041', client: 'NovaTech Ltd',    email: 'ap@novatech.io',       amount: 12500.00, description: 'Enterprise Software Integration Q2',    status: 'paid',    due: '2026-05-25', issued: '2026-05-11' },
    { id: 'inv_1040', client: 'GlobalRetail Inc',email: 'finance@globalretail.com', amount: 7600.00, description: 'UX/UI Redesign Phase 2',          status: 'paid',    due: '2026-05-20', issued: '2026-05-06' },
    { id: 'inv_1039', client: 'StartupXYZ',      email: 'cfo@startupxyz.co',   amount: 3300.00, description: 'Brand Strategy & Consulting',           status: 'pending', due: '2026-06-01', issued: '2026-05-14' },
    { id: 'inv_1038', client: 'BrightMind Co.',  email: 'admin@brightmind.com', amount: 5000.00, description: 'Monthly Retainer – May 2026',          status: 'paid',    due: '2026-05-08', issued: '2026-05-01' },
  ];

  // ── Monthly Analytics ─────────────────────────────────────
  const MONTHLY_STATS = [
    { month: 'Dec', income: 18200, expenses: 3100 },
    { month: 'Jan', income: 21500, expenses: 2800 },
    { month: 'Feb', income: 19800, expenses: 3500 },
    { month: 'Mar', income: 24100, expenses: 4200 },
    { month: 'Apr', income: 28700, expenses: 3900 },
    { month: 'May', income: 37378, expenses: 2254.70 },
  ];

  // ── Init / Load ────────────────────────────────────────────
  function init() {
    if (!localStorage.getItem(STORAGE_KEYS.transactions)) {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(SEED_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.paymentLinks)) {
      localStorage.setItem(STORAGE_KEYS.paymentLinks, JSON.stringify(SEED_PAYMENT_LINKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.invoices)) {
      localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(SEED_INVOICES));
    }
  }

  function getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) || '[]');
  }
  function saveTransactions(data) {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(data));
  }
  function addTransaction(txn) {
    const list = getTransactions();
    const newTxn = { ...txn, id: 'txn_' + Date.now() };
    list.unshift(newTxn);
    saveTransactions(list);
    return newTxn;
  }

  function getPaymentLinks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.paymentLinks) || '[]');
  }
  function savePaymentLinks(data) {
    localStorage.setItem(STORAGE_KEYS.paymentLinks, JSON.stringify(data));
  }
  function addPaymentLink(link) {
    const list = getPaymentLinks();
    const newLink = { ...link, id: 'lnk_' + Date.now(), uses: 0, created: new Date().toISOString().split('T')[0], url: 'https://pay.openpay.business/lnk_' + Date.now() };
    list.unshift(newLink);
    savePaymentLinks(list);
    return newLink;
  }
  function togglePaymentLink(id) {
    const list = getPaymentLinks();
    const link = list.find(l => l.id === id);
    if (link) link.status = link.status === 'active' ? 'inactive' : 'active';
    savePaymentLinks(list);
  }

  function getInvoices() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.invoices) || '[]');
  }
  function saveInvoices(data) {
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(data));
  }
  function addInvoice(inv) {
    const list = getInvoices();
    const num = 1042 + list.length + 1;
    const newInv = { ...inv, id: 'inv_' + num, issued: new Date().toISOString().split('T')[0] };
    list.unshift(newInv);
    saveInvoices(list);
    return newInv;
  }

  function getMonthlyStats() { return MONTHLY_STATS; }

  function getSummary() {
    const txns = getTransactions();
    const totalIncome  = txns.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount, 0);
    const totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const pending      = txns.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
    return { balance: totalIncome - totalExpense, income: totalIncome, expenses: totalExpense, pending };
  }

  function reset() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    init();
  }

  return { init, getTransactions, addTransaction, getPaymentLinks, addPaymentLink, togglePaymentLink, getInvoices, addInvoice, getMonthlyStats, getSummary, reset };
})();
