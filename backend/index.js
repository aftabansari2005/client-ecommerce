import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import { router as productsRouter } from './routes/Products.js';
import { router as categoriesRouter } from './routes/Categories.js';
import { router as brandsRouter } from './routes/Brands.js';
import { router as usersRouter } from './routes/Users.js';
import { router as authRouter } from './routes/Auth.js';
import { router as cartRouter } from './routes/Cart.js';
import { router as ordersRouter } from './routes/Order.js';

// Import middleware
import { isAuth } from './middleware/auth.js';

// Import models
import { Order } from './model/Order.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const server = express();

// Security middleware
server.use(helmet());
server.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
server.use(limiter);

// Middleware
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cookieParser());
server.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
}));
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Stripe webhook (needs raw body)
server.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const stripe = await import('stripe');
  const stripeInstance = stripe.default(process.env.STRIPE_SERVER_KEY);
  const endpointSecret = process.env.ENDPOINT_SECRET;

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      try {
        const order = await Order.findById(paymentIntentSucceeded.metadata.orderId);
        if (order) {
          order.paymentStatus = 'received';
          await order.save();
        }
      } catch (error) {
        console.error('Error updating order:', error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

// Routes
server.use('/products', isAuth, productsRouter);
server.use('/categories', isAuth, categoriesRouter);
server.use('/brands', isAuth, brandsRouter);
server.use('/users', isAuth, usersRouter);
server.use('/auth', authRouter);
server.use('/cart', isAuth, cartRouter);
server.use('/orders', isAuth, ordersRouter);

// Stripe payment intent endpoint
server.post('/create-payment-intent', async (req, res) => {
  try {
    const stripe = await import('stripe');
    const stripeInstance = stripe.default(process.env.STRIPE_SERVER_KEY);
    
    const { totalAmount, orderId } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // for decimal compensation
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
});

// Catch-all route for React Router
server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connected successfully');
    
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

main();
