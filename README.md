# Ali Algohary — Portfolio

A modern, fully dynamic portfolio website with an integrated admin dashboard for managing content, built with React, TypeScript, and Lovable Cloud.

## ✨ Features

- **Dynamic Portfolio Sections** — Summary, Experience, Education, Projects, Volunteering, Trainings, Certificates, Skills, and Testimonials — all editable from the admin panel.
- **Admin Dashboard** (`/admin`) — Secure, authenticated admin area to create, edit, and delete portfolio entries with a rich text editor.
- **RTL/LTR Support** — Automatic text direction detection for mixed Arabic and English content.
- **Visitor Analytics** — Privacy-friendly page view tracking with daily charts, unique visitor counts, and top referrers displayed in the admin dashboard.
- **Contact Info Management** — Editable contact details (email, phone, LinkedIn, GitHub, CV link) managed through the admin.
- **Responsive Design** — Fully responsive layout optimized for desktop and mobile.
- **SEO Optimized** — Semantic HTML, meta tags, sitemap, and robots.txt included.

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, TypeScript, Vite          |
| Styling    | Tailwind CSS, shadcn/ui             |
| Backend    | Lovable Cloud (database, auth, edge functions) |
| Charts     | Recharts                            |
| Sanitization | DOMPurify                         |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or bun

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── ContactInfoEditor.tsx
│   │   └── VisitorStats.tsx
│   ├── ui/             # shadcn/ui components
│   ├── NavLink.tsx
│   └── RichTextEditor.tsx
├── contexts/
│   ├── AuthContext.tsx  # Authentication state
│   └── PortfolioContext.tsx  # Portfolio data management
├── hooks/              # Custom React hooks
├── lib/                # Utilities (analytics, sanitization)
├── pages/
│   ├── Index.tsx       # Public portfolio page
│   ├── Admin.tsx       # Admin route
│   └── NotFound.tsx
└── types/
    └── portfolio.ts    # Type definitions & section config
supabase/
└── functions/
    └── track-visit/    # Edge function for analytics
```

## 🔐 Authentication

The admin panel uses email/password authentication. The first registered user can be assigned the admin role. Role-based access control is enforced via database-level security policies.

## 📊 Analytics

Page views are tracked via a privacy-friendly edge function that generates anonymous visitor IDs server-side (no cookies). Stats are visible only to authenticated admins.

## 🌐 Deployment

Deploy instantly via [Lovable](https://lovable.dev) — click **Share → Publish**. Backend changes (edge functions, database) deploy automatically.

## 📄 License

This project is private. All rights reserved.
