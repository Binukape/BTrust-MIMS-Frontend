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

Open http://localhost:5173. Demo logins (password `password123` for all seeded users):

| Role | Username |
|---|---|
| Administrator | `admin.demo` |
| Agent | `nimal.perera`, `kamala.silva`, ... |
| Customer | `anura.fernando`, `tharindu.j`, ... |

Build for hosting: `npm run build` (output in `dist/`, deployed on Vercel). Set `VITE_API_URL` to the hosted backend, and set the backend's `ALLOWED_ORIGIN` to the hosted frontend address.

## Docker image

The `Dockerfile` runs the Vite development server on port 5173 with live reload.

```bash
docker build -t btrust-mims-frontend .
docker run -p 5173:5173 btrust-mims-frontend
```

## Pages

| Portal | Pages |
|---|---|
| Login | one form for everyone; the portal opens by role |
| Customer | My accounts (balances, Fixed Deposit summary), Deposit / Withdraw (live balance preview, limit warnings), Fixed Deposits (open, next payout, close early with penalty preview), Transaction history (filters, search) |
| Agent | My customers (search, manage account status), Register and open account (age-checked plans, joint accounts), Process transactions, Fixed Deposits, Reports 1, 2, 3 and 5 for their own customers |
| Administrator | Branches, Agents, Reports 1-5 with date filters, Audit log |

Every report can be exported as CSV or PDF.

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
