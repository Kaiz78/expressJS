import express from 'express';
import { readdir } from 'fs/promises';
import passport from 'passport';
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 4000;


// Start server
app.listen(PORT, () => {
  // Middleware
  app.use(express.json());
  // initialization strategy
  app.use(passport.initialize());

  // Routes
  loadRoutes();

  console.log(`Server running on port ${PORT}`);
});


// Charges les routes
const loadRoutes = async () => {
  try {
    const files = await readdir('./src/routes');
    for (const file of files) {
      if (file.endsWith('.js')) {
        const { default: routes } = await import(`./routes/${file}`);
        app.use('/api', routes);
      }
    }
  } catch (error) {
    console.error('Error loading routes:', error);
  }
};