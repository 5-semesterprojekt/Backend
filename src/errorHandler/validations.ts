import { User } from '../models/user';
import { body } from 'express-validator';

export function isValidUser(user: User): boolean {
  if (user.password) {
    return (
      isValidEmail(user.email) &&
      isValidName(user.firstName) &&
      isValidName(user.lastName) &&
      isValidPassword(user.password)
    );
  }
  return isValidEmail(user.email) && isValidName(user.firstName) && isValidName(user.lastName);
}

// Function to check if a given string is a valid email address
export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

// Function to check if a given string is a valid name (only letters and spaces)
export function isValidName(name: string): boolean {
  const nameRegex = /[^a-zæøåA-ZÆØÅ\-\s]+/;
  return !nameRegex.test(name);
}

// Function to check if a given string is a valid password (at least 8 characters and one uppercase letter and have a number and a special character)
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zæøå)(?=.*[A-ZÆØÅ]).{8,}$/;
  return passwordRegex.test(password);
}

export const userValidationRules = [
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('firstName is required'),
  body('email').notEmpty().withMessage('email is required'),
  body('password').notEmpty().withMessage('password is required'),
];
export const userLoginValidationRules = [
  body('email').notEmpty().withMessage('email is required'),
  body('password').notEmpty().withMessage('password is required'),
];

export const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('start').isISO8601().toDate().withMessage('Must have a time and date'),
  body('end').isISO8601().toDate().withMessage('Must have a time and date'),
];

export const commonPasswords100 = [
  '123456',
  'password',
  '12345678',
  'qwerty',
  '123456789',
  '12345',
  '1234',
  '111111',
  '1234567',
  'dragon',
  '123123',
  'baseball',
  'abc123',
  'football',
  'monkey',
  'letmein',
  '696969',
  'shadow',
  'master',
  '666666',
  'qwertyuiop',
  '123321',
  'mustang',
  '1234567890',
  'michael',
  '654321',
  'pussy',
  'superman',
  '1qaz2wsx',
  '7777777',
  'fuckyou',
  '121212',
  '000000',
  'qazwsx',
  '123qwe',
  'killer',
  'trustno1',
  'jordan',
  'jennifer',
  'zxcvbnm',
  'asdfgh',
  'hunter',
  'buster',
  'soccer',
  'harley',
  'batman',
  'andrew',
  'tigger',
  'sunshine',
  'iloveyou',
  'fuckme',
  '2000',
  'charlie',
  'robert',
  'thomas',
  'hockey',
  'ranger',
  'daniel',
  'starwars',
  'klaster',
  '112233',
  'george',
  'asshole',
  'computer',
  'michelle',
  'jessica',
  'pepper',
  '1111',
  'zxcvbn',
  '555555',
  '11111111',
  '131313',
  'freedom',
  '777777',
  'pass',
  'fuck',
  'maggie',
  '159753',
  'aaaaaa',
  'ginger',
  'princess',
  'joshua',
  'cheese',
  'amanda',
  'summer',
  'love',
  'ashley',
  '6969',
  'nicole',
  'chelsea',
  'biteme',
  'matthew',
  'access',
  'yankees',
  '987654321',
  'dallas',
  'austin',
  'thunder',
  'taylor',
  'matrix',
  'minecraft',
];
