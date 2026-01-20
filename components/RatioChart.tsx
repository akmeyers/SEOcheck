import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RatioChartProps {
  textRatio: number;
}

const RatioChart: React.FC<RatioChartProps> = ({ textRatio }) => {
  const htmlRatio = 100 - textRatio;
  
  const data = [
    { name: 'Text Content', value: textRatio },
    { name: 'HTML Code', value: htmlRatio },
  ];

  const COLORS = ['#10b981', '#334155']; // Emerald-500, Slate-700

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{textRatio.toFixed(1)}%</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Text Ratio</span>
      </div>
    </div>
  );
};

export default RatioChart;