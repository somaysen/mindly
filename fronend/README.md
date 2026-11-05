This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## API configuration

For local development, set `NEXT_PUBLIC_API_BASE_URL` or `API_BASE_URL` to your backend origin (for example, `http://localhost:9000`). Production defaults to `https://mindly-backend-omega.vercel.app`; set `API_BASE_URL` in Vercel only if you use a different backend. Browser API calls use the app's `/api` route and Next.js proxies them to this backend, so the browser does not make cross-origin API requests. Authenticated requests forward the app's access-token cookie as a Bearer `Authorization` header. Production builds reject insecure or localhost API overrides.

Canvas collaboration uses a direct WebSocket connection to `/api/canvas/:canvasId/sync`; the HTTP API proxy does not proxy WebSocket upgrades. Set `NEXT_PUBLIC_SYNC_BASE_URL` to the backend origin when it differs from the API origin. HTTPS origins are upgraded to `wss://` automatically. The backend's Vercel deployment must route this endpoint through its WebSocket-enabled Node function and have Fluid Compute enabled. Vercel closes connections when the function reaches its duration limit, so clients must reconnect. Room state is currently held in process memory; Vercel may route collaborators to different instances, so reliable cross-instance collaboration requires shared room state or a dedicated sync service.

## Google sign in

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the OAuth 2.0 web client ID from Google Cloud Console, and add each app origin (for example, `http://localhost:3000` and the production domain) to that client's authorized JavaScript origins. Login and signup send Google's ID token credential to `POST /api/auth/google` through the same-origin API proxy. The backend must validate that credential with Google and return an auth token (`token`, `accessToken`, or `access_token`) or set the app's auth cookie.

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
