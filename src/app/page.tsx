'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, CheckCircle, Leaf, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-mangroves');

  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: 'Track Your Impact',
      description: 'Monitor the progress and environmental impact of blue carbon projects in real-time.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Verified Projects',
      description: 'All projects on our platform are rigorously vetted and verified for their carbon sequestration potential.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Secure & Transparent',
      description: 'Our registry uses cutting-edge technology to ensure all data is secure, transparent, and immutable.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader onLogin={() => setLoginOpen(true)} onRegister={() => setRegisterOpen(true)} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/50 z-10" />
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              style={{ objectFit: 'cover' }}
              className="z-0"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="relative z-20 container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
              Powering the Blue Carbon Economy
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
              A transparent, secure, and reliable registry for verifying and tracking marine-based carbon credits.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setRegisterOpen(true)}>
                Register Your NGO
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose Blue Carbon Registry?</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide the tools and trust needed to scale vital coastal and marine ecosystem restoration projects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Login</DialogTitle>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>

      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Register</DialogTitle>
          </DialogHeader>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
