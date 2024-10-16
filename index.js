import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleWebhook } from './controllers/order.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import ColorsRouter from './routes/colors.js';
import draftsRouter from './routes/drafts.js';
import emailRouter from './routes/mail.js';
import notificationRouter from './routes/notification.js';
import orderRouter from './routes/order.js';
import productsRouter from './routes/products.js';
import superAdminRouter from './routes/superAdmin.js';
import userRouter from './routes/user.js';
import config from './config.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/orders/webhook', express.raw({ type: 'application/json' }), handleWebhook);


// Create MongoDB store
const mongoStore = MongoStore.create({ mongoUrl: config.mongoUrl });


// Middleware setup
app.use(helmet());
app.use(cors(config.corsOptions));
app.use(bodyParser.json());


// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Connect to MongoDB
mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(e => {
    console.error(e);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/', (req, res) => res.status(200).json({ message: "Server status is OK" }));
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/super-admin', superAdminRouter);
app.use('/user', userRouter);
app.use('/notification', notificationRouter);
app.use('/products', productsRouter);
app.use('/drafts', draftsRouter)
app.use("/orders", orderRouter)
app.use("/email", emailRouter)
app.use("/colors", ColorsRouter)

// Create server
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server has been started on port ${config.port}`);
});