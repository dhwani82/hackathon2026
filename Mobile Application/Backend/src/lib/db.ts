import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

export async function connectDb(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment');
  }
  await mongoose.connect(MONGODB_URI);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
