import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Play,
  Pause,
  AlertTriangle,
  Zap,
  BarChart3,
  Search,
  Building2,
  Filter,
  Sparkles,
  Eye,
  TrendingDown,
  Users,
  Globe,
  Megaphone
} from 'lucide-react';

export function Recommendations({ selectedClient, setSelectedClient }) {
  const [selectedRec, setSelectedRec] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForRecs, setSelectedClientForRecs] = useState(selectedClient?.id || 'all');

  // Mock client data
  const clients = [
    {
      id: '999-221-223',
      name: 'TechStart Solutions',
      status: 'active'
    },
    {
      id: '888-334-556',
      name: 'Digital Marketing Pro',
      status: 'active'
    },
    {
      id: '777-445-667',
      name: 'E-commerce Hub',
      status: 'trial'
    },
    {
      id: '666-558-779',
      name: 'Local Fitness Gym',
      status: 'paused'
    }
  ];

  // Update selected client when prop changes
  useEffect(() => {
    if (selectedClient) {
      setSelectedClientForRecs(selectedClient.id);
    }
  }, [selectedClient]);

  const recommendations = [
    {
      id: 1,
      clientId: '999-221-223',
      clientName: 'TechStart Solutions',
      type: 'keyword',
      priority: 'high',
      title: 'Add High-Performance Keywords',
      description: 'Based on competitor analysis, these keywords show strong potential for your Summer Sale campaign.',
      campaign: 'Summer Sale 2024',
      platform: 'Google Ads',
      expectedImpact: '+15% CTR',
      revenueImpact: '+$2,400',
      effort: 'Low',
      confidence: 89,
      status: 'pending',
      aiReasoning: 'Analysis of 47 competitor campaigns shows these keywords have 23% higher CTR and 18% lower CPC than your current keyword set.',
      suggestedChanges: [
        'Add "summer discount shoes" (Est. 2,400 searches/mo)',
        'Add "sale footwear 2024" (Est. 1,800 searches/mo)',
        'Add "discounted summer apparel" (Est. 3,200 searches/mo)'
      ],
      risks: ['May increase competition for these keywords', 'Budget reallocation needed'],
      timeToImplement: '15 minutes',
      createdAt: '2 hours ago',
      category: 'Performance Optimization'
    },
    {
      id: 2,
      clientId: '888-334-556',
      clientName: 'Digital Marketing Pro',
      type: 'budget',
      priority: 'high',
      title: 'Increase Budget for Top Performers',
      description: 'Holiday Shopping campaign is constrained by budget and showing exceptional ROAS.',
      campaign: 'Holiday Shopping',
      platform: 'Google Ads',
      expectedImpact: '+25% conversions',
      revenueImpact: '+$5,200',
      effort: 'Medium',
      confidence: 94,
      status: 'pending',
      aiReasoning: 'Campaign consistently hits daily budget cap at 2:30 PM with 5.4x ROAS. Increasing budget by 60% could capture additional high-intent traffic.',
      suggestedChanges: [
        'Increase daily budget from $800 to $1,280',
        'Extend campaign hours to capture late-night shoppers',
        'Add smart bidding to optimize for conversions'
      ],
      risks: ['Higher spend may reduce ROAS initially', 'Market saturation possible'],
      timeToImplement: '30 minutes',
      createdAt: '4 hours ago',
      category: 'Budget Optimization'
    },
    {
      id: 3,
      clientId: '777-445-667',
      clientName: 'E-commerce Hub',
      type: 'bidding',
      priority: 'medium',
      title: 'Optimize Bid Strategy',
      description: 'Switch to Target CPA bidding for better conversion efficiency in LinkedIn B2B campaign.',
      campaign: 'LinkedIn B2B Campaign',
      platform: 'LinkedIn Ads',
      expectedImpact: '-20% CPA',
      revenueImpact: '+$1,800',
      effort: 'Low',
      confidence: 76,
      status: 'pending',
      aiReasoning: 'Current manual bidding shows inconsistent performance. Target CPA at $95 would optimize for your conversion goals while maintaining volume.',
      suggestedChanges: [
        'Switch from manual CPC to Target CPA',
        'Set target CPA at $95 (current avg: $124)',
        'Enable conversion tracking for job applications'
      ],
      risks: ['Learning period may reduce performance initially', 'Less manual control'],
      timeToImplement: '20 minutes',
      createdAt: '1 day ago',
      category: 'Bid Management'
    },
    {
      id: 4,
      clientId: '999-221-223',
      clientName: 'TechStart Solutions',
      type: 'audience',
      priority: 'low',
      title: 'Expand Lookalike Audiences',
      description: 'Create lookalike audiences based on high-value customers for Meta Ads retargeting.',
      campaign: 'Retargeting Campaign',
      platform: 'Meta Ads',
      expectedImpact: '+12% reach',
      revenueImpact: '+$950',
      effort: 'Medium',
      confidence: 68,
      status: 'pending',
      aiReasoning: 'Your top 10% customers show distinct behavior patterns. Lookalike audience could expand reach while maintaining quality.',
      suggestedChanges: [
        'Create 1% lookalike from top customer segment',
        'Test 2% and 5% lookalikes for broader reach',
        'Exclude existing customers from new audiences'
      ],
      risks: ['May dilute audience quality', 'Higher acquisition costs possible'],
      timeToImplement: '45 minutes',
      createdAt: '2 days ago',
      category: 'Audience Targeting'
    },
    {
      id: 5,
      clientId: '888-334-556',
      clientName: 'Digital Marketing Pro',
      type: 'creative',
      priority: 'medium',
      title: 'Test New Ad Creative Variations',
      description: 'Current ad creatives show signs of fatigue. Fresh variations could improve performance.',
      campaign: 'Brand Awareness Q3',
      platform: 'Meta Ads',
      expectedImpact: '+8% CTR',
      revenueImpact: '+$640',
      effort: 'High',
      confidence: 72,
      status: 'scheduled',
      aiReasoning: 'CTR has declined 23% over past 3 weeks indicating creative fatigue. A/B testing new formats could restore performance.',
      suggestedChanges: [
        'Test video ads vs current static images',
        'Create carousel format showcasing product range',
        'Test user-generated content creative'
      ],
      risks: ['Design and production time required', 'Performance may vary by audience'],
      timeToImplement: '2-3 days',
      createdAt: '3 days ago',
      category: 'Creative Optimization'
    }
  ];

  // Filter recommendations based on selected client and search
  const filteredRecs = recommendations.filter(rec => {
    const matchesClient = selectedClientForRecs === 'all' || rec.clientId === selectedClientForRecs;
    const matchesFilter = filter === 'all' || 
                         (filter === 'high' && rec.priority === 'high') ||
                         (filter === 'pending' && rec.status === 'pending') ||
                         (filter === 'scheduled' && rec.status === 'scheduled');
    const matchesSearch = !searchQuery || 
                         rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClient && matchesFilter && matchesSearch;
  });

  const getPriorityBadge = (priority) => {
    const variants = {
      high: { className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0', text: 'High Priority', icon: '🔥' },
      medium: { className: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0', text: 'Medium', icon: '⚡' },
      low: { className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0', text: 'Low Priority', icon: '✅' }
    };
    
    const config = variants[priority] || variants.medium;
    return (
      <Badge className={config.className}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      keyword: { icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      budget: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      bidding: { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      audience: { icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
      creative: { icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' }
    };
    
    const config = icons[type] || icons.keyword;
    const Icon = config.icon;
    return { icon: <Icon className={`h-5 w-5 ${config.color}`} />, bg: config.bg };
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Google Ads':
        return (
          <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
        );
      case 'Meta Ads':
        return (
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'LinkedIn Ads':
        return (
          <div className="w-4 h-4 bg-blue-700 rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        );
      default:
        return <Globe className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const applyRecommendation = (recId) => {
    console.log('Applying recommendation:', recId);
  };

  const dismissRecommendation = (recId) => {
    console.log('Dismissing recommendation:', recId);
  };

  const scheduleRecommendation = (recId) => {
    console.log('Scheduling recommendation:', recId);
  };

  if (selectedRec) {
    const rec = recommendations.find(r => r.id === selectedRec);
    return <RecommendationDetail recommendation={rec} onBack={() => setSelectedRec(null)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">AI Recommendations</h1>
          <p className="text-muted-foreground mt-1">
            Smart optimization suggestions powered by machine learning
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate New
        </Button>
      </div>

      {/* Client Selection - Mandatory */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-card-foreground mb-2">Select Client Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a client account to view their AI-powered campaign recommendations
              </p>
              <Select value={selectedClientForRecs} onValueChange={setSelectedClientForRecs}>
                <SelectTrigger className="w-full max-w-md bg-background border-border">
                  <SelectValue placeholder="Select a client account..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm text-blue-400">{client.id}</span>
                        <span>{client.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {client.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search recommendations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="border-border"
          >
            All ({filteredRecs.length})
          </Button>
          <Button
            variant={filter === 'high' ? 'default' : 'outline'}
            onClick={() => setFilter('high')}
            className="border-border"
          >
            High Priority ({recommendations.filter(r => r.priority === 'high' && (selectedClientForRecs === 'all' || r.clientId === selectedClientForRecs)).length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className="border-border"
          >
            Pending ({recommendations.filter(r => r.status === 'pending' && (selectedClientForRecs === 'all' || r.clientId === selectedClientForRecs)).length})
          </Button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => {
          const typeConfig = getTypeIcon(rec.type);
          
          return (
            <Card 
              key={rec.id} 
              className="bg-card border-border cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              onClick={() => setSelectedRec(rec.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 ${typeConfig.bg} rounded-lg`}>
                      {typeConfig.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Client Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm text-blue-400">{rec.clientId}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-card-foreground">{rec.clientName}</span>
                        </div>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg text-card-foreground truncate">{rec.title}</h3>
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {rec.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{rec.description}</p>
                      
                      <div className="flex items-center space-x-6 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Campaign:</span>
                          <span className="text-card-foreground">{rec.campaign}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(rec.platform)}
                          <span className="text-card-foreground">{rec.platform}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{rec.createdAt}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <span className="text-xs text-muted-foreground block mb-1">Expected Impact</span>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">{rec.expectedImpact}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <span className="text-xs text-muted-foreground block mb-1">Revenue Impact</span>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{rec.revenueImpact}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <span className="text-xs text-muted-foreground block mb-1">Effort Level</span>
                          <p className="text-sm text-purple-600 dark:text-purple-400">{rec.effort}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <span className="text-xs text-muted-foreground block mb-1">Confidence</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={rec.confidence} className="h-2 flex-1" />
                            <span className="text-sm text-amber-600 dark:text-amber-400">{rec.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        applyRecommendation(rec.id);
                      }}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Apply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-border text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        scheduleRecommendation(rec.id);
                      }}
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      Schedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissRecommendation(rec.id);
                      }}
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredRecs.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg text-card-foreground mb-2">No recommendations found</h3>
              <p className="text-muted-foreground mb-4">
                {!selectedClientForRecs 
                  ? 'Please select a client account to view recommendations.'
                  : searchQuery 
                    ? `No recommendations match "${searchQuery}".`
                    : filter === 'all' 
                      ? 'No recommendations available for this client.'
                      : `No ${filter} recommendations found for this client.`
                }
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function RecommendationDetail({ recommendation, onBack }) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    onBack();
  };

  const getTypeIcon = (type) => {
    const icons = {
      keyword: { icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      budget: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      bidding: { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      audience: { icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
      creative: { icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' }
    };
    
    const config = icons[type] || icons.keyword;
    const Icon = config.icon;
    return { icon: <Icon className={`h-5 w-5 ${config.color}`} />, bg: config.bg };
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: { className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0', text: 'High Priority', icon: '🔥' },
      medium: { className: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0', text: 'Medium', icon: '⚡' },
      low: { className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0', text: 'Low Priority', icon: '✅' }
    };
    
    const config = variants[priority] || variants.medium;
    return (
      <Badge className={config.className}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </Badge>
    );
  };

  const typeConfig = getTypeIcon(recommendation.type);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            ← Back to Recommendations
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${typeConfig.bg} rounded-lg`}>
              {typeConfig.icon}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-blue-400">{recommendation.clientId}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-card-foreground">{recommendation.clientName}</span>
                </div>
              </div>
              <h1 className="text-2xl text-foreground">{recommendation.title}</h1>
              <p className="text-muted-foreground">{recommendation.campaign} • {recommendation.platform}</p>
            </div>
          </div>
        </div>
        {getPriorityBadge(recommendation.priority)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground">{recommendation.aiReasoning}</p>
            </CardContent>
          </Card>

          {/* Suggested Changes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Suggested Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendation.suggestedChanges.map((change, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground">{change}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Potential Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendation.risks.map((risk, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-card-foreground">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Impact Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Expected Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance</span>
                <span className="text-green-600 dark:text-green-400">{recommendation.expectedImpact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="text-green-600 dark:text-green-400">{recommendation.revenueImpact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effort Level</span>
                <span className="text-card-foreground">{recommendation.effort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Implementation</span>
                <span className="text-card-foreground">{recommendation.timeToImplement}</span>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="text-card-foreground">{recommendation.confidence}%</span>
                </div>
                <Progress value={recommendation.confidence} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                onClick={handleApply}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Apply Now
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-border text-foreground"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule for Later
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive/10"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}