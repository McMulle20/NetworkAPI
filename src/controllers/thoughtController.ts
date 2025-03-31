import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

// Create a new thought
export const createThought = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Create a new Thought document from the request body
    const thought = await Thought.create(req.body);
    
    // Find the user by ID and associate the new thought with them by pushing the thought's ID into the user's thoughts array
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thought._id } },  // Add thought ID to user's thoughts array
      { new: true }  // Return the updated user document
    );

    // If the user was not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: 'Thought created, but found no user with that ID',
      });
    }

    // Return the created thought as a response
    return res.json(thought);
  } catch (err) {
    console.log(err);  // Log error for debugging
    return res.status(500).json(err);  // Return server error if any
  }
}

// Get all thoughts
export const getThoughts = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Fetch all thoughts from the database
    const thoughts = await Thought.find();
    
    // Return the list of thoughts as a JSON response
    return res.json(thoughts);
  } catch (err) {
    return res.status(500).json(err);  // Return error if fetching thoughts fails
  }
}

// Get a single thought by ID
export const getThoughtId = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Find a single thought using the thoughtId from the request params
    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    // Return the found thought as a response
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);  // Return error if fetching the thought fails
  }
}

// Update a thought
export const updateThought = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Update the thought with the given ID using the data in the request body
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },  // Apply the update with the new data
      { runValidators: true, new: true }  // Ensure validation and return the updated document
    );

    // If the thought is not found, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    // Return the updated thought
    return res.json(thought);
  } catch (err) {
    console.log(err);  // Log error for debugging
    return res.status(500).json(err);  // Return server error if update fails
  }
}

// Delete a thought
export const deleteThought = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Delete the thought document with the given ID
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

    // If the thought doesn't exist, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    // Find the user associated with the deleted thought and remove the thought ID from their thoughts array
    const user = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },  // Safely remove the thought ID from the user's thoughts array
      { new: true }  // Return the updated user document
    );

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        message: 'No user found with this id!',
      });
    }

    // Return success message after successfully deleting the thought
    return res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    return res.status(500).json(err);  // Return error if deletion fails
  }
}

// Add a reaction to a thought
export const addReaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Find the thought by ID and add a new reaction to the reactions array
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $push: {
          reactions: {
            reactionBody: req.body.reactionBody,  // Reaction content
            username: req.body.username,  // User who is adding the reaction
          },
        },
      },
      { new: true, runValidators: true }  // Ensure the new document is returned and validated
    );

    // If the thought is not found, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: 'No thought with this ID' });
    }

    // Return the updated thought with the new reaction
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);  // Return error if adding the reaction fails
  }
};

// Delete a reaction from a thought
export const deleteReaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Find the thought by ID and remove the specific reaction using reactionId
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },  // Remove reaction using reactionId
      { new: true }
    );

    // If the thought is not found, return a 404 error
    if (!thought) {
      return res.status(404).json({ message: 'No reaction with that ID' });
    }

    // Return the updated thought after deleting the reaction
    return res.json(thought);
  } catch (err) {
    return res.status(500).json(err);  // Return error if deletion fails
  }
};
