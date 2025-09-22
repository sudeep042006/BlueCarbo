import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, CheckCircle, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Projects Submitted',
    value: '12',
    icon: <Leaf className="h-6 w-6 text-muted-foreground" />,
    description: '+2 from last month',
  },
  {
    title: 'Verified Projects',
    value: '8',
    icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />,
    description: '66% success rate',
  },
  {
    title: 'Total Carbon Sequestered',
    value: '1,250 tCO₂e',
    icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
    description: 'Verified sequestration to date',
  },
];

export function StatCards() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
