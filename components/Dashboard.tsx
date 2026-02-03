
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
    if (hour < 12) return "What will make today a win?";
    if (hour < 17) return "Still time to recover.";
    return "Did today move you forward 1%?";
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
    // If not logged today, start from yesterday
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{timeGreeting}</h2>
          <p className="text-zinc-500 flex items-center gap-2">
            {motivationLine}
            <button 
              onClick={onToggleAntiMotivation}
              className="text-[10px] border border-zinc-800 px-2 py-0.5 rounded uppercase hover:bg-zinc-800 transition-colors"
            >
              {data.user?.antiMotivation ? "Stop Bluntness" : "Go Blunt"}
            </button>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-6">Daily Flow</h3>
        
        <div className="grid gap-4">
          {data.habits.length === 0 ? (
            <p className="text-zinc-500 italic py-4">No habits defined yet. Go to Vault to add some.</p>
          ) : (
            data.habits.map(habit => {
              const log = todayLogs.find(l => l.habitId === habit.id);
              const streak = calculateStreak(habit.id);
              return (
                <div key={habit.id} className="flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className={`font-medium transition-colors ${log?.status === 'completed' ? 'text-zinc-500' : 'text-zinc-100'}`}>
                      {habit.name} {habit.isPrivate && '🔒'}
                    </span>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">
                      Streak: {streak} days • {Math.round(habit.disciplineScore || 0)}% Discipline
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      disabled={!!log}
                      onClick={() => onLogHabit(habit.id, 'completed')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        log?.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                          : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                      }`}
                    >
                      ✓
                    </button>
                    <button 
                      disabled={!!log}
                      onClick={() => onLogHabit(habit.id, 'skipped')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        log?.status === 'skipped' 
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                          : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-4">Mood Check</h3>
          <div className="flex justify-between">
            {MOODS.map(m => (
              <button
                key={m.label}
                onClick={() => onSetMood(m.emoji)}
                className={`text-3xl p-3 rounded-2xl transition-all hover:scale-110 ${
                  todayMood === m.emoji ? 'bg-zinc-800 shadow-xl' : 'opacity-40 grayscale hover:grayscale-0'
                }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </section>

        <section className={`p-6 rounded-2xl border transition-all ${isDareDone ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-zinc-900/30 border-zinc-800'}`}>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-4 flex justify-between">
            Micro-Dare 
            {isDareDone && <span className="text-emerald-500">Done</span>}
          </h3>
          <p className="text-lg font-medium mb-4">{microDare}</p>
          {!isDareDone && (
            <button 
              onClick={onCompleteDare}
              className="bg-zinc-800 text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Mark Done
            </button>
          )}
        </section>
      </div>

      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-2xl border border-zinc-800">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Psychological Insight</h3>
        <p className="text-zinc-300 italic">
          "The first few days are easy. Motivation carries you. By Day 14, you'll want to quit. That's when Habita actually starts working."
        </p>
      </div>
    </div>
  );
};
