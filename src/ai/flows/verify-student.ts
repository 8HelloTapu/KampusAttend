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
  isMatch: z.boolean().describe('Whether the student is found and the face matches.'),
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

  // If the student has a reference image, use the AI-powered face verification.
  if (student.referenceImageUrl && input.livePhotoDataUri) {
    return verifyFaceFlow({
        referenceImageUrl: student.referenceImageUrl,
        livePhotoDataUri: input.livePhotoDataUri,
    });
  }

  // Fallback for students without a reference image (prototype behavior).
  return {
    isMatch: true,
    message: 'Verification successful (Roll Number only).',
  };
}


// Define the specific input for the face verification part of the flow.
const VerifyFaceInputSchema = z.object({
    referenceImageUrl: z.string().url().describe("The URL of the student's reference photo."),
    livePhotoDataUri: z.string().describe("A snapshot from the student's webcam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});


const faceVerificationPrompt = ai.definePrompt({
    name: 'faceVerificationPrompt',
    input: { schema: VerifyFaceInputSchema },
    output: { schema: VerifyStudentOutputSchema },
    prompt: `You are an advanced AI security assistant for an attendance system. Your task is to verify if two images are of the same person.

    - The first image is a trusted reference photo of the student.
    - The second image is a live photo captured from their webcam.

    Carefully compare the faces in both images.

    - If you are confident they are the same person, set "isMatch" to true and provide a success message like "Face match confirmed."
    - If they are not the same person, or if you cannot be sure, set "isMatch" to false and state that the faces do not match.
    - If a face is not clearly visible in the live photo, set "isMatch" to false and ask the user to ensure their face is clear and well-lit.

    Reference Photo: {{media url=referenceImageUrl}}
    Live Webcam Photo: {{media url=livePhotoDataUri}}
    `,
});

const verifyFaceFlow = ai.defineFlow(
  {
    name: 'verifyFaceFlow',
    inputSchema: VerifyFaceInputSchema,
    outputSchema: VerifyStudentOutputSchema,
  },
  async (input) => {
    const { output } = await faceVerificationPrompt(input);
    return output!;
  }
);
