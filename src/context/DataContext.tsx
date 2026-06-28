import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Share, Loan, Penalty, User } from '../types';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'share' | 'loan' | 'penalty' | 'info';
  unread: boolean;
}

interface DataContextType {
  shares: Share[];
  allShares: Share[];
  loans: Loan[];
  allLoans: Loan[];
  penalties: Penalty[];
  allPenalties: Penalty[];
  notifications: Notification[];
  totalShares: number;
  allUsers: User[];
  addShare: (amount: number) => void;
  adminAddShare: (userId: string, amount: number) => void;
  updateShare: (shareId: string, amount: number) => void;
  deleteShare: (shareId: string) => void;
  applyForLoan: (type: 'short' | 'long', amount: number) => { success: boolean; message: string };
  adminApplyForLoan: (userId: string, type: 'short' | 'long', amount: number) => { success: boolean; message: string };
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string) => void;
  repayLoan: (loanId: string, amount: number) => void;
  addMember: (member: Omit<User, 'id' | 'avatar'>) => void;
  deleteMember: (userId: string) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  shares: 'pojim_shares',
  loans: 'pojim_loans',
  penalties: 'pojim_penalties',
  notifications: 'pojim_notifications',
  users: 'pojim_users',
};

const defaultShares: Share[] = [
  { id: 's1', userId: 'MEM001', date: '2023-01-15', amount: 1000 },
  { id: 's1-2', userId: 'MEM002', date: '2023-01-15', amount: 2000 },
  { id: 's1-3', userId: 'MEM003', date: '2023-01-15', amount: 1500 },
  { id: 's2', userId: 'MEM001', date: '2023-02-15', amount: 1000 },
  { id: 's3', userId: 'MEM001', date: '2023-03-15', amount: 1000 },
  { id: 's4', userId: 'MEM001', date: '2023-04-15', amount: 1500 },
  { id: 's5', userId: 'MEM001', date: '2023-05-15', amount: 1000 },
  { id: 's6', userId: 'MEM001', date: '2023-06-15', amount: 1000 },
  { id: 's7', userId: 'MEM001', date: '2023-07-15', amount: 1000 },
  { id: 's8', userId: 'MEM001', date: '2023-08-15', amount: 2000 },
  { id: 's9', userId: 'MEM001', date: '2023-09-15', amount: 1000 },
  { id: 's10', userId: 'MEM001', date: '2023-10-15', amount: 2000 },
];

const defaultLoans: Loan[] = [
  {
    id: 'l1',
    userId: 'MEM001',
    type: 'short',
    amount: 5000,
    interest: 1000,
    totalRepayable: 6000,
    remainingBalance: 6000,
    status: 'active',
    date: '2023-10-20',
    installments: 1,
    missedInstallments: 0,
  },
];

const defaultPenalties: Penalty[] = [
  { id: 'p1', userId: 'MEM001', description: 'Missed Short Term Repayment', amount: 300, date: '2023-08-20' },
  { id: 'p2', userId: 'MEM001', description: 'Late Attendance Meeting', amount: 200, date: '2023-10-15' },
];

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Monthly Share Contribution',
    message: 'Your October share contribution of Ksh. 2,000 has been verified.',
    time: '2 hours ago',
    type: 'share',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Loan Approval',
    message: 'Your Short Term Loan request for Ksh. 5,000 has been approved and disbursed.',
    time: '1 day ago',
    type: 'loan',
    unread: false,
  },
];

const defaultUsers: User[] = [
  { id: 'MEM001', name: 'John Doe', memberId: 'MEM001', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MEM001' },
  { id: 'MEM002', name: 'Jane Smith', memberId: 'MEM002', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MEM002' },
  { id: 'MEM003', name: 'Bob Johnson', memberId: 'MEM003', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MEM003' },
  { id: 'ADMIN001', name: 'System Treasurer', memberId: 'ADMIN001', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ADMIN001' },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'MEM001';

  const [shares, setShares] = useState<Share[]>(() => loadFromStorage(STORAGE_KEYS.shares, defaultShares));
  const [loans, setLoans] = useState<Loan[]>(() => loadFromStorage(STORAGE_KEYS.loans, defaultLoans));
  const [penalties, setPenalties] = useState<Penalty[]>(() => loadFromStorage(STORAGE_KEYS.penalties, defaultPenalties));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage(STORAGE_KEYS.notifications, defaultNotifications));
  const [users, setUsers] = useState<User[]>(() => loadFromStorage(STORAGE_KEYS.users, defaultUsers));

  // Persist to localStorage on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.shares, shares); }, [shares]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.loans, loans); }, [loans]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.penalties, penalties); }, [penalties]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.notifications, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.users, users); }, [users]);

  const userShares = shares.filter(s => s.userId === userId);
  const totalShares = userShares.reduce((sum, s) => sum + s.amount, 0);

  const addShare = useCallback((amount: number) => {
    const newShare: Share = {
      id: `s${Date.now()}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      amount,
    };
    setShares(prev => [...prev, newShare]);

    const newNotif: Notification = {
      id: `n${Date.now()}`,
      title: 'Contribution Recorded',
      message: `Your share contribution of Ksh. ${amount.toLocaleString()} has been recorded.`,
      time: 'Just now',
      type: 'share',
      unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, [userId]);

  const adminAddShare = useCallback((targetUserId: string, amount: number) => {
    const newShare: Share = {
      id: `s${Date.now()}`,
      userId: targetUserId,
      date: new Date().toISOString().split('T')[0],
      amount,
    };
    setShares(prev => [...prev, newShare]);
  }, []);

  const updateShare = useCallback((shareId: string, amount: number) => {
    setShares(prev => prev.map(s => s.id === shareId ? { ...s, amount } : s));
  }, []);

  const deleteShare = useCallback((shareId: string) => {
    setShares(prev => prev.filter(s => s.id !== shareId));
  }, []);

  const applyForLoanInternal = useCallback((targetUserId: string, type: 'short' | 'long', amount: number, isAdmin: boolean): { success: boolean; message: string } => {
    const targetUserShares = shares.filter(s => s.userId === targetUserId);
    const targetTotalShares = targetUserShares.reduce((sum, s) => sum + s.amount, 0);

    if (type === 'short') {
      if (amount < 1000) return { success: false, message: 'Minimum short term loan is Ksh. 1,000' };
      if (amount > 7000) return { success: false, message: 'Maximum short term loan is Ksh. 7,000' };
    } else {
      if (amount > targetTotalShares) return { success: false, message: 'Loan amount cannot exceed member total shares (Ksh. ' + targetTotalShares.toLocaleString() + ')' };
      if (amount < 10000) return { success: false, message: 'Minimum long term loan is Ksh. 10,000' };
    }

    const interest = type === 'short' 
      ? amount * 0.2 
      : (amount / 1000) * 200;

    const totalRepayable = type === 'short' ? amount + interest : amount + interest;
    const remainingBalance = totalRepayable;

    const newLoan: Loan = {
      id: `l${Date.now()}`,
      userId: targetUserId,
      type,
      amount,
      interest,
      totalRepayable,
      remainingBalance,
      status: isAdmin ? 'active' : 'pending' as any, // Cast to any because pending might not be in the original type yet
      date: new Date().toISOString().split('T')[0],
      installments: type === 'short' ? 1 : undefined,
      missedInstallments: 0,
    };

    setLoans(prev => [...prev, newLoan]);

    const newNotif: Notification = {
      id: `n${Date.now()}`,
      title: isAdmin ? 'Loan Approved' : 'Loan Application Submitted',
      message: isAdmin 
        ? `${targetUserId === userId ? 'Your' : 'A'} ${type === 'short' ? 'Short Term' : 'Long Term'} loan of Ksh. ${amount.toLocaleString()} has been approved.`
        : `Your ${type === 'short' ? 'Short Term' : 'Long Term'} loan application of Ksh. ${amount.toLocaleString()} has been submitted for approval.`,
      time: 'Just now',
      type: 'loan',
      unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { 
      success: true, 
      message: isAdmin 
        ? `Loan of Ksh. ${amount.toLocaleString()} approved successfully!`
        : `Loan application of Ksh. ${amount.toLocaleString()} submitted successfully!` 
    };
  }, [userId, shares]);

  const applyForLoan = useCallback((type: 'short' | 'long', amount: number) => {
    return applyForLoanInternal(userId, type, amount, false);
  }, [userId, applyForLoanInternal]);

  const adminApplyForLoan = useCallback((targetUserId: string, type: 'short' | 'long', amount: number) => {
    return applyForLoanInternal(targetUserId, type, amount, true);
  }, [applyForLoanInternal]);

  const approveLoan = useCallback((loanId: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, status: 'active' as const };
      }
      return loan;
    }));
    
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      const newNotif: Notification = {
        id: `n${Date.now()}`,
        title: 'Loan Approved',
        message: `Your ${loan.type === 'short' ? 'Short Term' : 'Long Term'} loan of Ksh. ${loan.amount.toLocaleString()} has been approved.`,
        time: 'Just now',
        type: 'loan',
        unread: true,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [loans]);

  const rejectLoan = useCallback((loanId: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, status: 'rejected' as any };
      }
      return loan;
    }));
  }, []);

  const repayLoan = useCallback((loanId: string, amount: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newBalance = Math.max(0, loan.remainingBalance - amount);
        return {
          ...loan,
          remainingBalance: newBalance,
          status: newBalance === 0 ? 'completed' as const : loan.status,
        };
      }
      return loan;
    }));

    const newNotif: Notification = {
      id: `n${Date.now()}`,
      title: 'Loan Repayment Recorded',
      message: `Payment of Ksh. ${amount.toLocaleString()} has been recorded.`,
      time: 'Just now',
      type: 'loan',
      unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const addMember = useCallback((member: Omit<User, 'id' | 'avatar'>) => {
    const newMember: User = {
      ...member,
      id: `MEM${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.memberId}`,
    };
    setUsers(prev => [...prev, newMember]);
  }, []);

  const deleteMember = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  return (
    <DataContext.Provider value={{
      shares: userShares,
      allShares: shares,
      loans: loans.filter(l => l.userId === userId),
      allLoans: loans,
      penalties: penalties.filter(p => p.userId === userId),
      allPenalties: penalties,
      notifications,
      totalShares,
      allUsers: users,
      addShare,
      adminAddShare,
      updateShare,
      deleteShare,
      applyForLoan,
      adminApplyForLoan,
      approveLoan,
      rejectLoan,
      repayLoan,
      addMember,
      deleteMember,
      markNotificationRead,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};