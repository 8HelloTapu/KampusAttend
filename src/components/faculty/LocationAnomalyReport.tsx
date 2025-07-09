
'use client';

import { useState, useTransition } from 'react';
import { handleLocationAnomalyReport } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStudents } from '@/lib/attendanceStore';

export function LocationAnomalyReport({ branch }: { branch: string }) {
    const [isPending, startTransition] = useTransition();
    const [report, setReport] = useState<string | null>(null);
    const { toast } = useToast();

    const runReport = () => {
        setReport(null);
        const studentsForBranch = getStudents(branch);
        const attendanceDataString = JSON.stringify(studentsForBranch);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('attendanceData', attendanceDataString);
            const result = await handleLocationAnomalyReport(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Error Generating Report',
                    description: result.error,
                });
                setReport(null);
            } else if (result.report) {
                setReport(result.report);
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Location Anomaly Report</CardTitle>
                <CardDescription>
                    Use AI to generate a report for the selected class on students who marked their attendance from a location significantly far from campus.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isPending && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>AI is analyzing location data...</span>
                    </div>
                )}
                {report && (
                    <Card className="bg-muted/50">
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-semibold">AI-Generated Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-body whitespace-pre-wrap">{report}</p>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={runReport} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Anomaly Report'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
