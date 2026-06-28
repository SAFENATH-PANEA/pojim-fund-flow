import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  CircleDollarSign, 
  TrendingUp, 
  HandCoins, 
  CheckCircle2, 
  AlertTriangle,
  Scale
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';

const FinancialSummary: React.FC = () => {
  const summaryItems = [
    { title: 'Total Group Members', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Group Shares', value: 'Ksh. 542,000', icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Interest Generated', value: 'Ksh. 108,400', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Total Active Loans', value: '12', icon: HandCoins, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Finished Loans', value: '34', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Penalties', value: 'Ksh. 12,300', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Summary</h1>
        <p className="text-muted-foreground mt-1">
          Complete transparent overview of the group's financial health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryItems.map((item, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <div className={`${item.bg} ${item.color} p-2 rounded-lg`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Group Net Worth</CardTitle>
          <Scale className="h-6 w-6 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black mb-2">Ksh. 865,400</div>
          <p className="text-primary-foreground/70 text-sm">
            Total assets including cash at hand, active loans, and project investments.
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Fund Category</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead className="text-right pr-6">Current Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium pl-6">Main Share Pool</TableCell>
                <TableCell>60%</TableCell>
                <TableCell className="text-right pr-6">Ksh. 542,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6">Emergency Fund</TableCell>
                <TableCell>10%</TableCell>
                <TableCell className="text-right pr-6">Ksh. 86,540</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6">Project Investment Fund</TableCell>
                <TableCell>25%</TableCell>
                <TableCell className="text-right pr-6">Ksh. 216,350</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium pl-6">Administrative Fund</TableCell>
                <TableCell>5%</TableCell>
                <TableCell className="text-right pr-6">Ksh. 43,270</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
