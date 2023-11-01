import express, { Request, Response, NextFunction } from 'express';
import eventRoutes from './routes/events';
import cors from 'cors';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/events', eventRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

// Add this error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist.");
  console.log('Route 404: ', req.url);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
