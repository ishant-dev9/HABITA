
import React, { useMemo } from 'react';
import { AppData, Habit, DailyLog, Mood } from '../types';
import { MOODS, MICRO_DARES, ANTI_MOTIVATION_LINES, NORMAL_LINES } from '../constants';

interface DashboardProps {
  data: AppData;
  onLogHabit: (id: string, status: 'completed' | 'skipped') => void;
  onSetMood: (mood: Mood) => void;
  onCompleteDare: () => void;
  onToggleAntiMotivation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onLogHabit, onSetMood, onCompleteDare, onToggleAntiMotivation }) => {
  const today = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  
  const timeGreeting = useMemo(() => {
    if (hour < 12) return "Rise and Conquer";
    if (hour < 17) return "Keep the Momentum";
    return "Finish Strong";
  }, [hour]);

  const motivationLine = useMemo(() => {
    const pool = data.user?.antiMotivation ? ANTI_MOTIVATION_LINES : NORMAL_LINES;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [data.user?.antiMotivation]);

  const microDare = useMemo(() => {
    const dayIndex = new Date().getDate() % MICRO_DARES.length;
    return MICRO_DARES[dayIndex];
  }, []);

  const todayLogs = data.logs.filter(l => l.date === today);
  const todayMood = data.moods.find(m => m.date === today)?.mood;
  const isDareDone = data.microDareCompletedDate === today;

  const calculateStreak = (habitId: string) => {
    const logs = [...data.logs]
      .filter(l => l.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    let checkDate = new Date();
    const loggedToday = logs.some(l => l.date === today);
    if (!loggedToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (const log of logs) {
      const logDateStr = log.date;
      const expectedDateStr = checkDate.toISOString().split('T')[0];
      
      if (log.status === 'completed' && logDateStr === expectedDateStr) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (log.status === 'skipped' || log.status === 'none') {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        <h2 className="text-3xl font-black tracking-tight">{timeGreeting}</h2>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-zinc-500 font-medium leading-tight line-clamp-2 flex-1 italic">
            "{motivationLine}"
          </p>
          <button 
            onClick={onToggleAntiMotivation}
            className="flex-shrink-0 text-[9px] font-black bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full uppercase tracking-widest hover:bg-zinc-800 transition-colors active:scale-95"
          >
            {data.user?.antiMotivation ? "Soft Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">The Daily Work</h3>
        
        <div className="grid gap-5">
          {data.habits.length === 0 ? (
            <div className="py-8 text-center bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-800">
              <p className="text-zinc-500 italic text-sm">No habits in the vault yet.</p>
            </div>
          ) : (
            data.habits.map(habit => {
              const log = todayLogs.find(l => l.habitId === habit.id);
              const streak = calculateStreak(habit.id);
              return (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5 max-w-[60%]">
                    <span className={`text-base font-bold transition-all truncate ${log?.status === 'completed' ? 'text-zinc-600 line-through opacity-50' : 'text-zinc-100'}`}>
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase">
                        {streak}d Streak
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                      <span className="text-[10px] font-black text-zinc-600 uppercase">
                        Score: {Math.round(habit.disciplineScore || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      disabled={!!log}
                      onClick={() => onLogHabit(habit.id, 'completed')}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                        log?.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20' 
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button 
                      disabled={!!log}
                      onClick={() => onLogHabit(habit.id, 'skipped')}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                        log?.status === 'skipped' 
                          ? 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem]">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Daily State</h3>
        <div className="flex justify-between items-center bg-zinc-950/50 p-2 rounded-[1.5rem] border border-zinc-800">
          {MOODS.map(m => (
            <button
              key={m.label}
              onClick={() => onSetMood(m.emoji)}
              className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-75 ${
                todayMood === m.emoji ? 'bg-zinc-800 shadow-xl scale-110' : 'opacity-30 grayscale hover:grayscale-0'
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </section>

      <section className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden ${isDareDone ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Micro-Dare</h3>
          {isDareDone && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Victory</span>}
        </div>
        <p className="text-xl font-bold mb-6 leading-tight">{microDare}</p>
        {!isDareDone && (
          <button 
            onClick={onCompleteDare}
            className="w-full bg-zinc-800 text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-zinc-700 transition-colors active:scale-95 shadow-lg"
          >
            Dare Completed
          </button>
        )}
      </section>

      <div className="bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-3xl text-center">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Wisdom</p>
        <p className="text-sm text-zinc-400 font-medium italic leading-relaxed">
          "Consistency is the silent engine of greatness. The goal isn't to be perfect, it's to be persistent."
        </p>
      </div>
    </div>
  );
};
