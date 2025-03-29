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

export default router;
