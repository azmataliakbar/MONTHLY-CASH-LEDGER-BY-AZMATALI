import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LedgerEntry } from '@/types/ledger';

interface SummaryChartsProps {
  entries: LedgerEntry[];
}

const SummaryCharts: React.FC<SummaryChartsProps> = ({ entries }) => {
  const totalReceived = entries.reduce((sum, e) => sum + (e.cashIn || 0), 0);
  const totalSpent = entries.reduce((sum, e) => sum + (e.cashOut || 0), 0);
  const netBalance = totalReceived - totalSpent;

  const barData = entries.map(e => ({
    date: e.date,
    received: e.cashIn || 0,
    spent: e.cashOut || 0,
    balance: e.balance,
  }));

  const pieData = [
    { name: 'Received', value: totalReceived, color: '#22c55e' },
    { name: 'Spent', value: totalSpent, color: '#ef4444' },
  ];

  if (netBalance > 0) {
    pieData.push({ name: 'Remaining Balance', value: netBalance, color: '#3b82f6' });
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-black" 
        style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
          Financial Summary Charts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black"
            style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
            Bar Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData} barCategoryGap="5%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="received" fill="#22c55e" name="Received" stroke="#22c55e" strokeWidth={2} />
              <Bar dataKey="spent" fill="#ef4444" name="Spent" stroke="#ef4444" strokeWidth={2} />
              <Bar dataKey="balance" fill="#3b82f6" name="Balance" stroke="#3b82f6" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black"
            style={{ textShadow: '1px 1px 0px #ccc, 2px 2px 0px #ccc, 3px 3px 0px #bbb, 4px 4px 0px #aaa' }}>
            Pie Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                outerRadius="60%"
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SummaryCharts;