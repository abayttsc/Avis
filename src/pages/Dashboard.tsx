import React, { useMemo } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { usePersistence } from '../hooks/usePersistence';
import { sendSMSTrigger } from '../lib/smsService';
import type { AppSettings } from '../types';
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
import { format, subDays, isSameDay, parseISO, differenceInDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { vehicles } = useVehicles();
  const [settings] = usePersistence<AppSettings>('avis_settings', {} as AppSettings);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const todayCount = useMemo(() =>
    vehicles.filter(v => v.registrationDate === todayStr).length
  , [vehicles, todayStr]);

  const monthlyVolume = useMemo(() => {
    const currentMonth = format(today, 'yyyy-MM');
    return vehicles.filter(v => v.registrationDate.startsWith(currentMonth)).length;
  }, [vehicles, today]);

  const criticalCount = useMemo(() =>
    vehicles.filter(v => v.status === 'Critical' || v.status === 'Expired').length
  , [vehicles]);

  const kpis = [
    { label: 'Total Registered', value: vehicles.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'Live' },
    { label: 'Inspections Today', value: todayCount.toString(), icon: ClipboardCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'Realtime' },
    { label: 'Monthly Volume', value: monthlyVolume.toString(), icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'Snapshot' },
    { label: 'Expiring Soon', value: criticalCount.toString(), icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: 'Critical' },
  ];

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dayStr = format(date, 'yyyy-MM-dd');
      const count = vehicles.filter(v => v.registrationDate === dayStr).length;
      return {
        name: format(date, 'EEE'),
        value: count,
        fullDate: dayStr
      };
    });
  }, [vehicles, today]);

  const renewals = useMemo(() => {
    return vehicles
      .filter(v => v.status === 'Critical' || v.status === 'Pending')
      .map(v => {
        const expiry = parseISO(v.expiryDate);
        const daysLeft = differenceInDays(expiry, today);
        return {
          name: v.customerName,
          plate: v.plateNumber,
          days: daysLeft,
          status: v.status,
          original: v
        };
      })
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);
  }, [vehicles, today]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <Users className="text-blue-500 w-6 h-6" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight font-serif">Intelligence Dashboard</h1>
          </div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] ml-13">Real-time operational overview</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">System Timestamp</p>
          <p className="text-sm font-bold text-white mt-1">{format(new Date(), 'dd MMM yyyy | HH:mm:ss')}</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="dark-card p-8 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:border-blue-500/30">
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} opacity-20 -mr-12 -mt-12 rounded-full transition-transform duration-700 group-hover:scale-150`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-4 rounded-2xl ${kpi.bg} backdrop-blur-md`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-full border",
                kpi.trend === 'Critical' ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}>
                {kpi.trend}
              </span>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{kpi.label}</p>
              <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Trend Chart */}
        <div className="lg:col-span-2 dark-card p-10 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                Inspection Activity Trend
              </h3>
              <p className="text-slate-500 text-xs mt-1 ml-4.5">Daily volume for the past 7 days</p>
            </div>
            <div className="bg-white/5 p-1 rounded-xl border border-white/5 flex">
               <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-blue-600/20">Last 7D</button>
               <button className="px-4 py-2 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest hover:text-white transition-colors">Last 30D</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0a1122', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSameDay(parseISO(entry.fullDate), today) ? '#3b82f6' : 'url(#barGradient)'}
                      className="transition-all duration-300 hover:opacity-100 opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Renewal Tracker */}
        <div className="dark-card p-10 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              Renewal Tracker
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">Auto-Scan</span>
          </div>

          <div className="space-y-4 flex-1">
            {renewals.length > 0 ? (
              renewals.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-xs border shadow-lg transition-transform group-hover:scale-110",
                      item.days <= 5 ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5" : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                    )}>
                      <span className="text-[14px]">{item.days}</span>
                      <span className="text-[8px] uppercase tracking-tighter -mt-1">Days</span>
                    </div>
                    <div className="max-w-[120px]">
                      <p className="text-sm font-bold text-white truncate leading-none mb-1">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{item.plate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendSMSTrigger(item.original, settings)}
                    className="w-10 h-10 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl border border-blue-500/20 transition-all flex items-center justify-center group/btn"
                    title="Send Reminder"
                  >
                    <Zap className="w-4 h-4 fill-current group-hover/btn:scale-125 transition-transform" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ClipboardCheck className="w-8 h-8 text-slate-500" />
                 </div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No pending renewals</p>
              </div>
            )}
          </div>

          <button className="w-full mt-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:border-blue-600 transition-all group shadow-xl active:scale-[0.98]">
            Process Global Sync
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
