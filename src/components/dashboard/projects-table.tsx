import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, Leaf } from 'lucide-react';

export type Project = {
  name: string;
  location: string;
  area: string;
  status: 'Verified' | 'Pending' | 'Rejected';
};

const statusConfig = {
  Verified: {
    icon: CheckCircle2,
    badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300',
  },
  Pending: {
    icon: Clock,
    badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-400',
  },
  Rejected: {
    icon: XCircle,
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-400',
  },
};

type ProjectsTableProps = {
  projects: Project[];
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Projects</CardTitle>
        <CardDescription>A list of all projects submitted by your organization.</CardDescription>
      </CardHeader>
      <CardContent>
         {projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Area</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const statusInfo = statusConfig[project.status];
                const Icon = statusInfo.icon;
                return (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{project.location}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{project.area}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('flex items-center gap-2', statusInfo.badgeClass)}>
                        <Icon className="h-4 w-4" />
                        <span>{project.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Leaf className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">No projects submitted yet</h3>
            <p className="mt-1 text-sm">Click "Submit New Project" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
