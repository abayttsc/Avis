import React from 'react';
import {
  Building2,
  Palette,
  Languages,
  Mail,
  Database,
  Globe,
  Lock,
  CloudSync
} from 'lucide-react';
import { usePersistence } from '../hooks/usePersistence';
import type { AppSettings } from '../types';

const defaultSettings: AppSettings = {
  stationName: 'Abay Technical Inspection Station #1',
  theme: 'light',
  language: 'en',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  gatewayEnabled: true,
  smsTemplate: 'Dear [NAME], your vehicle [PLATE] inspection is due on [DATE]. Please visit Abay Technical Station. Ref: [CERT]',
};

const Settings: React.FC = () => {
  const [settings, setSettings] = usePersistence<AppSettings>('avis_settings', defaultSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500 mt-1">Manage station identity, gateway protocols, and visual preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar for Settings */}
        <div className="space-y-2">
          {[
            { id: 'station', icon: Building2, label: 'Station Identity' },
            { id: 'appearance', icon: Palette, label: 'Appearance' },
            { id: 'localization', icon: Languages, label: 'Localization' },
            { id: 'smtp', icon: Mail, label: 'SMTP Gateway' },
            { id: 'database', icon: Database, label: 'Cloud Sync' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                item.id === 'station'
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Station Identity Section */}
          <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Building2 className="w-4 h-4 text-blue-600" /> Station Identity
               </h3>
            </div>
            <div className="p-6 space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Station Name</label>
                  <input
                    type="text"
                    name="stationName"
                    value={settings.stationName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Station Logo (URL)</label>
                  <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-slate-300" />
                     </div>
                     <input
                        type="text"
                        placeholder="https://..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-mono"
                      />
                  </div>
               </div>
            </div>
          </div>

          {/* Localization Section */}
          <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Globe className="w-4 h-4 text-emerald-600" /> Localization
               </h3>
            </div>
            <div className="p-6 flex gap-4">
               <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Language</label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="en">English (US)</option>
                    <option value="am">Amharic (አማርኛ)</option>
                  </select>
               </div>
               <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred Theme</label>
                  <select
                    name="theme"
                    value={settings.theme}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="light">Production Light</option>
                    <option value="dark">Deep Space Dark</option>
                  </select>
               </div>
            </div>
          </div>

          {/* SMTP Gateway Section */}
          {/* SMS Template Section */}
          <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
            <div className="bg-blue-600 px-6 py-4">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Mail className="w-4 h-4" /> Automated SMS Template
               </h3>
            </div>
            <div className="p-6 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Message Template</label>
                  <textarea
                    name="smsTemplate"
                    value={settings.smsTemplate}
                    onChange={handleChange as any}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                  />
                  <div className="flex gap-2">
                     {['[NAME]', '[PLATE]', '[DATE]', '[CERT]'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-mono font-bold">{tag}</span>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* SMTP Gateway Section */}
          <div className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Lock className="w-4 h-4 text-blue-400" /> SMTP-to-SMS Gateway
               </h3>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
               </div>
            </div>
            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">SMTP Host</label>
                    <input
                      type="text"
                      name="smtpHost"
                      value={settings.smtpHost}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Port</label>
                    <input
                      type="number"
                      name="smtpPort"
                      value={settings.smtpPort}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 text-sm font-mono"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username / Email</label>
                  <input
                    type="email"
                    name="smtpUser"
                    value={settings.smtpUser}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 text-sm"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">App-Specific Password</label>
                  <input
                    type="password"
                    name="smtpPass"
                    value={settings.smtpPass}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 text-sm font-mono"
                  />
               </div>
               <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                     <CloudSync className="w-4 h-4" /> Cloud Synchronization
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md">
                     Save Protocol
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
