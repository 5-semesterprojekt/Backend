import { Request, Response, NextFunction } from 'express';
import { BaseError } from './baseErrors';

// Error handling Middleware function for logging the error message
export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`Caught Error: ${error.message}`);
  return next(error);
};

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
export const errorResponder = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error) {
    response.header('Content-Type', 'application/json');
    if (error instanceof BaseError) {
      response.status(error.status).send({ message: error.message });
    } else {
      response.status(500).send({ message: 'Something went wrong' });
    }
  } else {
    next();
  }
};

// Fallback Middleware function for returning
// 404 error for undefined paths
export const invalidPathHandler = (request: Request, response: Response) => {
  response.status(404);
  response.send('Invalid path');
};
