
import React, { useState } from 'react';
import { User } from '../types';

interface OnboardingProps {
  onComplete: (user: User, goals: string[]) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [goals, setGoals] = useState(['', '', '']);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        joinDate: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        onboarded: true,
        antiMotivation: false
      };
      onComplete(user, goals);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">HABITA</h1>
          <p className="text-zinc-500 font-medium">Build your core, brick by brick.</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Who are you?</h2>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600"
                  placeholder="Archer"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600"
                  placeholder="archer@habita.net"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">The Future You</h2>
              <p className="text-sm text-zinc-500">Where do you want to be in:</p>
              {[30, 90, 365].map((days, i) => (
                <div key={days}>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">{days} Days</label>
                  <input 
                    type="text" 
                    value={goals[i]} 
                    onChange={e => {
                      const newGoals = [...goals];
                      newGoals[i] = e.target.value;
                      setGoals(newGoals);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="e.g., Fluent in React"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold">Ready.</h2>
              <p className="text-zinc-400 italic">
                "Habita is not a social app. There are no likes here. No followers. Only you, and the version of you that exists in the future. We don't care about your excuses."
              </p>
            </div>
          )}

          <button 
            onClick={handleNext}
            disabled={step === 1 && !username}
            className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl mt-8 hover:bg-white transition-all disabled:opacity-50"
          >
            {step === 3 ? "Begin the Work" : "Continue"}
          </button>
        </div>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 w-8 rounded-full ${s === step ? 'bg-zinc-100' : 'bg-zinc-800'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
