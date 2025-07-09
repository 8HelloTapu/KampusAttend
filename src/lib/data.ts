export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  avatarUrl: string;
  status: 'Present' | 'Absent';
}

export const mockStudentData: Student[] = [
  { id: '1', rollNumber: 'R001', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '2', rollNumber: 'R002', name: 'Bob Williams', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '3', rollNumber: 'R003', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/100x100.png', status: 'Absent' },
  { id: '4', rollNumber: 'R004', name: 'Diana Miller', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '5', rollNumber: 'R005', name: 'Ethan Garcia', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '6', rollNumber: 'R006', name: 'Fiona Davis', avatarUrl: 'https://placehold.co/100x100.png', status: 'Absent' },
  { id: '7', rollNumber: 'R007', name: 'George Rodriguez', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '8', rollNumber: 'R008', name: 'Hannah Martinez', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '9', rollNumber: 'R009', name: 'Ivan Hernandez', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
  { id: '10', rollNumber: 'R010', name: 'Jane Doe', avatarUrl: 'https://placehold.co/100x100.png', status: 'Present' },
];

export const absenteeStudent = {
  studentId: 'R005',
  name: 'Ethan Garcia',
  lastKnownLocation: '28.6139, 77.2090', // India Gate, New Delhi
  attendanceMarkedTime: new Date().toISOString(),
  expectedClassroomLocation: '28.7041, 77.1025', // Rohini, Delhi (simulating a college location)
  acceptableProximity: 500, // meters
};
