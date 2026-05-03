'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { LedgerEntry } from '@/types/ledger';
import { calculateBalances } from '@/lib/calculations';
import LedgerTable from '@/components/LedgerTable';
import SummaryCharts from '@/components/SummaryCharts';

const getDefaultEntries = (): LedgerEntry[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `entry-${i}`,
    date: '',
    description: '',
    cashIn: 0,
    cashOut: 0,
    balance: 0,
  }));
};

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load data safely
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('ledgerEntries');
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch {
          setEntries(getDefaultEntries());
        }
      } else {
        setEntries(getDefaultEntries());
      }
      setIsMounted(true);
    };

    setTimeout(loadData, 0);
  }, []);

  // Save data
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('ledgerEntries', JSON.stringify(entries));
    }
  }, [entries, isMounted]);

  const calculatedEntries = useMemo(() => {
    return calculateBalances(entries);
  }, [entries]);

  const handleUpdate = (
    id: string,
    field: keyof Omit<LedgerEntry, 'id' | 'balance'>,
    value: string | number
  ) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleAddEntry = () => {
    const newEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      date: '',
      description: '',
      cashIn: 0,
      cashOut: 0,
      balance: 0,
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure?')) {
      setEntries(getDefaultEntries());
    }
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);

    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups.');
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
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #666; padding: 8px; }
          th { background: #f3f4f6; }
          tr:nth-child(even) { background: #f9fafb; }
        </style>
      </head>
      <body>
        <h1>Monthly Cash Ledger System</h1>
        ${content}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      setIsExporting(false);
    }, 300);
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return <div className="p-4 text-center text-sm sm:text-base">Loading ledger...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6 lg:px-8">
      <div className="w-full max-w-[100vw] sm:max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight"
            style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
            Monthly Cash Ledger
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-4 rounded min-h-[44px] w-full sm:w-auto text-sm sm:text-base transition-colors">
              Clear
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-semibold py-3 px-5 rounded disabled:opacity-50 min-h-[44px] w-full sm:w-auto text-sm sm:text-base transition-colors"
            >
              {isExporting ? 'Preparing PDF...' : 'Download PDF Copy'}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div ref={printRef} className="space-y-6 sm:space-y-8">
          <LedgerTable
            entries={calculatedEntries}
            onUpdate={handleUpdate}
            onAdd={handleAddEntry}
          />

          <SummaryCharts entries={calculatedEntries} />
        </div>

        <div className="mt-6 sm:mt-8 text-center text-purple-600 font-semibold text-xs sm:text-sm md:text-base"
        style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
          Designed By : Azmat Ali
        </div>
      </div>
    </div>
  );
}
