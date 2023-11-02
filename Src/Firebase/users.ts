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

const bcrypt = require('bcrypt');

//should return a token aswell
export async function createUser(newUser: user): Promise<{user:user, token: string}> {
  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', newUser.email),
  );
  const emailQuerySnapshot = await getDocs(emailQuery);
  if (!emailQuerySnapshot.empty) {
    throw new Error('Email is already in use'); // Change to a better error handling
  }
  try {
    const hashedPassword: string = await bcrypt.hash(newUser.password, 10);
    const docRef = doc(collection(db, `users`));
    const user : user = {
      id: docRef.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: hashedPassword,
      orgId: newUser.orgId,
    };
    await setDoc(docRef, user);
    const token = jwt.sign({ user }, "123", {
      expiresIn: '2 days',
    });
    return {user, token};
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
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
  return data as user;
}
//needs token
export async function userLogin(
  email: string,
  password: string,
  orgId: string,
): Promise<{user:user, token: string} | string> {
  const emailQuery = query(
    collection(db, 'users'),
    where('email', '==', email),
  );
  const emailQuerySnapshot = await getDocs(emailQuery);
  const hashedPassword = await bcrypt.hash(password, 10);
  if (emailQuerySnapshot.docs.find((doc) => doc.data().orgId != orgId)) {
    return "User doesn't belong to this organization";
  }
  for (const doc of emailQuerySnapshot.docs) {
    if (doc.data().password === hashedPassword) {
      const user: user = {
        firstName: doc.data()!.firstName,
        lastName: doc.data()!.lastName,
        email: doc.data()!.email,
        id: doc.data()!.id,
        orgId: [doc.data()!.orgId],
      };
      const token = jwt.sign({ user }, "123", {
        expiresIn: '2 days',
      });
      return {user, token};
    }
  }
  return "User doesn't exist";
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
}

export async function deleteUser(user: user) {
  const delteUser = doc(db, 'users/' + `${user.id}`);
  try {
    await deleteDoc(delteUser);
  } catch (e) {
    throw e;
  }
}
