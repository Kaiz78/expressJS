import express from 'express';

import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3005;


app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
