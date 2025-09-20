import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Shubhi_23:Shubhi%40123@managementtool.pq8tfno.mongodb.net/pm_db';

export default async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}
