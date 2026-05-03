'use client';

import React, { useRef, useState, useMemo } from 'react';
import { LedgerEntry } from '@/types/ledger';
import { calculateBalances } from '@/lib/calculations';
import LedgerTable from '@/components/LedgerTable';
import SummaryCharts from '@/components/SummaryCharts';

const getInitialEntries = (): LedgerEntry[] => {
  // Try to load from localStorage on client side
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ledgerEntries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved entries:', e);
      }
    }
  }
  
  // Return default empty entries
  const initialEntries: LedgerEntry[] = [];
  for (let i = 0; i < 30; i++) {
    initialEntries.push({
      id: `entry-${i}`,
      date: '',
      description: '',
      cashIn: 0,
      cashOut: 0,
      balance: 0,
    });
  }
  return initialEntries;
};

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [entries, setEntries] = useState<LedgerEntry[]>(getInitialEntries);

  const calculatedEntries = useMemo(() => calculateBalances(entries), [entries]);

  // Save to localStorage whenever entries change
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('ledgerEntries', JSON.stringify(entries));
  //   }
  // }, [entries]);

  const handleUpdate = (id: string, field: keyof Omit<LedgerEntry, 'id' | 'balance'>, value: string | number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleAddEntry = () => {
    const newId = `entry-${Date.now()}`;
    const newEntry: LedgerEntry = {
      id: newId,
      date: '',
      description: '',
      cashIn: 0,
      cashOut: 0,
      balance: 0,
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all entries? This cannot be undone.')) {
      const initialEntries: LedgerEntry[] = [];
      for (let i = 0; i < 30; i++) {
        initialEntries.push({
          id: `entry-${i}`,
          date: '',
          description: '',
          cashIn: 0,
          cashOut: 0,
          balance: 0,
        });
      }
      setEntries(initialEntries);
    }
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    
    // Use browser's native print functionality
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
      alert('Failed to open print window. Please check your browser settings.');
      setIsExporting(false);
      return;
    }

    const content = printRef.current?.innerHTML || '';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Monthly Cash Ledger</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; padding: 20px; }
          h1, h2, h3 { color: #000; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #666; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .green { color: #22c55e; }
          .red { color: #ef4444; }
          .blue { color: #3b82f6; }
          .purple { color: #a855f7; }
          .totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .card { background: #f3f4f6; padding: 15px; border-radius: 8px; }
          .footer { text-align: center; margin-top: 40px; color: #a855f7; font-weight: bold; }
          .chart-container { margin: 30px 0; page-break-inside: avoid; }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Monthly Cash Ledger System</h1>
        ${content}
        <div class="footer">Designed By : AzmatAli</div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      setIsExporting(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex flex-col gap-4 items-center sm:items-start sm:flex-row sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Monthly Cash Ledger System</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="rounded bg-purple-700 px-5 py-3 text-white shadow hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? 'Preparing PDF...' : 'Download PDF Copy'}
            </button>
          </div>
        </div>
        <div ref={printRef} className="space-y-8">
          <LedgerTable
            entries={calculatedEntries}
            onUpdate={handleUpdate}
            onAdd={handleAddEntry}
          />
          <SummaryCharts entries={calculatedEntries} />
        </div>
        <div className="mt-8 text-center text-purple-700 font-semibold">
          Designed By : Azmat Ali
        </div>
      </div>
    </div>
  );
}
