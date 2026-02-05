
import React, { useState } from 'react';
import { Habit } from '../types';
import { HabitConfigPanel } from './HabitConfigPanel';

interface HabitManagerProps {
  habits: Habit[];
  onAdd: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleHideFromFlow: (id: string) => void;
}

export const HabitManager: React.FC<HabitManagerProps> = ({ habits, onAdd, onDelete, onToggleHideFromFlow }) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleAdd = (habit: Habit) => {
    onAdd(habit);
    setIsConfiguring(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-2xl mx-auto lg:max-w-3xl">
      <div className="flex justify-between items-end px-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Architecture</p>
          <h2 className="text-3xl font-black tracking-tight lg:text-4xl">The Vault</h2>
        </div>
        <button 
          onClick={() => setIsConfiguring(true)}
          className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-zinc-100 text-zinc-950 transition-all active:scale-90 hover:bg-white shadow-lg"
        >
          New Habit
        </button>
      </div>

      {isConfiguring && (
        <HabitConfigPanel 
          onSave={handleAdd} 
          onCancel={() => setIsConfiguring(false)} 
        />
      )}

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-24 lg:py-32 border-2 border-dashed border-zinc-800 rounded-[2.5rem] bg-zinc-900/10">
            <p className="text-zinc-600 font-medium italic">The vault is silent.</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-zinc-900/40 border border-zinc-800 p-6 lg:p-7 rounded-[2rem] flex items-center justify-between group transition-all hover:bg-zinc-900/60 backdrop-blur-sm hover:border-zinc-700">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-lg font-bold truncate transition-colors ${habit.isHiddenFromFlow ? 'text-zinc-600 italic' : 'group-hover:text-zinc-100'}`}>
                    {habit.name}
                  </h4>
                  {habit.isPrivate && <span className="text-xs opacity-50">🔒</span>}
                  {habit.isHiddenFromFlow && <span className="text-[8px] font-black bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Hidden</span>}
                </div>
                {habit.description && <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">{habit.description}</p>}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Joined {new Date(habit.startDate).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                  <span className="text-[9px] font-black text-zinc-100 uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded">LVL {Math.floor((habit.disciplineScore || 0) / 10)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onToggleHideFromFlow(habit.id)}
                  className={`p-3 transition-colors active:scale-75 lg:opacity-0 lg:group-hover:opacity-100 ${habit.isHiddenFromFlow ? 'text-indigo-500 hover:text-indigo-400' : 'text-zinc-700 hover:text-zinc-400'}`}
                  title={habit.isHiddenFromFlow ? "Restore to Flow" : "Hide from Flow"}
                >
                  {habit.isHiddenFromFlow ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => onDelete(habit.id)}
                  className="p-3 text-zinc-700 hover:text-rose-500 transition-colors active:scale-75 lg:opacity-0 lg:group-hover:opacity-100"
                  title="Permanent Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
