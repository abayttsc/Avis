import React from 'react';
import avisLogo from '../assets/avis.png';

const SidebarLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 perspective-1000 group">
      <div className="relative w-24 h-24 transition-transform duration-500 transform-gpu group-hover:rotate-y-12 group-hover:rotate-x-12 group-hover:scale-110">
        {/* 3D Depth Layers */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>

        {/* Main Logo */}
        <img
          src={avisLogo}
          alt="AVIS Logo"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />

        {/* Reflection/Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/0 via-white/30 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
      </div>

      <div className="mt-4 text-center">
        <h1 className="text-xl font-bold text-white tracking-wider">AVIS</h1>
        <p className="text-[10px] text-slate-400 tracking-[0.2em] font-mono uppercase">Abay Technical</p>
      </div>
    </div>
  );
};

export default SidebarLogo;
