import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  CreditCard, 
  DollarSign, 
  Zap, 
  Calendar,
  TrendingUp,
  Download,
  AlertTriangle,
  Users,
  Building,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart3
} from 'lucide-react';

export function Billing() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  // Mock data for admin dashboard
  const packageDistribution = [
    {
      package: 'Starter',
      clientCount: 28,
      percentage: 59.6,
      monthlyRevenue: 1372, // 28 * $49
      tokensAllocated: 280000, // 28 * 10k
      tokensUsed: 198400,
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500',
      price: 49
    },
    {
      package: 'Pro',
      clientCount: 15,
      percentage: 31.9,
      monthlyRevenue: 2235, // 15 * $149
      tokensAllocated: 750000, // 15 * 50k
      tokensUsed: 623250,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-500',
      price: 149
    },
    {
      package: 'Enterprise',
      clientCount: 4,
      percentage: 8.5,
      monthlyRevenue: 1996, // 4 * $499
      tokensAllocated: 400000, // 4 * 100k (for calculation)
      tokensUsed: 356800,
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      color: 'bg-yellow-500',
      price: 499
    }
  ];

  const totalClients = packageDistribution.reduce((sum, pkg) => sum + pkg.clientCount, 0);
  const totalRevenue = packageDistribution.reduce((sum, pkg) => sum + pkg.monthlyRevenue, 0);
  const totalTokensUsed = packageDistribution.reduce((sum, pkg) => sum + pkg.tokensUsed, 0);

  const recentTransactions = [
    {
      clientId: '999-221-223',
      clientName: 'TechStart Solutions',
      package: 'Pro',
      amount: 149,
      tokensUsed: 12400,
      date: '2024-03-15',
      status: 'completed'
    },
    {
      clientId: '888-334-556',
      clientName: 'Digital Marketing Pro',
      package: 'Enterprise',
      amount: 499,
      tokensUsed: 87300,
      date: '2024-03-14',
      status: 'completed'
    },
    {
      clientId: '777-445-667',
      clientName: 'E-commerce Hub',
      package: 'Starter',
      amount: 49,
      tokensUsed: 8900,
      date: '2024-03-13',
      status: 'completed'
    },
    {
      clientId: '666-558-779',
      clientName: 'Local Fitness Gym',
      package: 'Pro',
      amount: 149,
      tokensUsed: 15600,
      date: '2024-03-12',
      status: 'pending'
    }
  ];

  const topTokenConsumers = [
    {
      clientId: '888-334-556',
      clientName: 'Digital Marketing Pro',
      package: 'Enterprise',
      tokensUsed: 87300,
      tokenLimit: 100000,
      efficiency: 92.3,
      monthlySpend: 499
    },
    {
      clientId: '999-221-223',
      clientName: 'TechStart Solutions',
      package: 'Pro',
      tokensUsed: 45600,
      tokenLimit: 50000,
      efficiency: 89.1,
      monthlySpend: 149
    },
    {
      clientId: '777-445-667',
      clientName: 'E-commerce Hub',
      package: 'Pro',
      tokensUsed: 42300,
      tokenLimit: 50000,
      efficiency: 87.4,
      monthlySpend: 149
    },
    {
      clientId: '555-334-221',
      clientName: 'Growth Agency',
      package: 'Enterprise',
      tokensUsed: 78900,
      tokenLimit: 100000,
      efficiency: 85.6,
      monthlySpend: 499
    }
  ];

  const getPackageIcon = (packageName) => {
    const pkg = packageDistribution.find(p => p.package === packageName);
    return pkg?.icon || <Zap className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600 text-white">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Billing & Tokens</h1>
          <p className="text-muted-foreground mt-1">
            Client package distribution, token usage analytics, and billing overview
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-border text-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl text-card-foreground">{totalClients}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+12% this month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl text-card-foreground">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+8.2% this month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens Consumed</p>
                <p className="text-2xl text-card-foreground">{(totalTokensUsed / 1000).toFixed(1)}K</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600 dark:text-orange-400">+15.3% this month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Revenue per Client</p>
                <p className="text-2xl text-card-foreground">${Math.round(totalRevenue / totalClients)}</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 dark:text-red-400">-2.1% this month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="distribution">Package Distribution</TabsTrigger>
          <TabsTrigger value="usage">Token Analytics</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="insights">Usage Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6">
          {/* Package Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packageDistribution.map((pkg) => (
              <Card key={pkg.package} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${pkg.color}/10 rounded-lg`}>
                        {pkg.icon}
                      </div>
                      <div>
                        <CardTitle className="text-card-foreground">{pkg.package}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          ${pkg.price}/month per client
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client Count</span>
                    <div className="text-right">
                      <span className="text-lg text-card-foreground">{pkg.clientCount}</span>
                      <p className="text-sm text-muted-foreground">{pkg.percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="text-lg text-green-600 dark:text-green-400">
                      ${pkg.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Token Usage</span>
                      <span className="text-card-foreground">
                        {((pkg.tokensUsed / pkg.tokensAllocated) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(pkg.tokensUsed / pkg.tokensAllocated) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{(pkg.tokensUsed / 1000).toFixed(0)}K used</span>
                      <span>{(pkg.tokensAllocated / 1000).toFixed(0)}K allocated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Client Distribution Chart Placeholder */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Client Distribution by Package
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Visual breakdown of client distribution across subscription packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Chart visualization would be rendered here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Integration with recharts or similar charting library
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Top Token Consumers */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Top Token Consumers</CardTitle>
              <CardDescription className="text-muted-foreground">
                Clients with highest token usage and efficiency ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTokenConsumers.map((client, index) => (
                  <div key={client.clientId} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <span className="text-blue-600 text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{client.clientId}</span>
                          <span className="text-card-foreground">{client.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-3 mt-1">
                          {getPackageIcon(client.package)}
                          <span className="text-sm text-muted-foreground">{client.package} Package</span>
                          <Badge variant="secondary" className="text-xs">
                            Efficiency: {client.efficiency}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-card-foreground">
                        {client.tokensUsed.toLocaleString()} / {client.tokenLimit.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${client.monthlySpend}/month
                      </p>
                      <div className="w-24 mt-2">
                        <Progress 
                          value={(client.tokensUsed / client.tokenLimit) * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Token Usage Trends */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Token Usage Trends
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Historical token consumption patterns across all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Token usage chart would be rendered here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Time series data showing usage patterns and trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Recent Billing Transactions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest billing activities and payment processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={`${transaction.clientId}-${transaction.date}`} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{transaction.clientId}</span>
                          <span className="text-card-foreground">{transaction.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-3 mt-1">
                          {getPackageIcon(transaction.package)}
                          <span className="text-sm text-muted-foreground">{transaction.package} Package</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-card-foreground">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.tokensUsed.toLocaleString()} tokens
                        </p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <Button variant="outline" className="w-full border-border text-foreground">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Usage Alerts */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Usage Alerts & Notifications
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Clients approaching token limits or showing unusual usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-card-foreground">High Usage Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Client #888-334-556 (Digital Marketing Pro) has used 87% of monthly tokens
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground">
                    Review
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-card-foreground">Usage Trend</p>
                    <p className="text-sm text-muted-foreground">
                      Overall token consumption up 15.3% this month across all packages
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground">
                    Analyze
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-card-foreground">New Clients</p>
                    <p className="text-sm text-muted-foreground">
                      5 new clients onboarded this week, mostly choosing Pro package
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Revenue by Package</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monthly revenue breakdown by subscription tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageDistribution.map((pkg) => (
                    <div key={pkg.package} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${pkg.color} rounded-full`}></div>
                        <span className="text-card-foreground">{pkg.package}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-card-foreground">${pkg.monthlyRevenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {((pkg.monthlyRevenue / totalRevenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Token Efficiency</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Average token utilization by package type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageDistribution.map((pkg) => (
                    <div key={pkg.package} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${pkg.color} rounded-full`}></div>
                          <span className="text-card-foreground">{pkg.package}</span>
                        </div>
                        <span className="text-sm text-card-foreground">
                          {((pkg.tokensUsed / pkg.tokensAllocated) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(pkg.tokensUsed / pkg.tokensAllocated) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}