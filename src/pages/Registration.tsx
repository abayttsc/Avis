import React, { useState } from 'react';
import {
  User,
  Hash,
  Truck,
  Armchair,
  Calendar as CalendarIcon,
  FileText,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { addDays, format } from 'date-fns';
import { useVehicles } from '../hooks/useVehicles';
import { useNavigate } from 'react-router-dom';

interface RegistrationForm {
  customerName: string;
  phone: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  vehicleType: string;
  seatingCapacity: string;
  registrationDate: string;
  notes: string;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, addVehicle } = useVehicles();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<RegistrationForm>({
    customerName: '',
    phone: '',
    plateNumber: '',
    chassisNumber: '',
    motorNumber: '',
    vehicleType: 'Private',
    seatingCapacity: '4',
    registrationDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real duplicate detection
    if (name === 'plateNumber') {
      const exists = vehicles.some(v => v.plateNumber.toUpperCase() === value.toUpperCase());
      setIsDuplicate(exists);
    }
  };

  const calculateExpiry = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(addDays(date, 365), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDuplicate || !formData.plateNumber) return;

    setIsSaving(true);
    try {
      await addVehicle({
        customerName: formData.customerName,
        phone: formData.phone,
        plateNumber: formData.plateNumber.toUpperCase(),
        chassisNumber: formData.chassisNumber,
        motorNumber: formData.motorNumber,
        vehicleType: formData.vehicleType,
        seatingCapacity: parseInt(formData.seatingCapacity),
        registrationDate: formData.registrationDate,
        expiryDate: calculateExpiry(formData.registrationDate),
        notes: formData.notes,
        status: 'Valid',
        lastUpdated: Date.now()
      });
      navigate('/registry');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vehicle Registration</h1>
          <p className="text-slate-500 mt-1">Official entry for technical inspection protocols.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
           <p className="text-[10px] font-mono text-blue-600 uppercase tracking-widest">Calculated Expiry</p>
           <p className="text-sm font-bold text-blue-900">{calculateExpiry(formData.registrationDate)}</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-xl border-slate-200/60">
        <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
          <span className="text-white font-mono text-xs uppercase tracking-[0.3em]">Technical Data Entry</span>
          <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             <div className="w-2 h-2 rounded-full bg-amber-500"></div>
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Duplicate Warning */}
          {isDuplicate && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 animate-in zoom-in-95 duration-300">
              <div className="bg-amber-100 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900 uppercase">Duplicate Plate Detected</h4>
                <p className="text-xs text-amber-700">This vehicle is already in the registry. Proceeding will trigger the <span className="font-bold underline cursor-pointer">Renewal Workflow</span>.</p>
              </div>
              <button type="button" className="text-xs font-bold bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors">
                Start Renewal
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Plate Number */}
            <div className="space-y-2">
              <label htmlFor="plateNumber" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" /> Plate Number (Unique)
              </label>
              <input
                id="plateNumber"
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                placeholder="e.g. AA-2-B12345"
                className={`w-full bg-slate-50 border ${isDuplicate ? 'border-amber-400 ring-amber-500/10' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold uppercase`}
              />
            </div>

            {/* Chassis/Motor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" /> Chassis / Motor Number
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleChange}
                  placeholder="Chassis"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                />
                <input
                  type="text"
                  name="motorNumber"
                  value={formData.motorNumber}
                  onChange={handleChange}
                  placeholder="Motor"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                />
              </div>
            </div>

             {/* Vehicle Type & Seats */}
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Truck className="w-3 h-3" /> Vehicle Type & <Armchair className="w-3 h-3 ml-2" /> Seats
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                >
                  <option>Private</option>
                  <option>Commercial</option>
                  <option>Public Transport</option>
                  <option>Truck / Heavy</option>
                </select>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  placeholder="Seats"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            {/* Registration Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CalendarIcon className="w-3 h-3" /> Registration Date
              </label>
              <input
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
              />
            </div>

             {/* Notes */}
             <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" /> Notes / Observations
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Initial technical observations..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving || isDuplicate}
              className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Registration'}
            </button>
            <button
              type="reset"
              onClick={() => setFormData({ ...formData, customerName: '', phone: '', plateNumber: '', chassisNumber: '', motorNumber: '', notes: '' })}
              className="px-6 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <RotateCcw className="w-5 h-5" /> Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
