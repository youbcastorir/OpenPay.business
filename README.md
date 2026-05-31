# OpenPay.business 💳

> A modern fintech SaaS landing page + merchant dashboard UI built with pure HTML, CSS, and Vanilla JavaScript.

![OpenPay.business](https://img.shields.io/badge/OpenPay-business-2563eb?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-blue?style=for-the-badge)

---

## 📋 Project Description

**OpenPay.business** is a production-quality frontend demo of a fintech payment platform. It includes:

- 🏠 **Landing Page** — Hero, features, pricing, security, FAQ, and CTA sections
- 📊 **Merchant Dashboard** — Balance overview, transaction list, payment links, invoices, analytics
- 💳 **Transactions System** — Add, filter, and track transactions with localStorage persistence
- 🔗 **Payment Links** — Generate mock shareable payment links with copy-to-clipboard
- 📄 **Invoice Generator** — Create and preview professional invoices
- 📈 **Analytics Charts** — Bar, line, and donut charts drawn on HTML5 Canvas
- 🌙 **Dark/Light Mode** — Persistent theme toggle
- 📱 **Fully Responsive** — Mobile-first design

> ⚠️ **This is a frontend-only demo. No real payments are processed. All data is mock/simulated and stored in localStorage.**

---

## 🗂️ Project Structure

```
openpay-business/
├── index.html          # Landing page
├── dashboard.html      # Full merchant dashboard
├── style.css           # Complete design system & all styles
├── app.js              # Landing page JS (theme, animations, modals)
├── dashboard.js        # Dashboard logic (charts, CRUD, navigation)
├── data.js             # Mock data layer (localStorage CRUD)
├── manifest.json       # PWA manifest
├── sitemap.xml         # SEO sitemap
├── robots.txt          # SEO robots
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🚀 Run Locally

No build step required. Just open the files:

```bash
# Option 1 — Direct browser open
open index.html

# Option 2 — Python simple server (recommended)
python3 -m http.server 8080
# Visit: http://localhost:8080

# Option 3 — Node.js serve
npx serve .
# Visit: http://localhost:3000

# Option 4 — VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

---

## 🌐 Deploy to GitHub Pages

```bash
# 1. Initialize repo
git init
git add .
git commit -m "Launch OpenPay.business"
git branch -M main

# 2. Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/openpay-business.git
git push -u origin main

# 3. Enable GitHub Pages
# GitHub repo → Settings → Pages → Source: main branch → / (root) → Save
# Your site will be live at: https://YOUR_USERNAME.github.io/openpay-business/
```

---

## ⚡ Deploy to Netlify

**Method 1 — Drag & Drop:**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the project folder into the deploy area
3. Done — instant live URL

**Method 2 — Git Integration:**
```bash
# Connect your GitHub repo to Netlify
# Build command: (leave empty)
# Publish directory: . (root)
```

---

## 🔷 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts — select defaults
# Your site: https://openpay-business.vercel.app
```

---

## 🎨 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Markup      | HTML5 (semantic)        |
| Styles      | CSS3 (custom properties, grid, flexbox) |
| Scripts     | Vanilla JavaScript ES6+ |
| Charts      | HTML5 Canvas API        |
| Storage     | localStorage            |
| Fonts       | Google Fonts (DM Sans + DM Mono) |
| Icons       | Unicode emoji           |
| Deployment  | Static — no build needed |

---

## ✨ Key Features

### Landing Page
- Animated hero with floating card stack
- Live payment ticker
- Scroll-triggered reveal animations
- Counter animations on stats
- Pricing toggle (monthly / annual)
- FAQ accordion
- Signup modal

### Dashboard
- Sidebar navigation with section routing
- Overview cards (balance, income, expenses, pending)
- Revenue vs Expenses bar chart (Canvas)
- Revenue trend line chart (Canvas)
- Category donut chart (Canvas)
- Transaction list with search + filter
- Add transaction modal
- Payment link generator + copy button
- Invoice creator + preview modal
- Analytics section with KPIs
- Billing & plans mock UI
- Settings page
- Dark/light mode

---

## 📦 localStorage Keys

| Key                  | Contents                    |
|---------------------|-----------------------------|
| `op_transactions`    | Array of transaction objects |
| `op_payment_links`   | Array of payment link objects |
| `op_invoices`        | Array of invoice objects     |
| `op_theme`           | `"light"` or `"dark"`       |
| `op_dash_section`    | Last visited dashboard section |

To reset all data, run in browser console:
```javascript
['op_transactions','op_payment_links','op_invoices','op_theme','op_dash_section']
  .forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 📧 Contact

**Email:** salatrir@gmail.com

---

## 📜 License

MIT — Free to use, modify, and deploy.

---

*Built with ❤️ using pure HTML, CSS & JavaScript — no frameworks, no dependencies, no build step.*
