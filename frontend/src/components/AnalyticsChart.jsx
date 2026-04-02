import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const REQUEST_COLORS = {
  Pending:   '#eab308',
  Approved:  '#3b82f6',
  Completed: '#10b981',
  Rejected:  '#ef4444',
};

const BLOOD_COLORS = [
  '#e51a1a','#f83b3b','#f97316','#eab308',
  '#8b5cf6','#ec4899','#06b6d4','#6366f1'
];

const customTooltipStyle = {
  backgroundColor: '#1e2333',
  border: '1px solid #393f4e',
  borderRadius: '12px',
  color: '#f1f5f9',
};

export function RequestStatusChart({ analytics }) {
  const data = [
    { name: 'Pending',   value: analytics?.pendingRequests   || 0 },
    { name: 'Approved',  value: analytics?.approvedRequests  || 0 },
    { name: 'Completed', value: analytics?.completedRequests || 0 },
    { name: 'Rejected',  value: analytics?.rejectedRequests  || 0 },
  ].filter(d => d.value > 0);

  if (data.length === 0) return <div className="flex items-center justify-center h-40 text-gray-500">No request data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
          paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={REQUEST_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip contentStyle={customTooltipStyle} />
        <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InventoryChart({ inventoryByBloodGroup }) {
  const data = Object.entries(inventoryByBloodGroup || {}).map(([bg, units]) => ({
    bloodGroup: bg,
    units: Number(units),
  }));

  if (data.length === 0) return <div className="flex items-center justify-center h-40 text-gray-500">No inventory data yet</div>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#393f4e" />
        <XAxis dataKey="bloodGroup" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#ffffff10' }} />
        <Bar dataKey="units" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={BLOOD_COLORS[i % BLOOD_COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
