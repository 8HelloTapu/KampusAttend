import { config } from 'dotenv';
config();

import '@/ai/flows/absentee-alert.ts';
import '@/ai/flows/attendance-inquiry.ts';
import '@/ai/flows/verify-student.ts';
