

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index.js';  // Import your models

dotenv.config();

// Seed data
const userSeeds = [
  { username: 'john_doe', email: 'john@example.com' },
  { username: 'jane_smith', email: 'jane@example.com' },
  { username: 'sam_jones', email: 'sam@example.com' },
  { username: 'olivia_jones', email: 'olivia_jones@example.com' }
];

const thoughtSeeds = [
  { thoughtText: 'This is my first thought!', username: 'john_doe' },
  { thoughtText: 'Feeling great today!', username: 'jane_smith' },
  { thoughtText: 'Just got a new job!', username: 'sam_jones' },
  { thoughtText: 'Working on some personal growth this year!', username: 'jane_smith' },
  { thoughtText: 'Can’t wait for the weekend.', username: 'john_doe' },
  { thoughtText: 'Started a new hobby: painting!', username: 'olivia_jones' },
  { thoughtText: 'Exploring new places with friends!', username: 'olivia_jones' }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialNetworkDB');
    console.log('Connected to the database!');

    // Delete existing data to ensure fresh start
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create new users and thoughts
    const createdUsers = await User.insertMany(userSeeds);
    const createdThoughts = await Thought.insertMany(thoughtSeeds);

    // Associate thoughts with users
    for (let i = 0; i < createdUsers.length; i++) {
      const randomThoughts = createdThoughts.slice(i * 2, (i + 1) * 2); // Assign 2 thoughts to each user
      await User.findByIdAndUpdate(createdUsers[i]._id, {
        $push: { thoughts: { $each: randomThoughts.map(thought => thought._id) } }
      });
    }

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
