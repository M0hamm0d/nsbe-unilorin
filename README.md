This is the NSBE Unilorin website, built with [Next.js](https://nextjs.org).

## Getting Started

Install dependencies and create your local environment file:

```bash
npm install
cp .env.example .env.local
```

Set `ADMIN_SESSION_SECRET` in `.env.local` to a random string of at least 32 characters. Change `ADMIN_DEMO_PASSWORD` before exposing the admin to a network. Configure the Supabase values when connecting the backend.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The public pages live in `app/(site)/` and keep their existing URLs. The admin area is available at `/admin`; unauthenticated requests are sent to `/admin/login`.

In development, the login page provides these demo accounts:

- `admin@nsbe.test` — full access
- `editor@nsbe.test` — cannot access Sponsors, Settings, or Access
- `resources@nsbe.test` — Resources and Projects only

The demo password defaults to `nsbe-demo` and can be changed with `ADMIN_DEMO_PASSWORD`. These accounts are for development only; replace the demo authentication before production use.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
