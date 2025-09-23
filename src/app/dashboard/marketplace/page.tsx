
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


// Mock project data - this would come from your smart contract or a backend
const ngoProjects = [
  { id: 1, name: 'Andaman Coast Mangrove Restoration', status: 'Verified', available: 1200, onMarketplace: true },
  { id: 2, name: 'Sunderbans Seagrass Initiative', status: 'Pending', available: 850, onMarketplace: false },
  { id: 3, name: 'Mekong Delta Reforestation', status: 'Verified', available: 2500, onMarketplace: false },
  { id: 4, name: 'Borneo Peatland Rewetting', status: 'Rejected', available: 0, onMarketplace: false },
];

export default function MarketplacePage() {
  const [projects, setProjects] = useState(ngoProjects);

  const toggleMarketplaceStatus = (projectId: number) => {
    setProjects(currentProjects =>
      currentProjects.map(p =>
        p.id === projectId ? { ...p, onMarketplace: !p.onMarketplace } : p
      )
    );
  };

  const verifiedProjects = projects.filter(p => p.status === 'Verified');
  const otherProjects = projects.filter(p => p.status !== 'Verified');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Project Marketplace</h1>
        <p className="text-muted-foreground">Manage the visibility of your verified projects on the public marketplace.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verified Projects</CardTitle>
          <CardDescription>
            Only verified projects can be listed on the marketplace for corporates to purchase credits from.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifiedProjects.length > 0 ? (
             verifiedProjects.map(project => (
                <Card key={project.id} className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.available.toLocaleString()} credits available</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Label htmlFor={`marketplace-switch-${project.id}`} className={cn("text-sm", project.onMarketplace ? 'text-primary' : 'text-muted-foreground')}>
                            {project.onMarketplace ? 'Live on Marketplace' : 'Not on Marketplace'}
                        </Label>
                        <Switch
                            id={`marketplace-switch-${project.id}`}
                            checked={project.onMarketplace}
                            onCheckedChange={() => toggleMarketplaceStatus(project.id)}
                        />
                    </div>
                </Card>
            ))
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No verified projects yet</h3>
                <p className="mt-1 text-sm">Once your projects are verified, you can list them here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Projects</CardTitle>
          <CardDescription>
            These projects are not yet verified and cannot be listed on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {otherProjects.length > 0 ? (
                otherProjects.map(project => (
                    <Card key={project.id} className="p-4 flex justify-between items-center gap-4 bg-muted/50">
                        <div>
                            <h3 className="font-semibold text-muted-foreground">{project.name}</h3>
                        </div>
                        <Badge variant={project.status === 'Pending' ? 'secondary' : 'destructive'}>
                            {project.status}
                        </Badge>
                    </Card>
                ))
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <XCircle className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">No other projects found</h3>
                    <p className="mt-1 text-sm">All your submitted projects are currently verified.</p>
                </div>
            )}
        </CardContent>
      </Card>

    </div>
  );
}
