// This is an example Genkit flow file.

'use server';

/**
 * @fileOverview An AI agent that detects students who marked themselves present but are not in the classroom and sends them a notification.
 *
 * - absenteeAlert - A function that handles the absentee alert process.
 * - AbsenteeAlertInput - The input type for the absenteeAlert function.
 * - AbsenteeAlertOutput - The return type for the absenteeAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AbsenteeAlertInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  lastKnownLocation: z.string().describe('The last known GPS coordinates of the student.'),
  attendanceMarkedTime: z.string().describe('The time the student marked their attendance (ISO format).'),
  expectedClassroomLocation: z.string().describe('The GPS coordinates of the classroom.'),
  acceptableProximity: z.number().describe('The acceptable proximity (in meters) to the classroom to be considered present.'),
});
export type AbsenteeAlertInput = z.infer<typeof AbsenteeAlertInputSchema>;

const AbsenteeAlertOutputSchema = z.object({
  isInClassroom: z.boolean().describe('Whether the student is currently in the classroom based on location data.'),
  notificationSent: z.boolean().describe('Whether a notification was sent to the student.'),
});
export type AbsenteeAlertOutput = z.infer<typeof AbsenteeAlertOutputSchema>;

export async function absenteeAlert(input: AbsenteeAlertInput): Promise<AbsenteeAlertOutput> {
  return absenteeAlertFlow(input);
}

const isStudentInClassroomTool = ai.defineTool({
  name: 'isStudentInClassroom',
  description: 'Checks if a student is in the classroom based on their last known location and the classroom location.',
  inputSchema: z.object({
    studentLocation: z.string().describe('The current GPS coordinates of the student.'),
    classroomLocation: z.string().describe('The GPS coordinates of the classroom.'),
    acceptableProximity: z.number().describe('The acceptable proximity (in meters) to the classroom.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // TODO: Implement the logic to calculate the distance between the student and the classroom
  // and determine if the student is within the acceptable proximity.
  // For now, just return false.
  // Replace this with actual distance calculation and proximity check.
  console.log('checking isStudentInClassroomTool', input);
  return false;
});

const sendNotificationTool = ai.defineTool({
  name: 'sendNotification',
  description: 'Sends a notification to a student.',
  inputSchema: z.object({
    studentId: z.string().describe('The unique identifier for the student.'),
    message: z.string().describe('The message to send to the student.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // TODO: Implement the logic to send a notification to the student.
  // For now, just return true.
  // Replace this with actual notification sending implementation.
  console.log('sending notification', input);
  return true;
});

const absenteeAlertPrompt = ai.definePrompt({
  name: 'absenteeAlertPrompt',
  tools: [isStudentInClassroomTool, sendNotificationTool],
  input: {schema: AbsenteeAlertInputSchema},
  output: {schema: AbsenteeAlertOutputSchema},
  prompt: `You are an AI assistant designed to detect students who marked themselves present but are not in the classroom.

  Here's the student data:
  - Student ID: {{{studentId}}}
  - Last Known Location: {{{lastKnownLocation}}}
  - Attendance Marked Time: {{{attendanceMarkedTime}}}
  - Expected Classroom Location: {{{expectedClassroomLocation}}}
  - Acceptable Proximity: {{{acceptableProximity}}} meters

  First, determine if the student is in the classroom using the isStudentInClassroom tool.
  If the student is not in the classroom, send them a notification using the sendNotification tool to remind them to attend class.

  Return the following information:
  - isInClassroom: Whether the student is currently in the classroom based on location data.
  - notificationSent: Whether a notification was sent to the student.
  `,
});

const absenteeAlertFlow = ai.defineFlow(
  {
    name: 'absenteeAlertFlow',
    inputSchema: AbsenteeAlertInputSchema,
    outputSchema: AbsenteeAlertOutputSchema,
  },
  async input => {
    const {output} = await absenteeAlertPrompt(input);
    return output!;
  }
);
