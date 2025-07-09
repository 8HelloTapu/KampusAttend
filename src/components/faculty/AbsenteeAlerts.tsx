'use client';

import { useState, useTransition } from 'react';
import { handleAbsenteeAlert } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BellRing, CheckCircle2, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { absenteeStudent } from '@/lib/data';

type AlertResult = {
    isInClassroom: boolean;
    notificationSent: boolean;
} | null;

export function AbsenteeAlerts() {
    const [isPending, startTransition] = useTransition();
    const [alertResult, setAlertResult] = useState<AlertResult>(null);
    const { toast } = useToast();

    const runCheck = () => {
        setAlertResult(null);
        startTransition(async () => {
            const result = await handleAbsenteeAlert();
            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error,
                });
                setAlertResult(null);
            } else if (result.result) {
                setAlertResult(result.result);
            }
        });
    }

    const getAlertContent = () => {
        if (!alertResult) return null;

        if (alertResult.isInClassroom) {
            return {
                variant: 'default',
                icon: <CheckCircle2 className="h-4 w-4" />,
                title: 'Student is Present',
                description: `Student ${absenteeStudent.name} is in the classroom. No action needed.`
            };
        }
        
        if (alertResult.notificationSent) {
            return {
                variant: 'default',
                className: 'border-accent text-accent',
                icon: <BellRing className="h-4 w-4 text-accent" />,
                title: 'Alert Sent!',
                description: `Student ${absenteeStudent.name} is not in the classroom. A notification has been sent.`
            };
        }
        
        return {
            variant: 'destructive',
            icon: <ShieldX className="h-4 w-4" />,
            title: 'Action Failed',
            description: 'Could not verify student location or send a notification.'
        };
    }

    const alertContent = getAlertContent();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-time Absentee Alerts</CardTitle>
                <CardDescription>
                    Run a check to find students who marked attendance but are not in the classroom. This demo will check for a specific student: <span className='font-medium font-code'>{absenteeStudent.name} ({absenteeStudent.studentId})</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {alertContent && (
                    <Alert variant={alertContent.variant as any} className={alertContent.className}>
                        {alertContent.icon}
                        <AlertTitle>{alertContent.title}</AlertTitle>
                        <AlertDescription>
                            {alertContent.description}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={runCheck} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        'Run Absentee Check'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
