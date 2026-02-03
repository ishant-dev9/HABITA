
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
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 my-auto">
        <header className="text-center space-y-3">
          <div className="w-12 h-12 bg-zinc-100 text-zinc-950 font-black rounded-xl flex items-center justify-center text-xl mx-auto mb-6 shadow-xl">H</div>
          <h1 className="text-5xl font-black tracking-tighter">HABITA</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Forging Long-Term Consistency</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] shadow-2xl">
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">The Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-600 mb-2 tracking-widest">Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                    placeholder="e.g. Archer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-600 mb-2 tracking-widest">Email (Vault Key)</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                    placeholder="e.g. neo@habita.net"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">The Horizon</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">Where will you be when the work is done?</p>
              <div className="space-y-4">
                {[30, 90, 365].map((days, i) => (
                  <div key={days}>
                    <label className="block text-[10px] font-black uppercase text-zinc-600 mb-2 tracking-widest">{days} Days Ahead</label>
                    <input 
                      type="text" 
                      value={goals[i]} 
                      onChange={e => {
                        const newGoals = [...goals];
                        newGoals[i] = e.target.value;
                        setGoals(newGoals);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                      placeholder={`Target for ${days} days...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center py-4">
              <h2 className="text-3xl font-black tracking-tight">Contract Signed.</h2>
              <p className="text-zinc-400 font-medium italic leading-relaxed text-lg">
                "No one is coming to save you. No one is going to push you. It is just you against the version of you that wants to quit."
              </p>
              <p className="text-[10px] text-zinc-700 uppercase font-black tracking-[0.3em]">Are you ready?</p>
            </div>
          )}

          <button 
            onClick={handleNext}
            disabled={step === 1 && !username}
            className="w-full bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest py-5 rounded-[1.5rem] mt-8 hover:bg-white transition-all transform active:scale-95 disabled:opacity-20 shadow-xl"
          >
            {step === 3 ? "Enter Sanctuary" : "Next Phase"}
          </button>
        </div>
        
        <div className="flex justify-center gap-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-300 ${s === step ? 'bg-zinc-100 w-16' : 'bg-zinc-800'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
