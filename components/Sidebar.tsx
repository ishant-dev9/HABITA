
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
    <nav className="w-20 md:w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tighter hidden md:block">HABITA</h1>
        <div className="md:hidden font-bold text-xl">H</div>
      </div>
      
      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              currentView === item.id 
                ? 'bg-zinc-900 text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-900">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold uppercase">
            {user.username[0]}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-zinc-300 truncate">{user.username}</p>
            <p className="text-[10px] text-zinc-600">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
