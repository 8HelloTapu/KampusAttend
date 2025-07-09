'use client';

import { useState, useTransition } from 'react';
import { handleAttendanceQuery } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AttendanceQuery() {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState('');
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResponse('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('query', query);
      const result = await handleAttendanceQuery(formData);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setResponse('');
      } else {
        setResponse(result.answer || '');
      }
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>AI Attendance Assistant</CardTitle>
          <CardDescription>
            Ask questions about today's attendance data. For example: "What is the strength of the class today?" or "Is R003 present?".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your question here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="font-body"
          />
          {isPending && (
             <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI is thinking...</span>
             </div>
          )}
          {response && (
            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold">AI Response</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-body font-code">{response}</p>
                </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending || !query.trim()}>
            {isPending ? 'Asking...' : 'Ask AI'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
