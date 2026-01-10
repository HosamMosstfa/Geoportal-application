import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value, title, theme = 'light' }) => {
  const data = [
    { name: 'Completed', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  const COLORS = ['#8884d8', '#f0f0f0'];

  return (
    <div style={{ width: '100%', height: 200, backgroundColor: 'transparent', color: theme === 'dark' ? '#fff' : '#000' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 10 }}>{title}</h3>
  <ResponsiveContainer>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="55%"
      startAngle={180}
      endAngle={0}
      innerRadius={60}
      outerRadius={80}
      paddingAngle={5}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    {/* 👇 الرقم جوّه التشارت */}
    <text
      x="50%"
      y="60%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="16"
      fontWeight="600"
      fill={theme === 'dark' ? '#fff' : '#000'}
    >
      {value}%
    </text>
  </PieChart>
</ResponsiveContainer>

    </div>
  );
};

export { GaugeChart };