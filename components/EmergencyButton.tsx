
import React from 'react';
import { Habit } from '../types';

interface EmergencyButtonProps {
  lastActivity: Date | null;
  habits: Habit[];
  onClose: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ lastActivity, habits, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8 md:p-12 rounded-[2rem] max-w-lg w-full shadow-2xl space-y-8 animate-in zoom-in duration-500">
        <header className="text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter">You're Drifting.</h2>
          <p className="text-zinc-500 text-lg">It's been {Math.floor((Date.now() - (lastActivity?.getTime() || 0)) / (1000 * 3600 * 24))} days since you showed up.</p>
        </header>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-600">Remember Why You Started</h3>
          {habits.slice(0, 3).map(h => (
            <div key={h.id} className="flex justify-between items-center text-sm">
              <span className="text-zinc-100 font-medium">{h.name}</span>
              <span className="text-zinc-600">Built to {Math.round(h.disciplineScore || 0)}%</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button 
            onClick={onClose}
            className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl hover:bg-white transition-all transform active:scale-[0.98]"
          >
            I'm Still Here
          </button>
          <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            No Guilt. No Shame. Just Motion.
          </p>
        </div>
      </div>
    </div>
  );
};
