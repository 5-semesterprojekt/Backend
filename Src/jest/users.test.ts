import { app } from '../index';
import { user } from '../models/user';
import { expect, test } from '@jest/globals';
import {
    createUser,
    getUserById,
    getAllUsersByOrgId,
    deleteUser,
    updateUser,
    userLogin,
  } from '../firebase/users';


const request = require('supertest');
  