# FitNova

FitNova is a responsive fitness and wellness web app with Supabase authentication and PostgreSQL persistence. Members can create accounts, save a health profile, and keep their generated workout and completion progress across devices.

## Features

- Email and password sign up, sign in, password recovery, and password updates through Supabase Auth.
- User-scoped health profiles and workout progress stored in PostgreSQL with row-level security (RLS).
- BMI, BMR, TDEE, nutrition planning, guided breathing, and nearby facility discovery.
- Static HTML/CSS/JavaScript frontend with a small Vercel serverless endpoint for deployment configuration.

## Stack

- HTML, CSS, and vanilla JavaScript
- [Supabase Auth and PostgreSQL](https://supabase.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions) for runtime public configuration and a validated, bounded OpenStreetMap location lookup
- OpenStreetMap Overpass API for nearby facilities

## Local setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in that project's SQL Editor. It creates the fitness table, forced row-level security, per-user policies, restricted grants, JSON shape and size checks, and a server-managed timestamp trigger. It is safe to run again after the initial setup.
3. For local development, set `FITNOVA_SUPABASE_URL` in [`supabase-config.js`](supabase-config.js) to the Project URL (for example, `https://your-project-ref.supabase.co`) and `FITNOVA_SUPABASE_ANON_KEY` to the publishable key from **Project Settings → API**. The publishable key is designed to be public; never put a `service_role` or secret key in browser code.
4. In **Authentication → URL Configuration**, set the Site URL and allow the local callback URL, such as `http://localhost:3000/**`.
5. Serve the project over HTTP. For example:

   ```bash
   python -m http.server 3000
   ```

   Then open `http://localhost:3000`. The local config file supplies Supabase settings; `/api/config` is available on Vercel deployments and through the Vercel development server.
6. Register through **LOGIN / JOIN**. If email confirmation is enabled, confirm the email before signing in.

## Deploy to Vercel

1. Import the repository into Vercel.
2. In the project's **Settings → Environment Variables**, add `FITNOVA_SUPABASE_URL` and `FITNOVA_SUPABASE_ANON_KEY` for each environment (Production, Preview, and Development as needed). Use the Supabase Project URL and its publishable key. The `/api/config` function returns only these public client settings; it never reads or returns a service-role key.
3. Redeploy after changing environment variables.
4. In Supabase **Authentication → URL Configuration**, set the production site URL and allow the Vercel production and preview callback URLs.
5. Confirm that `supabase/schema.sql` has been applied to the same Supabase project.

## Google sign-in

The login modal uses Supabase OAuth for Google. Enable and configure Google under **Supabase → Authentication → Sign In / Providers** before using its button. The provider callback URI for this project is:

```text
https://cacgoiiaeeusjwruagli.supabase.co/auth/v1/callback
```

For Google, create a **Web application** OAuth client in Google Cloud Console. Add the `openid` scope in the consent configuration if it is not already enabled. Add `https://fitnova-sepia.vercel.app` as an authorized JavaScript origin and the callback URI above as an authorized redirect URI. Enter the Google client ID and secret in the Supabase Google provider settings.

In **Supabase → Authentication → URL Configuration**, set the Site URL to `https://fitnova-sepia.vercel.app` and add `https://fitnova-sepia.vercel.app/**` to the allowed redirect URLs. Use your actual production domain if it differs. Keep provider client secrets only in Supabase; never put them in Vercel frontend variables or browser code. After configuring providers, deploy the updated frontend to Vercel.

## Data and security

`public.fitness_data` stores one profile and the current workout per authenticated user. Forced RLS policies scope reads and writes to `auth.uid()`, and anonymous and public roles have no table privileges. PostgreSQL checks require profile and workout values to be JSON objects within bounded sizes, and the database owns `updated_at`. The configuration endpoint rejects secret keys and returns only a Supabase publishable (or legacy anon) key. The browser publishable key is public by design; access to user rows is enforced by RLS. Never expose Supabase secret or service-role keys.

Vercel applies content-type, framing, referrer, transport-security, and browser-permission headers. The location finder requests geolocation only after a user action. Coordinates are sent to the bounded `/api/places` endpoint for a one-time OpenStreetMap query and are not stored by the app. Facility data comes from public OpenStreetMap endpoints and may be unavailable or incomplete.
