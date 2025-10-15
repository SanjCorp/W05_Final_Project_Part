const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // 🔹 agregar
const passport = require('passport');
const path = require('path');

dotenv.config();
require('./auth');

const swaggerDocument = require('./swagger/swagger.json');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();
app.use(express.json());

// 🔹 Session & Passport setup con MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // URI de MongoDB
    collectionName: 'sessions',      // colección para guardar sesiones
    ttl: 14 * 24 * 60 * 60           // duración de la sesión en segundos (14 días)
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// Google Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/api-docs')
);

app.get('/auth/failure', (req, res) => res.status(401).send('Authentication failed'));
app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// 🔹 Nueva ruta /login para redirigir a Google
app.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

// Middleware para proteger rutas
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// Rutas protegidas
app.use('/products', productRoutes(ensureAuth));
app.use('/orders', orderRoutes(ensureAuth));
app.use('/customers', customerRoutes(ensureAuth));
app.use('/suppliers', supplierRoutes(ensureAuth));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root
app.get('/', (req, res) => res.redirect('/api-docs'));

// Error 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error al conectar MongoDB:', err.message));

module.exports = app;
