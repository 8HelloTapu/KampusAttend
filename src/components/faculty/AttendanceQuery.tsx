'use client';

import { useState, useTransition } from 'react';
import { handleAttendanceQuery } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Paperclip, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function AttendanceQuery() {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState('');
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' && selectedFile.size < 5 * 1024 * 1024) { // 5MB limit
        setFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File',
          description: 'Please select a PDF file smaller than 5MB.',
        });
        setFile(null);
        e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResponse('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('query', query);

      if (file) {
        try {
          const pdfDataUri = await fileToDataUri(file);
          formData.append('pdfDataUri', pdfDataUri);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected PDF file.',
          });
          return;
        }
      }

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
            Ask questions about attendance data. You can also upload a PDF for context (e.g., a class roster or report).
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
          <div className="space-y-2">
            <label htmlFor="pdf-upload" className="text-sm font-medium">Attach PDF (Optional)</label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            {file && (
              <div className="flex items-center justify-between rounded-md border border-muted bg-muted/50 p-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-medium truncate">
                  <Paperclip className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                  setFile(null);
                  // Not perfectly working on all browsers to reset file input but good enough for a demo
                  const input = document.getElementById('pdf-upload') as HTMLInputElement;
                  if (input) input.value = '';
                }}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
                    <p className="font-body whitespace-pre-wrap">{response}</p>
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
