

## Visitor Stats for Portfolio Admin

### What we're building
A lightweight analytics system that tracks page views on the public portfolio and displays summary stats in the admin dashboard. For a portfolio site, the useful metrics are:

- **Total page views** (all time)
- **Unique visitors** (by anonymous fingerprint)
- **Views over time** (daily chart for last 30 days)
- **Top referrers** (where visitors come from)
- **Page/section visited** (which URL path was viewed)

### Technical approach

#### 1. Database: `page_views` table
Create a new table to log each visit:
- `id` (uuid, PK)
- `page_path` (text) — e.g. `/`, `/admin`
- `referrer` (text, nullable)
- `visitor_id` (text) — anonymous hash from user-agent + IP via edge function
- `country` (text, nullable) — optional, from request headers
- `created_at` (timestamptz)

RLS: Public insert (anonymous visitors must be able to write), admin-only select.

#### 2. Edge function: `track-visit`
An edge function that:
- Receives `page_path` and `referrer` from the client
- Generates a `visitor_id` hash from IP + user-agent (no cookies, privacy-friendly)
- Inserts into `page_views`
- Returns 200

This avoids exposing the table directly to anonymous inserts and allows server-side fingerprinting.

#### 3. Client-side tracking
In `Index.tsx`, call the edge function on page load (once per session via `sessionStorage` flag to avoid duplicate counts on re-renders).

#### 4. Admin Stats component
A new `VisitorStats` component rendered at the top of `AdminDashboard.tsx` showing:
- **Summary cards**: Total views, unique visitors, views today, top referrer
- **Line chart** (using recharts, already installed): Daily views for last 30 days

Data fetched directly from `page_views` table using the authenticated admin session.

### Files to create/modify

| File | Action |
|------|--------|
| `supabase/migrations/...` | Create `page_views` table with RLS |
| `supabase/functions/track-visit/index.ts` | Edge function for logging visits |
| `supabase/config.toml` | Add `verify_jwt = false` for track-visit |
| `src/pages/Index.tsx` | Add tracking call on mount |
| `src/components/admin/VisitorStats.tsx` | New stats dashboard component |
| `src/components/admin/AdminDashboard.tsx` | Add VisitorStats above content tabs |

