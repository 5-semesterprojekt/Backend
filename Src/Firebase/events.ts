import { event } from '../models/event';
import { collection, getDocs, updateDoc, doc, query, where, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from './firebaseConfig';
import e from 'express';
//firebase events.ts

export async function createEvent(event: event) {
    try {
        //missing org id
        //docRef makes its own id for events
        const docRef = doc(collection(db, `events`));
        const data =  {
            id: docRef.id,
            title: event.title,
            description: event.description,
            start: event.start,
            end: event.end,
            orgId: event.orgId,
        };
        await setDoc(docRef, data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    }catch (e) {
        console.error("Error adding document: ", e);
        throw e;
      }
} 

export async function getAllEventsByOrgId(orgId: number): Promise<event[]> {
    const q = query(collection(db, "events"), where("orgId", "==", orgId));
    const eventsList = await getDocs(q);
    let events: event[] = [];
    eventsList.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        events.push(doc.data() as event);
});
    return events as event[];
}

//ToDo fix this!!! does not get it by id
export async function getEventById(id: string): Promise<event> {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data() as event;
      }else{
        throw new Error("No such document!");
      }
    
}

export async function updateEvent(id:string) {
    const event: event = await getEventById(id) as event;
    const updateEvent = doc(db, "events", `${event.id}`);
    await updateDoc(updateEvent, {
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        orgId: event.orgId,
    });
}

export async function deleteEvent(event: event) {
    const deleteEvent = doc(db, "events/"+ `${event.id}`);
    await deleteDoc(deleteEvent);
    
}