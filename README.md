# WashPanda Frontend

React, Vite, and Tailwind frontend for WashPanda.

## Local setup

```bash
npm install
npm run dev
```

The Vite development server proxies `/api` to `http://localhost:5000`.

## Vercel

Import this repository as a Vercel project and set:

```text
VITE_API_URL=https://your-backend.vercel.app/api
```

Deploy the backend first. After the frontend receives its final URL, add that exact origin (without a trailing slash) to the backend project's `CLIENT_URL` and redeploy the backend. `vercel.json` provides the React Router SPA fallback.
