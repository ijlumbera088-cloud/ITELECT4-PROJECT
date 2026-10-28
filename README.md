# ITELECT4 Frontend

[![Frontend CI](https://github.com/ijlumbera088-cloud/itelect4-project/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlumbera088-cloud/itelect4-project/actions/workflows/ci.yml)

## GitHub repository
- Frontend repo: https://github.com/ijlumbera088-cloud/itelect4-project.git

## Live deployment
- Live frontend: https://itelect4-project.vercel.app
- Live backend: https://itelect4-backend.vercel.app

## Project overview
This frontend connects to the backend API for authentication and item submission features.

## Local setup
1. Copy `.env.example` to `.env`
2. Update the backend URL if needed
3. Start the app:

```bash
npm install
npm run dev
```

## Required environment variable
```env
VITE_API_URL=http://localhost:4000
```

## Vercel deployment note
Set `VITE_API_URL` in the project environment variables to the deployed backend URL before deploying the frontend.

Example:
```env
VITE_API_URL=https://your-live-backend-url.vercel.app
```
