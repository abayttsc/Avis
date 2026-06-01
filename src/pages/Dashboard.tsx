import React from 'react';
import { useVehicles } from '../hooks/useVehicles';
import {
  Users,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 48 },
  { name: 'Sat', value: 32 },
  { name: 'Sun', value: 12 },
];

const Dashboard: React.FC = () => {
  const { vehicles } = useVehicles();

  const todayCount = vehicles.filter(v => v.registrationDate === new Date().toISOString().split('T')[0]).length;
  const criticalCount = vehicles.filter(v => v.status === 'Critical').length;

  const kpis = [
    { label: 'Total Registered', value: vehicles.length.toString(), icon: Users, color: 'bg-blue-500', trend: 'Live' },
    { label: 'Inspections Today', value: todayCount.toString(), icon: ClipboardCheck, color: 'bg-emerald-500', trend: 'Realtime' },
    { label: 'Monthly Volume', value: vehicles.length.toString(), icon: Calendar, color: 'bg-amber-500', trend: 'Snapshot' },
    { label: 'Expiring Soon', value: criticalCount.toString(), icon: AlertTriangle, color: 'bg-orange-500', trend: 'Critical' },
  ];

  const renewals = vehicles
    .filter(v => v.status === 'Critical' || v.status === 'Pending')
    .slice(0, 5)
    .map(v => ({
       name: v.customerName,
       plate: v.plateNumber,
       days: 5, // Mocked days
       status: v.status
    }));

  const renewalsStatic = [
    { name: 'Abebe Kebede', plate: 'AA-2-B12345', days: 3, status: 'Critical' },
    { name: 'Sara Tekle', plate: 'OR-3-A55667', days: 12, status: 'Pending' },
    { name: 'Mulugeta Tesfaye', plate: 'AA-2-C98765', days: 1, status: 'Critical' },
    { name: 'Bethlehem Desta', plate: 'AA-2-A00001', days: 25, status: 'Pending' },
    { name: 'Dawit Hailu', plate: 'AM-2-D44332', days: 5, status: 'Critical' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time operational overview of Abay Inspection Station.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Last Updated</p>
          <p className="text-sm font-bold text-slate-700">24 MAY 2024 | 14:30:05</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform duration-500 group-hover:scale-150`}></div>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${kpi.color} bg-opacity-10`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full",
                kpi.trend === 'Critical' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
              Inspection Activity Trend
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 transition-all">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#2563eb' : '#94a3b8'} className="transition-all duration-300 hover:opacity-80" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Renewal Tracker */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              Renewal Tracker
            </h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {(renewals.length > 0 ? renewals : renewalsStatic).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${item.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.days}d
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{item.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{item.plate}</p>
                  </div>
                </div>
                <button className="p-2 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 shadow-sm transition-all group-hover:scale-110" title="Send Reminder">
                  <Zap className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group">
            Global Sync
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for Tailwind Merge
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
