import mongoose from 'mongoose';
import { migrateProductImages } from './migration.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetwear_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Run automated migration on startup
    await migrateProductImages();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
