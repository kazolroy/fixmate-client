# FixMate — Client

**Smart Device & Home Appliance Repair Service Platform** (Assignment 9 · Category 006)

FixMate connects customers with verified repair technicians. Technicians list services (smartphone, laptop, AC, refrigerator, TV, washing machine, electrical), customers send repair requests and follow every job step by step, and they **pay with Stripe only after the job is completed**. Admins approve listings, manage users and monitor revenue.

- **Live site:** `https://fixmate-client-chi.vercel.app`
- **Server repo:** `https://github.com/kazolroy/fixmate-server`
- **API (production):** `https://fixmate-server-plum.vercel.app`

## Test accounts (created by `npm run seed`)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fixmate.test` | `Admin123` |
| Technician | `rafiq@fixmate.test` | `Tech1234` |
| Technician | `nusrat@fixmate.test` | `Tech1234` |
| Customer | `customer@fixmate.test` | `Cust1234` |
| Customer | `tanvir@fixmate.test` | `Cust1234` |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- **Three roles** (Customer / Technician / Admin) with separate dashboards, a role-aware sidebar and server-side route guards. Nobody can sign up as admin (enforced on the server in BetterAuth `databaseHooks`).
- **Browse services** with **server-side** search, category / mode filters, sorting and pagination — all state lives in the URL, so it survives reloads and Home category cards open `/services?category=AC` already filtered.
- **Repair request flow** with role restrictions (logged-out → sign-in and back, technicians/admins blocked) and duplicate-active-request protection.
- **Job status pipeline** `Requested → Accepted → In Progress → Completed (→ Paid)` with Rejected / Cancelled branches, enforced by the server. Visual step tracker in My Bookings.
- **Pay-after-service** with Stripe Checkout; payments verified on the success page and by webhook without ever saving twice.
- **Technician tools:** add service (ImgBB upload), full CRUD, availability toggle, request manager with a "final amount" modal.
- **Admin tools:** service approval queue, role management (cannot change own role), all bookings, transactions + total revenue.
- **Charts** (Recharts) on all three overviews, reusable stats cards, consistent status badges, toasts (sonner), confirmation modals, empty states, loading skeletons, custom 404 and error pages.
- Responsive navbar/sidebar, sticky header with active-route highlight, equal-height cards, X logo in the footer.

## Tech stack & npm packages

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · BetterAuth (+ MongoDB adapter) · `jsonwebtoken` · `mongodb` · `recharts` · `sonner` · `lucide-react` · `clsx` · `tailwind-merge` · `tsx` + `dotenv` (seed script only)

## How auth works

1. BetterAuth (MongoDB adapter) stores users in the `user` collection with extra fields `role`, `phone`, `area`, `bio`.
2. For API calls, the browser asks `GET /api/token` (needs a valid BetterAuth session) and receives a short-lived **JWT** signed with `JWT_SECRET`.
3. The Express server verifies that JWT (`verifyToken`), loads the user from MongoDB and applies `verifyCustomer / verifyTechnician / verifyAdmin`. The role always comes from the database, never from the token.

## Run locally

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run seed                   # demo users + services + bookings (clears services/bookings/payments!)
npm run dev                    # http://localhost:3000
```

### Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL of the Express server |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB key for image uploads |
| `BETTER_AUTH_SECRET` | BetterAuth secret (long random string) |
| `BETTER_AUTH_URL` | Public URL of this app (e.g. your Vercel domain) |
| `MONGODB_URI`, `DB_NAME` | MongoDB connection (same DB as the server) |
| `JWT_SECRET` | **Must equal** the server's `JWT_SECRET` |
| `EXTRA_TRUSTED_ORIGINS` | Extra BetterAuth trusted origins (comma separated) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google login |

## Deploy (Vercel)

1. Import this repo, add every variable above, set `BETTER_AUTH_URL` to the production domain.
2. Add the production domain to the server's `CLIENT_URL` / CORS and redeploy the server.
3. Hard-refresh every route (`/dashboard/customer/bookings`, `/services/<id>`, …) — they all work on reload and keep you signed in.
