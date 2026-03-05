

Each member **copies only their section** and pastes it into a **new Cursor chat** in the project. After the AI implements everything, they create a branch, commit, push, and open a PR.

**Rules for everyone:**
- Pull latest `main` first (after Member 1’s PR is merged).
- Do not change API request/response field names or shapes from Document 2.
- Only touch the files/routes assigned to your member number.

**Auth:** We use **custom auth** (bcrypt + JWT/session), not NextAuth. Only **college emails** are allowed (e.g. `btech25043.24@bitmesra.ac.in`). Validation: email must end with the allowed domain (e.g. `@bitmesra.ac.in`), set via `ALLOWED_EMAIL_DOMAIN` in env.

---

## Who can work when (after Member 1’s setup is merged)

| Member | Can start when | Depends on |
|--------|----------------|------------|
| **2 – Auth** | Right away | Only Member 1 (setup) |
| **3 – PG** | Right away | Only Member 1 (setup) |
| **4 – Rides** | After **Member 2** merged | Member 1 + Member 2 (needs session + user.college) |
| **5 – Reviews + Deploy** | After **Member 2** merged (better after 3) | Member 1 + Member 2; nicer with Member 3 done so PG pages exist |
| **1 – UI/UX** | **Last** (after 2, 3, 4, 5) | Everyone’s pages/routes in place so you can polish the full app |

So: **2 and 3 can work in parallel** right after your setup. **4 should wait for 2.** **5 should wait for 2** (and ideally 3). **UI/UX (Member 1) is done last** so one person polishes the whole app.

---

## Prompt for Member 1 (UI/UX – Team Lead) — use last

Copy from the line below to the end of this section and paste into Cursor.

```
I am Member 1 – UI/UX owner for Campus Nest (Next.js, Prisma, Tailwind). The project setup and database are already done. I need a clean, modern, responsive UI across the app.

Do the following. Do not change API contracts or backend route logic. Only improve layout, styling, and UX.

1) Landing page (app/page.tsx):
   - Clear hero: app name "Campus Nest", tagline (e.g. "Find PGs and rides for your campus"), and primary CTAs: "Browse PGs" and "Find Rides" linking to /pg and /rides. Optionally "Login" / "Sign up" linking to /login and /signup.
   - A short section (e.g. cards or list) explaining: PG listings, Ride sharing, College-only. Use Tailwind; pick a cohesive color scheme (e.g. calm green/teal for campus) – avoid generic "AI slop" aesthetics.

2) Layout and navigation:
   - app/layout.tsx: root layout with Navbar at top and Footer at bottom on all pages. Make Navbar and Footer responsive (e.g. mobile hamburger or stacked links).
   - components/layout/Navbar.tsx: links to Home (/), PGs (/pg), Rides (/rides), Dashboard (/dashboard), and Auth (Login/Sign up or Logout – placeholder links; Member 2 will wire auth).
   - components/layout/Footer.tsx: app name, "College-only marketplace", minimal links. Keep it simple.

3) Global styles (app/globals.css):
   - Consistent font (e.g. Inter or similar), base text/background colors. Optional: CSS variables (--color-primary, --color-background) for reuse in Tailwind/components.

4) Dashboard and list pages (polish only – do not implement API calls or forms):
   - app/dashboard/page.tsx: dashboard shell with welcome and links to "Add PG" and "Add Ride". Style to match the rest of the app.
   - app/pg/page.tsx and app/rides/page.tsx: if still placeholders, style the container/text to match the design system. Do not remove or break any existing fetch logic from Member 3/4.

5) Reusable UI (components/ui/): ensure Button, Input, Card are consistent with the palette and work on mobile (touch targets, spacing). Do not remove props other members rely on.

When done, tell me: "UI/UX implementation done. Create a branch (e.g. member-1-ui-ux), commit, push, and open a PR."
```

---

## Prompt for Member 2 (Authentication – custom bcrypt + college email)

Copy from the line below to the end of this section and paste into Cursor.

```
I am Member 2 – Authentication owner for Campus Nest (Next.js, Prisma, PostgreSQL). We use custom auth with bcrypt and college-email validation (no NextAuth/Google).

College emails look like: btech25043.24@bitmesra.ac.in. Only emails ending with the allowed domain (e.g. @bitmesra.ac.in) may sign up or log in. The allowed domain is set via env ALLOWED_EMAIL_DOMAIN=bitmesra.ac.in (no @ prefix).

Do the following. Do not change the Permanent API Contract (Document 2) or other members' routes.

1) Install: npm install bcryptjs jsonwebtoken. Install types: npm install -D @types/bcryptjs @types/jsonwebtoken. Use bcrypt for hashing (bcrypt.hash and bcrypt.compare).

2) User model has: id, email, password (string for bcrypt hash), name, image, college. On signup set user.college to the email domain (e.g. "bitmesra.ac.in") for ride filtering. Run: npx prisma migrate dev --name add-password if the schema has a new password field.

3) Auth API routes (replace or remove app/api/auth/[...nextauth]/route.ts; create these instead):
   - POST /api/auth/signup
     Body: { email, password, name? }. Validate email ends with ALLOWED_EMAIL_DOMAIN (case-insensitive). If not return 400 "Only college email addresses are allowed." Hash password with bcrypt (e.g. 10 rounds). Create User with email, hashed password, name, college = email domain. Return { success: true, user: { id, email, name } }. Do not return password.
   - POST /api/auth/login
     Body: { email, password }. Find user by email. If not found or password invalid (bcrypt.compare) return 401. Else create JWT (e.g. { userId: user.id }) signed with JWT_SECRET, set in httpOnly cookie (e.g. "session") and return { success: true, user: { id, email, name } }.
   - POST /api/auth/logout: clear session cookie, return { success: true }.
   - GET /api/auth/me: read JWT from cookie; if valid return { id, email, name, college }; else 401.

4) lib/auth.ts: export getSession(request?) or getCurrentUser() that reads JWT from cookie (request or next/headers), verifies with JWT_SECRET, returns user or null. Use in protected APIs and server components.

5) Middleware (middleware.ts): protect /dashboard, /dashboard/add-pg, /dashboard/add-ride. If no valid JWT redirect to /login. Allow /, /pg, /rides, /login, /signup publicly.

6) Auth pages:
   - app/login/page.tsx: form email + password; POST /api/auth/login; on success redirect to /dashboard; show error on 401.
   - app/signup/page.tsx: form email, password, name (optional); POST /api/auth/signup; client-side check email ends with ALLOWED_EMAIL_DOMAIN; on success redirect to /login or /dashboard.

7) .env.example: document JWT_SECRET and ALLOWED_EMAIL_DOMAIN=bitmesra.ac.in (no real secrets).

Do not change pg, rides, or reviews API formats. When done, tell me: "Auth implementation done. Create a branch (e.g. member-2-auth), commit, push, and open a PR."
```

---

## Prompt for Member 3 (PG Listing System)

Copy from the line below to the end of this section and paste into Cursor.

```
I am Member 3 – PG Listing System owner for Campus Nest (Next.js, Prisma, PostgreSQL).

Follow the Permanent API Contract exactly. Do not change field names or response shapes.

1) POST /api/pg – Create PG
   Request body (JSON): title (string), rent (number), location (string), distance (number), description (string), image (string).
   Response: { "success": true, "data": { "id": "<cuid>", "title": "<string>" } }.
   Validate required fields and save using Prisma (PGListing model). Use lib/prisma.ts.

2) GET /api/pg – Get all PGs
   Response: array of { id, title, rent, rating, distance, image }.
   Rating: compute average rating from Review model for each listing (Prisma aggregate). If no reviews, rating can be 0 or null; contract expects a number so use 0 if no reviews.
   Support query params for filters: rent range (min/max), distance max, rating min. Use Prisma conditional where clauses.

3) GET /api/pg/[id] – Get single PG
   Response: full PG listing object (id, title, rent, location, distance, description, image, and computed average rating). Return 404 if not found.

4) Pages and components:
   - app/dashboard/add-pg/page.tsx: form with fields title, rent, location, distance, description, image (URL). On submit POST to /api/pg and show success or error.
   - app/pg/page.tsx: fetch GET /api/pg (with optional filter params), show list using components/pg/PGCard.tsx. Add filters using components/pg/PGFilter.tsx (rent range, max distance, min rating).
   - app/pg/[id]/page.tsx: fetch GET /api/pg/[id] and display the single PG (use existing layout; make it look clean).

Implement PGCard and PGFilter so they accept the data from the API (id, title, rent, rating, distance, image and filter state/callbacks).

Do not change auth or rides or reviews. When done, tell me: “PG implementation done. Create a branch (e.g. member-3-pg-listings), commit, push, and open a PR.”
```

---

## Prompt for Member 4 (Ride Sharing)

Copy from the line below to the end of this section and paste into Cursor.

```
I am Member 4 – Ride Sharing owner for Campus Nest (Next.js, Prisma, PostgreSQL).

Follow the Permanent API Contract exactly. Do not change field names or response shapes.

1) POST /api/rides – Create ride
   Request body: source (string), destination (string), date (string, e.g. "2026-01-01"), seats (number).
   Response: { "success": true }.
   Get the current user from the session (use lib/auth getSession or getCurrentUser – custom auth with JWT). Set ride.college from the user’s college (User.college in DB). If user has no college, you may reject or use a default; document the choice. Save with Prisma (Ride model). Use lib/prisma.ts.

2) GET /api/rides – Get rides
   Response: array of { id, source, destination, date, seats }.
   Only return rides where ride.college matches the logged-in user’s college. If not logged in, return 401 or empty array per team preference (prefer empty array for public listing).

3) POST /api/rides/book – Book a ride
   Request body: { "rideId": "<string>" }.
   Logic: find ride by id; if seats > 0 then decrement seats by 1; if seats becomes 0, you may mark the ride as full (e.g. optional boolean or just rely on seats === 0). Response: { "success": true, "remainingSeats": <number> }. If no seats or invalid rideId, return 4xx with a clear message.

4) Pages and components:
   - app/dashboard/add-ride/page.tsx: form with source, destination, date, seats. On submit POST to /api/rides.
   - app/rides/page.tsx: fetch GET /api/rides, display list using components/rides/RideCard.tsx. Each ride has a “Book” button that calls POST /api/rides/book with that ride’s id and updates remaining seats (or refetch).

Implement RideCard to show source, destination, date, seats and a Book button; disable Book when seats === 0.

Do not change auth, pg, or reviews APIs. When done, tell me: “Rides implementation done. Create a branch (e.g. member-4-rides), commit, push, and open a PR.”
```

---

## Prompt for Member 5 (Reviews + Deployment)

Copy from the line below to the end of this section and paste into Cursor.

```
I am Member 5 – Reviews and Deployment owner for Campus Nest (Next.js, Prisma, PostgreSQL).

Follow the Permanent API Contract exactly. Do not change field names or response shapes. The Review model and reported flag already exist in the schema.

1) POST /api/reviews – Add review
   Request body: listingId (string), rating (number 1–5), comment (string).
   Response: { "success": true }.
   Get userId from the session (use lib/auth getSession or getCurrentUser – custom auth with JWT). Validate listingId exists (PGListing), then create Review with userId, listingId, rating, comment. Use lib/prisma.ts.

2) Rating aggregation: wherever PG listings are shown with a rating (e.g. GET /api/pg or GET /api/pg/[id]), ensure the average rating is computed from the Review model (Prisma aggregate). Member 3 may have done this already; if so, ensure it’s correct and consistent. If not, add or fix the aggregation.

3) Report feature: add a way to “report” a review. Options:
   - PATCH /api/reviews/[id] with body { "reported": true } and set Review.reported = true in DB, or
   - A dedicated POST /api/reviews/[id]/report that sets reported = true.
   Do not change the existing POST /api/reviews response shape. Expose the report action from the UI where reviews are shown (e.g. on a single PG page or in a review list).

4) Deployment:
   - Deploy the Next.js app to Vercel (connect the GitHub repo). Add env vars: DATABASE_URL, JWT_SECRET, ALLOWED_EMAIL_DOMAIN (e.g. bitmesra.ac.in).
   - Ensure the database is Neon (or the same Postgres used in dev). Add DATABASE_URL in Vercel project settings.
   - Add a short “Deployment” section in README: how to deploy to Vercel and required env vars (DATABASE_URL, JWT_SECRET, ALLOWED_EMAIL_DOMAIN).

Do not change auth, pg, or rides API contract. When done, tell me: “Reviews and deployment done. Create a branch (e.g. member-5-reviews-deploy), commit, push, and open a PR.”
```

---

## After using the prompt

Each member should:

1. Pull latest `main`.
2. Create branch: `git checkout -b member-X-<feature>` (e.g. `member-2-auth`).
3. Paste their prompt in Cursor and let the AI implement.
4. Run `npm run build` and fix any errors.
5. Commit: `git add -A && git commit -m "Member X: <short description>"`.
6. Push: `git push -u origin member-X-<feature>`.
7. Open a PR and request review. **Merge order:** 1 (setup) → 2 → 3 → 4 → 5 → 1 (UI/UX last).
