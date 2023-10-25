import {describe, expect, test} from '@jest/globals';
import {
    createEvent,
    getAllEventsByOrgId,
    getEventById,
    deleteEvent,
  } from '../firebase/events';
    import { event } from '../models/event';
    const startDate: Date = new Date();
    const endDate: Date = new Date("1995-12-17T03:24:00");
    let event: event = {
        title: "Test Event",
        description: "Test Description",
        start: startDate,
        end: endDate,
        orgId: 123456789,
      };

/******************/
/**** Firebase ****/
/******************/
//Works
test('Create event', async () => {
    const data = await createEvent(event);

    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toBe(startDate);
    expect(data.end)            .toBe(endDate);
    expect(data.orgId)          .toBe(123456789);
  });

  test('Get event by orgId', async () => {
    const data = await getAllEventsByOrgId(event.orgId);
    event.id = data[0].id;
    expect(data[0].title)       .toBe("Test Event");
    expect(data[0].description) .toBe("Test Description");
    expect(data[0].start)       .toBe(startDate);
    expect(data[0].end)         .toBe(endDate);
    expect(data[0].orgId)       .toBe(123456789);
  });

  test('Get event by id', async () => {
    const data = await getEventById(event.id?.toString() as string);
    expect(data.title)          .toBe("Test Event");
    expect(data.description)    .toBe("Test Description");
    expect(data.start)          .toBe(startDate);
    expect(data.end)            .toBe(endDate);
    expect(data.orgId)          .toBe(123456789);
  });
  //Not made yet
    /*
    test('Update event', async () => {
        
    });
    */
test('Delete event', async () => {
    await deleteEvent(event);
    const deletedData = await getEventById(event.id?.toString() as string);
    expect(deletedData).toBe(undefined);
  });

  //can not make it fail
  /*
  test('the fetch fails with an error', async () => {
    await expect(createEvent).rejects.toMatch('error');
  });
  */