import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { event } from '../models/event';

const router = Router();
let events: event[] = [];

const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('start').isDate().withMessage('Must have a time and date'),
  body('end').isDate().withMessage('Must have a time and date'),
];

// create new
router.post('/', eventValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const event: event = {
    id: events.length + 1,
    title: req.body.title,
    description: req.body.description,
    start: req.body.start,
    end: req.body.end,
  };

  events.push(event);
  res.status(201).json(event);
});

// get all
router.get('/', (req: Request, res: Response) => {
  res.json(events);
});

//get by id
router.get('/:id', (req: Request, res: Response) => {
  const event = events.find((e) => e.id === parseInt(req.params.id));

  if (!event) {
    res.status(404).send('Event not found');
  } else {
    res.json(event);
  }
});

//update
router.put('/:id', eventValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const event = events.find((e) => e.id === parseInt(req.params.id));

  if (!event) {
    res.status(404).send('Event not found');
  } else {
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.start = req.body.start || event.start;
    event.end = req.body.end || event.end;

    res.json(event);
  }
});

// delete by id
router.delete('/:id', eventValidationRules, (req: Request, res: Response) => {
  const index = events.findIndex((e) => e.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send('Event not found');
  } else {
    events.splice(index, 1);
    res.status(204).send();
  }
});

export default router;
