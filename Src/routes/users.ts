import { Router, Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator';
import { user } from '../models/user';
import { asyncHandler } from './errorhandling';
import {
  createUser,
  getAllUsersByOrgId,
  getUserById,
  deleteUser,
  updateUser,
  userLogin,
} from '../firebase/users';

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

    //id might be a problem
    const user: user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      orgId: [parseInt(req.params.orgId)],
    };

    const result = await createUser(user);
    res.status(201).json({ ...user, id: result.id }); //missing token
  }),
);

//user logs in
router.get(
  `/:orgId/login`,
  userValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const user: user | undefined = await userLogin(
      req.body.email,
      req.body.password,
    );
    if (user) {
      res.status(200).json(user); //missing token, gets it from firebase
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  }),
);

//get users by orgId
router.get(
  '/:orgId/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsersByOrgId(parseInt(req.params.orgId));
    res.json(users);
  }),
);

//get user by id
router.get(
  '/:orgId/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user: user = await getUserById(req.params.id);
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
  userValidationRules,
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
  asyncHandler(async (req: Request, res: Response) => {
    const user: user = await getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      deleteUser(user);
      res.status(204).end();
    }
  }),
);
export default router;
