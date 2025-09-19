import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  User,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit,
  Plus,
  Clock
} from 'lucide-react';

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const auditEvents = [
    {
      id: 1,
      timestamp: '2024-03-15 14:30:22',
      user: 'John Smith',
      userEmail: 'john.smith@company.com',
      action: 'campaign_created',
      type: 'campaign',
      description: 'Created new campaign "Summer Sale 2024"',
      details: {
        campaign: 'Summer Sale 2024',
        platform: 'Google Ads',
        budget: 500
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 122.0.0.0',
      severity: 'info'
    },
    {
      id: 2,
      timestamp: '2024-03-15 14:25:11',
      user: 'Sarah Johnson',
      userEmail: 'sarah.j@company.com',
      action: 'budget_modified',
      type: 'campaign',
      description: 'Increased daily budget for "Holiday Shopping" from $800 to $1,280',
      details: {
        campaign: 'Holiday Shopping',
        oldBudget: 800,
        newBudget: 1280,
        reason: 'AI recommendation applied'
      },
      ipAddress: '192.168.1.101',
      userAgent: 'Chrome 122.0.0.0',
      severity: 'warning'
    },
    {
      id: 3,
      timestamp: '2024-03-15 14:20:45',
      user: 'System',
      userEmail: 'system@campaignai.com',
      action: 'api_key_rotated',
      type: 'security',
      description: 'OpenAI API key automatically rotated',
      details: {
        provider: 'OpenAI',
        reason: 'Scheduled rotation',
        previousKeyLastUsed: '2024-03-15 14:19:30'
      },
      ipAddress: 'N/A',
      userAgent: 'System Process',
      severity: 'info'
    },
    {
      id: 4,
      timestamp: '2024-03-15 14:15:33',
      user: 'Mike Chen',
      userEmail: 'mike.chen@company.com',
      action: 'user_invited',
      type: 'user',
      description: 'Invited new user "emily.davis@company.com" with Account Manager role',
      details: {
        invitedEmail: 'emily.davis@company.com',
        role: 'Account Manager',
        workspaces: ['Local Services']
      },
      ipAddress: '192.168.1.102',
      userAgent: 'Safari 17.2.1',
      severity: 'info'
    },
    {
      id: 5,
      timestamp: '2024-03-15 14:10:17',
      user: 'System',
      userEmail: 'system@campaignai.com',
      action: 'quota_warning',
      type: 'billing',
      description: 'Token quota warning: 85% of monthly limit reached',
      details: {
        tokensUsed: 42500,
        tokenLimit: 50000,
        workspace: 'SaaS Platform'
      },
      ipAddress: 'N/A',
      userAgent: 'System Process',
      severity: 'warning'
    },
    {
      id: 6,
      timestamp: '2024-03-15 14:05:22',
      user: 'Emily Davis',
      userEmail: 'emily.davis@company.com',
      action: 'login_failed',
      type: 'security',
      description: 'Failed login attempt - incorrect password',
      details: {
        attempts: 3,
        locked: false
      },
      ipAddress: '203.0.113.42',
      userAgent: 'Chrome 122.0.0.0',
      severity: 'error'
    },
    {
      id: 7,
      timestamp: '2024-03-15 14:00:10',
      user: 'John Smith',
      userEmail: 'john.smith@company.com',
      action: 'integration_connected',
      type: 'integration',
      description: 'Connected Meta Ads account',
      details: {
        platform: 'Meta Ads',
        accountId: 'act_1234567890',
        permissions: ['ads_read', 'ads_management']
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 122.0.0.0',
      severity: 'info'
    },
    {
      id: 8,
      timestamp: '2024-03-15 13:55:45',
      user: 'System',
      userEmail: 'system@campaignai.com',
      action: 'optimization_applied',
      type: 'optimization',
      description: 'AI optimization applied to "Brand Awareness Q3" campaign',
      details: {
        campaign: 'Brand Awareness Q3',
        changes: ['keyword_bids_adjusted', 'ad_schedule_optimized'],
        expectedImpact: '+12% CTR'
      },
      ipAddress: 'N/A',
      userAgent: 'AI Optimization Engine',
      severity: 'info'
    }
  ];

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesUser = filterUser === 'all' || event.user === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const getActionIcon = (action) => {
    const iconMap = {
      campaign_created: Plus,
      campaign_modified: Edit,
      campaign_deleted: Trash2,
      budget_modified: Settings,
      user_invited: User,
      user_removed: Trash2,
      login_failed: AlertTriangle,
      api_key_rotated: Zap,
      integration_connected: CheckCircle,
      optimization_applied: Zap,
      quota_warning: AlertTriangle
    };
    
    const Icon = iconMap[action] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      info: { className: 'bg-blue-600', text: 'Info' },
      warning: { className: 'bg-yellow-600', text: 'Warning' },
      error: { className: 'bg-red-600', text: 'Error' },
      success: { className: 'bg-green-600', text: 'Success' }
    };
    
    const config = variants[severity] || variants.info;
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const variants = {
      campaign: { className: 'bg-purple-600', text: 'Campaign' },
      user: { className: 'bg-green-600', text: 'User' },
      security: { className: 'bg-red-600', text: 'Security' },
      billing: { className: 'bg-yellow-600', text: 'Billing' },
      integration: { className: 'bg-blue-600', text: 'Integration' },
      optimization: { className: 'bg-orange-600', text: 'Optimization' }
    };
    
    const config = variants[type] || variants.campaign;
    return (
      <Badge variant="outline" className={`border-gray-600 ${config.className.replace('bg-', 'text-')}`}>
        {config.text}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const uniqueUsers = [...new Set(auditEvents.map(e => e.user))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Audit Log</h1>
          <p className="text-muted-foreground mt-1">Track all system activities and user actions</p>
        </div>
        <Button variant="outline" className="border-border text-foreground">
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, users, or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="optimization">Optimization</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-input border-border text-foreground">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Activity Timeline ({filteredEvents.length} events)</CardTitle>
          <CardDescription className="text-muted-foreground">
            Chronological log of all system and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const timestamp = formatTimestamp(event.timestamp);
              
              return (
                <div key={event.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0 p-2 bg-accent rounded-lg">
                    {getActionIcon(event.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-card-foreground font-medium">{event.description}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">by {event.user}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{timestamp.date} at {timestamp.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTypeBadge(event.type)}
                        {getSeverityBadge(event.severity)}
                      </div>
                    </div>
                    
                    {event.details && (
                      <div className="mt-3 p-3 bg-accent rounded text-sm">
                        <h5 className="text-muted-foreground font-medium mb-2">Details:</h5>
                        <div className="space-y-1">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-muted-foreground w-24 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-card-foreground">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>IP: {event.ipAddress}</span>
                        <span>•</span>
                        <span>{event.userAgent}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-card-foreground">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  No audit events match your current filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl text-card-foreground">{auditEvents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Events</p>
                <p className="text-2xl text-card-foreground">
                  {auditEvents.filter(e => e.type === 'security').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Actions</p>
                <p className="text-2xl text-card-foreground">
                  {auditEvents.filter(e => e.user !== 'System').length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl text-card-foreground">
                  {auditEvents.filter(e => e.timestamp.startsWith('2024-03-15')).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}