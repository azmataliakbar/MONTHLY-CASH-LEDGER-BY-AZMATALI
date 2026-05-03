import { LedgerEntry } from '@/types/ledger';

export function calculateBalances(entries: LedgerEntry[]): LedgerEntry[] {
  let runningBalance = 0;
  return entries.map(entry => {
    runningBalance += (entry.cashIn || 0) - (entry.cashOut || 0);
    return {
      ...entry,
      balance: runningBalance,
    };
  });
}