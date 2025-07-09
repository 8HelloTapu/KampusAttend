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
  capturedPhotoDataUri: z.string().describe("A photo of the student attempting to mark attendance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type VerifyStudentInput = z.infer<typeof VerifyStudentInputSchema>;

const VerifyStudentOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the captured photo matches the reference photo for the student.'),
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
  
  const referencePhotoUrl = student.avatarUrl;
  
  const flowInput = {
      rollNumber: input.rollNumber,
      capturedPhotoDataUri: input.capturedPhotoDataUri,
      referencePhotoUrl: referencePhotoUrl,
  }

  return verifyStudentFlow(flowInput);
}

const verificationPrompt = ai.definePrompt({
  name: 'verifyStudentPrompt',
  input: {
    schema: z.object({
      rollNumber: z.string(),
      capturedPhotoDataUri: z.string(),
      referencePhotoUrl: z.string(),
    }),
  },
  output: {schema: VerifyStudentOutputSchema},
  prompt: `You are an advanced AI verification system for a school. Your task is to determine if a student trying to mark attendance is the correct person by comparing their live photo with their official reference photo.

For this prototype, since we are using placeholder images, you will need to simulate the verification. If the live photo appears to be a person, assume it is the correct person and a match. If it is not a person or is unclear, assume it is not a match.

Student Roll Number: {{{rollNumber}}}

Reference photo on file:
{{media url=referencePhotoUrl}}

Live photo captured by student:
{{media url=capturedPhotoDataUri}}

Analyze the two images.
- If the person in the live photo is clearly the same person as in the reference photo (or if the live photo is a person, for this demo), set 'isMatch' to true. The message should be "Verification successful."
- If they do not match, set 'isMatch' to false. The message should be "Face verification failed. The captured image does not match the student on file."
`,
});

const verifyStudentFlow = ai.defineFlow(
  {
    name: 'verifyStudentFlow',
    inputSchema: z.object({
      rollNumber: z.string(),
      capturedPhotoDataUri: z.string(),
      referencePhotoUrl: z.string(),
    }),
    outputSchema: VerifyStudentOutputSchema,
  },
  async (input) => {
    const {output} = await verificationPrompt(input);
    return output!;
  }
);
