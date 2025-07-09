'use server';

/**
 * @fileOverview An AI agent for generating attendance cancellation notifications.
 *
 * - generateCancellationNotification - Generates a notification for a student whose attendance was cancelled.
 * - CancellationNotificationInput - The input type for the function.
 * - CancellationNotificationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CancellationNotificationInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  rollNumber: z.string().describe('The roll number of the student.'),
});
export type CancellationNotificationInput = z.infer<typeof CancellationNotificationInputSchema>;

const CancellationNotificationOutputSchema = z.object({
  notification: z.string().describe('The generated notification message for the student.'),
});
export type CancellationNotificationOutput = z.infer<typeof CancellationNotificationOutputSchema>;

export async function generateCancellationNotification(input: CancellationNotificationInput): Promise<CancellationNotificationOutput> {
  return cancellationNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cancellationNotificationPrompt',
  input: {schema: CancellationNotificationInputSchema},
  output: {schema: CancellationNotificationOutputSchema},
  prompt: `You are an assistant for the KampusAttend app. A faculty member has cancelled the attendance for the following student because they were not found in the class during a spot check.

  Student Details:
  - Name: {{{name}}}
  - Roll Number: {{{rollNumber}}}

  Generate a polite but clear notification message for the student. Inform them that their attendance for the current session has been cancelled. Advise them to contact their faculty if they believe this was done in error. Keep the message concise.`,
});

const cancellationNotificationFlow = ai.defineFlow(
  {
    name: 'cancellationNotificationFlow',
    inputSchema: CancellationNotificationInputSchema,
    outputSchema: CancellationNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
