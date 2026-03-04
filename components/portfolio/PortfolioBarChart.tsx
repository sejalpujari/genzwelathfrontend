"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio'; // Adjust path if needed

interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  description?: string;
}

const PortfolioBarChart = ({ data }: { data: PortfolioItem[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} fontSize={12} />
        <YAxis label={{ value: 'Allocation (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          formatter={(value: any) => `${value}%`}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PortfolioBarChart;
