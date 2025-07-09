// This is a client-side store that uses localStorage to simulate a database.
import { mockStudentData, type Student, COLLEGE_LOCATION } from './data';

const ATTENDANCE_KEY = 'attendanceData';
const SESSION_KEY = 'attendanceSession';
const ACCEPTABLE_PROXIMITY_METERS = 500;

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

  const storedDataRaw = localStorage.getItem(ATTENDANCE_KEY);
  const storedStudents: Student[] = storedDataRaw ? JSON.parse(storedDataRaw) : [];
  
  // Create a map of the current attendance statuses for easy lookup
  const attendanceStatusMap = new Map<string, Partial<Student>>();
  storedStudents.forEach(student => {
    attendanceStatusMap.set(student.rollNumber.toLowerCase(), {
        status: student.status,
        location: student.location,
        locationWarning: student.locationWarning
    });
  });

  // Create a fresh student list from the source of truth (mockStudentData)
  // and apply any existing attendance statuses. This prevents stale data issues.
  const updatedStudents = mockStudentData.map(mockStudent => {
    const existingStatus = attendanceStatusMap.get(mockStudent.rollNumber.toLowerCase());
    return {
      ...mockStudent,
      status: existingStatus?.status || 'Absent',
      location: existingStatus?.location,
      locationWarning: existingStatus?.locationWarning || false,
    };
  });

  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updatedStudents));
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
    window.dispatchEvent(new Event('storageUpdate')); // Notify other components
    return { locationWarning };
  }
  return { locationWarning: false };
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
