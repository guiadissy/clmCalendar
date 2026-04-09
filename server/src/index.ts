import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
