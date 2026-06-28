import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Briefcase, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      name: 'Poultry Farming Phase 1',
      status: 'finished',
      revenue: 150000,
      investment: 100000,
      description: 'The first phase of our group poultry farm located in Pojim North.',
      date: 'Completed June 2023',
    },
    {
      id: 2,
      name: 'Group Rental Units',
      status: 'active',
      revenue: 45000,
      investment: 2000000,
      progress: 65,
      description: 'Ongoing construction of 4 studio apartments for long-term rental income.',
      date: 'Est. Completion Dec 2023',
    },
    {
      id: 3,
      name: 'Community Water Project',
      status: 'active',
      revenue: 12000,
      investment: 350000,
      progress: 90,
      description: 'Borehole and distribution system for the local community members.',
      date: 'Est. Completion Nov 2023',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Group Projects</h1>
        <p className="text-muted-foreground mt-1">
          Monitor the progress and returns of our shared investments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-none shadow-sm flex flex-col h-full overflow-hidden transition-all hover:translate-y-[-4px]">
            <div className={`h-2 w-full ${project.status === 'active' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${project.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <Badge variant={project.status === 'active' ? 'default' : 'outline'} className={project.status === 'finished' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                  {project.status.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {project.status === 'active' ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {project.date}
              </div>
              
              {project.status === 'active' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Investment</p>
                  <p className="font-semibold">Ksh. {project.investment.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-emerald-600">Ksh. {project.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t pt-4">
              <Button variant="ghost" className="w-full gap-2 text-primary font-medium hover:bg-primary/5">
                <TrendingUp className="h-4 w-4" /> View Detailed Report
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 text-slate-50 border-none overflow-hidden">
        <div className="p-8 md:p-12 relative">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Suggest a New Project</h2>
            <p className="text-slate-300 mb-6">
              Have a viable business idea that the group could invest in? Submit a proposal for the committee to review.
            </p>
            <Button variant="secondary" className="font-bold">
              Submit Proposal
            </Button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/20 skew-x-[-20deg] translate-x-12 hidden md:block" />
        </div>
      </Card>
    </div>
  );
};

export default Projects;
