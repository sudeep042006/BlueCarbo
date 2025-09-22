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
import { UserPlus, Loader2 } from 'lucide-react';
import { signUpWithEmail } from '@/lib/auth';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type UserType = 'ngo' | 'corporate' | 'admin';

interface RegisterFormProps {
    userType: UserType;
    onRegisterSuccess: () => void;
}

export function RegisterForm({ userType, onRegisterSuccess }: RegisterFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        await signUpWithEmail(values.email, values.password, values.name, userType);
        
        toast({
          title: 'Registration Successful',
          description: "Welcome! We're glad to have you.",
        });

        onRegisterSuccess();

        if (userType === 'corporate') {
            router.push('/dashboard/corporate');
        } else if (userType === 'admin') {
            router.push('/dashboard/admin');
        } else {
            router.push('/dashboard');
        }
    } catch (error: any) {
        console.error("Registration failed:", error);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  const nameLabel = userType === 'ngo' ? 'NGO Name' : userType === 'corporate' ? 'Company Name' : 'Full Name';
  const namePlaceholder = userType === 'ngo' ? 'Global Restoration Fund' : userType === 'corporate' ? 'Example Corp' : 'John Doe';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {userType !== 'admin' && <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="contact@example.com" {...field} />
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
          {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
