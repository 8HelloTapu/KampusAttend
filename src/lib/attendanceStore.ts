
// This is a client-side store that uses localStorage to simulate a database.
import { mockStudentData, type Student, COLLEGE_LOCATION } from './data';

const ATTENDANCE_KEY = 'attendanceData';
const SESSION_KEY = 'attendanceSession';
const ACCEPTABLE_PROXIMITY_METERS = 1000;

interface AttendanceSession {
  startTime: string;
  isOpen: boolean;
}

// Haversine formula to calculate distance between two lat/lon points in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}


export function initializeData() {
  if (typeof window === 'undefined') return;
  // Only initialize if data doesn't exist, to preserve state across page loads.
  if (!localStorage.getItem(ATTENDANCE_KEY)) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(mockStudentData));
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

export function markPresent(rollNumber: string, location?: {latitude: number, longitude: number}): { locationWarning: boolean } {
  if (typeof window === 'undefined') return { locationWarning: false };
  
  const students = getStudents();
  const studentIndex = students.findIndex(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
  
  let locationWarning = false;

  if (studentIndex > -1) {
    students[studentIndex].status = 'Present';
    students[studentIndex].attendanceTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    students[studentIndex].absenceReason = undefined; // Clear reason on marking present
    students[studentIndex].wasCancelled = false; // Clear cancelled flag

    if (location) {
        students[studentIndex].location = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
        const distance = calculateDistance(location.latitude, location.longitude, COLLEGE_LOCATION.latitude, COLLEGE_LOCATION.longitude);
        if (distance > ACCEPTABLE_PROXIMITY_METERS) {
            students[studentIndex].locationWarning = true;
            locationWarning = true;
        } else {
            students[studentIndex].locationWarning = false;
        }
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(students));
    return { locationWarning };
  }
  return { locationWarning: false };
}

export function markAbsent(rollNumber: string, cancelled = false) {
  if (typeof window === 'undefined') return;
  
  const students = getStudents();
  const studentIndex = students.findIndex(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
  
  if (studentIndex > -1) {
    students[studentIndex].status = 'Absent';
    students[studentIndex].attendanceTime = undefined;
    students[studentIndex].location = undefined;
    students[studentIndex].locationWarning = false;
    students[studentIndex].absenceReason = undefined; // Clear reason when manually marked absent
    students[studentIndex].wasCancelled = cancelled;

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(students));
  }
}

export function addAbsenceReason(rollNumber: string, reason: string): { success: boolean; studentName?: string; error?: string } {
    if (typeof window === 'undefined') return { success: false, error: 'Function can only be called on the client.'};

    const students = getStudents();
    const studentIndex = students.findIndex(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());

    if (studentIndex > -1) {
        const student = students[studentIndex];
        if (student.status === 'Present') {
            return { success: false, error: 'Cannot report absence for a student marked Present.' };
        }
        students[studentIndex].absenceReason = reason;
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(students));
        return { success: true, studentName: student.name };
    }
    return { success: false, error: 'Student with the provided roll number not found.' };
}


// === Notification Management ===
const NOTIFICATION_PREFIX = 'notifications_';

export function addNotification(rollNumber: string, message: string) {
  if (typeof window === 'undefined') return;
  const key = `${NOTIFICATION_PREFIX}${rollNumber.toLowerCase()}`;
  const existing = localStorage.getItem(key);
  const notifications: string[] = existing ? JSON.parse(existing) : [];
  notifications.push(message);
  localStorage.setItem(key, JSON.stringify(notifications));
}

export function getNotifications(rollNumber: string): string[] {
  if (typeof window === 'undefined') return [];
  const key = `${NOTIFICATION_PREFIX}${rollNumber.toLowerCase()}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function clearNotifications(rollNumber: string) {
  if (typeof window === 'undefined') return;
  const key = `${NOTIFICATION_PREFIX}${rollNumber.toLowerCase()}`;
  localStorage.removeItem(key);
}

// === Attendance Session Management ===

export function startAttendanceSession() {
  if (typeof window !== 'undefined') {
    const session: AttendanceSession = {
      startTime: new Date().toISOString(),
      isOpen: true,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
