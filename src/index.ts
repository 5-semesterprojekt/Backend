import express, { Request, Response } from 'express';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import cors from 'cors';
import { errorLogger, errorResponder, invalidPathHandler } from './errorHandler/handlerForExpress';
import { errors } from 'celebrate';
import helmet from 'helmet';

export const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.use(helmet());
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send(
    'Hello, this is the backend.',
  );
});
// Catch celebrate validation errors
app.use(errors());

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use(errorLogger);

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use(errorResponder);

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use(invalidPathHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
