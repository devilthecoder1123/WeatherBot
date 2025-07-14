import React, { useState } from 'react';
import SimpleSidebar from './components/SimpleSidebar';
import SimpleDashboard from './components/SimpleDashboard';
import SimpleUserManagement from './components/SimpleUserManagement';
import SimpleBotSettings from './components/SimpleBotSettings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SimpleDashboard />;
      case 'users':
        return <SimpleUserManagement />;
      case 'settings':
        return <SimpleBotSettings />;
      default:
        return <SimpleDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SimpleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-x-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;