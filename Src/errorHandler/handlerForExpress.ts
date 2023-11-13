import { Request, Response, NextFunction } from 'express';
import { BaseError } from './baseErrors';

// Error handling Middleware function for logging the error message
export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`error ${error.message}`);
  next(error); // calling next middleware
};

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
export const errorResponder = (
  error: Error,
  request: Request,
  response: Response,
) => {
  response.header('Content-Type', 'application/json');
  if (error instanceof BaseError) {
    response.status(error.status).send(error.message);
  } else {
    response.status(500).send('Something went wrong');
  }
};

// Fallback Middleware function for returning
// 404 error for undefined paths
export const invalidPathHandler = (
  request: Request,
  response: Response,
) => {
  response.status(404);
  response.send('invalid path');
};
