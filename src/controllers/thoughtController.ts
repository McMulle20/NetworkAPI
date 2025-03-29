//src/controllers/thoughtController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User, Thought } from '../models';

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
      const { thoughtId } = req.params;  // Extract thoughtId from params
  
      // Step 1: Delete the thought document
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      // Step 2: Remove the thoughtId reference from the user's thoughts array
      const updatedUser = await User.findOneAndUpdate(
        { thoughts: thoughtId },  // Find user who has the thoughtId in their array
        { $pull: { thoughts: thoughtId } },  // Safely remove the thoughtId from the thoughts array
        { new: true }  // Return the updated user document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Step 3: Return success response
      return res.status(200).json({ message: 'Thought deleted successfully', updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  };