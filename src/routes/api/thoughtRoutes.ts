import express from 'express';
import { createThought, getUserThoughts, getThoughtById, updateThought, deleteThought } from '../../controllers/thoughtController';

const router = express.Router();

// Thought Routes
router.post('/users/:userId/thoughts', createThought);
router.get('/users/:userId/thoughts', getUserThoughts);
router.get('/thoughts/:thoughtId', getThoughtById);
router.put('/thoughts/:thoughtId', updateThought);
router.delete('/thoughts/:thoughtId', deleteThought);

export default router;