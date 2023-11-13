import { User } from '../models/user';

export function isValidUser(user: User): boolean {
  if (user.password) {
    return (
      isValidEmail(user.email) &&
      isValidName(user.firstName) &&
      isValidName(user.lastName) &&
      isValidPassword(user.password)
    );
  }
  return (
    isValidEmail(user.email) &&
    isValidName(user.firstName) &&
    isValidName(user.lastName)
  );
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
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  console.log(passwordRegex.test(password));
  return passwordRegex.test(password);
}
