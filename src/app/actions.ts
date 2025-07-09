'use server';

import { attendanceInquiry } from '@/ai/flows/attendance-inquiry';
import { locationAnomalyReport } from '@/ai/flows/location-anomaly-report';
import { verifyStudent } from '@/ai/flows/verify-student';
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

const anomalyReportSchema = z.object({
    attendanceData: z.string(),
});

export async function handleLocationAnomalyReport(formData: FormData) {
    const parsed = anomalyReportSchema.safeParse({
        attendanceData: formData.get('attendanceData'),
    });

    if (!parsed.success) {
        return { error: 'Invalid input.' };
    }

    try {
        const result = await locationAnomalyReport({
            attendanceData: parsed.data.attendanceData,
        });
        return { report: result.report };
    } catch(e) {
        console.error(e);
        return { error: "Failed to generate location anomaly report."}
    }
}


const verificationSchema = z.object({
  rollNumber: z.string(),
  livePhotoDataUri: z.string(),
});

export async function handleAttendanceVerification(formData: FormData) {
    const parsed = verificationSchema.safeParse({
        rollNumber: formData.get('rollNumber'),
        livePhotoDataUri: formData.get('livePhotoDataUri'),
    });

    if (!parsed.success) {
        return { error: 'Invalid input. Roll number and photo are required.' };
    }
    
    try {
        const result = await verifyStudent(parsed.data);
        return { result };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred during verification.' };
    }
}
