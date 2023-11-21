import { User, BeforeCreateUser } from '../models/user';
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

describe('FIREBASE User tests', () => {
  const createTestUser: BeforeCreateUser = {
    firstName: 'Thor',
    lastName: 'Hansen',
    email: 'testmail@hotmail.com',
    password: 'Testå123Å4!',
    orgId: [1232344432],
  };
  let testUser: User;
  beforeAll(async () => {
    testUser = await createUser(createTestUser);
  });
  afterAll(async () => {
    await deleteUser(testUser);
  });
  test('Successfully create a user in the FIREBASE User service', async () => {
    expect(testUser.firstName).toBe(createTestUser.firstName);
    expect(testUser.lastName).toBe(createTestUser.lastName);
    expect(testUser.email).toBe(createTestUser.email);
    expect(testUser.orgId).toStrictEqual(createTestUser.orgId);
  });
  test('Successfully retrieve a user by organization ID from the FIREBASE User service', async () => {
    const data = await getAllUsersByOrgId(testUser.orgId![0]);
    const corretId = data.find((e) => e.id === testUser.id);
    expect(corretId?.firstName).toBe(testUser.firstName);
    expect(corretId?.lastName).toBe(testUser.lastName);
    expect(corretId?.email).toBe(testUser.email);
    expect(corretId?.orgId).toStrictEqual(testUser.orgId);
    expect(data.length).toBe(1);
  });

  test('Successfully fetch a user by user ID from the FIREBASE User service', async () => {
    const data = await getUserById(testUser.id);
    expect(data.firstName).toBe(testUser.firstName);
    expect(data.lastName).toBe(testUser.lastName);
    expect(data.email).toBe(testUser.email);
    expect(data.orgId).toStrictEqual(testUser.orgId);
  });
  test('Successfully log in a user via the FIREBASE User service', async () => {
    const data = await userLogin(
      testUser.email,
      createTestUser.password as string,
      testUser.orgId![0].toString(),
    );
    expect(data.user.firstName).toBe(testUser.firstName);
    expect(data.user.lastName).toBe(testUser.lastName);
    expect(data.user.email).toBe(testUser.email);
    expect(data.user.orgId[0]).toStrictEqual(testUser.orgId);
    expect(data.user.id).toBe(testUser.id);
  });

  test('Successfully delete a user from the FIREBASE User service', async () => {
    await expect(getUserById(testUser.id)).rejects.toThrow(BaseError);
  });
});

/******************/
/**** Express  ****/
/******************/

describe('EXPRESS user routes', () => {
  let expressId: string;
  let expressToken: string;
  const orgid = [1232344432] as Array<number>;
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
  test('Successfully log in a user via the EXPRESS user route', async () => {
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
  test('Successfully retrieve a user by token from the EXPRESS user route', async () => {
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
  test('Successfully update a user via the EXPRESS user route', async () => {
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
  test('Successfully log in a user after password change via the EXPRESS user route', async () => {
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

/*********************/
/*TEST THAT WILL FAIL*/
/*********************/
describe('Test meant to fail', () => {
  test('Fail to create a user with a common password via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'Thor',
        lastName: 'Hansen',
        email: 'asdfasdfasdf@hotmail.com',
        password: '987654321',
      });
    expect(res.statusCode).toBe(400);
  });
  test('Fail to create a user with an invalid email format via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'Thor',
        lastName: 'Hansen',
        email: 'notAnEmail@.gh',
        password: 'Asd!!!asdD23123',
      });
    expect(res.statusCode).toBe(400);
  });
  test('Fail to create a user with insufficient characters in a field via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'T',
        lastName: 'Hansen',
        email: 'notAnEmail@.gh',
        password: 'Asd!!!asdD23123',
      });
    expect(res.statusCode).toBe(400);
  });
  const userWithTokenPassword = 'Asd!!!asdD23123';
  let userWithToken: User;
  test('Fail to create a user with an existing email via the EXPRESS user route', async () => {
    const deleteRes = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'Thor',
        lastName: 'Hansen',
        email: 'asdfasdfasdf@hotmail.com',
        password: 'Asd!!!asdD23123',
      });
    userWithToken = deleteRes.body;
    const res = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'Thor',
        lastName: 'Hansen',
        email: 'asdfasdfasdf@hotmail.com',
        password: 'Asd!!!asdD23123',
      });
    expect(deleteRes.statusCode).toBe(201);
    expect(res.statusCode).toBe(400);
  });
  test('Fail to authenticate a user with an incorrect password via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432] + '/login')
      .send({
        email: userWithToken.email,
        password: 'wrongPassword!1!',
      });
    expect(res.statusCode).toBe(401);
  });

  test('Fail to authenticate a user with an incorrect email via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432] + '/login')
      .send({
        email: 'wrongEmail@mail.com',
        password: userWithTokenPassword,
      });
    expect(res.statusCode).toBe(401);
  });

  test('Fail to authenticate a user with an incorrect organization ID via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [123] + '/login')
      .send({
        email: userWithToken.email,
        password: userWithTokenPassword,
      });
    expect(res.statusCode).toBe(401);
    await deleteUser(userWithToken);
  });
  test('Fail to fetch user details by organization ID with an invalid token via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432] + '/me')
      .set('Authorization', 'Bearer ' + 'wrongToken');
    expect(res.statusCode).toBe(500);
  });
  test('Fail to create a user with inconsistent repeat password via the EXPRESS user route', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432])
      .send({
        firstName: 'Thor',
        lastName: 'Hansen',
        email: 'asdfasdfasdf@hotmail.com',
        password: 'Asd!!!asdD23123',
        repeatPassword: 'Asd!!!asdD23123!',
      });
    expect(res.statusCode).toBe(400);
  });
});
