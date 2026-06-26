import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

export const EXPENSE_CATEGORIES: Record<string, string> = {
  'Food': '#10b981',
  'Rent': '#3b82f6',
  'Transport': '#f59e0b',
  'Entertainment': '#8b5cf6',
  'Utilities': '#ec4899',
  'Others': '#6b7280'
};

export const INCOME_CATEGORIES: Record<string, string> = {
  'Salary/Bonus': '#10b981',
  'Investment': '#3b82f6',
  'Gift': '#f59e0b',
  'Other Income': '#8b5cf6'
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [];

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (updater: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
}

export const useTransactions = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: DEFAULT_TRANSACTIONS,
      setTransactions: (updater) => set((state) => ({
        transactions: typeof updater === 'function' ? updater(state.transactions) : updater
      })),
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          ...state.transactions,
          {
            ...transaction,
            id: Date.now().toString(),
            date: new Date().toISOString()
          }
        ]
      })),
      removeTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'as_transactions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
