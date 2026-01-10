import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PieChart = ({ data, title, colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'], theme = 'light' }) => {
  const bgColor = theme === 'dark' ? '#1a1a1a' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: bgColor, padding: '10px', border: '1px solid #ccc', color: textColor }}>
          <p>{`Name: ${data.name}`}</p>
          {data.coordinates && <p>{`Coordinates: [${data.coordinates[0].toFixed(6)}, ${data.coordinates[1].toFixed(6)}]`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 250, backgroundColor: 'transparent', color: textColor }}>
      <h3 style={{ textAlign: 'center', marginBottom: 10 }}>{title}</h3>
      <ResponsiveContainer height={200}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { PieChart };