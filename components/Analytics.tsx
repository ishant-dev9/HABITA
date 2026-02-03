
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
// MOODS is exported from constants.ts, not types.ts. It is unused here, so removing it.
import { AppData } from '../types';

interface AnalyticsProps {
  data: AppData;
}

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayLogs = data.logs.filter(l => l.date === date);
      const completions = dayLogs.filter(l => l.status === 'completed').length;
      return {
        date: date.slice(5),
        completions,
      };
    });
  }, [data.logs]);

  const moodHabitCorrelation = useMemo(() => {
    const stats: Record<string, { total: number; counts: Record<string, number> }> = {};
    
    data.habits.forEach(h => {
      stats[h.name] = { total: 0, counts: {} };
    });

    data.logs.forEach(log => {
      if (log.status === 'completed') {
        const moodEntry = data.moods.find(m => m.date === log.date);
        const habit = data.habits.find(h => h.id === log.habitId);
        if (moodEntry && habit) {
          stats[habit.name].total++;
          stats[habit.name].counts[moodEntry.mood] = (stats[habit.name].counts[moodEntry.mood] || 0) + 1;
        }
      }
    });

    return Object.entries(stats).map(([name, data]) => {
      const dominantMood = Object.entries(data.counts).sort((a, b) => b[1] - a[1])[0];
      return {
        name,
        mood: dominantMood ? dominantMood[0] : 'None',
        percent: dominantMood ? Math.round((dominantMood[1] / data.total) * 100) : 0
      };
    });
  }, [data.logs, data.moods, data.habits]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Mirror</h2>
        <p className="text-zinc-500">Raw data doesn't lie.</p>
      </header>

      <section className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl h-[400px]">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-6">Completion Over Time (7 Days)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
            <XAxis dataKey="date" stroke="#3f3f46" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#3f3f46" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#fafafa' }}
            />
            <Line type="monotone" dataKey="completions" stroke="#a1a1aa" strokeWidth={3} dot={{ r: 4, fill: '#fafafa' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-4">Mood Correlation</h3>
          <div className="space-y-4">
            {moodHabitCorrelation.length === 0 ? (
              <p className="text-zinc-600 text-sm italic">Need more logs to generate correlation maps...</p>
            ) : (
              moodHabitCorrelation.map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <span className="font-medium">{item.name}</span>
                  <div className="text-right">
                    <span className="text-xl mr-2">{item.mood}</span>
                    <span className="text-xs text-zinc-500 font-bold">{item.percent}% correlation</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-4">Invisible Meters</h3>
          <div className="space-y-6">
            {data.habits.map(habit => (
              <div key={habit.id}>
                <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 mb-2">
                  <span>{habit.name}</span>
                  <span>{Math.round(habit.disciplineScore || 0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-100 transition-all duration-1000" 
                    style={{ width: `${habit.disciplineScore || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-zinc-600 italic mt-4 text-center">
              These meters grow with consistency and never reset. They measure your inner core.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
