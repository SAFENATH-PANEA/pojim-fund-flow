export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  memberId: string;
  role: UserRole;
  avatar?: string;
}

export interface Share {
  id: string;
  userId: string;
  date: string;
  amount: number;
}

export interface Loan {
  id: string;
  userId: string;
  type: 'short' | 'long';
  amount: number;
  interest: number;
  totalRepayable: number;
  remainingBalance: number;
  status: 'active' | 'completed' | 'overdue' | 'pending' | 'rejected';
  date: string;
  installments?: number;
  missedInstallments?: number;
}

export interface Penalty {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'finished';
  revenue: number;
  description: string;
}
