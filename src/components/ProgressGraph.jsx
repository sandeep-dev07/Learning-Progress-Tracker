import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ProgressGraph = ({ percentage }) => {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];
  
  const COLORS = ['#10b981', '#334155']; 

  return (
    <div style={{ width: '160px', height: '160px', position: 'relative', background: 'var(--bg-card)', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={45}
            outerRadius={65}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} 
             itemStyle={{ color: 'var(--text-main)' }}
             formatter={(val) => `${val}%`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'var(--text-main)'
      }}>
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressGraph;
