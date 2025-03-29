import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index';  // Import your models

dotenv.config();

// Seed data
const userSeeds = [
  { username: 'john_doe', email: 'john@example.com' },
  { username: 'jane_smith', email: 'jane@example.com' },
  { username: 'sam_jones', email: 'sam@example.com' }
];

const thoughtSeeds = [
  { content: 'This is my first thought!', username: 'john_doe' },
  { content: 'Feeling great today!', username: 'jane_smith' },
  { content: 'Just got a new job!', username: 'sam_jones' }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialNetworkDB', {
    });

    console.log('Connected to the database!');

    // Delete existing data to ensure fresh start
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create new users and thoughts
    await User.insertMany(userSeeds);
    await Thought.insertMany(thoughtSeeds);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDatabase();
