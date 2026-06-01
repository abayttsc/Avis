import React from 'react';
import avisLogo from '../assets/avis.png';

const SidebarLogo: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="relative group perspective-1000">
        <div className="relative transition-all duration-500 transform-gpu group-hover:rotate-y-12 group-hover:-rotate-x-12 group-hover:scale-110">
          {/* 3D Depth Layers */}
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all duration-500"></div>

          <img
            src={avisLogo}
            alt="AVIS Logo"
            className="w-24 h-24 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20 rounded-full pointer-events-none"></div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-xl font-black tracking-[0.2em] text-white">ABAY</h1>
        <p className="text-[10px] font-bold tracking-[0.4em] text-blue-500 uppercase mt-1">Technical Inspection</p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-8"></div>
    </div>
  );
};

export default SidebarLogo;
