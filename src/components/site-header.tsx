import Link from 'next/link';
import { Leaf, Briefcase, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type SiteHeaderProps = {
  onLogin: () => void;
  onRegister: () => void;
  onCorporateLogin: () => void;
  onCorporateRegister: () => void;
  onAdminLogin: () => void;
};

export function SiteHeader({ onLogin, onRegister, onCorporateLogin, onCorporateRegister, onAdminLogin }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Blue Carbon Registry</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" onClick={onLogin}>
              NGO Login
            </Button>
            <Button onClick={onRegister} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Register NGO
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                      <Briefcase className="mr-2" /> Corporate
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onCorporateLogin}>
                      Corporate Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCorporateRegister}>
                      Register Corporate
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                      <UserCog className="mr-2" /> Admin
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onAdminLogin}>
                      Admin Login
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
           <div className="sm:hidden">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogin}>NGO Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={onRegister}>Register NGO</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onCorporateLogin}>Corporate Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={onCorporateRegister}>Register Corporate</DropdownMenuItem>
                   <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onAdminLogin}>Admin Login</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           </div>
        </div>
      </div>
    </header>
  );
}
