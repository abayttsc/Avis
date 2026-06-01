import React, { useState } from 'react';
import {
  User,
  Hash,
  Truck,
  Armchair,
  FileText,
  Save,
  Building2,
  Phone,
  MessageSquare,
  Zap,
  Camera,
  CheckCircle2,
  XCircle,
  ChevronDown
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
  certificateNumber: string;
  fileLocation: string;
  visualResult: 'Pass' | 'Fail';
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
    certificateNumber: '',
    fileLocation: '',
    visualResult: 'Pass',
    notes: '',
  });

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [duplicateVehicle, setDuplicateVehicle] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real duplicate detection
    if (name === 'plateNumber') {
      const existing = vehicles.find(v => v.plateNumber.toUpperCase() === value.toUpperCase());
      setIsDuplicate(!!existing);
      if (existing) {
        setDuplicateVehicle(existing);
        setShowRenewalModal(true);
      }
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
        certificateNumber: formData.certificateNumber,
        fileLocation: formData.fileLocation,
        visualResult: formData.visualResult,
        notes: formData.notes,
        status: formData.visualResult === 'Fail' ? 'Suspended' : 'Valid',
        lastUpdated: Date.now()
      });
      navigate('/reporting');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <User className="text-blue-500 w-6 h-6" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight font-serif italic-none">Customer Registration</h1>
          </div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] ml-13">AVIS CORE IDENTITY MANAGEMENT</p>
        </div>
      </div>

      {/* Renewal Workflow Modal */}
      {showRenewalModal && duplicateVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="dark-card max-w-lg w-full rounded-[2.5rem] p-10 shadow-2xl border-amber-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Zap className="text-amber-500 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight font-serif">Renewal Workflow</h3>
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Plate {duplicateVehicle.plateNumber} Detected</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-slate-400 text-sm leading-relaxed">
                This vehicle is already registered to <span className="text-white font-bold">{duplicateVehicle.customerName}</span>.
                Would you like to initiate a <span className="text-amber-500 font-bold">Renewal Inspection</span> for this profile?
              </p>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                   <span className="text-slate-500">Current Expiry</span>
                   <span className="text-amber-500">{duplicateVehicle.expiryDate}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                   <span className="text-slate-500">Last Inspection</span>
                   <span className="text-slate-300">{duplicateVehicle.registrationDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    customerName: duplicateVehicle.customerName,
                    phone: duplicateVehicle.phone,
                    vehicleType: duplicateVehicle.vehicleType,
                    seatingCapacity: duplicateVehicle.seatingCapacity.toString(),
                    chassisNumber: duplicateVehicle.chassisNumber,
                    motorNumber: duplicateVehicle.motorNumber,
                    fileLocation: duplicateVehicle.fileLocation,
                  });
                  setShowRenewalModal(false);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-amber-600/20"
              >
                AUTO-FILL DATA
              </button>
              <button
                type="button"
                onClick={() => setShowRenewalModal(false)}
                className="bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-4 rounded-2xl transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Identity Profile Section */}
        <section className="dark-card rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <User className="text-blue-400 w-5 h-5" />
            <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Identity Profile</h2>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 . . ."
                  className="dark-input w-full"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Full Customer Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter legal name"
                  className="dark-input w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Machine Specs Section */}
        <section className="dark-card rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="absolute right-10 top-10 opacity-5">
            <Truck className="w-32 h-32 text-white" />
          </div>

          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <Truck className="text-blue-400 w-5 h-5" />
            <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Machine Specs</h2>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Plate Number (Identification Key)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  placeholder="AA 12345"
                  className={`dark-input w-full font-mono font-bold uppercase ${isDuplicate ? 'border-amber-500/50 ring-2 ring-amber-500/20' : ''}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="relative group">
                  <label className="absolute left-6 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Vehicle Type</label>
                  <div className="relative">
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="dark-input w-full appearance-none px-6"
                    >
                      <option disabled value="">Select Category</option>
                      <option>Private</option>
                      <option>Commercial</option>
                      <option>Public Transport</option>
                      <option>Truck / Heavy</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  </div>
               </div>

               <div className="relative group">
                  <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Seating Capacity</label>
                  <div className="relative flex items-center">
                    <Armchair className="absolute left-4 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleChange}
                      placeholder="Seats"
                      className="dark-input w-full !pl-12 !pr-24 font-mono text-xl"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                       <button
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, seatingCapacity: Math.max(1, parseInt(prev.seatingCapacity || '0') - 1).toString() }))}
                         className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg hover:bg-white/10 text-white"
                       >
                         -
                       </button>
                       <button
                         type="button"
                         onClick={() => setFormData(prev => ({ ...prev, seatingCapacity: (parseInt(prev.seatingCapacity || '0') + 1).toString() }))}
                         className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg hover:bg-white/10 text-white"
                       >
                         +
                       </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Chassis Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleChange}
                    placeholder="CH-XXXXXX"
                    className="dark-input w-full font-mono"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Motor Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="motorNumber"
                    value={formData.motorNumber}
                    onChange={handleChange}
                    placeholder="MOT-XXXXXX"
                    className="dark-input w-full font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Assessment Section */}
        <section className="dark-card rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <CheckCircle2 className="text-emerald-400 w-5 h-5" />
            <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Technical Assessment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group md:col-span-2">
              <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Certificate Number</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={handleChange}
                  placeholder="CERT-XXXX"
                  className="dark-input w-full font-mono"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="absolute left-6 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">Registration Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="dark-input w-full px-6"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="absolute left-12 -top-3 px-2 bg-[#0a1122] text-[10px] font-bold text-slate-500 uppercase tracking-widest z-10">File Location / Address</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="fileLocation"
                  value={formData.fileLocation}
                  onChange={handleChange}
                  placeholder="Cabinet A / Addis Ababa"
                  className="dark-input w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Visual Result</label>
                <div className="flex gap-4 w-2/3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, visualResult: 'Pass' }))}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${formData.visualResult === 'Pass' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-slate-500 border border-transparent opacity-40'}`}
                  >
                    <CheckCircle2 className="w-5 h-5" /> PASS
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, visualResult: 'Fail' }))}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${formData.visualResult === 'Fail' ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/5 text-slate-500 border border-transparent opacity-40'}`}
                  >
                    <XCircle className="w-5 h-5" /> FAIL
                  </button>
                </div>
             </div>

             <div className="relative group">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 block">Observations / Technical Notes</label>
                <div className="relative">
                   <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-slate-500" />
                   <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter detailed technical observations..."
                    className="dark-input w-full px-12 py-6 resize-none"
                  />
                </div>
             </div>

             {/* Expiry Display Block */}
             <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2rem] p-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-2">Auto-Calculated Expiry</p>
                  <p className="text-4xl font-black text-white font-mono tracking-tighter">{calculateExpiry(formData.registrationDate)}</p>
                </div>
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
             </div>

             {/* Photo Capture Mock */}
             <div className="relative group">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 block">Visual Proof / Plate Scan</p>
                <button type="button" className="w-full py-6 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-500/50 hover:text-white transition-all group">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-500/20">
                      <Camera className="w-6 h-6" />
                   </div>
                   <span className="font-bold uppercase tracking-widest text-xs">Capture Plate Photo</span>
                </button>
             </div>
          </div>
        </section>

        {/* Messaging Section */}
        <section className="dark-card rounded-[2.5rem] p-10 space-y-8">
           <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-blue-400 w-5 h-5" />
            <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Messaging Template</h2>
          </div>

          <div className="space-y-6">
             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Notification Template</p>
                <div className="bg-[#050b18] border border-white/5 rounded-2xl p-6 text-slate-400 font-mono text-sm">
                   Dear Customer, your vehicle inspection for {`{PLATE}`} is complete. Valid until {`{EXPIRY}`}.
                </div>
             </div>

             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Preview (EN/AM)</p>
                <div className="bg-[#050b18] border border-white/5 rounded-3xl p-8 space-y-6">
                   <p className="text-slate-300 font-mono text-sm leading-relaxed">
                     Dear Customer, your vehicle inspection for {formData.plateNumber || 'AA-12345'} is complete. Valid until {calculateExpiry(formData.registrationDate)}.
                   </p>
                   <p className="text-slate-500 font-mono text-[10px] leading-relaxed border-t border-white/5 pt-4">
                     ውድ ደንበኛ፣ የሰሌዳ ቁጥር {formData.plateNumber || 'AA-12345'} ተሽከርካሪ ምርመራ ተጠናቋል፡፡ እስከ {calculateExpiry(formData.registrationDate)} ድረስ ያገለግላል፡፡
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="sticky bottom-8 z-30">
           <button
              type="submit"
              disabled={isSaving || isDuplicate}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 rounded-[2rem] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-6 h-6" />
              <span className="uppercase tracking-[0.3em] text-lg">Confirm & Finalize Inspection</span>
            </button>
            <button
              type="reset"
              onClick={() => setFormData({ ...formData, customerName: '', phone: '', plateNumber: '', chassisNumber: '', motorNumber: '', notes: '' })}
              className="w-full mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              Discard and reset entries
            </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
