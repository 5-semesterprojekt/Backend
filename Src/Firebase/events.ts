import { event } from '../models/event';
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
import { db } from './firebaseConfig';
import { BaseError } from '../errorHandler/baseErrors';
//firebase events.ts

export async function createEvent(event: event): Promise<event> {
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
  return data as event;
 
}

export async function getAllEventsByOrgId(orgId: number): Promise<event[]> {
  const q = query(collection(db, 'events'), where('orgId', '==', orgId));
  const eventsList = await getDocs(q);
  let events: event[] = [];
  eventsList.forEach((docSnap) => {
    const startDate: Date = docSnap.data().start.toDate();
    const endDate: Date = docSnap.data().end.toDate();
    const data: event = {
      description: docSnap.data()?.description,
      start: startDate,
      end: endDate,
      id: docSnap.data()?.id,
      orgId: docSnap.data()?.orgId,
      title: docSnap.data()?.title,
    };
    events.push(data);
  });
  return events as event[];
}

export async function getEventById(id: string): Promise<event> {
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const startDate: Date = docSnap.data().start.toDate();
    const endDate: Date = docSnap.data().end.toDate();
    const data: event = {
      description: docSnap.data()?.description,
      start: startDate,
      end: endDate,
      id: docSnap.data()?.id,
      orgId: docSnap.data()?.orgId,
      title: docSnap.data()?.title,
    };
    return data as event;
  } else {
    throw new BaseError('Event not found', 'EventNotFoundError', 404);
  }
}

export async function updateEvent(event: event) {
  const updateEvent = doc(db, 'events', `${event.id}`);
  await updateDoc(updateEvent, {
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    orgId: event.orgId,
  });
}

export async function deleteEvent(event: event) {
  const deleteEvent = doc(db, 'events/' + `${event.id}`);
  await deleteDoc(deleteEvent);
}
