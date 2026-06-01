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
  Armchair,
  Building2
} from 'lucide-react';
import type { VehicleStatus } from '../types';
import { exportToExcel } from '../lib/exportUtils';
import { useVehicles } from '../hooks/useVehicles';

const Registry: React.FC = () => {
  const { vehicles, loading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<VehicleStatus | 'All'>('All');

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Technical Registry</h1>
          <p className="text-slate-500 mt-1">High-precision vehicle inspection record management.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={() => exportToExcel(vehicles, `AVIS_Registry_${new Date().toISOString().split('T')[0]}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="print-header">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white">
               <Building2 className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-xl font-bold uppercase">Abay Technical Inspection Station</h1>
               <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Official Vehicle Registry Report</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-xs font-bold uppercase">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] font-mono text-slate-400 uppercase">System: AVIS Core v1.0</p>
         </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Plate, Name, or Chassis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
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

      {/* Registry Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-mono uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Plate Number</th>
                <th className="px-6 py-4">Chassis/Motor</th>
                <th className="px-6 py-4 text-center">Seats</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">
                    Loading High-Precision Data...
                  </td>
                </tr>
              ) : vehicles
                  .filter(v =>
                    (activeFilter === 'All' || v.status === activeFilter) &&
                    (v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     v.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((vehicle) => (
                <tr key={vehicle.id} className="hover-illuminate group transition-colors duration-150 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{vehicle.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">{vehicle.customerName}</p>
                        <p className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors">{vehicle.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-mono font-bold tracking-tighter">{vehicle.plateNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] font-mono leading-tight">
                      <p className="text-slate-400 group-hover:text-slate-300">C: {vehicle.chassisNumber}</p>
                      <p className="text-slate-400 group-hover:text-slate-300">M: {vehicle.motorNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-xs font-bold border border-slate-100 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-700 transition-colors">
                       <Armchair className="w-3 h-3" /> {vehicle.seatingCapacity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold">
                       {vehicle.expiryDate}
                       <p className="text-[10px] font-normal text-slate-400 mt-0.5 group-hover:text-slate-300">365 days cycle</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 group-hover:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing {vehicles.length} entries</p>
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

export default Registry;
