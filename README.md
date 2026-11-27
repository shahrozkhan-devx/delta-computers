# Delta Computers

Responsive bilingual storefront and admin panel for Delta Computers, built with JavaScript, Next.js App Router, Tailwind CSS, Motion, and Supabase.

## Run locally

1. Install Node.js 18.18 or newer.
2. Install packages with `npm install`.
3. Copy `.env.local.example` to `.env.local`. The public storefront can run with demo listings before Supabase is configured.
4. Start the app with `npm run dev`, then open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Do not use a service-role key in the website.
2. Run `supabase/schema.sql` and then `supabase/seed.sql` in the Supabase SQL Editor.
3. In Supabase Authentication, create an admin user. In the SQL Editor, associate that user using the commented statement at the end of `supabase/seed.sql`.
4. Restart the Next.js app. The admin panel is at `/admin`; public inquiries and admin uploads require the Supabase setup.

The admin user's database authorization and all product write access are protected by Row Level Security. The sample catalog is clearly marked and should be replaced with actual inventory before launch.

## Install the admin app on a phone

The admin area can be installed as a Progressive Web App (PWA); the public storefront remains a regular website. Deploy the site over HTTPS first, then open `https://your-domain.com/admin` on the administrator's phone and sign in with an authorized Supabase admin account.

- **Android:** Open the admin page in Chrome and choose **Install app** or **Add to Home screen** from the browser menu.
- **iPhone:** Open the admin page in Safari, tap **Share**, then **Add to Home Screen**.

The home-screen app still requires an authorized admin login and an internet connection. Installing it does not grant admin access.

## Commands

- `npm run dev` — local development
- `npm run lint` — ESLint
- `npm run build` — production build

## Deployment

Deploy to Vercel and set the three environment variables from `.env.local.example`. Configure Supabase Auth's Site URL and allowed redirect URLs for the deployed domain. Configure a custom domain and test the public inquiry, admin login, product image uploads, mobile navigation, and language switcher before launch.
