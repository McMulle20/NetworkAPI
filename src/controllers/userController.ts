//src/controllers/userController.ts
import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js'; // Import the User and Thought model

  // Get all users
  export const getUsers = async  (_req: Request, res: Response): Promise<Response> => {
    try {
      const users = await User.find();  // Find all users
      return res.json(users);  // Return users
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Get a single user by ID
  export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findById(req.params.userId)
        .populate('thoughts') // Populate the user's thoughts
        .populate('friends'); // Populate the user's friends
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.json(user);  // Return user data
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err });
    }
  };

  // Create a new user
  export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      return res.status(201).json(newUser);  // Return the created user
    } catch (err) {
      return res.status(400).json({ message: 'Error creating user', error: err });
    }
  };

  // Update a user
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);  // Return updated user
  } catch (err) {
    return res.status(400).json({ message: 'Error updating user', error: err });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Delete all thoughts associated with the user
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    return res.json({ message: 'User and thoughts deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

// Add a friend
export const addFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with this ID' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Remove a friend
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with this ID' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};