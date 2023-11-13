import { app } from '../index';
import { User } from '../models/user';
import { expect, test } from '@jest/globals';
import {
  createUser,
  getUserById,
  getAllUsersByOrgId,
  deleteUser,
  updateUser,
  userLogin,
} from '../firebase/users';
import { BaseError } from '../errorHandler/baseErrors';
import { isValidName, isValidPassword, isValidEmail } from '../errorHandler/validations';

const request = require('supertest');

let testUser1: User = {
  id: '',
  firstName: 'Thor',
  lastName: 'Hansen',
  email: 'testmail@hotmail.com',
  password: 'Test1234!',
  orgId: [1232344432],
};


describe('Regex tests', () => {
  test('regex tests :)', () => {
    expect(isValidName(testUser1.firstName)).toBe(true);
    expect(isValidName(testUser1.lastName)).toBe(true);
    expect(isValidEmail(testUser1.email)).toBe(true);
    expect(isValidPassword(testUser1.password as string)).toBe(true);
  }
  );
});

describe('FIREBASE User tests', () => {
  test('Create user', async () => {
    const data: User = await createUser(testUser1);
    testUser1.id = data.id;
    expect(data.firstName).toBe(testUser1.firstName);
    expect(data.lastName).toBe(testUser1.lastName);
    expect(data.email).toBe(testUser1.email);
    expect(data.orgId).toStrictEqual(testUser1.orgId);
  });

  test('Get user by orgId', async () => {
    const data = await getAllUsersByOrgId(testUser1.orgId![0]);
    const corretId = data.find((e) => e.id === testUser1.id);
    expect(corretId?.firstName).toBe(testUser1.firstName);
    expect(corretId?.lastName).toBe(testUser1.lastName);
    expect(corretId?.email).toBe(testUser1.email);
    expect(corretId?.orgId).toStrictEqual(testUser1.orgId);
    expect(data.length).toBe(1);
  });

  test('Get user by id', async () => {
    const data = await getUserById(testUser1.id!);
    expect(data.firstName).toBe(testUser1.firstName);
    expect(data.lastName).toBe(testUser1.lastName);
    expect(data.email).toBe(testUser1.email);
    expect(data.orgId).toStrictEqual(testUser1.orgId);
  });
  test('User login', async () => {
    const data = await userLogin(testUser1.email, testUser1.password as string, testUser1.orgId![0].toString());
    expect(data.user.firstName).toBe(testUser1.firstName);
    expect(data.user.lastName).toBe(testUser1.lastName);
    expect(data.user.email).toBe(testUser1.email);
    expect(data.user.orgId[0]).toStrictEqual(testUser1.orgId);
    expect(data.user.id).toBe(testUser1.id);
  });

  test('Delete user', async () => {
    await deleteUser(testUser1);
    await expect(getUserById(testUser1.id!)).rejects.toThrow(BaseError);

  });
});