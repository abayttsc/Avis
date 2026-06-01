import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/registration', icon: UserPlus, label: 'Registration' },
    { to: '/registry', icon: ClipboardList, label: 'Registry' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 watermark-pattern">
      {/* Sidebar */}
      <aside className="w-64 bg-[#020617] text-white flex flex-col z-20 shadow-2xl">
        <SidebarLogo />

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-110")} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors duration-200 w-full group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium uppercase text-xs tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">Section /</span>
            <h2 className="text-slate-900 font-bold uppercase tracking-wide">
              {/* Dynamic title based on route could go here */}
              Management Core
            </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">System Online</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">JD</span>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle Silver Watermark Background (Pattern is in index.css) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none watermark-pattern"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
