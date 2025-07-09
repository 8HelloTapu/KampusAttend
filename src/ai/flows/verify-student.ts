'use server';

/**
 * @fileOverview An AI agent for student face verification.
 *
 * - verifyStudent - A function that handles the student verification process.
 * - VerifyStudentInput - The input type for the verifyStudent function.
 * - VerifyStudentOutput - The return type for the verifyStudent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {mockStudentData} from '@/lib/data';

function getStudentByRollNumber(rollNumber: string) {
  return mockStudentData.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
}

const VerifyStudentInputSchema = z.object({
  rollNumber: z.string().describe('The roll number of the student to verify.'),
  livePhotoDataUri: z.string().describe("A snapshot from the student's webcam, as a data URI."),
});
export type VerifyStudentInput = z.infer<typeof VerifyStudentInputSchema>;

const VerifyStudentOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the student is found.'),
  message: z.string().describe('A message explaining the verification result.'),
});
export type VerifyStudentOutput = z.infer<typeof VerifyStudentOutputSchema>;


export async function verifyStudent(input: VerifyStudentInput): Promise<VerifyStudentOutput> {
  const student = getStudentByRollNumber(input.rollNumber);

  if (!student) {
    return {
      isMatch: false,
      message: 'Student with the provided roll number not found.',
    };
  }

  // For this prototype, we are only verifying by roll number.
  // The live photo is captured in the UI but not used for verification yet.
  return {
    isMatch: true,
    message: 'Verification successful!',
  };
}
