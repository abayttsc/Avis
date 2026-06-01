import React, { useState } from 'react';
import {
  Search,
  Download,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Hash,
  Building2,
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

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'All' || v.status === activeFilter;

    const regDate = new Date(v.registrationDate);
    const matchesFrom = !fromDate || regDate >= new Date(fromDate);
    const matchesTo = !toDate || regDate <= new Date(toDate);

    return matchesSearch && matchesFilter && matchesFrom && matchesTo;
  });

  const stats = {
    total: filteredVehicles.length,
    passed: filteredVehicles.filter(v => v.visualResult === 'Pass').length,
    failed: filteredVehicles.filter(v => v.visualResult === 'Fail').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reporting Center</h1>
          <p className="text-slate-500 mt-1">High-precision vehicle inspection record management & analytics.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={() => exportToExcel(filteredVehicles, `AVIS_Report_${new Date().toISOString().split('T')[0]}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
         <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <BarChart3 className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
               <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
         </div>
         <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Pass</p>
               <p className="text-xl font-bold text-slate-900">{stats.passed}</p>
            </div>
         </div>
         <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
               <XCircle className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Fail</p>
               <p className="text-xl font-bold text-slate-900">{stats.failed}</p>
            </div>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-6 space-y-4 no-print">
        <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
                type="text"
                placeholder="Search by Plate, Name, Certificate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="flex-1 lg:w-40 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-bold outline-none"
                    />
                </div>
                <span className="text-slate-400 text-xs font-bold">TO</span>
                <div className="flex-1 lg:w-40 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-bold outline-none"
                    />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full overflow-x-auto no-scrollbar">
          {['All', 'Valid', 'Pending', 'Critical', 'Expired', 'Suspended'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Print Header */}
      <div className="print-header">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white">
               {settings.stationLogo ? (
                  <img src={settings.stationLogo} alt="Logo" className="w-full h-full object-contain" />
               ) : (
                  <Building2 className="w-8 h-8" />
               )}
            </div>
            <div>
               <h1 className="text-xl font-bold uppercase">{settings.stationName || 'Abay Technical Inspection Station'}</h1>
               <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Technical Inspection Report Summary</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-xs font-bold uppercase">Report Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] font-mono text-slate-400 uppercase">Period: {fromDate || 'Start'} - {toDate || 'End'}</p>
         </div>
      </div>

      {/* Registry Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[9px] font-mono uppercase tracking-widest">
                <th className="px-4 py-4">Status / Result</th>
                <th className="px-4 py-4">Customer & Phone</th>
                <th className="px-4 py-4">Plate & Cert #</th>
                <th className="px-4 py-4">Vehicle Specs</th>
                <th className="px-4 py-4">File Loc.</th>
                <th className="px-4 py-4">Dates</th>
                <th className="px-4 py-4 no-print text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">
                    Loading High-Precision Data...
                  </td>
                </tr>
              ) : filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover-illuminate group transition-colors duration-150 cursor-pointer">
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">{vehicle.status}</span>
                        </div>
                        <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full inline-block ${vehicle.visualResult === 'Pass' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600'}`}>
                            VISUAL: {vehicle.visualResult}
                        </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold truncate max-w-[120px]">{vehicle.customerName}</p>
                        <p className="text-[9px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">{vehicle.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3 text-slate-400" />
                            <span className="text-xs font-mono font-bold tracking-tighter">{vehicle.plateNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300">{vehicle.certificateNumber}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[9px] font-mono leading-tight">
                      <p className="font-bold text-slate-700 group-hover:text-white uppercase">{vehicle.vehicleType}</p>
                      <p className="text-slate-400 group-hover:text-slate-300">CH: {vehicle.chassisNumber}</p>
                      <p className="text-slate-400 group-hover:text-slate-300">MO: {vehicle.motorNumber}</p>
                      <p className="text-slate-400 group-hover:text-slate-300">SEATS: {vehicle.seatingCapacity}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-300">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase">{vehicle.fileLocation || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[9px] font-bold space-y-0.5">
                       <p className="text-slate-500 group-hover:text-slate-300">REG: {vehicle.registrationDate}</p>
                       <p className="text-blue-600 group-hover:text-blue-300 uppercase">EXP: {vehicle.expiryDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right no-print">
                    <button className="p-2 hover:bg-slate-100 group-hover:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reports generated: {filteredVehicles.length}</p>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="print-footer">
        <div className="signature-grid">
           <div className="signature-line">Technician Signature</div>
           <div className="signature-line">Station Manager</div>
           <div className="signature-line">Official Stamp</div>
        </div>
        <p className="mt-8 text-[10px] text-center text-slate-400 font-mono">
          This report was automatically generated by the Abay Technical Vehicle Inspection System (AVIS).
        </p>
      </div>
    </div>
  );
};

export default Reporting;
