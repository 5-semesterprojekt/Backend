//import { app } from '../index';
import { User } from '../models/user';
import { expect, test } from '@jest/globals';
import {
  createUser,
  getUserById,
  getAllUsersByOrgId,
  deleteUser,
  userLogin,
} from '../firebase/users';
import { BaseError } from '../errorHandler/baseErrors';
import { app } from '../index';
import request from 'supertest';

//const request = require('supertest'); //express

const testUser1: User = {
  id: '',
  firstName: 'Thor',
  lastName: 'Hansen',
  email: 'testmail@hotmail.com',
  password: 'Testå123Å4!',
  orgId: [1232344432],
};

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
    const data = await userLogin(
      testUser1.email,
      testUser1.password as string,
      testUser1.orgId![0].toString(),
    );
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

/******************/
/**** Express  ****/
/******************/

describe('EXPRESS user routes', () => {
  let expressId: string;
  let expressToken: string;
  const orgid = 1232344432 as number;
  const user1: { [key: string]: any } = {
    firstName: 'Thor',
    lastName: 'Hansen',
    email: 'express@mail.com',
    password: 'Test123!!!',
  };
  test('Create user', async () => {
    const res = await request(app)
      .post('/users/' + orgid)
      .send(user1);

    expressId = res.body.id;
    expressToken = res.body.token;
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe(user1.firstName);
    expect(res.body.lastName).toBe(user1.lastName);
    expect(res.body.email).toBe(user1.email);
    expect(res.body).not.toHaveProperty('password');
  });
  test('Login user', async () => {
    const res = await request(app)
      .post('/users/' + orgid + '/login')
      .send({
        email: user1.email,
        password: user1.password,
      })
      .set('Authorization', 'Bearer ' + expressToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstName).toBe(user1.firstName);
    expect(res.body.user.lastName).toBe(user1.lastName);
    expect(res.body.user.email).toBe(user1.email);
    expect(res.body).not.toHaveProperty('password');
  });
  test('Get user by orgId', async () => {
    const res = await request(app)
      .get('/users/' + orgid)
      .set('Authorization', 'Bearer ' + expressToken);
    const user = res.body.find((e: User) => e.id === expressId);
    expect(res.statusCode).toBe(200);
    expect(user.firstName).toBe(user1.firstName);
    expect(user.lastName).toBe(user1.lastName);
    expect(user.email).toBe(user1.email);
    expect(res.body).not.toHaveProperty('password');
  });
  test('Get user by token', async () => {
    const res = await request(app)
      .get('/users/' + orgid + '/me')
      .set('Authorization', 'Bearer ' + expressToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe(user1.firstName);
    expect(res.body.lastName).toBe(user1.lastName);
    expect(res.body.email).toBe(user1.email);
    expect(res.body).not.toHaveProperty('password');
  });
  const user2: { [key: string]: any } = {
    firstName: 'Thor',
    lastName: 'Hansen',
    email: 'updatedtest@mail.com',
    password: 'Testå123Å4!!!!!',
  };
  test('Update user', async () => {
    const res = await request(app)
      .put('/users/' + orgid + '/' + expressId)
      .set('Authorization', 'Bearer ' + expressToken)
      .send(user2);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe(user2.firstName);
    expect(res.body.lastName).toBe(user2.lastName);
    expect(res.body.email).toBe(user2.email);
    expect(res.body).not.toHaveProperty('password');
  });
  test('Login user after password change', async () => {
    const res = await request(app)
      .post('/users/' + orgid + '/login')
      .send({
        email: user2.email,
        password: user2.password,
      })
      .set('Authorization', 'Bearer ' + expressToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstName).toBe(user2.firstName);
    expect(res.body.user.lastName).toBe(user2.lastName);
    expect(res.body.user.email).toBe(user2.email);
    expect(res.body).not.toHaveProperty('password');
  });
  test('Delete user', async () => {
    const res = await request(app)
      .delete('/users/' + orgid + '/' + expressId)
      .set('Authorization', 'Bearer ' + expressToken);
    expect(res.body).not.toHaveProperty('password');
    expect(res.statusCode).toBe(204);
  });
});
