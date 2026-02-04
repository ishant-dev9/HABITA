
import React, { useState } from 'react';
import { Habit, ChecklistItem } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface HabitConfigPanelProps {
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

export const HabitConfigPanel: React.FC<HabitConfigPanelProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [pattern, setPattern] = useState<'Every Day' | 'Custom'>('Every Day');
  const [goalValue, setGoalValue] = useState(1);
  const [goalUnit, setGoalUnit] = useState('times');
  const [goalPeriod, setGoalPeriod] = useState('per day');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['Morning']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endCondition, setEndCondition] = useState('Never');
  const [customEndDate, setCustomEndDate] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [isMagicFilling, setIsMagicFilling] = useState(false);

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const addChecklistItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist([...checklist, { id: Math.random().toString(), text: newCheckItem, completed: false }]);
    setNewCheckItem('');
  };

  const handleMagicFill = async () => {
    setIsMagicFilling(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = name.trim() 
        ? `Optimize this habit configuration for long-term success: "${name}". Suggest realistic goals and timing.`
        : `Suggest a random high-impact "Habit of Excellence" for a high-performer. Include name, frequency, goal, and best time of day.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the habit" },
              frequency: { type: Type.STRING, enum: ["Daily", "Weekly", "Monthly"] },
              pattern: { type: Type.STRING, enum: ["Every Day", "Custom"] },
              goalValue: { type: Type.NUMBER },
              goalUnit: { type: Type.STRING, description: "Unit of measurement (e.g., mins, times, pages)" },
              goalPeriod: { type: Type.STRING, enum: ["per day", "per week"] },
              selectedTimes: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] } 
              }
            },
            required: ["name", "frequency", "pattern", "goalValue", "goalUnit", "goalPeriod", "selectedTimes"]
          }
        }
      });

      const data = JSON.parse(response.text);
      if (data) {
        setName(data.name);
        setFrequency(data.frequency);
        setPattern(data.pattern);
        setGoalValue(data.goalValue);
        setGoalUnit(data.goalUnit);
        setGoalPeriod(data.goalPeriod);
        setSelectedTimes(data.selectedTimes);
      }
    } catch (error) {
      console.error("Magic Fill failed:", error);
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleSave = () => {
    if (!name) return;
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      startDate,
      isPrivate: false,
      disciplineScore: 0,
      frequency,
      pattern,
      goal: { value: goalValue, unit: goalUnit, period: goalPeriod },
      timeOfDay: selectedTimes,
      endCondition,
      customEndDate: endCondition === 'Custom date' ? customEndDate : undefined,
      areas,
      checklist
    };
    onSave(newHabit);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop for Desktop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm md:backdrop-blur-md"
        onClick={onCancel}
      />
      
      {/* Configuration Card */}
      <div className="relative w-full h-full bg-[#09090b] flex flex-col animate-in slide-in-from-bottom duration-300 lg:max-w-2xl lg:h-auto lg:max-h-[90vh] lg:rounded-[2.5rem] lg:border lg:border-zinc-800 lg:shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-5 lg:p-6 border-b border-zinc-800 flex-shrink-0">
          <button onClick={onCancel} className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-zinc-300 transition-colors">Cancel</button>
          <h2 className="text-lg font-black tracking-tight">New Habit</h2>
          <div className="flex gap-2">
             <span className="text-[8px] font-black bg-zinc-900 border border-zinc-800 text-zinc-600 px-2 py-1 rounded opacity-50">Fitbit</span>
             <span className="text-[8px] font-black bg-zinc-900 border border-zinc-800 text-zinc-600 px-2 py-1 rounded opacity-50">Strava</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 lg:space-y-10 pb-20 lg:pb-8">
          {/* Habit Name */}
          <section className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Identity</label>
              <button 
                onClick={handleMagicFill}
                disabled={isMagicFilling}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${isMagicFilling ? 'text-zinc-500 animate-pulse cursor-wait' : 'text-indigo-500 hover:text-indigo-400'}`}
              >
                {isMagicFilling ? '✨ Manifesting...' : '✨ Magic Fill'}
              </button>
            </div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Habit Name"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 lg:p-5 text-xl font-bold placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
            />
          </section>

          {/* Repeat Grid */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Repeat</label>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 lg:p-4 text-sm font-bold focus:outline-none focus:bg-zinc-800 cursor-pointer"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <select 
                value={pattern}
                onChange={(e) => setPattern(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 lg:p-4 text-sm font-bold focus:outline-none focus:bg-zinc-800 cursor-pointer"
              >
                <option>Every Day</option>
                <option>Custom</option>
              </select>
            </div>
          </section>

          {/* Goal Compact */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Goal</label>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 lg:p-4">
              <input 
                type="number" 
                value={goalValue}
                onChange={(e) => setGoalValue(parseInt(e.target.value) || 0)}
                className="w-12 bg-transparent text-center font-black text-xl focus:outline-none" 
              />
              <select 
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
              >
                <option>times</option>
                <option>mins</option>
                <option>liters</option>
                <option>km</option>
                <option>pages</option>
              </select>
              <select 
                value={goalPeriod}
                onChange={(e) => setGoalPeriod(e.target.value)}
                className="bg-transparent text-zinc-500 font-bold text-[10px] uppercase cursor-pointer"
              >
                <option>per day</option>
                <option>per week</option>
              </select>
            </div>
          </section>

          {/* Time of Day */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Time of Day</label>
            <div className="grid grid-cols-3 gap-3">
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleTime(time)}
                  className={`py-3 lg:py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all active:scale-95 ${
                    selectedTimes.includes(time) 
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-950' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          {/* Start Date & End Condition Desktop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-zinc-600"
              />
            </section>
            <section className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Ends</label>
              <select 
                value={endCondition}
                onChange={(e) => setEndCondition(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option>Never</option>
                <option>After 21 days</option>
                <option>Custom date</option>
              </select>
              {endCondition === 'Custom date' && (
                <input 
                  type="date" 
                  value={customEndDate}
                  min={startDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-zinc-600 animate-in fade-in slide-in-from-top-1 duration-200"
                />
              )}
            </section>
          </div>

          {/* Area Compact */}
          <section className="space-y-3">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Area</label>
            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-zinc-500 cursor-pointer">
              <option>Select areas</option>
              <option>Health</option>
              <option>Finance</option>
              <option>Spirituality</option>
              <option>Productivity</option>
            </select>
          </section>

          {/* Checklist Refined */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Checklist</label>
            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-3.5 h-3.5 rounded-sm border border-zinc-700"></div>
                  <span className="text-xs font-medium text-zinc-300">{item.text}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  placeholder="Add checklist item..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <button 
                  type="button"
                  onClick={addChecklistItem}
                  className="bg-zinc-800 px-4 rounded-xl text-lg font-bold text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions Container */}
        <footer className="p-5 lg:p-6 border-t border-zinc-800 bg-[#09090b] flex-shrink-0">
          <button 
            type="button"
            onClick={handleSave}
            disabled={!name || isMagicFilling}
            className="w-full bg-zinc-100 text-zinc-950 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-20 transition-all active:scale-[0.98] hover:bg-white"
          >
            Forge Habit
          </button>
        </footer>
      </div>
    </div>
  );
};
