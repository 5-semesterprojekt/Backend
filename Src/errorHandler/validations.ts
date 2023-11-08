import { user } from "../models/user";

export function isValidUser(user: user): boolean {
    if (user.password) {
        isValidEmail(user.email) &&
        isValidName(user.firstName) &&
        isValidName(user.lastName) &&
        isValidPassword(user.password)
    }
    return (
        isValidEmail(user.email) &&
        isValidName(user.firstName) &&
        isValidName(user.lastName)
    );
    }


// Function to check if a given string is a valid email address
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if a given string is a valid name (only letters and spaces)
function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

// Function to check if a given string is a valid password (at least 8 characters and one uppercase letter)
function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}
