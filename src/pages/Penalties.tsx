import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useData } from '../context/DataContext';

const Penalties: React.FC = () => {
  const { penalties } = useData();
  
  const unpaidPenalties = penalties.filter((_, idx) => idx === penalties.length - 1); // Last one is unpaid in default data
  const totalUnpaid = penalties.reduce((sum, p) => {
    // Simple logic: first penalty is paid, rest are unpaid for demo
    return sum + (penalties.indexOf(p) > 0 ? p.amount : 0);
  }, 0);

  const penaltiesWithStatus = penalties.map((penalty, idx) => ({
    ...penalty,
    status: idx === 0 ? 'paid' : 'unpaid',
    displayId: idx + 1,
  })).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Penalties</h1>
        <p className="text-muted-foreground mt-1">
          Tracking of all fines and penalties charged to your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-destructive/5 border-destructive/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Unpaid Penalties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">Ksh. {totalUnpaid.toLocaleString()}</div>
            <p className="text-xs mt-1 text-muted-foreground">Due as soon as possible</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Info className="h-4 w-4" /> Penalty Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-800 leading-relaxed">
              Standard penalty for missed installments is Ksh. 300. Other behavioral penalties are decided by the committee.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Penalty History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penaltiesWithStatus.map((penalty) => (
                <TableRow key={penalty.id}>
                  <TableCell className="font-medium">{penalty.displayId}</TableCell>
                  <TableCell>{new Date(penalty.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>{penalty.description}</TableCell>
                  <TableCell className="text-right font-semibold">Ksh. {penalty.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={penalty.status === 'paid' ? 'outline' : 'destructive'} className={penalty.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                      {penalty.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Penalties;
