//import { app } from '../index';
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
import { create } from 'domain';

//const request = require('supertest'); //express

const createTestUser: BeforeCreateUser = {
  firstName: 'Thor',
  lastName: 'Hansen',
  email: 'testmail@hotmail.com',
  password: 'Testå123Å4!',
  orgId: [1232344432],
};

describe('FIREBASE User tests', () => {
  let testUser: User;
  test('Create user', async () => {
    testUser = await createUser(createTestUser);
    expect(testUser.firstName).toBe(createTestUser.firstName);
    expect(testUser.lastName).toBe(createTestUser.lastName);
    expect(testUser.email).toBe(createTestUser.email);
    expect(testUser.orgId).toStrictEqual(createTestUser.orgId);
  });
  test('Get user by orgId', async () => {
    const data = await getAllUsersByOrgId(testUser.orgId![0]);
    const corretId = data.find((e) => e.id === testUser.id);
    expect(corretId?.firstName).toBe(testUser.firstName);
    expect(corretId?.lastName).toBe(testUser.lastName);
    expect(corretId?.email).toBe(testUser.email);
    expect(corretId?.orgId).toStrictEqual(testUser.orgId);
    expect(data.length).toBe(1);
  });

  test('Get user by id', async () => {
    const data = await getUserById(testUser.id);
    expect(data.firstName).toBe(testUser.firstName);
    expect(data.lastName).toBe(testUser.lastName);
    expect(data.email).toBe(testUser.email);
    expect(data.orgId).toStrictEqual(testUser.orgId);
  });
  test('User login', async () => {
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

  test('Delete user', async () => {
    await deleteUser(testUser);
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

/*********************/
/*TEST THAT WILL FAIL*/
/*********************/
describe('Test meant to fail', () => {
  test('Create user with common password', async () => {
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
  test('Create user with wrong email', async () => {
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
  test('Create user with not enough chars', async () => {
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
  const userWithTokenPassword ='Asd!!!asdD23123';
  let userWithToken: User;
  test('Create user with email allready in the system', async () => {
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
  test('login with wrong password', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432] + '/login')
      .send({
        email: userWithToken.email,
        password: 'wrongPassword!1!',
      });
    expect(res.statusCode).toBe(401);
  });

  test('login with wrong email', async () => {
    const res = await request(app)
      .post('/users/' + [1232344432] + '/login')
      .send({
        email: 'wrongEmail@mail.com',
        password: userWithTokenPassword,
      });
      
      console.log(res.body)
    expect(res.statusCode).toBe(401);
  });

  test('login with wrong orgId', async () => {
    const res = await request(app)
      .post('/users/' + [123] + '/login')
      .send({
        email: userWithToken.email,
        password: userWithTokenPassword,
      });
    expect(res.statusCode).toBe(401);
    await deleteUser(userWithToken);
  });
  test('Get me by orgId with wrong token', async () => {
    const res = await request(app)
    .post('/users/' + [1232344432] + '/me')
    .set('Authorization', 'Bearer ' + 'wrongToken');
    expect(res.statusCode).toBe(500);
  }
  );
})
