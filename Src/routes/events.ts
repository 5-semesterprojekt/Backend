import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { event } from '../models/event';
import { asyncHandler } from './errorhandling';
import {
  createEvent,
  getAllEventsByOrgId,
  getEventById,
  deleteEvent,
  updateEvent,
} from '../firebase/events';

const router = Router();

const eventValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('start').isISO8601().toDate().withMessage('Must have a time and date'),
  body('end').isISO8601().toDate().withMessage('Must have a time and date'),
];

// create new
router.post(
  '/:orgId/',
  eventValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
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
  }),
);

// get all
router.get(
  '/:orgId/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const events = await getAllEventsByOrgId(parseInt(req.params.orgId));
    res.json(events);
  }),
);

//get by id
router.get(
  '/:orgId/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const event: event | undefined = await getEventById(req.params.id);
    if (!event || event.orgId !== parseInt(req.params.orgId)) {
      res.status(404).send('Event not found');
    } else {
      res.json(event);
    }
  }),
);

//update
router.put(
  '/:orgId/:id',
  eventValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event: event | undefined = await getEventById(req.params.id);

    if (!event) {
      res.status(404).send('Event not found');
    } else {
      event.title = req.body.title || event.title;
      event.description = req.body.description; // || event.description  Deleted because it did not like an empty string
      event.start = req.body.start || event.start;
      event.end = req.body.end || event.end;

      await updateEvent(event);
      res.json(event);
    }
  }),
);

// delete by id
router.delete(
  '/:orgId/:id',
  eventValidationRules,
  asyncHandler(async (req: Request, res: Response) => {
    const event: event | undefined = await getEventById(req.params.id);

    if (!event) {
      res.status(404).send('Event not found');
    } else {
      await deleteEvent(event);
      res.status(204).send();
    }
  }),
);

export default router;
