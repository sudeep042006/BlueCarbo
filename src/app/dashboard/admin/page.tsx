'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, Send, ShieldCheck, FileText, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { assessProjectAction } from './actions';
import { AdminAutoAssessProjectOutput } from '@/ai/flows/admin-auto-assess-project';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  projectDescription: z.string().min(50, 'Please provide a detailed project description of at least 50 characters.'),
  evidenceDocument: z
    .any()
    .refine((files) => files?.length === 1, 'Evidence document is required.')
    .refine((files) => files?.[0]?.size <= 5000000, 'Max file size is 5MB.')
    .refine(
      (files) => ['application/pdf', 'image/jpeg', 'image/png'].includes(files?.[0]?.type),
      '.pdf, .jpg, and .png files are accepted.'
    ),
  projectCategory: z.string({ required_error: 'Please select a project category.' }),
  expectedImpact: z.string().min(20, 'Please describe the expected impact in at least 20 characters.'),
});

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const statusConfig = {
    approved: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    rejected: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    'needs clarification': { icon: HelpCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
};


export default function AdminVerificationPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AdminAutoAssessProjectOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: '',
      projectCategory: '',
      expectedImpact: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAssessmentResult(null);

    try {
      const evidenceFile = values.evidenceDocument[0];
      const evidenceDocument = await fileToDataURI(evidenceFile);

      const result = await assessProjectAction({ ...values, evidenceDocument });
      setAssessmentResult(result);
      toast({
        title: 'Assessment Complete',
        description: 'The AI has finished pre-verifying the project.',
      });
    } catch (error) {
      console.error('Assessment failed:', error);
      toast({
        variant: 'destructive',
        title: 'Assessment Failed',
        description: 'An error occurred while assessing the project.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusKey = (status: string) => {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus in statusConfig) {
          return lowerStatus as keyof typeof statusConfig;
      }
      return 'needs clarification';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Verification Tool</h1>
        <p className="text-muted-foreground">Use AI to perform a pre-verification assessment of environmental projects.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Project Details</CardTitle>
            <CardDescription>Enter the project information and upload evidence for AI assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the environmental project." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reforestation">Reforestation</SelectItem>
                          <SelectItem value="conservation">Conservation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedImpact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Environmental Impact</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Sequester 500 tons of CO2 annually, restore 20 hectares of habitat..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="evidenceDocument"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Evidence Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files)}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Assess Project
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              AI Assessment Result
            </CardTitle>
            <CardDescription>The outcome of the AI-powered pre-verification will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>Assessing project... this may take a moment.</p>
              </div>
            )}
            {!isLoading && !assessmentResult && (
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Results will be displayed here once you submit a project for assessment.</p>
              </div>
            )}
            {assessmentResult && (
              <div className="space-y-6 w-full">
                 <Alert className={cn(statusConfig[getStatusKey(assessmentResult.verificationStatus)]?.bgColor)}>
                  <AlertTitle className="text-lg font-semibold flex items-center gap-2">
                    {React.createElement(statusConfig[getStatusKey(assessmentResult.verificationStatus)]?.icon || AlertCircle, { className: cn('h-5 w-5', statusConfig[getStatusKey(assessmentResult.verificationStatus)]?.color) })}
                    Status: {assessmentResult.verificationStatus}
                  </AlertTitle>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Summary</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{assessmentResult.assessmentSummary}</p>
                  </div>

                  <div>
                     <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500" /> Suggested Actions</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{assessmentResult.suggestedActions}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
