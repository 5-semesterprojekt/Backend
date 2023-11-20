import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Event } from '../models/event';
import { asyncHandler } from '../errorHandler/asyncHandler';
import {
  createEvent,
  getAllEventsByOrgId,
  getEventById,
  deleteEvent,
  updateEvent,
  userCheckOrgId,
} from '../firebase/events';
import { eventValidationRules } from '../errorHandler/validations';
import { auth, CustomRequest } from '../middleware/auth';

const router = Router();

// create new
router.post(
  '/:orgId/',
  eventValidationRules,
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    await userCheckOrgId(req.token as string, parseInt(req.params.orgId));

    //id might be a problem
    const event: Event = {
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
  asyncHandler(async (req: Request, res: Response) => {
    const events = await getAllEventsByOrgId(parseInt(req.params.orgId));
    res.json(events);
  }),
);

//get by id
router.get(
  '/:orgId/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const event: Event | undefined = await getEventById(req.params.id);
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
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await userCheckOrgId(req.token as string, parseInt(req.params.orgId));

    const event: Event = await getEventById(req.params.id);

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
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    const event: Event = await getEventById(req.params.id);
    await userCheckOrgId(req.token as string, parseInt(req.params.orgId));
    if (!event) {
      res.status(404).send('Event not found');
    } else {
      await deleteEvent(event);
      res.status(204).send();
    }
  }),
);

export default router;
