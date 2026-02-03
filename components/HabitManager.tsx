
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">The Vault</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
        >
          {isAdding ? 'Cancel' : 'New Habit'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div>
            <label className="block text-sm font-bold uppercase text-zinc-600 mb-1">Name</label>
            <input 
              type="text" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-600"
              placeholder="e.g. Deep Work"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase text-zinc-600 mb-1">Description (Optional)</label>
            <textarea 
              value={newDesc} 
              onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-zinc-600"
              placeholder="Why does this matter?"
            />
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isPrivate" 
              checked={isPrivate} 
              onChange={e => setIsPrivate(e.target.checked)}
              className="w-4 h-4 bg-zinc-950 border-zinc-800 rounded"
            />
            <label htmlFor="isPrivate" className="text-sm font-medium text-zinc-400">Keep this habit private 🔒</label>
          </div>
          <button type="submit" className="w-full bg-zinc-100 text-zinc-950 py-3 rounded-lg font-bold hover:bg-white transition-all">
            Lock It In
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-600">The vault is empty. What are we building?</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group">
              <div>
                <h4 className="text-xl font-semibold flex items-center gap-2">
                  {habit.name} {habit.isPrivate && <span className="text-xs font-normal opacity-40">🔒</span>}
                </h4>
                {habit.description && <p className="text-sm text-zinc-500 mt-1">{habit.description}</p>}
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest mt-2">Started {new Date(habit.startDate).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => onDelete(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-500 transition-all p-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
