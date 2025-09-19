import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  Plus, 
  Filter, 
  Building2, 
  DollarSign, 
  Users, 
  Target,
  Zap,
  Settings,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Globe,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Workspaces({ selectedClient, setSelectedClient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock client data - in real app, fetch from API
  const clients = [
    {
      id: '999-221-223',
      name: 'TechStart Solutions',
      email: 'admin@techstart.com',
      status: 'active',
      plan: 'Pro',
      monthlySpend: 15420,
      tokensUsed: 12840,
      tokensLimit: 15000,
      campaigns: 12,
      connectedAccounts: ['google_ads', 'facebook'],
      lastActivity: '2 hours ago',
      joinDate: '2024-01-15',
      contactPerson: 'Sarah Chen',
      industry: 'Technology'
    },
    {
      id: '888-334-556',
      name: 'Digital Marketing Pro',
      email: 'contact@digipro.com',
      status: 'active',
      plan: 'Pro',
      monthlySpend: 8950,
      tokensUsed: 7650,
      tokensLimit: 10000,
      campaigns: 8,
      connectedAccounts: ['google_ads'],
      lastActivity: '1 day ago',
      joinDate: '2024-02-20',
      contactPerson: 'Mike Rodriguez',
      industry: 'Marketing'
    },
    {
      id: '777-445-667',
      name: 'E-commerce Hub',
      email: 'hello@ecomhub.com',
      status: 'trial',
      plan: 'Trial',
      monthlySpend: 3200,
      tokensUsed: 2890,
      tokensLimit: 5000,
      campaigns: 6,
      connectedAccounts: ['facebook'],
      lastActivity: '3 hours ago',
      joinDate: '2024-06-01',
      contactPerson: 'Lisa Wang',
      industry: 'E-commerce'
    },
    {
      id: '666-558-779',
      name: 'Local Fitness Gym',
      email: 'info@fitgym.com',
      status: 'paused',
      plan: 'Starter',
      monthlySpend: 0,
      tokensUsed: 0,
      tokensLimit: 2500,
      campaigns: 2,
      connectedAccounts: [],
      lastActivity: '2 weeks ago',
      joinDate: '2024-03-10',
      contactPerson: 'Tom Stevens',
      industry: 'Fitness'
    },
    {
      id: '555-669-881',
      name: 'Restaurant Chain Co',
      email: 'marketing@restaurantchain.com',
      status: 'active',
      plan: 'Enterprise',
      monthlySpend: 25800,
      tokensUsed: 18950,
      tokensLimit: 25000,
      campaigns: 18,
      connectedAccounts: ['google_ads', 'facebook', 'linkedin'],
      lastActivity: '30 minutes ago',
      joinDate: '2023-11-05',
      contactPerson: 'David Kim',
      industry: 'Food & Beverage'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || colors.active;
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'google_ads':
        return <Globe className="h-4 w-4 text-blue-600" />;
      case 'facebook':
        return <div className="h-4 w-4 bg-blue-500 rounded"></div>;
      case 'linkedin':
        return <div className="h-4 w-4 bg-blue-700 rounded"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Client Account Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all client accounts and their campaign performance
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl text-card-foreground">{clients.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl text-card-foreground">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl text-card-foreground">
                  ${clients.reduce((sum, c) => sum + c.monthlySpend, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl text-card-foreground">
                  {clients.reduce((sum, c) => sum + c.campaigns, 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clients by ID, name, email, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded-md text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" className="border-border">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Client Accounts</CardTitle>
          <CardDescription className="text-muted-foreground">
            Showing {filteredClients.length} of {clients.length} clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monthly Spend</TableHead>
                  <TableHead>Token Usage</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Connected Platforms</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-accent">
                    <TableCell>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-blue-400">{client.id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                            className="p-0 h-auto text-foreground hover:text-blue-400"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium text-card-foreground">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.contactPerson}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border">
                        {client.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-card-foreground">${client.monthlySpend.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">this month</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-card-foreground">
                          {client.tokensUsed.toLocaleString()} / {client.tokensLimit.toLocaleString()}
                        </div>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((client.tokensUsed / client.tokensLimit) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((client.tokensUsed / client.tokensLimit) * 100)}% used
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg text-card-foreground">{client.campaigns}</div>
                        <div className="text-xs text-muted-foreground">active</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {client.connectedAccounts.map((platform) => (
                          <div key={platform} title={platform.replace('_', ' ')}>
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                        {client.connectedAccounts.length === 0 && (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-card-foreground">{client.lastActivity}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem 
                            className="text-popover-foreground hover:bg-accent"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}