import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value, title }) => {
  const data = [
    { name: 'Completed', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  const COLORS = ['var(--chart-bar)', 'var(--border-color)'];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      minHeight: '120px',
      backgroundColor: 'transparent', 
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '4px',
        fontSize: 'clamp(10px, 1.2vw, 14px)',
        padding: '0 4px'
      }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="60%"
              startAngle={180}
              endAngle={0}
              innerRadius="50%"
              outerRadius="70%"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="clamp(12px, 1.5vw, 16px)"
              fontWeight="600"
              fill="var(--text-primary)"
            >
              {value}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { GaugeChart };