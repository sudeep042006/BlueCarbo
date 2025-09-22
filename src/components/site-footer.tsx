import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold font-headline">BlueCarbo</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Methodologies
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BlueCarbo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
