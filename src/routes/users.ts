import { Router, Request, Response } from 'express';

import { validationResult } from 'express-validator';
import { User } from '../models/user';
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
import { auth, CustomRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { userValidationRules, userLoginValidationRules } from '../errorHandler/validations';

const router = Router();

// create user
router.post(
  '/:orgId/',
  userValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser: User = {
      id: '',
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      orgId: [parseInt(req.params.orgId)],
    };

    const user = await createUser(newUser);
    res.status(201).json(user);
  }),
);

//user logs in
router.post(
  `/:orgId/login`,
  userLoginValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const user: { user: User } = await userLogin(
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
  asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsersByOrgId(parseInt(req.params.orgId));
    res.json(users);
  }),
);
//get user by token
router.get(
  '/:orgId/me',
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    const user: User = await getUserByToken(req.token as string);

    res.json(user);
  }),
);
//get user by id
router.get(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: User = await getUserById(req.params.id);
    res.json(user);
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
    const user: User = await getUserById(req.params.id);
    let hashedPassword: string | undefined;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser: User = {
      id: req.params.id,
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      email: req.body.email || user.email,
      password: hashedPassword || user.password,
      orgId: [parseInt(req.params.orgId)],
    };
    const newUserInfo = await updateUser(updatedUser);
    res.json(newUserInfo);
  }),
);

//delete user
router.delete(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: User = await getUserById(req.params.id);
    await deleteUser(user);
    res.status(204).end();
  }),
);
export default router;