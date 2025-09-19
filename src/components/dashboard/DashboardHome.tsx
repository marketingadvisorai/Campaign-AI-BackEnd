import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  DollarSign, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  Users,
  BarChart3,
  Building2,
  Shield,
  Globe,
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function DashboardHome({ selectedClient, setSelectedClient }) {
  const [metrics, setMetrics] = useState({
    totalClients: 47,
    activeClients: 42,
    totalRevenue: 124500,
    tokensUsed: 85600,
    tokensAllocated: 120000,
    activeCampaigns: 186,
    avgClientSpend: 2650
  });

  const [revenueData] = useState([
    { name: 'Jan', revenue: 42000, tokens: 35000 },
    { name: 'Feb', revenue: 38000, tokens: 32000 },
    { name: 'Mar', revenue: 51000, tokens: 42000 },
    { name: 'Apr', revenue: 48000, tokens: 39000 },
    { name: 'May', revenue: 56000, tokens: 46000 },
    { name: 'Jun', revenue: 62000, tokens: 51000 }
  ]);

  const [clientStatusData] = useState([
    { name: 'Active', value: 42, color: '#10b981' },
    { name: 'Trial', value: 8, color: '#3b82f6' },
    { name: 'Paused', value: 5, color: '#f59e0b' },
    { name: 'Cancelled', value: 2, color: '#ef4444' }
  ]);

  const topClients = [
    {
      id: '999-221-223',
      name: 'TechStart Solutions',
      monthlySpend: 15420,
      tokensUsed: 12840,
      campaigns: 12,
      status: 'active'
    },
    {
      id: '888-334-556',
      name: 'Digital Marketing Pro',
      monthlySpend: 8950,
      tokensUsed: 7650,
      campaigns: 8,
      status: 'active'
    },
    {
      id: '777-445-667',
      name: 'E-commerce Hub',
      monthlySpend: 6200,
      tokensUsed: 5890,
      campaigns: 6,
      status: 'trial'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Token Usage High',
      message: '5 clients approaching token limits',
      action: 'Review Billing'
    },
    {
      id: 2,
      type: 'info',
      title: 'OAuth Renewal Needed',
      message: '3 Google Ads connections expire soon',
      action: 'Contact Clients'
    },
    {
      id: 3,
      type: 'success',
      title: 'New Integrations',
      message: '2 clients connected Facebook Business Manager',
      action: 'View Details'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {selectedClient ? (
        // Selected Client View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedClient(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to Overview
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl text-foreground">{selectedClient.name}</h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="font-mono text-blue-400">{selectedClient.id}</span>
                    <Badge className={`${getStatusColor(selectedClient.status)} text-white`}>
                      {selectedClient.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-border text-foreground">
                <Target className="mr-2 h-4 w-4" />
                Manage Campaigns
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="mr-2 h-4 w-4" />
                Client Settings
              </Button>
            </div>
          </div>

          {/* Client-specific metrics cards would go here */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Spend</p>
                    <p className="text-2xl text-card-foreground">${selectedClient.monthlySpend?.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            {/* Add more client-specific cards */}
          </div>
        </div>
      ) : (
        // Admin Overview
        <div className="space-y-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl text-foreground mb-4">Campaign AI Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Manage client accounts, monitor AI optimization performance, and oversee platform operations
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-8">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setActiveTab?.('clients')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Manage Clients
              </Button>
              <Button variant="outline" className="border-border text-foreground">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-accent text-accent-foreground px-3 py-1">
                {metrics.totalClients} Total Clients
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground px-3 py-1">
                {metrics.activeCampaigns} Active Campaigns
              </Badge>
              <Badge variant="secondary" className="bg-accent text-accent-foreground px-3 py-1">
                AI Optimization Active
              </Badge>
            </div>
          </div>

          {/* Admin KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Clients</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-card-foreground">{metrics.totalClients}</div>
                <div className="flex items-center space-x-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3" />
                  <span>{metrics.activeClients} active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-card-foreground">${metrics.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3" />
                  <span>+18.2% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">Token Usage</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-card-foreground">{metrics.tokensUsed.toLocaleString()}</div>
                <div className="mt-2">
                  <Progress 
                    value={(metrics.tokensUsed / metrics.tokensAllocated) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {((metrics.tokensUsed / metrics.tokensAllocated) * 100).toFixed(1)}% of allocated
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">Avg Client Spend</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-card-foreground">${metrics.avgClientSpend.toLocaleString()}</div>
                <div className="flex items-center space-x-1 text-xs text-blue-500">
                  <ArrowUp className="h-3 w-3" />
                  <span>+8.7% per client</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-card-foreground">Revenue & Token Usage</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monthly revenue and token consumption trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                    <Bar dataKey="tokens" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Client Status Distribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Client Status</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Distribution of client account statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={clientStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {clientStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {clientStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-card-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clients */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Top Clients by Spend</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Highest spending clients this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topClients.map((client) => (
                  <div 
                    key={client.id} 
                    className="flex items-center justify-between p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/80 transition-colors"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-blue-400">{client.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {client.campaigns} campaigns
                          </Badge>
                        </div>
                        <div className="text-sm text-accent-foreground">{client.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-accent-foreground">${client.monthlySpend.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{client.tokensUsed} tokens</div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-border text-foreground"
                  onClick={() => setActiveTab?.('clients')}
                >
                  View All Clients
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">System Alerts</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Important notifications requiring admin attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 p-3 bg-accent rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'warning' ? 'bg-yellow-500' :
                      alert.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-accent-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto mt-2">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-border text-foreground">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}