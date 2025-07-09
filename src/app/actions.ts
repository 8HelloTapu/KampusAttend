'use server';

import { attendanceInquiry } from '@/ai/flows/attendance-inquiry';
import { absenteeAlert } from '@/ai/flows/absentee-alert';
import { verifyStudent } from '@/ai/flows/verify-student';
import { absenteeStudent } from '@/lib/data';
import { z } from 'zod';

const inquirySchema = z.object({
  query: z.string(),
  attendanceData: z.string(),
});

export async function handleAttendanceQuery(formData: FormData) {
  const parsed = inquirySchema.safeParse({
    query: formData.get('query'),
    attendanceData: formData.get('attendanceData'),
  });

  if (!parsed.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await attendanceInquiry({
      query: parsed.data.query,
      attendanceData: parsed.data.attendanceData,
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
});

export async function handleAttendanceVerification(formData: FormData) {
    const parsed = verificationSchema.safeParse({
        rollNumber: formData.get('rollNumber'),
    });

    if (!parsed.success) {
        return { error: 'Invalid input. Roll number is required.' };
    }
    
    try {
        const result = await verifyStudent(parsed.data);
        return { result };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred during verification.' };
    }
}
