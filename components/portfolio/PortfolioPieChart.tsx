"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio';  // adjust number of ../ based on folder depth
interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  description?: string;
}

const PortfolioPieChart = ({ data }: { data: PortfolioItem[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => `${value}%`}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PortfolioPieChart;
