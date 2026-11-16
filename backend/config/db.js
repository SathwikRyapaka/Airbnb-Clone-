const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airbnb_clone';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (initialErr) {
    console.warn(`[MongoDB] Primary connection to ${uri.replace(/:([^@]+)@/, ':****@')} failed: ${initialErr.message}`);
    console.log('[MongoDB] Attempting in-memory database fallback for seamless development...');

    try {
      // Dynamic import/require so development can continue without standalone mongod installed
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Running in-memory database at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] In-memory database fallback also failed or not installed.');
      console.error('[MongoDB] Please ensure MongoDB is running locally or specify valid MONGODB_URI in backend/.env');
      throw initialErr;
    }
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
