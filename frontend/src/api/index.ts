import { type Faculty, type Student, type Event } from '../types';

const FACULTY_API = 'http://localhost:8081/faculty';
const STUDENT_API = 'http://localhost:8080/students';

const toJson = (res: Response) => {
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
};

export const facultyRegister = (data: Faculty) =>
  fetch(`${FACULTY_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(toJson);

export const facultyLogin = (emailId: string, password: string) =>
  fetch(`${FACULTY_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailId, password }),
  }).then(toJson);

export const studentRegister = (data: Student) =>
  fetch(`${STUDENT_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(toJson);

export const studentLogin = (emailId: string, password: string) =>
  fetch(`${STUDENT_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailId, password }),
  }).then(toJson);

export const studentGetEvents = (rollNumber: string) =>
  fetch(`${STUDENT_API}/events/${rollNumber}`).then(toJson);

export const addEvent = (data: Event) =>
  fetch(`${FACULTY_API}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(toJson);

export const getEventsByMonth = (month: number, year: number) =>
  fetch(`${FACULTY_API}/events/month?month=${month}&year=${year}`).then(toJson);

export const updateEvent = (eventId: string, facultyId: string, data: Partial<Event>) =>
  fetch(`${FACULTY_API}/events/${eventId}?facultyId=${facultyId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(toJson);

export const deleteEvent = (eventId: string, facultyId: string) =>
  fetch(`${FACULTY_API}/events/${eventId}?facultyId=${facultyId}`, {
    method: 'DELETE',
  }).then(toJson);