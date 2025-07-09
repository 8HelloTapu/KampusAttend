'use server';

/**
 * @fileOverview A flow for handling attendance inquiries from faculty members.
 *
 * - attendanceInquiry - A function that processes faculty questions about attendance.
 * - AttendanceInquiryInput - The input type for the attendanceInquiry function.
 * - AttendanceInquiryOutput - The return type for the attendanceInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceInquiryInputSchema = z.object({
  query: z.string().describe('The attendance-related question from the faculty member.'),
  attendanceData: z.string().describe('The attendance data, e.g., a JSON string of roll numbers and presence status.'),
});
export type AttendanceInquiryInput = z.infer<typeof AttendanceInquiryInputSchema>;

const AttendanceInquiryOutputSchema = z.object({
  answer: z.string().describe('The answer to the attendance question.'),
});
export type AttendanceInquiryOutput = z.infer<typeof AttendanceInquiryOutputSchema>;

export async function attendanceInquiry(input: AttendanceInquiryInput): Promise<AttendanceInquiryOutput> {
  return attendanceInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attendanceInquiryPrompt',
  input: {schema: AttendanceInquiryInputSchema},
  output: {schema: AttendanceInquiryOutputSchema},
  prompt: `You are an AI assistant providing information about class attendance.
  You are provided with attendance data and a question from a faculty member.
  Use the attendance data to accurately answer the question.

  Attendance Data: {{{attendanceData}}}
  Question: {{{query}}}
  Answer: `,
});

const attendanceInquiryFlow = ai.defineFlow(
  {
    name: 'attendanceInquiryFlow',
    inputSchema: AttendanceInquiryInputSchema,
    outputSchema: AttendanceInquiryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
