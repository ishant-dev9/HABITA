
import React, { useMemo } from 'react';
import { AppData } from '../types';

interface FutureYouProps {
  data: AppData;
}

export const FutureYou: React.FC<FutureYouProps> = ({ data }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const relevantMessage = useMemo(() => {
    // Show messages written exactly X days ago
    const diffs = [7, 30, 90, 365];
    for (const diff of diffs) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - diff);
      const pastDateStr = pastDate.toISOString().split('T')[0];
      
      const found = data.messages.find(m => m.timestamp.split('T')[0] === pastDateStr);
      if (found) return { message: found, type: `A message from ${diff} days ago` };
    }
    return null;
  }, [data.messages]);

  const habitReplays = useMemo(() => {
    return data.habits.map(h => {
      const logs = data.logs.filter(l => l.habitId === h.id && l.status === 'completed');
      const ageInDays = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 3600 * 24));
      
      if (ageInDays >= 21) {
        return {
          id: h.id,
          name: h.name,
          story: [
            "Day 1: You decided this mattered.",
            "Day 7: You showed up when it was hard.",
            `Day ${ageInDays}: This is now part of who you are.`
          ]
        };
      }
      return null;
    }).filter(Boolean);
  }, [data.habits, data.logs]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Future</h2>
        <p className="text-zinc-500">You are the bridge between who you were and who you will be.</p>
      </header>

      {relevantMessage ? (
        <section className="bg-indigo-950/20 border border-indigo-500/30 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-1 rounded uppercase">Past Self</span>
          </div>
          <h3 className="text-lg font-bold mb-4">{relevantMessage.type}</h3>
          <p className="text-xl italic text-zinc-100 font-serif leading-relaxed">
            "{relevantMessage.message.content}"
          </p>
        </section>
      ) : (
        <section className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl text-center">
          <p className="text-zinc-500 italic">No messages from your past self today. Keep building so you have something to tell yourself later.</p>
        </section>
      )}

      <div className="grid gap-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600">Habit Memory Replays</h3>
        {habitReplays.length === 0 ? (
          <p className="text-zinc-600 italic">Complete a habit for 21 days to unlock its narrative replay.</p>
        ) : (
          habitReplays.map((replay: any) => (
            <div key={replay.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl space-y-4">
              <h4 className="text-2xl font-bold">{replay.name}</h4>
              <div className="space-y-6 relative ml-4 border-l border-zinc-800 pl-8 py-2">
                {replay.story.map((step: string, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-950"></div>
                    <p className="text-zinc-300 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
