
import React, { useState } from 'react';
import { Experiment } from '../types';

interface ExperimentsProps {
  experiments: Experiment[];
  onUpdate: (exps: Experiment[]) => void;
}

export const Experiments: React.FC<ExperimentsProps> = ({ experiments, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleStart = () => {
    if (!title.trim()) return;
    const newExp: Experiment = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      logs: [],
      isActive: true
    };
    onUpdate([...experiments, newExp]);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lab</h2>
          <p className="text-zinc-500">Scientific approach to behavior changes.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-lg font-medium"
        >
          {isAdding ? 'Cancel' : 'Start Experiment'}
        </button>
      </header>

      {isAdding && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3"
            placeholder="e.g., Cold Showers for 7 days"
          />
          <button onClick={handleStart} className="w-full bg-zinc-100 text-zinc-950 py-3 rounded-lg font-bold">
            Begin Phase 1
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {experiments.length === 0 ? (
          <p className="text-zinc-600 text-center py-20 italic">No experiments in progress. Try a 7-day sprint.</p>
        ) : (
          experiments.map(exp => (
            <div key={exp.id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex justify-between mb-4">
                <h4 className="text-xl font-bold">{exp.title}</h4>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${exp.isActive ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                  {exp.isActive ? 'Active' : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mb-4">Ends: {new Date(exp.endDate).toLocaleDateString()}</p>
              
              <div className="flex gap-2 mb-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${exp.logs[i]?.completed ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                  </div>
                ))}
              </div>

              {!exp.isActive && exp.conclusion && (
                <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <p className="text-sm italic text-zinc-400">"{exp.conclusion}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
