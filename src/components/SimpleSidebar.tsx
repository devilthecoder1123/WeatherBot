import React from 'react';
import { LayoutDashboard, Users, Settings, MessageSquare } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SimpleSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Bot Settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-6">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Weather Bot</h1>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Quick Start</h3>
        <ol className="text-xs text-slate-400 space-y-1">
          <li>1. Get bot token from @BotFather</li>
          <li>2. Get weather API key</li>
          <li>3. Configure in Bot Settings</li>
          <li>4. Run: npm run bot</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleSidebar;