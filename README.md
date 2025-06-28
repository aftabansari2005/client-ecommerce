# MERN E-commerce Monorepo

This is a modern, full-featured MERN (MongoDB, Express, React, Node.js) e-commerce application.

## Structure

- `backend/` — Node.js/Express API, MongoDB, JWT Auth, Stripe, Email
- `frontend/` — React 18, Redux Toolkit, Tailwind CSS, Stripe, modern UI

## Quick Start

### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables
See `backend/.env.example` for backend config. Create your own `.env` in `backend/`.

### 3. Run the app
- Start backend: `cd backend && npm run dev`
- Start frontend: `cd frontend && npm start`

### 4. Open in browser
Go to [http://localhost:3000](http://localhost:3000)

## Features
- User authentication (JWT)
- Admin panel
- Product management
- Cart & checkout
- Stripe payments
- Email notifications
- Responsive design

## More
- See `SETUP.md` for full setup and API docs.
- Each subfolder has its own README for details. 