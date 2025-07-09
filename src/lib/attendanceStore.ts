// This is a client-side store that uses localStorage to simulate a database.
import { mockStudentData, type Student } from './data';

const ATTENDANCE_KEY = 'attendanceData';
const SESSION_KEY = 'attendanceSession';

interface AttendanceSession {
  startTime: string;
  isOpen: boolean;
}

export function initializeData() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    if (!data) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(mockStudentData));
    }
  }
}

export function getStudents(branch?: string): Student[] {
  if (typeof window === 'undefined') {
    const students = mockStudentData;
    if (branch) {
      return students.filter(s => s.branch === branch);
    }
    return students;
  }
  const data = localStorage.getItem(ATTENDANCE_KEY);
  const students: Student[] = data ? JSON.parse(data) : mockStudentData;

  if (branch) {
    return students.filter(s => s.branch === branch);
  }
  return students;
}

export function findStudent(rollNumber: string): Student | undefined {
    const students = getStudents();
    return students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
}

export function markPresent(rollNumber: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const students = getStudents();
  const studentIndex = students.findIndex(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
  
  if (studentIndex > -1) {
    students[studentIndex].status = 'Present';
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event('storageUpdate')); // Notify other components
    return true;
  }
  return false;
}

// === Attendance Session Management ===

export function startAttendanceSession() {
  if (typeof window !== 'undefined') {
    const session: AttendanceSession = {
      startTime: new Date().toISOString(),
      isOpen: true,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('storageUpdate'));
  }
}

export function getAttendanceSession(): AttendanceSession | null {
   if (typeof window === 'undefined') return null;
   const data = localStorage.getItem(SESSION_KEY);
   return data ? JSON.parse(data) : null;
}

export function isAttendanceWindowOpen(): boolean {
    const session = getAttendanceSession();
    if (!session || !session.isOpen) return false;

    const now = new Date();
    const startTime = new Date(session.startTime);
    const diffInMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);

    return diffInMinutes <= 30;
}
