//Connect to MongoDB

import mongoose from 'mongoose';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';
        await mongoose.connect(mongoURI);
        console.log('Database connected.');
        return mongoose.connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed.');
    }
};

export default db;

