
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitManagerProps {
  habits: Habit[];
  onAdd: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitManager: React.FC<HabitManagerProps> = ({ habits, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      description: newDesc,
      startDate: new Date().toISOString(),
      isPrivate,
      disciplineScore: 0
    };

    onAdd(habit);
    setNewName('');
    setNewDesc('');
    setIsPrivate(false);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Architecture</p>
          <h2 className="text-3xl font-black tracking-tight">The Vault</h2>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-5 py-3 rounded-2xl font-bold transition-all active:scale-90 shadow-lg ${
            isAdding ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-950'
          }`}
        >
          {isAdding ? 'Close' : 'New Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Identity</label>
            <input 
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              placeholder="e.g. Deep Work"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Purpose</label>
            <textarea 
              value={newDesc} 
              onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all h-24"
              placeholder="Why does this matter?"
            />
          </div>
          <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <input 
              type="checkbox" 
              id="isPrivate" 
              checked={isPrivate} 
              onChange={e => setIsPrivate(e.target.checked)}
              className="w-5 h-5 bg-zinc-900 border-zinc-800 rounded accent-zinc-100"
            />
            <label htmlFor="isPrivate" className="text-sm font-bold text-zinc-400">Lock to Privacy 🔒</label>
          </div>
          <button type="submit" className="w-full bg-zinc-100 text-zinc-950 py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl transform transition-all active:scale-95">
            Initialize Habit
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-zinc-800 rounded-[2.5rem] bg-zinc-900/20">
            <p className="text-zinc-600 font-medium">The vault is silent.</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between group transition-all hover:bg-zinc-900/60 backdrop-blur-sm">
              <div className="max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold truncate">
                    {habit.name}
                  </h4>
                  {habit.isPrivate && <span className="text-xs">🔒</span>}
                </div>
                {habit.description && <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-2">{habit.description}</p>}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Joined {new Date(habit.startDate).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                  <span className="text-[9px] font-black text-zinc-100 uppercase tracking-widest">LVL {Math.floor((habit.disciplineScore || 0) / 10)}</span>
                </div>
              </div>
              <button 
                onClick={() => onDelete(habit.id)}
                className="p-3 text-zinc-700 hover:text-rose-500 transition-colors active:scale-75"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
