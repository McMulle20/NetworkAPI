//src/routes/api/userRoutes.ts
//route files match Express expectations:
import express, { Request, Response } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../controllers/userController';

const router = express.Router();

// User Routes
router.get('/', async (req: Request, res: Response) => {
    await getUsers(req, res);
});
router.get('/:userId', async (req: Request, res: Response) => {
    await getUserById(req, res);
});
router.post('/', async (req: Request, res: Response) => {
    await createUser(req, res);
});
router.put('/:userId', async (req: Request, res: Response) => {
    await updateUser(req, res);
});
router.delete('/:userId', async (req: Request, res: Response) => {
    await deleteUser(req, res);
});
import express from 'express';
import User from '../models/User';
import Thought from '../models/Thought';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user by ID with populated thoughts and friends
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update user by ID
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true
    });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE to remove a user by ID and their thoughts
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Remove associated thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.json({ message: 'User and their thoughts deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to add a new friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) return res.status(404).json({ error: 'User or Friend not found' });

    user.friends.push(friend._id);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE to remove a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.friends = user.friends.filter(friend => friend.toString() !== req.params.friendId);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

export default router;
