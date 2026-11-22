# DevBlog — Full-Stack Developer Blog

A multi-page developer blog built with semantic HTML5, responsive CSS3, vanilla JavaScript, and **Supabase** (PostgreSQL + Auth + Row Level Security).

## Features
- **Authentication & Session Management:** User sign-up, login, session persistence, dynamic navbar state, and logout via Supabase Auth.
- **Protected Author Dashboard:** Route guard on `dashboard.html` redirecting unauthenticated visitors to `login.html`, displaying user profile info, and showing the signed-in user's posts.
- **Full CRUD Operations:** Create, read, update, and delete blog posts persisted in PostgreSQL (`public.blogs`).
- **Search & Category Filtering:** Instant client-side filtering by keyword (`title`, `content`, `author`) and blog category (`All`, `Web Development`, `CSS & Design`, `JavaScript`, `Backend & DB`).
- **Article Detail View:** Dedicated `post.html?id=<id>` page for reading full posts.

## Project Structure
- `index.html` — Public blog feed with search and category filters
- `post.html` — Individual article reader view
- `login.html` — User login page
- `register.html` — New account registration page
- `dashboard.html` — Protected CRUD workspace and user profile view
- `script.js` — Supabase client initialization, auth guards, CRUD operations, and live filtering
- `style.css` — Dark-theme styling and mobile-responsive layout

## Setup & Local Run
1. Clone or open the project folder in your editor.
2. Create a Supabase project and set up the `public.blogs` table with Row Level Security policies (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) and email confirmation configured as needed.
3. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top of `script.js`.
4. Serve over a local HTTP server (e.g., VS Code Live Server or `python -m http.server 5500`) rather than `file://`.

## Deployment
Deployed as a static web application on **Vercel** connected to Supabase.
