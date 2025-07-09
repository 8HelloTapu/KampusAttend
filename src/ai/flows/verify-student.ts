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
    try {
      const result = await verifyFaceFlow({
          referenceImageUrl: student.referenceImageUrl,
          livePhotoDataUri: input.livePhotoDataUri,
      });
      return result;
    } catch (e) {
      console.error("Face verification flow failed:", e);
      return {
        isMatch: false,
        message: "The AI verification system encountered an error. Please try again.",
      }
    }
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
    prompt: `You are an AI assistant for a prototype application. Your primary goal is to verify if two images show the same person. For this prototype, you should be lenient in your comparison. Prioritize finding a match even if there are minor differences in lighting, angle, or expression.

Compare the reference photo with the live webcam photo.

Your response MUST be a JSON object with two fields: 'isMatch' (boolean) and 'message' (string).

- If there is a reasonable similarity between the faces, set "isMatch" to true. For the message, say "Verification successful!".
- If the faces are clearly different people, or if a face is not visible, set "isMatch" to false. For the message, explain briefly (e.g., "Faces do not appear to match.").

Reference Photo: {{media url=referenceImageUrl}}
Live Webcam Photo: {{media url=livePhotoDataUri}}`,
});

const verifyFaceFlow = ai.defineFlow(
  {
    name: 'verifyFaceFlow',
    inputSchema: VerifyFaceInputSchema,
    outputSchema: VerifyStudentOutputSchema,
  },
  async (input) => {
    const { output } = await faceVerificationPrompt(input);
    if (!output) {
      throw new Error("AI model did not return a valid JSON response.");
    }
    return output;
  }
);
