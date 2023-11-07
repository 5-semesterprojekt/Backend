import { Router, Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator';
import { user } from '../models/user';
import { asyncHandler } from '../errorHandler/asyncHandler';
import {
  createUser,
  getAllUsersByOrgId,
  getUserById,
  deleteUser,
  updateUser,
  userLogin,
  getUserByToken,
} from '../firebase/users';
import { auth } from './auth';

const bcrypt = require('bcrypt');
const router = Router();

const userValidationRules = [
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('firstName is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').notEmpty().withMessage('password is required'),
];
// create user
router.post(
  '/:orgId/',
  userValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser: user = {
      id: "",
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      orgId: [parseInt(req.params.orgId)],
    };

    const user = await createUser(newUser);
    res.status(201).json({ user });
  }),
);

//user logs in
router.post(
  `/:orgId/login`,
  asyncHandler(async (req: Request, res: Response) => {
    const user: { user: user } = await userLogin(
      req.body.email,
      req.body.password,
      req.params.orgId,
    );
    res.status(200).json(user);
  }),
);

//get users by orgId
router.get(
  '/:orgId/',
  auth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsersByOrgId(parseInt(req.params.orgId));
    res.json(users);
  }),
);

//get user by id
router.get(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: user = await getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  }),
);
//get user by token
router.get(
  '/:orgId/me',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: user = await getUserByToken(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  }),
);

//update user
router.put(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user: user = await getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
      const updatedUser: user = {
        id: req.params.id,
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        email: req.body.email || user.email,
        password: hashedPassword || user.password,
        orgId: [parseInt(req.params.orgId)],
      };
      updateUser(updatedUser);
      res.status(204).end();
    }
  }),
);

//delete user
router.delete(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: user = await getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      await deleteUser(user);
      res.status(204).end();
    }
  }),
);
export default router;
