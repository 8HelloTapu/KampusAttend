'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getNotifications, clearNotifications } from '@/lib/attendanceStore';
import { Bell, Trash2, Inbox } from 'lucide-react';

export default function NotificationsPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const handleCheckMessages = () => {
    if (!rollNumber) return;
    const notifications = getNotifications(rollNumber);
    setMessages(notifications);
    setSearched(true);
  };

  const handleClearMessages = () => {
    if (!rollNumber) return;
    clearNotifications(rollNumber);
    setMessages([]);
    setSearched(false);
    setRollNumber('');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-4 md:p-8">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <Bell /> Student Notifications
            </CardTitle>
            <CardDescription>
              Enter your roll number to check for any messages from the faculty, such as attendance cancellations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter your Roll Number"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value);
                  setSearched(false);
                }}
                className="font-code"
              />
              <Button onClick={handleCheckMessages} disabled={!rollNumber}>Check Messages</Button>
            </div>
            
            {searched && (
              <div className="mt-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className="rounded-lg border bg-muted/50 p-4 text-sm">
                      {msg}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
                    <Inbox className="h-12 w-12" />
                    <p className="mt-4 font-semibold">You're all caught up!</p>
                    <p>No new notifications for {rollNumber.toUpperCase()}.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {messages.length > 0 && (
            <CardFooter>
              <Button variant="outline" onClick={handleClearMessages}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}
