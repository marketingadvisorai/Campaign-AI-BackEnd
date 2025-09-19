import React, { useState } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { TopBar } from './dashboard/TopBar';
import { DashboardHome } from './dashboard/DashboardHome';
import { Workspaces } from './dashboard/Workspaces';
import { Campaigns } from './dashboard/Campaigns';
import { Recommendations } from './dashboard/Recommendations';
import { ModelTraining } from './dashboard/ModelTraining';
import { Users } from './dashboard/Users';
import { Integrations } from './dashboard/Integrations';
import { Billing } from './dashboard/Billing';
import { AuditLog } from './dashboard/AuditLog';
import { Settings } from './dashboard/Settings';

export function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  const renderContent = () => {
    const props = { selectedClient, setSelectedClient };
    
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome {...props} />;
      case 'clients':
        return <Workspaces {...props} />;
      case 'campaigns':
        return <Campaigns {...props} />;
      case 'recommendations':
        return <Recommendations {...props} />;
      case 'model-training':
        return <ModelTraining {...props} />;
      case 'billing':
        return <Billing {...props} />;
      case 'integrations':
        return <Integrations {...props} />;
      case 'audit':
        return <AuditLog {...props} />;
      case 'settings':
        return <Settings {...props} />;
      default:
        return <DashboardHome {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        selectedClient={selectedClient}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <TopBar
          user={user}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onClientSelect={setSelectedClient}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}