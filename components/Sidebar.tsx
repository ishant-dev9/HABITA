
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Flow', icon: '⚡' },
    { id: 'habits', label: 'Vault', icon: '🔒' },
    { id: 'analytics', label: 'Mirror', icon: '📊' },
    { id: 'future', label: 'Future', icon: '⏳' },
    { id: 'experiments', label: 'Lab', icon: '🧪' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-950 flex-col h-full">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter">HABITA</h1>
        </div>
        
        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-zinc-900 text-zinc-100 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-zinc-900">
          <div className="flex items-center gap-4 p-2">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-sm font-bold uppercase ring-1 ring-zinc-700">
              {user.username[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-200 truncate">{user.username}</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Active Member</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-t border-zinc-800 px-2 py-3">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                currentView === item.id 
                  ? 'text-zinc-100' 
                  : 'text-zinc-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              {currentView === item.id && (
                <div className="w-1 h-1 rounded-full bg-zinc-100 absolute bottom-1"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
