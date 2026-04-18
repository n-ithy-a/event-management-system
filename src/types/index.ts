export interface Faculty {
  id?: string;
  facultyName: string;
  facultyId: string;
  emailId: string;
  password: string;
}

export interface Student {
  id?: string;
  studentName: string;
  rollNumber: string;
  emailId: string;
  password: string;
}

export interface Event {
  id?: string;
  studentName: string;
  studentRollNumber: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventDescription: string;
  facultyId: string;
}

export type UserRole = 'faculty' | 'student' | null;

export interface AuthState {
  role: UserRole;
  facultyId?: string;
  facultyName?: string;
  rollNumber?: string;
  studentName?: string;
}