# ProjectFlow Frontend

Enterprise Project & Task Management SPA built with Vite + React + Redux Toolkit.

## Tech Stack

- Vite + React + TypeScript
- React Router
- Redux Toolkit + redux-persist
- Tailwind CSS + ShadCN UI
- React Hook Form + Zod
- Axios → Express BE
- TanStack Query, Recharts

## Getting Started

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

Backend API (default): `http://localhost:3001/api` via `VITE_API_URL`.

## Demo Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@projectflow.com | admin123 |
| Project Manager | manager@projectflow.com | manager123 |
| Member | member@projectflow.com | member123 |

## Current Features

- Login / Logout against Express + MongoDB BE
- Redux-persisted auth session
- Protected dashboard showing authenticated user name
