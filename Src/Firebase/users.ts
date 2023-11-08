import { user } from '../models/user';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../routes/auth';
import { BaseError } from '../errorHandler/baseErrors';

const bcrypt = require('bcrypt');

//should return a token aswell
export async function createUser(newUser: user): Promise<{ user: user }> {
  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', newUser.email),
  );
  const emailQuerySnapshot = await getDocs(emailQuery);
  if (!emailQuerySnapshot.empty) {
    throw new BaseError('That email is allready in the system', 400);
  }

  const hashedPassword: string = await bcrypt.hash(newUser.password, 10);
  const docRef = doc(collection(db, `users`));
  const user: user = {
    id: docRef.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    password: hashedPassword,
    orgId: newUser.orgId,
  };
  const token = jwt.sign({id: user.id}, SECRET_KEY, {
    expiresIn: '7d',
  });
  user.token = token;
  await setDoc(docRef, user);
  if (!user) {
    throw new BaseError('User not created', 400);
  }

  return { user };
}

export async function getAllUsersByOrgId(orgId: number): Promise<user[]> {
  const q = query(collection(db, 'users'), where('orgId', '==', orgId));
  const usersList = await getDocs(q);
  const users: user[] = usersList.docs.map((docSnap) => {
    const data: user = {
      firstName: docSnap.data().firstName,
      lastName: docSnap.data().lastName,
      email: docSnap.data().email,
      id: docSnap.data().id,
      orgId: [docSnap.data().orgId],
    };
    return data as user;
  });
  if (!users.length) {
    throw new BaseError('No users found', 404);
  }
  return users as user[];
}
export async function getUserById(id: string): Promise<user> {
  const docSnap = await getDoc(doc(db, 'users', id));
  const data: user = {
    firstName: docSnap.data()!.firstName,
    lastName: docSnap.data()!.lastName,
    email: docSnap.data()!.email,
    id: docSnap.data()!.id,
    orgId: [docSnap.data()!.orgId],
  };
  if (!data) {
    throw new BaseError('User not found', 404);
  }
  return data as user;
}
export async function getUserByToken(token: string): Promise<user> {
  const decodedUser = jwt.verify(token, SECRET_KEY);
  if (!decodedUser) {
    throw new BaseError('User not found', 404);
  }
  return decodedUser as user;
}

export async function userLogin(
  email: string,
  password: string,
  orgId: string,
): Promise<{ user: user }> {
  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', email),
  );
  const emailQuerySnapshot = await getDocs(emailQuery);

  if (emailQuerySnapshot.docs.find((doc) => doc.data().orgId != orgId)) {
    throw new BaseError('User does not exist in this organization', 401);
  }
  for (const doc of emailQuerySnapshot.docs) {
    if (bcrypt.compare(password, doc.data().password)) {
      const user: user = {
        firstName: doc.data()!.firstName,
        lastName: doc.data()!.lastName,
        email: doc.data()!.email,
        id: doc.data()!.id,
        orgId: [doc.data()!.orgId],
      };
      const token = jwt.sign(user.id, SECRET_KEY, {
        expiresIn: '2 days',
      });
      user.token = token;
      if (!user) {
        throw new BaseError('User not found', 404);
      }
      return { user };
    }
  }
  throw new BaseError(
    'User did not complete the login because something was spelt wrong!',
    401,
  );
}
//hashes password in routes intill i know a better way
export async function updateUser(user: user) {
  const updateUser = doc(db, 'users', `${user.id}`);
  await updateDoc(updateUser, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    orgId: user.orgId,
  });
  if (!updateUser) {
    throw new BaseError('User not found', 404);
  }
}

export async function deleteUser(user: user) {
  const delteUser = doc(db, 'users/' + `${user.id}`);
  await deleteDoc(delteUser);
  if (!delteUser) {
    throw new BaseError('User not found', 404);
  }
}
