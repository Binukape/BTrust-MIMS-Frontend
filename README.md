# BTrust-MIMS-Frontend

React (Vite) web application for the B-Trust Microbanking and Interest Management System (MIMS), Group 28.
Three role-based portals in one app: Customer, Agent and Administrator. Styled with Tailwind CSS and shadcn/ui-style components (midnight canvas, frosted glass cards, pill buttons, gradient wordmark).

## Run it locally

1. Start the database (BTrust-MIMS-DB repository) and the backend (BTrust_MIMS-Backend repository).
2. Copy `.env.example` to `.env` (`VITE_API_URL` = the backend address, default `http://localhost:4000`).
3. Install and start:

```bash
npm install
npm run dev
```

Open http://localhost:5173. The demo logins are listed below.

Build for hosting: `npm run build` (output in `dist/`). `VITE_API_URL` is the address of the API; the production image uses the relative address `/api`, so the same image works on any host, and the backend's `ALLOWED_ORIGIN` is the public address of the site.

## Docker images and deployment

The `Dockerfile` runs the Vite development server on port 5173 with live reload (used by the local compose file in the BTrust-MIMS-DB repository).

```bash
docker build -t btrust-mims-frontend .
docker run -p 5173:5173 btrust-mims-frontend
```

`Dockerfile.prod` builds the app (`npm run build`) and serves `dist/` with nginx on port 80 (`nginx.conf` sends every unknown path to `index.html`, so deep links work).

```bash
docker build -f Dockerfile.prod -t btrust-mims-frontend:prod .
```

Pushing to `main` runs `.github/workflows/deploy.yml`: it builds the app, builds the production image, pushes it to ghcr.io as `btrust-mims-frontend:latest` and with the commit id, then updates the Azure server (`docker compose pull frontend` and `up -d`) and checks `/api/health` on the public site. Pull requests only run the build.

## Pages

| Portal | Pages |
|---|---|
| Login | one form for everyone; the portal opens by role |
| Customer | My accounts (balances, Fixed Deposit summary), Deposit / Withdraw (live balance preview, limit warnings), Fixed Deposits (open, next payout, close early with penalty preview), Transaction history (filters, search) |
| Agent | My customers (search, manage account status), Register and open account (age-checked plans, joint accounts), Process transactions, Fixed Deposits, Reports 1, 2, 3 and 5 for their own customers |
| Administrator | Branches, Agents, Reports 1-5 with date filters, Audit log |

Every report can be exported as CSV or PDF.

## Demo logins

Live site: https://btrust-mims-xyz.centralindia.cloudapp.azure.com
Local: http://localhost:5173

Every seeded login uses the same demo password: `password123`. It is for demo data only; the data files hold just its bcrypt hash. Deposits and withdrawals only work from 09:00 to 17:00 Sri Lanka time.

| Role | Username | Password |
|---|---|---|
| Administrator | `admin.demo` | `password123` |

Agents:

| Username | Name | Branch |
|---|---|---|
| `nimal.perera` | Nimal Perera | Colombo Main Branch |
| `kamala.silva` | Kamala Silva | Colombo Main Branch |
| `sunil.bandara` | Sunil Bandara | Kandy Branch |
| `priya.rajapaksa` | Priya Rajapaksa | Kandy Branch |
| `kumar.selvam` | Kumar Selvam | Jaffna Branch |

All agents use the password `password123`.

Customers:

| Username | Name | Agent | Account | Plan |
|---|---|---|---|---|
| `anura.fernando` | Anura Fernando | nimal.perera | SA00000001 | Adult |
| `dilani.wick` | Dilani Wickramasinghe | nimal.perera | SA00000002 | Adult |
| `somasiri.g` | Somasiri Gunawardena | kamala.silva | SA00000003 | Senior |
| `tharindu.j` | Tharindu Jayasuriya | kamala.silva | SA00000004 | Teen |
| `sithumini.p` | Sithumini Perera | sunil.bandara | SA00000005 | Children |
| `ruwan.k` | Ruwan Karunaratne | sunil.bandara | SA00000006 | Adult |
| `chamara.r` | Chamara Rathnayake | priya.rajapaksa | SA00000007 (joint, primary) | Joint |
| `ishara.desilva` | Ishara De Silva | kumar.selvam | SA00000007 (joint, secondary) | Joint |
| `priyantha.w` | Priyantha Wijesekara | nimal.perera | SA00000008 | Senior |
| `nadeeka.a` | Nadeeka Abeysinghe | kamala.silva | SA00000009 | Adult |
| `kavindu.s` | Kavindu Senanayake | sunil.bandara | SA00000010 | Teen |
| `malithi.g` | Malithi Gunasekara | priya.rajapaksa | SA00000011 (joint, primary) | Joint |
| `vishwa.b` | Vishwa Balasubramaniam | kumar.selvam | SA00000011 (joint, secondary) | Joint |
| `sanduni.r` | Sanduni Rodrigo | nimal.perera | SA00000012 | Children |
| `buddhika.e` | Buddhika Ekanayake | kamala.silva | SA00000013 | Adult |

All customers use the password `password123`. An agent only sees their own customers, and a customer only sees their own accounts.

## Notes

- The login token is kept in memory only (not in localStorage), so refreshing the page signs you out. This is deliberate.
- Business hours (9:00 AM - 5:00 PM Sri Lanka time) are enforced by the database; the app only shows a warning.
- Colours and fonts live in `src/index.css` (`ink`, `steel`, `mist`, `mint`, `glass`, `coral` (error accent), `violet` (login button only); Space Grotesk for headings, Inter for text, JetBrains Mono for labels, all installed locally).
- The UI components in `src/components/ui` are written in the shadcn/ui style (Tailwind + class-variance-authority) and live in the project, so they can be edited freely.

## Structure

```
src/
  api/          axios client and one file per area
  components/   ui (button, input, card, dialog, ...), shared (layout, tables, reports), forms
  context/      AuthContext (token and user in memory)
  pages/        auth, customer, agent, admin
  routes/       AppRouter and ProtectedRoute (role guard)
  lib/          formatting helpers and a small data-loading hook
```

## Contributions

| Member | Work in this repository |
|---|---|
| Pranav M.A. | setup, API client and auth context, deposit and withdraw form and customer page, agent transaction page, fixed deposit form, manager and page, customer dashboard |
| Ranathunga N.R.A.K.H.K. | routing, dialog and alert components, layout and page headers, customer transaction history, branch management, agent management, audit log page |
| Jackson J.W. | theme styles, helpers, button and input components, login page, customer registration, open account form, assigned customers page |
| Isiwara M.A.G.A. | card, badge and skeleton components, data table, report API and date range filter, export buttons, report view, agent and admin report pages |
| Perera K.D.B.M. (Binuka) | Dockerfile, production image (`Dockerfile.prod`, `nginx.conf`), `.dockerignore`, README, deployment workflow |

### Files per person

**Pranav M.A.** (20 files): `package.json`, `package-lock.json`, `.gitignore`, `.env.example`, `index.html`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `src/api/axiosClient.js`, `src/api/authApi.js`, `src/context/AuthContext.jsx`, `src/api/transactionApi.js`, `src/components/forms/DepositWithdrawForm.jsx`, `src/pages/customer/DepositWithdrawPage.jsx`, `src/pages/agent/TransactionProcessingPage.jsx`, `src/api/fixedDepositApi.js`, `src/components/forms/OpenFDForm.jsx`, `src/components/shared/FixedDepositManager.jsx`, `src/pages/customer/FixedDepositPage.jsx`, `src/pages/customer/DashboardPage.jsx`

**Ranathunga N.R.A.K.H.K.** (12 files): `src/routes/AppRouter.jsx`, `src/routes/ProtectedRoute.jsx`, `src/components/ui/dialog.jsx`, `src/components/ui/alert.jsx`, `src/components/shared/Layout.jsx`, `src/components/shared/PageHeader.jsx`, `src/pages/customer/TransactionHistoryPage.jsx`, `src/api/branchApi.js`, `src/pages/admin/BranchManagementPage.jsx`, `src/api/agentApi.js`, `src/pages/admin/AgentManagementPage.jsx`, `src/pages/admin/AuditLogPage.jsx`

**Jackson J.W.** (13 files): `src/index.css`, `src/lib/format.js`, `src/lib/useLoad.js`, `src/lib/utils.js`, `src/components/ui/button.jsx`, `src/components/ui/input.jsx`, `src/pages/auth/LoginPage.jsx`, `src/api/customerApi.js`, `src/components/forms/CustomerRegistrationForm.jsx`, `src/pages/agent/CustomerRegistrationPage.jsx`, `src/api/accountApi.js`, `src/components/forms/OpenAccountForm.jsx`, `src/pages/agent/AssignedCustomersPage.jsx`

**Isiwara M.A.G.A.** (10 files): `src/components/ui/card.jsx`, `src/components/ui/badge.jsx`, `src/components/ui/skeleton.jsx`, `src/components/shared/DataTable.jsx`, `src/api/reportApi.js`, `src/components/shared/DateRangeFilter.jsx`, `src/components/shared/ExportButtons.jsx`, `src/components/shared/ReportView.jsx`, `src/pages/agent/AgentReportsPage.jsx`, `src/pages/admin/AdminReportsPage.jsx`

**Perera K.D.B.M. (Binuka)**: `Dockerfile`, `Dockerfile.prod`, `nginx.conf`, `.dockerignore`, `README.md`, `.github/workflows/deploy.yml`
