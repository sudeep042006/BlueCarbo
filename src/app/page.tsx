'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, CheckCircle, Leaf, ShieldCheck, Briefcase, UserCog, Building, Handshake, Sprout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { featuredNGOs, corporatePartners } from '@/lib/partners';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Home() {
  const [authAction, setAuthAction] = useState<'login' | 'register' | null>(null);
  const [initialAuthTab, setInitialAuthTab] = useState<'ngo' | 'corporate' | 'admin'>('ngo');
  const [isPartnersSheetOpen, setIsPartnersSheetOpen] = useState(false);

  const openAuthModal = (action: 'login' | 'register', userType: 'ngo' | 'corporate' | 'admin') => {
    setInitialAuthTab(userType);
    setAuthAction(action);
  };
  
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
      <SiteHeader 
        onLogin={() => openAuthModal('login', 'ngo')} 
        onRegister={() => openAuthModal('register', 'ngo')} 
        onCorporateLogin={() => openAuthModal('login', 'corporate')}
        onCorporateRegister={() => openAuthModal('register', 'corporate')}
        onAdminLogin={() => openAuthModal('login', 'admin')}
        onShowPartners={() => setIsPartnersSheetOpen(true)}
      />
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
              Powering the BlueCarbo Economy
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
              A transparent, secure, and reliable registry for verifying and tracking marine-based carbon credits.
            </p>
            <div className="flex gap-4 justify-center">
               <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => openAuthModal('register', 'ngo')}>
                  Register as NGO <ArrowRight className="ml-2" />
               </Button>
               <Button size="lg" variant="secondary" onClick={() => openAuthModal('register', 'corporate')}>
                  Register as Corporate
               </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose BlueCarbo?</h2>
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

      {/* Partners Sheet */}
      <Sheet open={isPartnersSheetOpen} onOpenChange={setIsPartnersSheetOpen}>
        <SheetContent side="left" className="sm:max-w-md w-full">
            <SheetHeader>
                <SheetTitle className="font-headline text-2xl flex items-center gap-2"><Handshake />Our Partners</SheetTitle>
                <SheetDescription>
                A growing community of organizations committed to a healthier planet.
                </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary"><Sprout />Featured NGOs</h3>
                    <div className="space-y-4">
                        {featuredNGOs.map(ngo => (
                            <Card key={ngo.id} className="p-3">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${ngo.avatarSeed}/100`} alt={ngo.name} />
                                        <AvatarFallback>{ngo.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{ngo.name}</p>
                                        <p className="text-sm text-muted-foreground">{ngo.mission}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                 <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-accent"><Building />Corporate Partners</h3>
                    <div className="space-y-4">
                        {corporatePartners.map(corp => (
                             <Card key={corp.id} className="p-3">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${corp.avatarSeed}/100`} alt={corp.name} />
                                        <AvatarFallback>{corp.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{corp.name}</p>
                                        <p className="text-sm text-muted-foreground">{corp.industry}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </SheetContent>
      </Sheet>


      {/* Auth Dialog */}
      <Dialog open={authAction !== null} onOpenChange={(isOpen) => !isOpen && setAuthAction(null)}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              {authAction === 'login' ? 'Welcome Back' : 'Create an Account'}
            </DialogTitle>
             <DialogDescription>
              {authAction === 'login' ? 'Login to access your dashboard.' : 'Join our platform to make a difference.'}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={initialAuthTab} value={initialAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ngo" onClick={() => setInitialAuthTab('ngo')}><Leaf className="mr-2" /> NGO</TabsTrigger>
              <TabsTrigger value="corporate" onClick={() => setInitialAuthTab('corporate')}><Briefcase className="mr-2"/> Corporate</TabsTrigger>
              <TabsTrigger value="admin" onClick={() => setInitialAuthTab('admin')}><UserCog className="mr-2"/> Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="ngo">
                {authAction === 'login' ? <LoginForm userType="ngo" onLoginSuccess={() => setAuthAction(null)} /> : <RegisterForm userType="ngo" onRegisterSuccess={() => setAuthAction(null)} />}
            </TabsContent>
            <TabsContent value="corporate">
                {authAction === 'login' ? <LoginForm userType="corporate" onLoginSuccess={() => setAuthAction(null)} /> : <RegisterForm userType="corporate" onRegisterSuccess={() => setAuthAction(null)} />}
            </TabsContent>
             <TabsContent value="admin">
                {authAction === 'login' ? <LoginForm userType="admin" onLoginSuccess={() => setAuthAction(null)} /> : <RegisterForm userType="admin" onRegisterSuccess={() => setAuthAction(null)} />}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
