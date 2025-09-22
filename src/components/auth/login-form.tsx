'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';
import { signInWithEmail } from '@/lib/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type UserType = 'ngo' | 'corporate' | 'admin';

interface LoginFormProps {
    userType: UserType;
    onLoginSuccess: () => void;
}

export function LoginForm({ userType, onLoginSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmail(values.email, values.password);
      
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });

      onLoginSuccess();

      if (userType === 'corporate') {
        router.push('/dashboard/corporate');
      } else if (userType === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
        setIsLoading(false);
    }
  }
  
  const userTypeDisplay = {
      ngo: 'NGO',
      corporate: 'Corporate',
      admin: 'Admin'
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? <Loader2 className="animate-spin"/> : <LogIn />}
           Login as {userTypeDisplay[userType]}
        </Button>
      </form>
    </Form>
  );
}
