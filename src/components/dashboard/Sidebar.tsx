import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Target,
  Lightbulb,
  Plug,
  CreditCard,
  FileText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Building2,
  Brain
} from 'lucide-react';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: LayoutDashboard
  },
  {
    id: 'clients',
    label: 'Client Accounts',
    icon: Building2,
    badge: '47'
  },
  {
    id: 'campaigns',
    label: 'Campaign Management',
    icon: Target
  },
  {
    id: 'recommendations',
    label: 'AI Recommendations',
    icon: Lightbulb,
    badge: '12'
  },
  {
    id: 'model-training',
    label: 'AI Model Training',
    icon: Brain,
    badge: 'NEW'
  },
  {
    id: 'billing',
    label: 'Billing & Tokens',
    icon: CreditCard
  },
  {
    id: 'integrations',
    label: 'OAuth & Integrations',
    icon: Plug
  },
  {
    id: 'audit',
    label: 'Audit Log',
    icon: FileText
  },
  {
    id: 'settings',
    label: 'Admin Settings',
    icon: Settings
  }
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, selectedClient }) {
  return (
    <div className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-20 overflow-hidden ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
            <Zap className="h-8 w-8 text-blue-500 flex-shrink-0" />
            {isOpen && (
              <div className="min-w-0 flex-1">
                <h1 className="text-sidebar-foreground text-xl truncate">Campaign AI</h1>
                <p className="text-muted-foreground text-sm truncate">Admin Dashboard</p>
              </div>
            )}
          </div>
          
          {isOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Selected Client Indicator */}
        {selectedClient && isOpen && (
          <div className="mb-6 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-blue-400 font-mono truncate">{selectedClient.id}</span>
            </div>
            <p className="text-sidebar-foreground truncate text-sm">{selectedClient.name}</p>
            <p className="text-xs text-muted-foreground">Selected Client</p>
          </div>
        )}

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab(item.id)}
                className={`w-full justify-start text-left transition-all h-11 relative ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                    : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                } ${!isOpen && 'px-3 justify-center'}`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                {isOpen && (
                  <>
                    <span className="text-sm truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-blue-600 text-white text-xs h-5 px-2 flex-shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {!isOpen && item.badge && (
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Collapse button for collapsed state */}
        {!isOpen && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent justify-center"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}