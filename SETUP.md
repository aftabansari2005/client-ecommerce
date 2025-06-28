# Modern MERN E-commerce Setup Guide

This project has been updated to use modern technologies and dependencies. Here's how to set it up:

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd MERN-ecommerce-backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe Configuration
STRIPE_SERVER_KEY=sk_test_your_stripe_secret_key
ENDPOINT_SECRET=whsec_your_stripe_webhook_secret

# Server Configuration
PORT=8080
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd MERN-ecommerce-Frontend
npm install
```

### 2. Start Frontend
```bash
npm start
```

## Key Updates Made

### Backend Updates
- ✅ Upgraded to ES Modules (import/export)
- ✅ Replaced Passport.js with modern JWT authentication
- ✅ Updated to bcryptjs for password hashing
- ✅ Added security middleware (helmet, rate limiting)
- ✅ Updated all dependencies to latest versions
- ✅ Improved error handling and logging
- ✅ Added input validation
- ✅ Modern MongoDB operations

### Frontend Updates
- ✅ Replaced react-alert with react-hot-toast
- ✅ Updated all dependencies to latest versions
- ✅ Modern React patterns and hooks
- ✅ Improved error handling
- ✅ Better TypeScript-like patterns

### Removed Deprecated Dependencies
- ❌ Passport.js (replaced with custom JWT auth)
- ❌ react-alert (replaced with react-hot-toast)
- ❌ react-loader-spinner (can be replaced with modern alternatives)
- ❌ SQLite dependencies (not used in this project)

## Features

- 🔐 Modern JWT Authentication
- 🛒 Shopping Cart Management
- 💳 Stripe Payment Integration
- 📧 Email Notifications
- 👤 User Profile Management
- 🛍️ Product Management (Admin)
- 📦 Order Management
- 🔍 Product Search & Filtering
- 📱 Responsive Design

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/check` - Check authentication
- `GET /auth/logout` - User logout
- `POST /auth/reset-password-request` - Request password reset
- `POST /auth/reset-password` - Reset password

### Products
- `GET /products` - Get all products (with filtering)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PATCH /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove item from cart

### Orders
- `GET /orders` - Get all orders (admin)
- `GET /orders/own` - Get user orders
- `POST /orders` - Create order
- `PATCH /orders/:id` - Update order (admin)
- `DELETE /orders/:id` - Delete order (admin)

### Users
- `GET /users/own` - Get user profile
- `PATCH /users/:id` - Update user profile

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting
- CORS configuration
- Input validation
- Secure cookie handling
- Helmet security headers

## Deployment

### Backend (Vercel)
The backend is configured for Vercel deployment with the provided `vercel.json`.

### Frontend
The frontend can be deployed to any static hosting service (Vercel, Netlify, etc.).

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure MongoDB is running and the connection string is correct
2. **Email Issues**: Use Gmail App Passwords for email authentication
3. **Stripe Issues**: Ensure you're using test keys for development
4. **CORS Issues**: Check that FRONTEND_URL is set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 