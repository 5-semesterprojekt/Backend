import { Router, Request, Response } from 'express';
import { Event } from '../models/event';
import { asyncHandler } from '../errorHandler/asyncHandler';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  createEvent,
  getAllEventsByOrgId,
  getEventById,
  deleteEvent,
  updateEvent,
  userCheckOrgId,
} from '../firebase/events';
import { auth, CustomRequest } from '../middleware/auth';
import { BaseError } from '../errorHandler/baseErrors';

const router = Router();

// create new
router.post(
  '/:orgId/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
      description: Joi.string(),
    }),
  }),
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    await userCheckOrgId(req.token as string, parseInt(req.params.orgId));
    const event: Event = {
      title: req.body.title,
      description: req.body.description,
      start: req.body.start.toISOString(),
      end: req.body.end.toISOString(),
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
    const event: Event = await getEventById(req.params.id);
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
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      start: Joi.date(),
      end: Joi.date(),
      description: Joi.string(),
    }),
  }),
  auth,
  asyncHandler(async (req: CustomRequest, res: Response) => {
    await userCheckOrgId(req.token as string, parseInt(req.params.orgId));
    const event: Event = await getEventById(req.params.id);

    if (!event) {
      throw new BaseError('Event not found', 404);
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
