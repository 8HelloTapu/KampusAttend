// This is a client-side store that uses localStorage to simulate a database.
import { mockStudentData, type Student } from './data';

const ATTENDANCE_KEY = 'attendanceData';

export function initializeData() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    if (!data) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(mockStudentData));
    }
  }
}

export function getStudents(): Student[] {
  if (typeof window === 'undefined') {
    return mockStudentData;
  }
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : mockStudentData;
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
