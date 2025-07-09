'use server';

import { attendanceInquiry } from '@/ai/flows/attendance-inquiry';
import { absenteeAlert } from '@/ai/flows/absentee-alert';
import { verifyStudent } from '@/ai/flows/verify-student';
import { mockStudentData, absenteeStudent } from '@/lib/data';
import { z } from 'zod';

// Note: This file uses mockStudentData. For a fully connected experience, 
// it should use a shared data source that the student portal can update.
// The live attendance table is updated via client-side state management.

const inquirySchema = z.object({
  query: z.string(),
});

export async function handleAttendanceQuery(formData: FormData) {
  const parsed = inquirySchema.safeParse({ query: formData.get('query') });
  if (!parsed.success) {
    return { error: 'Invalid query.' };
  }

  try {
    // The AI assistant uses the static mock data for its context.
    // A real implementation would fetch live data from a database here.
    const attendanceDataString = JSON.stringify(
      mockStudentData.map(s => ({ rollNumber: s.rollNumber, name: s.name, status: s.status }))
    );

    const result = await attendanceInquiry({
      query: parsed.data.query,
      attendanceData: attendanceDataString,
    });
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to process the query with AI.' };
  }
}

export async function handleAbsenteeAlert() {
    try {
        const result = await absenteeAlert(absenteeStudent);
        return { result };
    } catch(e) {
        console.error(e);
        return { error: "Failed to run absentee alert."}
    }
}

const verificationSchema = z.object({
  rollNumber: z.string(),
  capturedPhotoDataUri: z.string(),
});

export async function handleAttendanceVerification(formData: FormData) {
    const parsed = verificationSchema.safeParse({
        rollNumber: formData.get('rollNumber'),
        capturedPhotoDataUri: formData.get('capturedPhotoDataUri'),
    });

    if (!parsed.success || !parsed.data.capturedPhotoDataUri) {
        return { error: 'Invalid input. Image and roll number are required.' };
    }
    
    try {
        const result = await verifyStudent(parsed.data);
        return { result };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred during AI verification.' };
    }
}
