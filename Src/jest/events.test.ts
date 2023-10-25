import {expect, test} from '@jest/globals';
import {
    createEvent,
    getAllEventsByOrgId,
    getEventById,
    deleteEvent,
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

    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toStrictEqual(startDate);
    expect(data.end)            .toStrictEqual(endDate);
    expect(data.orgId)          .toBe(123451231231231236789);
  });

  test('Get event by orgId', async () => {
    const data = await getAllEventsByOrgId(testEvent.orgId);
    const corretId = data.find (e => e.id === testEvent.id);
    expect(corretId?.title)       .toBe("Test Event");
    expect(corretId?.description) .toBe("Test Description");
    expect(corretId?.start)       .toStrictEqual(startDate);
    expect(corretId?.end)         .toStrictEqual(endDate);
    expect(corretId?.orgId)       .toBe(123451231231231236789);
  });

  test('Get event by id', async () => {
    const data =                await getEventById(testEvent.id!);
    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toStrictEqual(startDate);
    expect(data.end)            .toStrictEqual(endDate);
    expect(data.orgId)          .toBe(123451231231231236789);
  });

  //Not made yet
    /*
    test('Update event', async () => {
        
    });
    */

test('Delete event/Ask for wrong ID', async () => {
    await deleteEvent(testEvent);
    
    expect(async() => await getEventById(testEvent.id!)).rejects.toThrow("No such document!");
});