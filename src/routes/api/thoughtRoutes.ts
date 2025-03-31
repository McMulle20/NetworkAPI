//src/routes/api/thoughtRoutes.ts
import { Router } from 'express';
const router = Router();

import {createThought, updateThought, deleteThought, getThoughts, getThoughtId, addReaction, deleteReaction  } from '../../controllers/thoughtController.js';

// Thought Routes
router.route('/') 
    .get(getThoughts) //Get all thoughts
    .post(createThought); //Create new thought

router
  .route('/:thoughtId')
    .get(getThoughtId) //Get single thought by ID
    .put(updateThought) //Update a thought
    .delete(deleteThought); //Delete a thought

//Reaction routes
router.route('/:thoughtId/reactions')
    .post(addReaction); //Add a reaction

router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction); //Delete a specified Reaction

export default router;