import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { event } from '../models/event';
import {
  createEvent,
  getAllEventsByOrgId,
  getEventById,
  deleteEvent,
} from '../Firebase/events';

const router = Router();

const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('start').isISO8601().toDate().withMessage('Must have a time and date'),
  body('end').isISO8601().toDate().withMessage('Must have a time and date'),
];

// create new
router.post(
  '/:orgId/',
  eventValidationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //id might be a problem
    const event: event = {
      title: req.body.title,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      orgId: parseInt(req.params.orgId),
    };

    const result = await createEvent(event);
    res.status(201).json({ ...event, id: result.id });
  }
);

// get all
router.get('/:orgId/', async (req: Request, res: Response) => {
  const events = await getAllEventsByOrgId(parseInt(req.params.orgId));
  res.json(events);
});

//get by id
router.get('/:orgId/:id', async (req: Request, res: Response) => {
  const event: event = await getEventById(req.params.id);
  if (!event || event.orgId !== parseInt(req.params.orgId)) {
    res.status(404).send('Event not found');
  } else {
    res.json(event);
  }
});

//update
router.put(
  '/:orgId/:id',
  eventValidationRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event: event = await getEventById(req.params.id);

    if (!event) {
      res.status(404).send('Event not found');
    } else {
      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.start = req.body.start || event.start;
      event.end = req.body.end || event.end;
      //updatefunction here
      res.json(event);
    }
  }
);

// delete by id
router.delete(
  '/:orgId/:id',
  eventValidationRules,
  async (req: Request, res: Response) => {
    const event: event = await getEventById(req.params.id);

    if (!event) {
      res.status(404).send('Event not found');
    } else {
      deleteEvent(event);
      res.status(204).send();
    }
  }
);

export default router;
