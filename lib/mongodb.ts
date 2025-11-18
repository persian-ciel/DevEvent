// lib/mongodb.ts

import mongoose, { Connection } from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Connection | null;
    promise: Promise<typeof import('mongoose')> | null;
  } | undefined;
}

// Create the cached object if it doesn't exist
let cached = global.mongoose || { conn: null, promise: null };


if (!cached) {
  cached = {
    conn: null,
    promise: null
  };
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<Connection> {
  // If already connected, return the existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is not created yet, create the promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
  }

  try {
    const mongooseInstance = await cached.promise; // always defined because we set it above
    cached.conn = mongooseInstance.connection;

    console.log('MongoDB connected successfully');

    // Events (optional)
    cached.conn.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    cached.conn.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    cached.conn.on('disconnected', () => {
      console.warn('Mongoose disconnected from MongoDB');
    });

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('MongoDB disconnected');
  }
}
