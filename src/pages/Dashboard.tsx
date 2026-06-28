import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  CircleDollarSign, 
  HandCoins, 
  AlertTriangle, 
  TrendingUp,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { totalShares, loans, penalties } = useData();
  const isAdmin = user?.role === 'admin';
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

  const memberStats = [
    { title: 'My Total Shares', value: `Ksh. ${totalShares.toLocaleString()}`, icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Loans', value: `${activeLoans.length}`, icon: HandCoins, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Penalties', value: `Ksh. ${totalPenalties.toLocaleString()}`, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const adminStats = [
    { title: 'Total Members', value: '45', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Group Shares', value: 'Ksh. 540,000', icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Active Loans', value: '12', icon: HandCoins, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Net Worth', value: 'Ksh. 850,000', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const stats = isAdmin ? adminStats : memberStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin 
            ? "Here's an overview of the Pojim Self Help Group performance." 
            : "Here's an overview of your contributions and active services."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Share Contribution</p>
                    <p className="text-xs text-muted-foreground">October {20 - i}, 2023</p>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">
                    +Ksh. 1,000
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeLoans.length > 0 ? (
                activeLoans.map((loan) => (
                  <div key={loan.id} className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <HandCoins className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-900 truncate">
                        Loan Repayment ({loan.type === 'short' ? 'Short Term' : 'Long Term'})
                      </p>
                      <p className="text-xs text-amber-700">
                        {loan.type === 'short' ? 'Due in 1 month' : 'Installment due'}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-amber-900">
                      Ksh. {loan.remainingBalance.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Monthly Share Target</p>
                    <p className="text-xs text-muted-foreground">Due by Nov 30, 2023</p>
                  </div>
                  <div className="text-sm font-semibold">
                    Ksh. 1,000
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
