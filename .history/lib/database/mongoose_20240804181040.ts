import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {
  if(cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if(!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL environment variable');
  }

  try {
    console.log('Connecting to MongoDB...');
    cached.promise = 
      cached.promise || 
      mongoose.connect(MONGODB_URL, { 
        dbName: 'Nyme', bufferCommands: false 
      });

    cached.conn = await cached.promise;
    console.log('Successfully connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Add an event listener for connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Add an event listener for successful connections
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});