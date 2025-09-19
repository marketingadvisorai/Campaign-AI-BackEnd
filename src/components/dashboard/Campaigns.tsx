import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Plus
} from 'lucide-react';

export function Campaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      platform: 'Google Ads',
      type: 'Search',
      status: 'active',
      spend: 12400,
      impressions: 245000,
      clicks: 3420,
      conversions: 287,
      ctr: 1.4,
      cpa: 43.20,
      roas: 4.2,
      lastOptimized: '2 hours ago',
      budget: 500
    },
    {
      id: 2,
      name: 'Brand Awareness Q3',
      platform: 'Meta Ads',
      type: 'Display',
      status: 'active',
      spend: 8900,
      impressions: 890000,
      clicks: 2140,
      conversions: 156,
      ctr: 0.24,
      cpa: 57.05,
      roas: 3.8,
      lastOptimized: '1 day ago',
      budget: 300
    },
    {
      id: 3,
      name: 'LinkedIn B2B Campaign',
      platform: 'LinkedIn Ads',
      type: 'Sponsored Content',
      status: 'paused',
      spend: 5600,
      impressions: 123000,
      clicks: 890,
      conversions: 45,
      ctr: 0.72,
      cpa: 124.44,
      roas: 2.1,
      lastOptimized: '5 days ago',
      budget: 200
    },
    {
      id: 4,
      name: 'Holiday Shopping',
      platform: 'Google Ads',
      type: 'Shopping',
      status: 'active',
      spend: 15600,
      impressions: 567000,
      clicks: 4320,
      conversions: 432,
      ctr: 0.76,
      cpa: 36.11,
      roas: 5.4,
      lastOptimized: '3 hours ago',
      budget: 800
    },
    {
      id: 5,
      name: 'Retargeting Campaign',
      platform: 'Meta Ads',
      type: 'Retargeting',
      status: 'active',
      spend: 3200,
      impressions: 78000,
      clicks: 1240,
      conversions: 89,
      ctr: 1.59,
      cpa: 35.96,
      roas: 4.8,
      lastOptimized: '6 hours ago',
      budget: 150
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || campaign.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleSelectCampaign = (campaignId, checked) => {
    if (checked) {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: 'default', className: 'bg-green-600', text: 'Active' },
      paused: { variant: 'secondary', className: 'bg-yellow-600', text: 'Paused' },
      ended: { variant: 'destructive', className: 'bg-red-600', text: 'Ended' }
    };
    
    const config = variants[status] || variants.paused;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getTrendIcon = (value, threshold = 0) => {
    if (value > threshold) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (value < threshold) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Campaign Explorer</h1>
          <p className="text-muted-foreground mt-1">Manage and optimize campaigns across all platforms</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
            
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                <SelectItem value="LinkedIn Ads">LinkedIn Ads</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-input border-border text-foreground">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-border text-foreground">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>

            <Button variant="outline" className="border-border text-foreground">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCampaigns.length > 0 && (
        <Card className="bg-blue-900/20 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-300">
                {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                  <Play className="mr-1 h-3 w-3" />
                  Start
                </Button>
                <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400">
                  <Pause className="mr-1 h-3 w-3" />
                  Pause
                </Button>
                <Button size="sm" variant="outline" className="border-border text-foreground">
                  <Settings className="mr-1 h-3 w-3" />
                  Edit Budget
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Campaigns ({filteredCampaigns.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Cross-platform campaign performance overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-muted-foreground">Platform</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Spend</TableHead>
                  <TableHead className="text-muted-foreground">Conversions</TableHead>
                  <TableHead className="text-muted-foreground">CPA</TableHead>
                  <TableHead className="text-muted-foreground">ROAS</TableHead>
                  <TableHead className="text-muted-foreground">CTR</TableHead>
                  <TableHead className="text-muted-foreground">Last Optimized</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-border">
                    <TableCell>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-card-foreground">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-card-foreground">{campaign.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-card-foreground">${campaign.spend.toLocaleString()}</span>
                        {getTrendIcon(campaign.spend, 10000)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-card-foreground">{campaign.conversions}</span>
                        {getTrendIcon(campaign.conversions, 100)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-card-foreground">${campaign.cpa}</span>
                        {getTrendIcon(-campaign.cpa, -50)} {/* Negative because lower CPA is better */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className={`font-medium ${campaign.roas >= 4 ? 'text-green-400' : campaign.roas >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {campaign.roas}x
                        </span>
                        {getTrendIcon(campaign.roas, 3)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-card-foreground">{campaign.ctr}%</span>
                        {getTrendIcon(campaign.ctr, 1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">{campaign.lastOptimized}</span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-card-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl text-card-foreground">
                  ${filteredCampaigns.reduce((sum, c) => sum + c.spend, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <p className="text-2xl text-card-foreground">
                  {filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg ROAS</p>
                <p className="text-2xl text-card-foreground">
                  {(filteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / filteredCampaigns.length).toFixed(1)}x
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl text-card-foreground">
                  {filteredCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}