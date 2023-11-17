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
import request from 'supertest';

const startDate: Date = new Date('2018-12-17T23:24:00');
const endDate: Date = new Date('2019-12-17T03:24:00');
const testEvent: Event = {
  title: 'Test Event',
  description: 'Test Description',
  start: startDate.toISOString(),
  end: endDate.toISOString(),
  orgId: 15551,
};
const testEvent2: Event = {
  title: 'Test Event 2',
  description: 'Test Description 2',
  start: startDate.toISOString(),
  end: endDate.toISOString(),
  orgId: 15551,
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
    await deleteEvent(testEvent2);
    await expect(getEventById(testEvent.id!)).rejects.toThrow(BaseError);
  });
});

/******************/
/**** Express  ****/
/******************/

describe('EXPRESS Event routes', () => {
  const orgId = Math.floor(Math.random() * 10000) + 1;
  let expressId: string;
  const expressEvent: { [key: string]: any } = {
    title: 'Test Event 3',
    description: 'Test Description 3',
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
  test('create', async () => {
    const res = await request(app)
      .post('/events/' + orgId)
      .send(expressEvent);
    expressId = res.body.id;
    expect(res.statusCode).toBe(201);
    expect(res.body!.id).toBeDefined();
    expect(res.body!.title).toBe(expressEvent.title);
    expect(res.body?.description).toBe(expressEvent.description);
    expect(res.body!.start).toStrictEqual(expressEvent.start);
    expect(res.body!.end).toStrictEqual(expressEvent.end);
    expect(res.body!.orgId).toBe(orgId);
  });

  test('Get one event', async () => {
    const res = await request(app).get('/events/' + orgId + '/' + expressId);
    expect(res.body!.title).toBe(expressEvent.title);
    expect(res.body?.description).toBe(expressEvent.description);
    expect(res.body!.start).toStrictEqual(expressEvent.start);
    expect(res.body!.end).toStrictEqual(expressEvent.end);
    expect(res.body!.orgId).toBe(orgId);
  });

  test('Get events by orgId', async () => {
    const res = await request(app).get('/events/' + orgId);
    const corretId = res.body.find((ev: Event) => ev.id === expressId);
    expect(corretId!.title).toBe(expressEvent.title);
    expect(corretId?.description).toBe(expressEvent.description);
    expect(corretId!.start).toStrictEqual(expressEvent.start);
    expect(corretId!.end).toStrictEqual(expressEvent.end);
    expect(corretId!.orgId).toBe(orgId);
    expect(res.body.length).toBe(1);
  });

  test('Update event', async () => {
    expressEvent.title = 'Updated Test Event API';
    const res = await request(app)
      .put('/events/' + orgId + '/' + expressId)
      .send(expressEvent);
    expect(res.statusCode).toBe(200);
    expect(res.body!.title).toBe(expressEvent.title);
    expect(res.body?.description).toBe(expressEvent.description);
    expect(res.body!.start).toStrictEqual(expressEvent.start);
    expect(res.body!.end).toStrictEqual(expressEvent.end);
    expect(res.body!.orgId).toBe(orgId);
  });

  test('Delete event', async () => {
    const res = await request(app).delete('/events/' + orgId + '/' + expressId);
    expect(res.statusCode).toBe(204);
  });
});
