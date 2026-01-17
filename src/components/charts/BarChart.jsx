import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChart = ({ data, title, dataKey = 'value' }) => {
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
        fontSize: 'clamp(9px, 1.1vw, 13px)',
        padding: '0 4px'
      }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-primary)" 
              tick={{ fontSize: 'clamp(8px, 1vw, 11px)' }}
              interval={0}
            />
            <YAxis 
              stroke="var(--text-primary)" 
              tick={{ fontSize: 'clamp(8px, 1vw, 11px)' }}
              width={30}
            />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '12px', border: '1px solid var(--border-color)' }} />
            <Bar dataKey={dataKey} fill="var(--chart-bar)" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { BarChart };