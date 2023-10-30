import {expect, test} from '@jest/globals';
import {
    createEvent,
    getAllEventsByOrgId,
    getEventById,
    deleteEvent,
    updateEvent
  } from '../firebase/events';
    import { event } from '../models/event';


const startDate: Date = new Date("2018-12-17T23:24:00");
const endDate: Date = new Date("2019-12-17T03:24:00");
let testEvent: event = {
    title: "Test Event",
    description: "Test Description",
    start: startDate,
    end: endDate,
    orgId: 123451231231231236789,
};

    /******************/
    /**** Firebase ****/
    /******************/

test('Create event', async () => {
    const data = await createEvent(testEvent);
    testEvent.id = data.id;

    expect(data.title)          .toBe(testEvent.title);
    expect(data.description)    .toBe(testEvent.description);
    expect(data.start)          .toStrictEqual(testEvent.start);
    expect(data.end)            .toStrictEqual(testEvent.end);
    expect(data.orgId)          .toBe(testEvent.orgId);
  });

  test('Get event by orgId', async () => {
    const data = await getAllEventsByOrgId(testEvent.orgId!);
    const corretId = data.find (e => e.id === testEvent.id);
    expect(corretId?.title)       .toBe(testEvent.title);
    expect(corretId?.description) .toBe(testEvent.description);
    expect(corretId?.start)       .toStrictEqual(testEvent.start);
    expect(corretId?.end)         .toStrictEqual(testEvent.end);
    expect(corretId?.orgId)       .toBe(testEvent.orgId);
  });

  test('Get event by id', async () => {
    const data =                await getEventById(testEvent.id!);
    expect(data!.title)          .toBe(testEvent.title);
    expect(data?.description)    .toBe(testEvent.description);
    expect(data!.start)          .toStrictEqual(testEvent.start);
    expect(data!.end)            .toStrictEqual(testEvent.end);
    expect(data!.orgId)          .toBe(testEvent.orgId);
  });

  
  test('Update event', async () => {
    testEvent.title =           "Updated Test Event";
    testEvent.description =     ""; //test empty string
    await updateEvent(testEvent);
    const data = await getEventById(testEvent.id!); 
    expect(data!.title)          .toBe(testEvent.title);
    expect(data?.description)    .toBe(testEvent.description);
    expect(data!.start)          .toStrictEqual(testEvent.start);
    expect(data!.end)            .toStrictEqual(testEvent.end);
    expect(data!.orgId)          .toBe(testEvent.orgId);
  });
    

test('Delete event/Ask for wrong ID', async () => {
    await deleteEvent(testEvent);
    
    expect(async() => await getEventById(testEvent.id!)).rejects.toThrow(undefined);
});