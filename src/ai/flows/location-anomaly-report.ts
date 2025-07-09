'use server';

/**
 * @fileOverview An AI agent that analyzes attendance data to report on location anomalies.
 *
 * - locationAnomalyReport - A function that generates a report on students with location warnings.
 * - LocationAnomalyReportInput - The input type for the function.
 * - LocationAnomalyReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocationAnomalyReportInputSchema = z.object({
  attendanceData: z.string().describe('A JSON string of all student attendance data.'),
});
export type LocationAnomalyReportInput = z.infer<typeof LocationAnomalyReportInputSchema>;

const LocationAnomalyReportOutputSchema = z.object({
  report: z.string().describe("A concise report summarizing students with location anomalies. If none, it should state that."),
});
export type LocationAnomalyReportOutput = z.infer<typeof LocationAnomalyReportOutputSchema>;

export async function locationAnomalyReport(input: LocationAnomalyReportInput): Promise<LocationAnomalyReportOutput> {
  return locationAnomalyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locationAnomalyReportPrompt',
  input: {schema: LocationAnomalyReportInputSchema},
  output: {schema: LocationAnomalyReportOutputSchema},
  prompt: `You are an AI attendance monitoring assistant. Your task is to analyze a list of students and generate a report on location anomalies.

  You will be given a JSON string of student data. Identify all students who have the field '"locationWarning": true'.
  
  Your report should be a brief, human-readable summary.
  - List the name and roll number of each student with a location warning.
  - If no students have a location warning, your report should clearly state that "All student locations were verified successfully."
  - Do not list students who do not have a location warning.
  - Format the output as a simple list. Do not use markdown tables.

  Student Data:
  {{{attendanceData}}}
  `,
});

const locationAnomalyReportFlow = ai.defineFlow(
  {
    name: 'locationAnomalyReportFlow',
    inputSchema: LocationAnomalyReportInputSchema,
    outputSchema: LocationAnomalyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
