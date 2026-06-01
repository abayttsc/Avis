import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Hash,
  Calendar,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import type { VehicleStatus, AppSettings } from '../types';
import { exportToExcel } from '../lib/exportUtils';
import { useVehicles } from '../hooks/useVehicles';
import { usePersistence } from '../hooks/usePersistence';

const Reporting: React.FC = () => {
  const [settings] = usePersistence<AppSettings>('avis_settings', {} as AppSettings);
  const { vehicles, loading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<VehicleStatus | 'All'>('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'Valid': return 'bg-emerald-500';
      case 'Pending': return 'bg-amber-500';
      case 'Critical': return 'bg-orange-500';
      case 'Expired': return 'bg-red-500';
      case 'Suspended': return 'bg-slate-500';
      default: return 'bg-slate-400';
    }
  };

  const filteredVehicles = useMemo(() => {
     return vehicles.filter(v => {
        const matchesSearch = v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = activeFilter === 'All' || v.status === activeFilter;

        const regDate = new Date(v.registrationDate);
        const matchesFrom = !fromDate || regDate >= new Date(fromDate);
        const matchesTo = !toDate || regDate <= new Date(toDate);

        return matchesSearch && matchesFilter && matchesFrom && matchesTo;
      });
  }, [vehicles, searchTerm, activeFilter, fromDate, toDate]);

  const stats = useMemo(() => ({
    total: filteredVehicles.length,
    passed: filteredVehicles.filter(v => v.visualResult === 'Pass').length,
    failed: filteredVehicles.filter(v => v.visualResult === 'Fail').length,
  }), [filteredVehicles]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-blue-500 w-6 h-6" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight font-serif">Reporting Center</h1>
          </div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] ml-13">High-precision record management</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={() => exportToExcel(filteredVehicles, `AVIS_Report_${new Date().toISOString().split('T')[0]}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
         <div className="dark-card p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
               <BarChart3 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Reports</p>
               <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
            </div>
         </div>
         <div className="dark-card p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Pass</p>
               <p className="text-3xl font-black text-white mt-1">{stats.passed}</p>
            </div>
         </div>
         <div className="dark-card p-6 rounded-[2rem] flex items-center gap-6">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20">
               <XCircle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Fail</p>
               <p className="text-3xl font-black text-white mt-1">{stats.failed}</p>
            </div>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="dark-card rounded-[2.5rem] p-8 space-y-6 no-print">
        <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
                type="text"
                placeholder="Search by Plate, Name, Certificate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark-input w-full !pl-14"
            />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:w-44 relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="dark-input w-full !px-11 !py-3 !text-[10px] !rounded-xl"
                    />
                </div>
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">To</span>
                <div className="flex-1 lg:w-44 relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="dark-input w-full !px-11 !py-3 !text-[10px] !rounded-xl"
                    />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl w-full overflow-x-auto no-scrollbar border border-white/5">
          {['All', 'Valid', 'Pending', 'Critical', 'Expired', 'Suspended'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="dark-card rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-6">Status / Result</th>
                <th className="px-8 py-6">Customer Identity</th>
                <th className="px-8 py-6">Plate & Cert</th>
                <th className="px-8 py-6">Technical Specs</th>
                <th className="px-8 py-6">Registry Loc.</th>
                <th className="px-8 py-6">Timeline</th>
                <th className="px-8 py-6 no-print text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Retrieving Secure Data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">No matching records found in registry</p>
                  </td>
                </tr>
              ) : filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-900 group transition-all duration-200 cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-white transition-colors">{vehicle.status}</span>
                        </div>
                        <div className={`text-[8px] font-black px-2 py-0.5 rounded-full inline-block ${vehicle.visualResult === 'Pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border border-current opacity-80 group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent`}>
                            VISUAL: {vehicle.visualResult}
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center border border-white/5 group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent transition-all">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white group-hover:text-white truncate max-w-[150px]">{vehicle.customerName}</p>
                        <p className="text-[10px] font-mono text-slate-500 group-hover:text-blue-100 mt-0.5">{vehicle.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-blue-500 group-hover:text-white" />
                            <span className="text-xs font-mono font-black text-white tracking-tighter group-hover:text-white">{vehicle.plateNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-slate-500 group-hover:text-blue-100" />
                            <span className="text-[10px] font-mono text-slate-500 group-hover:text-blue-100">{vehicle.certificateNumber}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-mono leading-relaxed">
                      <p className="font-black text-blue-400 group-hover:text-white uppercase mb-1">{vehicle.vehicleType}</p>
                      <p className="text-slate-500 group-hover:text-blue-50 text-[9px]">CH: {vehicle.chassisNumber}</p>
                      <p className="text-slate-500 group-hover:text-blue-50 text-[9px]">SEATS: {vehicle.seatingCapacity}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-white">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-wide">{vehicle.fileLocation || 'UNASSIGNED'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-black space-y-1">
                       <p className="text-slate-500 group-hover:text-blue-50">REG: {vehicle.registrationDate}</p>
                       <p className="text-blue-500 group-hover:text-white uppercase">EXP: {vehicle.expiryDate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right no-print">
                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 group-hover:bg-white/20 group-hover:border-transparent transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between no-print">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Registry Entries: {filteredVehicles.length}</p>
          <div className="flex gap-3">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 active:scale-90" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Print Header/Footer (Using print.css classes) */}
      <div className="print-header">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 p-2 rounded-2xl">
                <img src="/avis.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">{settings.stationName || 'Abay Technical Inspection'}</h1>
                <p className="text-sm font-mono tracking-[0.3em] text-slate-500 uppercase mt-1">Official Registry Report Summary</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-sm font-black uppercase">Report Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">System Secure Export</p>
         </div>
      </div>

      <div className="print-footer">
        <div className="signature-grid">
          <div className="signature-line">Lead Inspector Signature</div>
          <div className="signature-line">Station Manager Signature</div>
          <div className="signature-line">Official Station Seal</div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
