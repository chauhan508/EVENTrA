const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    try {
      console.log('Connecting to configured MongoDB...');
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.warn('Configured MongoDB connection failed:', err.message);
    }
  }

  // Attempt local connection if specified
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log('Local MongoDB connected successfully at:', uri);
      return;
    } catch (err) {
      console.warn('Local MongoDB connection failed, falling back to embedded MongoDB engine:', err.message);
    }
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Starting Embedded MongoDB Engine for seamless zero-setup execution...');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'eventra'
      }
    });
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log('Embedded MongoDB connected at:', memUri);
  } catch (err) {
    console.error('Fatal: Could not initialize database:', err);
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }
};

module.exports = { connectDB, disconnectDB };
