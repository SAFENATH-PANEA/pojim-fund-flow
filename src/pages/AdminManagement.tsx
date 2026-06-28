import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  UserPlus, 
  CreditCard, 
  Landmark, 
  CheckCircle, 
  XCircle, 
  Edit2, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

const AdminManagement: React.FC = () => {
  const { 
    allUsers, 
    allShares, 
    allLoans, 
    adminAddShare, 
    updateShare, 
    deleteShare, 
    adminApplyForLoan, 
    approveLoan, 
    rejectLoan, 
    addMember, 
    deleteMember 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editShareModalOpen, setEditShareModalOpen] = useState(false);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedShareId, setSelectedShareId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loanType, setLoanType] = useState<'short' | 'long'>('short');
  
  // New Member state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');

  const filteredMembers = allUsers.filter(user => 
    user.role === 'member' && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.memberId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUserStats = (userId: string) => {
    const userShares = allShares.filter(s => s.userId === userId);
    const totalShares = userShares.reduce((sum, s) => sum + s.amount, 0);
    const userLoans = allLoans.filter(l => l.userId === userId && l.status === 'active');
    const totalLoans = userLoans.reduce((sum, l) => sum + l.remainingBalance, 0);
    return { totalShares, totalLoans };
  };

  const handleRecordShare = () => {
    if (!selectedUserId || !amount) return;
    adminAddShare(selectedUserId, parseFloat(amount));
    toast.success('Share contribution recorded successfully');
    setShareModalOpen(false);
    setAmount('');
  };

  const handleUpdateShare = () => {
    if (!selectedShareId || !amount) return;
    updateShare(selectedShareId, parseFloat(amount));
    toast.success('Share contribution updated successfully');
    setEditShareModalOpen(false);
    setAmount('');
  };

  const handleDeleteShare = (shareId: string) => {
    if (confirm('Are you sure you want to delete this contribution?')) {
      deleteShare(shareId);
      toast.success('Share contribution deleted');
    }
  };

  const handleRecordLoan = () => {
    if (!selectedUserId || !amount) return;
    const result = adminApplyForLoan(selectedUserId, loanType, parseFloat(amount));
    if (result.success) {
      toast.success(result.message);
      setLoanModalOpen(false);
      setAmount('');
    } else {
      toast.error(result.message);
    }
  };

  const handleAdmitMember = () => {
    if (!newMemberName || !newMemberId) {
      toast.error('Please fill in all fields');
      return;
    }
    addMember({ name: newMemberName, memberId: newMemberId, role: 'member' });
    toast.success(`Member ${newMemberName} admitted successfully`);
    setMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberId('');
  };

  const handleDeleteMember = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to remove member ${name}? This will not delete their shares/loans history but they will no longer appear in the directory.`)) {
      deleteMember(userId);
      toast.success('Member removed');
    }
  };

  const selectedUser = allUsers.find(u => u.id === selectedUserId);
  const selectedShare = allShares.find(s => s.id === selectedShareId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">Manage members, record contributions, and process loans.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button onClick={() => setMemberModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Admit Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="shares">Shares</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Member Directory</CardTitle>
                  <CardDescription>All registered members of the group.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search name or ID..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Total Shares</TableHead>
                    <TableHead>Active Loans</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const stats = getUserStats(member.id);
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.memberId}</TableCell>
                        <TableCell>Ksh. {stats.totalShares.toLocaleString()}</TableCell>
                        <TableCell>Ksh. {stats.totalLoans.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              title="Record Share"
                              onClick={() => {
                                setSelectedUserId(member.id);
                                setAmount('');
                                setShareModalOpen(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              title="Issue Loan"
                              onClick={() => {
                                setSelectedUserId(member.id);
                                setAmount('');
                                setLoanModalOpen(true);
                              }}
                            >
                              <Landmark className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              title="Remove Member"
                              onClick={() => handleDeleteMember(member.id, member.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shares" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Contributions</CardTitle>
              <CardDescription>Manage member share records.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...allShares].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((share) => {
                    const member = allUsers.find(u => u.id === share.userId);
                    return (
                      <TableRow key={share.id}>
                        <TableCell>{share.date}</TableCell>
                        <TableCell>{member?.name || 'Unknown'}</TableCell>
                        <TableCell>Ksh. {share.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedShareId(share.id);
                                setAmount(share.amount.toString());
                                setEditShareModalOpen(true);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteShare(share.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Management</CardTitle>
              <CardDescription>Review applications and track active loans.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...allLoans].sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                  }).map((loan) => {
                    const member = allUsers.find(u => u.id === loan.userId);
                    return (
                      <TableRow key={loan.id}>
                        <TableCell>{member?.name || 'Unknown'}</TableCell>
                        <TableCell className="capitalize">{loan.type} Term</TableCell>
                        <TableCell>Ksh. {loan.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            loan.status === 'active' ? 'default' : 
                            loan.status === 'pending' ? 'outline' : 
                            loan.status === 'completed' ? 'secondary' : 
                            'destructive'
                          }>
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {loan.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => {
                                  approveLoan(loan.id);
                                  toast.success('Loan approved');
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  rejectLoan(loan.id);
                                  toast.error('Loan rejected');
                                }}
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                          {loan.status === 'active' && (
                            <span className="text-xs text-muted-foreground">Repayment in progress</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Fund Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">Ksh. {allShares.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">Ksh. {allLoans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.remainingBalance, 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{allUsers.filter(u => u.role === 'member').length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Admit Member Modal */}
      <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admit New Member</DialogTitle>
            <DialogDescription>
              Add a new person to the self-help group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                placeholder="Jane Doe" 
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Member ID / Phone</label>
              <Input 
                placeholder="MEM004" 
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdmitMember}>Admit Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record/Edit Share Modal */}
      <Dialog open={shareModalOpen || editShareModalOpen} onOpenChange={(open) => {
        if (!open) {
          setShareModalOpen(false);
          setEditShareModalOpen(false);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editShareModalOpen ? 'Edit Contribution' : 'Record Share Contribution'}</DialogTitle>
            <DialogDescription>
              {editShareModalOpen 
                ? `Update the contribution amount for ${allUsers.find(u => u.id === selectedShare?.userId)?.name}.`
                : `Record a manual share contribution for ${selectedUser?.name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (Ksh.)</label>
              <Input 
                type="number" 
                placeholder="2000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShareModalOpen(false);
              setEditShareModalOpen(false);
            }}>Cancel</Button>
            <Button onClick={editShareModalOpen ? handleUpdateShare : handleRecordShare}>
              {editShareModalOpen ? 'Update' : 'Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Loan Modal */}
      <Dialog open={loanModalOpen} onOpenChange={setLoanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue New Loan</DialogTitle>
            <DialogDescription>
              Process a new loan application for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loan Type</label>
              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant={loanType === 'short' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoanType('short')}
                >
                  Short Term (1mo)
                </Button>
                <Button 
                  type="button"
                  variant={loanType === 'long' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setLoanType('long')}
                >
                  Long Term (3mo+)
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (Ksh.)</label>
              <Input 
                type="number" 
                placeholder="5000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
              <p className="font-semibold">Member Info:</p>
              <p>Current Shares: <span className="font-bold">Ksh. {selectedUserId ? getUserStats(selectedUserId).totalShares.toLocaleString() : 0}</span></p>
              <p>Maximum Long Term: <span className="font-bold">Ksh. {selectedUserId ? getUserStats(selectedUserId).totalShares.toLocaleString() : 0}</span></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoanModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordLoan}>Issue Loan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;