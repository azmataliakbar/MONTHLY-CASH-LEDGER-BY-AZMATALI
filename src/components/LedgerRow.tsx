'use client';

import React, { useEffect, useState } from 'react';
import { LedgerEntry } from '@/types/ledger';

interface LedgerRowProps {
  entry: LedgerEntry;
  onUpdate: (id: string, field: keyof Omit<LedgerEntry, 'id' | 'balance'>, value: string | number) => void;
}

const LedgerRow: React.FC<LedgerRowProps> = ({ entry, onUpdate }) => {
  const [isTiny, setIsTiny] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTiny(window.innerWidth <= 370);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChange = (field: keyof Omit<LedgerEntry, 'id' | 'balance'>, value: string) => {
    if (field === 'cashIn' || field === 'cashOut') {
      const numValue = parseFloat(value) || 0;
      onUpdate(entry.id, field, numValue);
    } else {
      onUpdate(entry.id, field, value);
    }
  };

  // Base style for all cells
  const baseStyle = isTiny ? {
    fontSize: '11px',
    padding: '4px 6px',
  } : {};

  // Input specific style
  const inputStyle = isTiny ? {
    fontSize: '11px',
    padding: '4px 6px',
    width: '100%',
    minWidth: '60px',
  } : {};

  return (
    <tr className="even:bg-gray-50">
      <td className="border border-gray-600" style={baseStyle}>
        <input
          type="date"
          value={entry.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={inputStyle}
        />
      </td>
      <td className="border border-gray-600" style={baseStyle}>
        <input
          type="text"
          value={entry.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={inputStyle}
          placeholder="Enter description"
        />
      </td>
      <td className="border border-gray-600" style={{ ...baseStyle, color: '#22c55e' }}>
        <input
          type="number"
          value={entry.cashIn || ''}
          onChange={(e) => handleChange('cashIn', e.target.value)}
          className="w-full border border-gray-300 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{ ...inputStyle, color: '#22c55e' }}
          placeholder="0"
          min="0"
        />
      </td>
      <td className="border border-gray-600" style={{ ...baseStyle, color: '#ef4444' }}>
        <input
          type="number"
          value={entry.cashOut || ''}
          onChange={(e) => handleChange('cashOut', e.target.value)}
          className="w-full border border-gray-300 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          style={{ ...inputStyle, color: '#ef4444' }}
          placeholder="0"
          min="0"
        />
      </td>
      <td className="border border-gray-600 font-semibold" style={{ ...baseStyle, color: '#3b82f6' }}>
        {entry.balance.toFixed(2)}
      </td>
    </tr>
  );
};

export default LedgerRow;