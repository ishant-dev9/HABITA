
import React, { useState, useEffect, useMemo } from 'react';
import { AppData, Habit, DailyLog, Mood, User, FutureMessage, MoodEntry, Experiment } from './types';
import { loadData, saveData } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { HabitManager } from './components/HabitManager';
import { Analytics } from './components/Analytics';
import { FutureYou } from './components/FutureYou';
import { Experiments } from './components/Experiments';
import { EmergencyButton } from './components/EmergencyButton';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [view, setView] = useState<'dashboard' | 'habits' | 'analytics' | 'future' | 'experiments'>('dashboard');
  const [showFirstVisit, setShowFirstVisit] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('habita_visited');
    if (!hasVisited) {
      setShowFirstVisit(true);
      localStorage.setItem('habita_visited', 'true');
    }
  }, []);

  const handleUpdateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleAddHabit = (habit: Habit) => {
    setData(prev => ({ ...prev, habits: [...prev.habits, habit] }));
  };

  const handleLogHabit = (habitId: string, status: 'completed' | 'skipped') => {
    const today = new Date().toISOString().split('T')[0];
    const newLogs = data.logs.filter(l => !(l.date === today && l.habitId === habitId));
    newLogs.push({ date: today, habitId, status });
    
    // Update Discipline Score (Invisible Progress Meter)
    const updatedHabits = data.habits.map(h => {
      if (h.id === habitId) {
        const increment = status === 'completed' ? 1.5 : -0.5;
        return { ...h, disciplineScore: Math.max(0, Math.min(100, (h.disciplineScore || 0) + increment)) };
      }
      return h;
    });

    setData(prev => ({ ...prev, logs: newLogs, habits: updatedHabits }));
  };

  const handleSetMood = (mood: Mood) => {
    const today = new Date().toISOString().split('T')[0];
    const newMoods = data.moods.filter(m => m.date !== today);
    newMoods.push({ date: today, mood });
    setData(prev => ({ ...prev, moods: newMoods }));
  };

  // Check Inactivity for Emergency Button
  const lastActivityDate = useMemo(() => {
    if (data.logs.length === 0) return null;
    const sorted = [...data.logs].sort((a, b) => b.date.localeCompare(a.date));
    return new Date(sorted[0].date);
  }, [data.logs]);

  const showEmergency = useMemo(() => {
    if (!lastActivityDate) return false;
    const diff = (new Date().getTime() - lastActivityDate.getTime()) / (1000 * 3600 * 24);
    return diff >= 2;
  }, [lastActivityDate]);

  if (!data.user) {
    return <Onboarding onComplete={(user, goals) => {
      const messages: FutureMessage[] = goals.map((g, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        targetDate: new Date(Date.now() + [30, 90, 365][i] * 24 * 3600 * 1000).toISOString().split('T')[0],
        content: g,
        authorVersion: 'past',
        timestamp: new Date().toISOString()
      }));
      setData({ ...data, user, messages });
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden">
      <Sidebar currentView={view} setView={setView} user={data.user} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {showFirstVisit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-bold mb-4">Welcome to HABITA</h2>
              <p className="text-zinc-400 mb-6">Made with love by IKS ❤️</p>
              <button 
                onClick={() => setShowFirstVisit(false)}
                className="w-full bg-zinc-100 text-zinc-950 font-medium py-2 rounded-lg hover:bg-white transition-colors"
              >
                Let's Build
              </button>
            </div>
          </div>
        )}

        {showEmergency && <EmergencyButton lastActivity={lastActivityDate} habits={data.habits} onClose={() => {}} />}

        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {view === 'dashboard' && (
            <Dashboard 
              data={data} 
              onLogHabit={handleLogHabit} 
              onSetMood={handleSetMood}
              onCompleteDare={() => setData(prev => ({ ...prev, microDareCompletedDate: new Date().toISOString().split('T')[0] }))}
              onToggleAntiMotivation={() => {
                const updatedUser = { ...data.user!, antiMotivation: !data.user!.antiMotivation };
                setData(prev => ({ ...prev, user: updatedUser }));
              }}
            />
          )}
          {view === 'habits' && (
            <HabitManager 
              habits={data.habits} 
              onAdd={handleAddHabit} 
              onDelete={(id) => setData(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }))}
            />
          )}
          {view === 'analytics' && <Analytics data={data} />}
          {view === 'future' && <FutureYou data={data} />}
          {view === 'experiments' && (
            <Experiments 
              experiments={data.experiments} 
              onUpdate={(exps) => setData(prev => ({ ...prev, experiments: exps }))} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
