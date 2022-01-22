import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // Check env variable existence
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to DB');
  } catch (e) {
    console.error(e);
  }

  const port = 3000;

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
