import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  HandCoins, 
  Info, 
  Plus, 
  Calendar, 
  ArrowUpRight,
  ShieldAlert,
  History,
  Clock
} from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

const Loans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loanType, setLoanType] = useState<'short' | 'long' | ''>('');
  const [loanAmount, setLoanAmount] = useState('');
  const { loans, totalShares, applyForLoan, repayLoan } = useData();

  const longTermRanges = [
    { range: '10,000 - 14,999', months: 4 },
    { range: '15,000 - 19,999', months: 6 },
    { range: '20,000 - 24,999', months: 6 },
    { range: '25,000 - 29,999', months: 7 },
    { range: '30,000 - 34,999', months: 7 },
    { range: '35,000 - 39,999', months: 7 },
    { range: '40,000 - 44,999', months: 8 },
    { range: '45,000 - 49,999', months: 8 },
    { range: '50,000 - 54,999', months: 10 },
  ];

  const activeShortLoan = loans.find(l => l.type === 'short' && l.status === 'active');
  const activeLongLoan = loans.find(l => l.type === 'long' && l.status === 'active');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const completedLoans = loans.filter(l => l.status === 'completed');

  const handleApplyLoan = () => {
    if (!loanType) {
      toast.error('Please select a loan type');
      return;
    }
    const amount = parseInt(loanAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const result = applyForLoan(loanType as 'short' | 'long', amount);
    if (result.success) {
      toast.success(result.message);
      setDialogOpen(false);
      setLoanType('');
      setLoanAmount('');
    } else {
      toast.error(result.message);
    }
  };

  const handleRepay = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      repayLoan(loanId, loan.remainingBalance);
      toast.success(`Loan repaid successfully! Ksh. ${loan.remainingBalance.toLocaleString()} paid.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans Management</h1>
          <p className="text-muted-foreground mt-1">
            Apply for and track your short-term and long-term loans.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Loan Application</DialogTitle>
                <DialogDescription>
                  Select the type of loan and enter the amount you wish to borrow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="loan-type">Loan Type</Label>
                  <Select value={loanType} onValueChange={(v) => setLoanType(v as 'short' | 'long')}>
                    <SelectTrigger id="loan-type">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short Term (1 Month)</SelectItem>
                      <SelectItem value="long">Long Term (Installments)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (Ksh)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="Enter amount" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">Loan Information:</p>
                    <ul className="list-disc list-inside">
                      <li>Short term: 20% interest deducted upfront.</li>
                      <li>Long term: 20% interest added to total.</li>
                      <li>Limit: Cannot exceed your current shares (Ksh. {totalShares.toLocaleString()}).</li>
                    </ul>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleApplyLoan}>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between bg-muted/30 p-1 rounded-lg w-fit overflow-x-auto max-w-full">
          <TabsList className="bg-transparent border-none h-auto py-1">
            <TabsTrigger value="active" className="gap-2 whitespace-nowrap">
              <HandCoins className="h-4 w-4" /> My Loans
            </TabsTrigger>
            <TabsTrigger value="short-rules" className="gap-2 whitespace-nowrap">
              <ShieldAlert className="h-4 w-4" /> Short Term Rules
            </TabsTrigger>
            <TabsTrigger value="long-rules" className="gap-2 whitespace-nowrap">
              <Calendar className="h-4 w-4" /> Long Term Rules
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 whitespace-nowrap">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="space-y-6">
          {pendingLoans.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> Pending Applications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingLoans.map(loan => (
                  <Card key={loan.id} className="border-dashed bg-muted/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-bold">{loan.type === 'short' ? 'Short Term' : 'Long Term'}</CardTitle>
                        <Badge variant="outline" className="animate-pulse">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">Ksh. {loan.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">Applied on {loan.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Short Term Loan */}
            {activeShortLoan ? (
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="bg-emerald-600 h-2 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Short Term Loan</CardTitle>
                      <CardDescription>Repayment due in 1 month</CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Borrowed Amount</p>
                      <p className="font-bold text-lg">Ksh. {activeShortLoan.amount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Interest Paid (20%)</p>
                      <p className="font-bold text-lg text-emerald-600">Ksh. {activeShortLoan.interest.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Repayment Status</span>
                      <span>Ksh. {activeShortLoan.remainingBalance.toLocaleString()} to pay</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${((activeShortLoan.totalRepayable - activeShortLoan.remainingBalance) / activeShortLoan.totalRepayable) * 100}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 gap-3 border-t">
                  <Button className="w-full" variant="outline">Renew Loan</Button>
                  <Button className="w-full" onClick={() => handleRepay(activeShortLoan.id)}>Repay Now</Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-none shadow-sm overflow-hidden opacity-60">
                <div className="bg-emerald-600 h-2 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Short Term Loan</CardTitle>
                      <CardDescription>No active short term loan</CardDescription>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <HandCoins className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    You don't have an active short-term loan at the moment.
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t">
                  <Button className="w-full" variant="ghost" onClick={() => {
                    setLoanType('short');
                    setDialogOpen(true);
                  }}>Apply Now</Button>
                </CardFooter>
              </Card>
            )}

            {/* Active Long Term Loan */}
            {activeLongLoan ? (
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="bg-blue-600 h-2 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Long Term Loan</CardTitle>
                      <CardDescription>Installment repayment in progress</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Borrowed Amount</p>
                      <p className="font-bold text-lg">Ksh. {activeLongLoan.amount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground mb-1">Total Interest</p>
                      <p className="font-bold text-lg text-blue-600">Ksh. {activeLongLoan.interest.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Repayment Status</span>
                      <span>Ksh. {activeLongLoan.remainingBalance.toLocaleString()} remaining</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${((activeLongLoan.totalRepayable - activeLongLoan.remainingBalance) / activeLongLoan.totalRepayable) * 100}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t">
                  <Button className="w-full" onClick={() => handleRepay(activeLongLoan.id)}>Make Installment</Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-none shadow-sm overflow-hidden opacity-60">
                <div className="bg-blue-600 h-2 w-full" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Long Term Loan</CardTitle>
                      <CardDescription>No active long term loan</CardDescription>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    You don't have an active long-term loan at the moment.
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t">
                  <Button className="w-full" variant="ghost" onClick={() => {
                    setLoanType('long');
                    setDialogOpen(true);
                  }}>Apply Now</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="short-rules">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Short Term Loan Regulations</CardTitle>
              <CardDescription>Loans for quick financial needs with fast turnover.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</div>
                    Limits & Interest
                  </h4>
                  <ul className="space-y-2 list-none pl-0">
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">MIN</Badge> <span>Ksh. 1,000</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary">MAX</Badge> <span>Ksh. 7,000</span>
                    </li>
                    <li className="bg-muted p-3 rounded-lg border-l-4 border-primary">
                      <span className="font-semibold">20% Interest</span> deducted upfront before disbursement.
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</div>
                    Repayment & Renewals
                  </h4>
                  <ul className="space-y-2 list-none pl-0">
                    <li>1 Month Repayment Period.</li>
                    <li>Up to <span className="font-bold">2 Renewals</span> allowed.</li>
                    <li>Renewal requires paying the interest again.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <div className="flex gap-3">
                  <ShieldAlert className="h-6 w-6 shrink-0" />
                  <div>
                    <h5 className="font-bold">Default Penalty</h5>
                    <p className="text-sm">
                      Reaching the 3rd month without full repayment triggers a mandatory "Pay in Full" rule. 
                      Subsequent borrowing limits will be reduced to 50% of the previous amount.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="long-rules">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Long Term Loan Schedule</CardTitle>
              <CardDescription>Installment-based loans with share-locked limits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">Key Rules</h4>
                    <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
                      <li>Loan approved only if <span className="text-foreground font-medium">shares allow</span>.</li>
                      <li>Max amount <span className="text-foreground font-medium">cannot exceed total member shares</span>.</li>
                      <li>Interest: <span className="text-foreground font-medium">20% per 1,000</span> (added to total balance).</li>
                      <li>Full amount disbursed without deduction.</li>
                      <li>Missed installment: <span className="text-destructive font-bold">Ksh. 300 penalty</span> per month.</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-dashed">
                    <h4 className="font-bold mb-2">Example Calculation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Borrowed:</span> <span>Ksh. 20,000</span></div>
                      <div className="flex justify-between text-emerald-600"><span>Interest (20%):</span> <span>+Ksh. 4,000</span></div>
                      <div className="flex justify-between border-t pt-1 font-bold"><span>Total Repayable:</span> <span>Ksh. 24,000</span></div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>Period:</span> <span>6 Months</span></div>
                      <div className="flex justify-between font-medium"><span>Installment:</span> <span>Ksh. 4,000/mo</span></div>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan Amount (Ksh)</TableHead>
                      <TableHead>Repayment Period</TableHead>
                      <TableHead className="text-right">Interest Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {longTermRanges.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{item.range}</TableCell>
                        <TableCell>{item.months} Months</TableCell>
                        <TableCell className="text-right text-muted-foreground">20% per 1000</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          {completedLoans.length > 0 ? (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Completed Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.type === 'short' ? 'Short Term' : 'Long Term'}</TableCell>
                        <TableCell>Ksh. {loan.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(loan.date).toLocaleDateString('en-GB')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Loan History</h3>
                <p className="text-muted-foreground max-sm mt-2 mt-2">
                  When you complete loans, they will appear here for your records.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loans;