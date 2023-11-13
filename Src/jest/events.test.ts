import { expect, test } from '@jest/globals';
import {
  createEvent,
  getAllEventsByOrgId,
  getEventById,
  deleteEvent,
  updateEvent,
} from '../firebase/events';
import { Event } from '../models/event';
import { app } from '../index';
import { BaseError } from '../errorHandler/baseErrors';

const request = require('supertest');

const orgId: number = Math.floor(Math.random() * 10000) + 1;
const startDate: Date = new Date('2018-12-17T23:24:00');
const endDate: Date = new Date('2019-12-17T03:24:00');
let testEvent: Event = {
  title: 'Test Event',
  description: 'Test Description',
  start: startDate,
  end: endDate,
  orgId: orgId,
};
let testEvent2: Event = {
  title: 'Test Event 2',
  description: 'Test Description 2',
  start: startDate,
  end: endDate,
  orgId: orgId,
};

/******************/
/**** Firebase ****/
/******************/
describe('FIREBASE Event tests', () => {
  test('Create event', async () => {
    const data: Event = await createEvent(testEvent);
    const data1: Event = await createEvent(testEvent2);
    testEvent.id = data.id;
    testEvent2.id = data1.id;

    expect(data.title).toBe(testEvent.title);
    expect(data.description).toBe(testEvent.description);
    expect(data.start).toStrictEqual(testEvent.start);
    expect(data.end).toStrictEqual(testEvent.end);
    expect(data.orgId).toBe(testEvent.orgId);
  });

  test('Get event by orgId', async () => {
    const data = await getAllEventsByOrgId(testEvent.orgId!);
    const corretId = data.find((e) => e.id === testEvent.id);
    expect(corretId?.title).toBe(testEvent.title);
    expect(corretId?.description).toBe(testEvent.description);
    expect(corretId?.start).toStrictEqual(testEvent.start);
    expect(corretId?.end).toStrictEqual(testEvent.end);
    expect(corretId?.orgId).toBe(testEvent.orgId);
    expect(data.length).toBe(2);
  });

  test('Get event by id', async () => {
    const data = await getEventById(testEvent.id!);
    expect(data!.title).toBe(testEvent.title);
    expect(data?.description).toBe(testEvent.description);
    expect(data!.start).toStrictEqual(testEvent.start);
    expect(data!.end).toStrictEqual(testEvent.end);
    expect(data!.orgId).toBe(testEvent.orgId);
  });

  test('Update event', async () => {
    testEvent.title = 'Updated Test Event';
    testEvent.description = ''; //test empty string
    await updateEvent(testEvent);
    const data = await getEventById(testEvent.id!);
    expect(data!.title).toBe(testEvent.title);
    expect(data?.description).toBe(testEvent.description);
    expect(data!.start).toStrictEqual(testEvent.start);
    expect(data!.end).toStrictEqual(testEvent.end);
    expect(data!.orgId).toBe(testEvent.orgId);
  });

  test('Delete event/Ask for wrong ID', async () => {
    await deleteEvent(testEvent);
    await expect(getEventById(testEvent.id!)).rejects.toThrow(BaseError);
  });
});

/******************/
/**** Express  ****/
/******************/

describe('EXPRESS Event routes', () => {
  test('create', async () => {
    const res = await request(app)
      .post('/events/' + testEvent.orgId)
      .send(testEvent);
    testEvent.id = res.body.id;
    expect(res.body!.id).toBe(testEvent.id);
    expect(res.body!.title).toBe(testEvent.title);
    expect(res.body?.description).toBe(testEvent.description);
    expect(res.body!.start).toStrictEqual(testEvent.start.toISOString());
    expect(res.body!.end).toStrictEqual(testEvent.end.toISOString());
    expect(res.body!.orgId).toBe(testEvent.orgId);
  });

  test('Get one event', async () => {
    const res = await request(app).get(
      '/events/' + testEvent2.orgId + '/' + testEvent2.id,
    );
    expect(res.body!.title).toBe(testEvent2.title);
    expect(res.body?.description).toBe(testEvent2.description);
    expect(res.body!.start).toStrictEqual(testEvent2.start.toISOString());
    expect(res.body!.end).toStrictEqual(testEvent2.end.toISOString());
    expect(res.body!.orgId).toBe(testEvent2.orgId);
  });

  test('Get events by orgId', async () => {
    const res = await request(app).get('/events/' + testEvent2.orgId);
    const corretId = res.body.find((ev: Event) => ev.id === testEvent2.id);
    expect(corretId!.title).toBe(testEvent2.title);
    expect(corretId?.description).toBe(testEvent2.description);
    expect(corretId!.start).toStrictEqual(testEvent2.start.toISOString());
    expect(corretId!.end).toStrictEqual(testEvent2.end.toISOString());
    expect(corretId!.orgId).toBe(testEvent2.orgId);
    expect(res.body.length).toBe(2);
  });

  test('Update event', async () => {
    testEvent2.title = 'Updated Test Event API';
    const res = await request(app)
      .put('/events/' + testEvent2.orgId + '/' + testEvent2.id)
      .send(testEvent2);
    expect(res.body!.title).toBe(testEvent2.title);
    expect(res.body?.description).toBe(testEvent2.description);
    expect(res.body!.start).toStrictEqual(testEvent2.start.toISOString());
    expect(res.body!.end).toStrictEqual(testEvent2.end.toISOString());
    expect(res.body!.orgId).toBe(testEvent2.orgId);
  });

  test('Delete event', async () => {
    const res = await request(app).delete(
      '/events/' + testEvent2.orgId + '/' + testEvent2.id,
    );
    await request(app).delete(
      '/events/' + testEvent.orgId + '/' + testEvent.id,
    );
    expect(res.statusCode).toBe(204);
  });
});
