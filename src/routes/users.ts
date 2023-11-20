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
import { commonPasswords100 } from '../errorHandler/validations';
import { celebrate, Joi, Segments } from 'celebrate';
import { BaseError } from '../errorHandler/baseErrors';

const router = Router();
/*******************/
/*** CREATE USER ***/
/*******************/

router.post(
  '/:orgId/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^[a-zæøåA-ZÆØÅ\\-\s]+$/)
        .min(2)
        .max(64)
        .required(),
      lastName: Joi.string()
        .regex(/^[a-zæøåA-ZÆØÅ\\-\s]+$/)
        .min(2)
        .max(64)
        .required(),
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-ZÆØÅa-zæøå\d@$!%*?&]{8,}$/)
        .min(8)
        .max(64),
      repeatPassword: Joi.ref('password'),
    }),
  }),
  asyncHandler(async (req: Request, res: Response) => {
    if (commonPasswords100.includes(req.body.password)) {
      throw new BaseError('Password is too common', 400);
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
/******************/
/*** USER LOGIN ***/
/******************/

router.post(
  `/:orgId/login`,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zæøå)(?=.*[A-ZÆØÅ]).{8,}$/)
        .min(8)
        .max(64),
    }),
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const user: { user: User } = await userLogin(
      req.body.email,
      req.body.password,
      req.params.orgId,
    );
    res.status(200).json(user);
  }),
);
/****************************/
/*** GET ALL USERS BY ORG ***/
/****************************/

router.get(
  '/:orgId/',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsersByOrgId(parseInt(req.params.orgId));
    res.json(users);
  }),
);
/****************************/
/*** GET USER BY TOKEN/ID ***/
/****************************/
router.get(
  '/:orgId/me',
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    const user: User = await getUserByToken(req.token as string);

    res.json(user);
  }),
);
/**********************/
/*** GET USER BY ID ***/
/**********************/

router.get(
  '/:orgId/:id',
  auth,
  asyncHandler(async (req: Request, res: Response) => {
    const user: User = await getUserById(req.params.id);
    res.json(user);
  }),
);
/**********************/
/**** UPDATE USER *****/
/**********************/

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
/**********************/
/**** DELETE USER *****/
/**********************/

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
