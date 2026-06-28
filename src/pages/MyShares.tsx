import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CircleDollarSign, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

const MyShares: React.FC = () => {
  const { shares, totalShares, addShare } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const sharesWithTotal = [...shares].reverse().map((share, idx) => {
    const totalUpToHere = shares.reduce((sum, s) => {
      return new Date(s.date) <= new Date(share.date) ? sum + s.amount : sum;
    }, 0);
    return { ...share, total: totalUpToHere, displayId: shares.length - idx };
  });

  const handleAddContribution = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    addShare(numAmount);
    toast.success(`Contribution of Ksh. ${numAmount.toLocaleString()} added successfully!`);
    setAmount('');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shares</h1>
          <p className="text-muted-foreground mt-1">
            History of your monthly contributions and cumulative shares.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Contribution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Share Contribution</DialogTitle>
              <DialogDescription>
                Record a new share contribution to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="share-amount">Amount (Ksh)</Label>
                <Input 
                  id="share-amount" 
                  type="number" 
                  placeholder="Enter amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddContribution}>Add Contribution</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 text-primary-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ksh. {totalShares.toLocaleString()}</div>
            <p className="text-xs mt-1 opacity-70">{shares.length} contributions made</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{shares.length}</div>
            <p className="text-xs mt-1 text-muted-foreground">Active for {shares.length} months</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ksh. {shares.length > 0 ? Math.round(totalShares / shares.length).toLocaleString() : '0'}</div>
            <p className="text-xs mt-1 text-emerald-600 font-medium">Consistent saver</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            Contribution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">Sr No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Share Amount</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sharesWithTotal.map((share) => (
                <TableRow key={share.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{share.displayId}</TableCell>
                  <TableCell>{new Date(share.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>Ksh. {share.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">Ksh. {share.total.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Verified
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

export default MyShares;
