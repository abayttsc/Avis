import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SystemIntelligence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Neural Grid (CSS only) */}
      <div className="absolute inset-0 opacity-10 watermark-pattern pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="relative flex flex-col items-center"
      >
        <div className="w-32 h-32 mb-8 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-white font-mono text-xl">{progress}%</span>
          </div>
        </div>

        <h2 className="text-blue-500 font-mono tracking-[0.3em] uppercase mb-2">System Intelligence</h2>
        <div className="flex gap-1 h-1 w-48 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
        </div>

        <p className="mt-4 text-slate-500 text-xs font-mono">Initializing Neural Inspection Core...</p>
      </motion.div>
    </div>
  );
};

export default SystemIntelligence;
