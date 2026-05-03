'use client';

import React, { useEffect, useState } from 'react';
import { LedgerEntry } from '@/types/ledger';
import LedgerRow from './LedgerRow';
import AddEntryButton from './AddEntryButton';

interface LedgerTableProps {
  entries: LedgerEntry[];
  onUpdate: (id: string, field: keyof Omit<LedgerEntry, 'id' | 'balance'>, value: string | number) => void;
  onAdd: () => void;
}

const LedgerTable: React.FC<LedgerTableProps> = ({ entries, onUpdate, onAdd }) => {
  const [isTiny, setIsTiny] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTiny(window.innerWidth <= 370);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalCashIn = entries.reduce((sum, e) => sum + (e.cashIn || 0), 0);
  const totalCashOut = entries.reduce((sum, e) => sum + (e.cashOut || 0), 0);
  const netBalance = totalCashIn - totalCashOut;

  const headerStyle = isTiny ? {
    fontSize: '11px',
    padding: '6px 8px',
    fontWeight: 'bold',
  } : {};

  const totalsStyle = isTiny ? {
    fontSize: '11px',
  } : {};

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="mb-4">
        <AddEntryButton onAdd={onAdd} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[600px] sm:min-w-full bg-white border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-600 text-left text-gray-800" 
                 style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
                Date</th>
              <th className="border border-gray-600 text-left text-gray-800" 
                 style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
                Description</th>
              <th className="border border-gray-600 text-left text-green-600" 
                 style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
                Cash In</th>
              <th className="border border-gray-600 text-left text-red-600" 
                 style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
                Cash Out</th>
              <th className="border border-gray-600 text-left text-blue-600" 
                 style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
                Balance</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <LedgerRow key={entry.id} entry={entry} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800" 
           style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
          Totals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded border border-green-300">
            <p className="text-gray-800 font-semibold text-sm" 
               style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
              Total Cash In</p>
            <p className="text-3xl font-bold text-green-600 mt-2" style={totalsStyle}>{totalCashIn.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-4 rounded border border-red-300">
            <p className="text-gray-800 font-semibold text-sm" 
               style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
              Total Cash Out</p>
            <p className="text-3xl font-bold text-red-600 mt-2" style={totalsStyle}>{totalCashOut.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded border border-blue-300">
            <p className="text-gray-800 font-semibold text-sm" 
               style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
              Net Balance</p>
            <p className="text-3xl font-bold text-blue-600 mt-2" style={totalsStyle}>{netBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerTable;