import {expect, test} from '@jest/globals';
import {
    createEvent,
    getAllEventsByOrgId,
    getEventById,
    deleteEvent,
  } from '../firebase/events';
    import { event } from '../models/event';


const startDate: Date = new Date();
const endDate: Date = new Date("1995-12-17T03:24:00");
let testEvent: event = {
    title: "Test Event",
    description: "Test Description",
    start: startDate,
    end: endDate,
    orgId: 123456789,
};

    /******************/
    /**** Firebase ****/
    /******************/

test('Create event', async () => {
    const data = await createEvent(testEvent);

    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toStrictEqual(startDate);
    expect(data.end)            .toStrictEqual(endDate);
    expect(data.orgId)          .toBe(123456789);
  });

  test('Get event by orgId', async () => {
    const data = await getAllEventsByOrgId(testEvent.orgId);
    testEvent.id = data[0].id;

    expect(data[0].title)       .toBe("Test Event");
    expect(data[0].description) .toBe("Test Description");
    expect(data[0].start)       .toStrictEqual(startDate);
    expect(data[0].end)         .toStrictEqual(endDate);
    expect(data[0].orgId)       .toBe(123456789);
  });

  test('Get event by id', async () => {
    const data = await getEventById(testEvent.id?.toString() as string);
    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toStrictEqual(startDate);
    expect(data.end)            .toStrictEqual(endDate);
    expect(data.orgId)          .toBe(123456789);
  });

  //Not made yet
    /*
    test('Update event', async () => {
        
    });
    */

test('Delete event', async () => {
    await deleteEvent(testEvent);
    try {
        await getEventById(testEvent.id?.toString() as string);
      } catch (e) {
        expect(await getEventById(testEvent.id?.toString() as string)).toThrow(e);
      }
  });