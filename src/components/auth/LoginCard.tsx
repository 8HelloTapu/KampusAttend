'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import AttendaVisionLogo from '../AttendaVisionLogo';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginCardProps {
  userType: 'Student' | 'Faculty';
  expectedUsername: string;
  expectedPassword: string;
  redirectPath: string;
  authKey: string;
}

export function LoginCard({ userType, expectedUsername, expectedPassword, redirectPath, authKey }: LoginCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (data.username === expectedUsername && data.password === expectedPassword) {
        localStorage.setItem(authKey, 'true');
        toast({
          title: 'Login Successful',
          description: `Welcome to the ${userType} Portal.`,
        });
        router.push(redirectPath);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid username or password.',
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <AttendaVisionLogo className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">{userType} Login</CardTitle>
            <CardDescription>
              For this prototype, please use:
              <br />
              Username: <span className="font-mono font-bold">{expectedUsername}</span>
              <br />
              Password: <span className="font-mono font-bold">{expectedPassword}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
