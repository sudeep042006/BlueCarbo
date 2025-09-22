'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Leaf, Shield, LogOut, Menu, Briefcase, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { signOut } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.' });
    }
  }

  const isCorporate = pathname.startsWith('/dashboard/corporate');
  const isAdmin = pathname.startsWith('/dashboard/admin');
  
  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['ngo']
    },
    {
      href: '/dashboard/projects',
      icon: Leaf,
      label: 'Projects',
      roles: ['ngo']
    },
     {
      href: '/dashboard/corporate',
      icon: Briefcase,
      label: 'Corporate Dashboard',
      roles: ['corporate']
    },
    {
      href: '/dashboard/admin',
      icon: UserCog,
      label: 'Admin',
      roles: ['admin']
    },
  ];

  let activeRole: 'ngo' | 'corporate' | 'admin' = 'ngo';
  if (isCorporate) activeRole = 'corporate';
  if (isAdmin) activeRole = 'admin';

  const visibleNavItems = navItems.filter(item => item.roles.includes(activeRole));
  
  const user = {
      ngo: {name: 'Global Waves', type: 'NGO Account', avatarSeed: 'ngo'},
      corporate: {name: 'Example Corp', type: 'Corporate Account', avatarSeed: 'corp'},
      admin: {name: 'Admin User', type: 'Administrator', avatarSeed: 'admin'},
  }[activeRole];


  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={cn('flex flex-col h-full', className)}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg font-headline">Blue Carbon</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://picsum.photos/seed/${user.avatarSeed}/100/100`} />
            <AvatarFallback>{user.type.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.type}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </nav>
  );

  return (
    <SidebarProvider>
      <div className="md:flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar>
            <SidebarNav />
          </Sidebar>
        </div>

        <main className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:justify-end">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  <SidebarNav className="bg-background" />
                </SheetContent>
              </Sheet>
            </div>
            <div className="md:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg font-headline">Blue Carbon</span>
                </Link>
            </div>
            <div className="ml-auto hidden md:block">
              <SidebarTrigger />
            </div>
          </header>
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
