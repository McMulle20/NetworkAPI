import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Thought from '../models/Thought'; // Import the Thought model
import User from '../models/User'; // Import the User model

// Create a new thought
export const createThought = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.params;
        const { thoughtText } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newThought = new Thought({
            thoughtText,
            username: user.username, // Assuming each thought is associated with the user who created it
            userId,
        });

        await newThought.save();
        user.thoughts.push(newThought._id as Types.ObjectId); // Add thought ID to user's thoughts array
        await user.save();

        return res.status(201).json(newThought);  // Ensure that you're returning the response
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });  // Ensure return in catch block
    }
};

// Get all thoughts of a user
export const getUserThoughts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('thoughts');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.thoughts);  // Ensure that you're returning the response
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });  // Ensure return in catch block
    }
};

// Get a single thought by ID
export const getThoughtById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { thoughtId } = req.params;
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        return res.status(200).json(thought);  // Ensure that you're returning the response
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });  // Ensure return in catch block
    }
};

// Update a thought
export const updateThought = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { thoughtId } = req.params;
        const updates = req.body;

        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, updates, { new: true });

        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        return res.status(200).json(updatedThought);  // Ensure that you're returning the response
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });  // Ensure return in catch block
    }
};

// Delete a thought
export const deleteThought = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { thoughtId } = req.params;

        // Find and delete the thought
        const deletedThought = await Thought.findByIdAndDelete(thoughtId);

        if (!deletedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Remove the thought from the associated user's thoughts array
        const user = await User.findOne({ thoughts: thoughtId });
        if (user) {
            // Using the `pull` method to safely remove the thought from the user's array
            user.thoughts.pull(thoughtId); // Pull the thoughtId from the thoughts array
            await user.save(); // Save the user document after modifying the thoughts array
        }

        return res.status(200).json({ message: 'Thought deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
