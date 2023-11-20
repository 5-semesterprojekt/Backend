import { Event } from '../models/event';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
// @ts-ignore
import { db } from '../secrets/firebaseConfig';
import { BaseError } from '../errorHandler/baseErrors';
import { getUserByToken } from './users';
import { User } from '../models/user';
//firebase events.ts

export async function createEvent(event: Event): Promise<Event> {
  const docRef = doc(collection(db, `events`));
  const data = {
    id: docRef.id,
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    orgId: event.orgId,
  };
  await setDoc(docRef, data);
  if (!data) {
    throw new BaseError('Event not created', 400);
  }
  return data as Event;
}

export async function getAllEventsByOrgId(orgId: number): Promise<Event[]> {
  const q = query(collection(db, 'events'), where('orgId', '==', orgId));
  const eventsList = await getDocs(q);
  const events: Event[] = [];
  eventsList.forEach((docSnap) => {
    const startDate: Date = docSnap.data().start.toDate();
    const endDate: Date = docSnap.data().end.toDate();
    const data: Event = {
      description: docSnap.data()?.description,
      start: startDate,
      end: endDate,
      id: docSnap.data()?.id,
      orgId: docSnap.data()?.orgId,
      title: docSnap.data()?.title,
    };
    events.push(data);
  });
  if (!events.length) {
    throw new BaseError('No events found', 404);
  }
  return events as Event[];
}

export async function getEventById(id: string): Promise<Event> {
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const startDate: Date = docSnap.data().start.toDate();
    const endDate: Date = docSnap.data().end.toDate();
    const data: Event = {
      description: docSnap.data()?.description,
      start: startDate,
      end: endDate,
      id: docSnap.data()?.id,
      orgId: docSnap.data()?.orgId,
      title: docSnap.data()?.title,
    };
    return data as Event;
  } else {
    throw new BaseError('Event not found', 404);
  }
}

export async function updateEvent(event: Event) {
  const updateEvent = doc(db, 'events', `${event.id}`);
  await updateDoc(updateEvent, {
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    orgId: event.orgId,
  });
  if (!updateEvent) {
    throw new BaseError('Event not found', 404);
  }
}

export async function deleteEvent(event: Event) {
  const deleteEvent = doc(db, 'events/' + `${event.id}`);
  await deleteDoc(deleteEvent);
  if (!deleteEvent) {
    throw new BaseError('Event not found', 404);
  }
}

export async function userCheckOrgId(userToken: string, orgId: number) {
  const user: User = await getUserByToken(userToken);
  if (!user.orgId.includes(orgId)) {
    throw new BaseError('User is not apart of this org', 401);
  }
}