import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTheme } from '../../App';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database,
  Bell,
  Palette,
  Globe,
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon
} from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [showApiKeys, setShowApiKeys] = useState({});
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: 'Campaign AI',
    defaultTimeZone: 'UTC',
    defaultCurrency: 'USD',
    autoOptimization: true,
    smartBidding: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 24,
    ipWhitelist: '',
    requirePasswordChange: false,
    
    // Notification Settings
    emailAlerts: true,
    slackNotifications: false,
    webhookUrl: '',
    dailyReports: true,
    weeklyReports: true,
    
    // Data Settings
    dataRetention: 365,
    autoBackup: true,
    exportFormat: 'csv',
    anonymizeData: false,
    
    // API Keys (masked for display)
    apiKeys: {
      openai: '••••••••••••••••••••••••••••••••sk-abc123',
      anthropic: '••••••••••••••••••••••••••••••••ant-123',
      google: '••••••••••••••••••••••••••••••••AIza123'
    }
  });

  const toggleApiKeyVisibility = (provider) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system preferences and security options</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="general">
            <SettingsIcon className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Appearance Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Platform Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Basic platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Platform Name</Label>
                  <Input
                    value={settings.platformName}
                    onChange={(e) => updateSetting('platformName', e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Default Time Zone</Label>
                  <Select value={settings.defaultTimeZone} onValueChange={(value) => updateSetting('defaultTimeZone', value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Default Currency</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(value) => updateSetting('defaultCurrency', value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">AI Optimization Settings</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure automatic optimization behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Auto Optimization</Label>
                  <p className="text-sm text-muted-foreground">Automatically apply AI recommendations</p>
                </div>
                <Switch
                  checked={settings.autoOptimization}
                  onCheckedChange={(checked) => updateSetting('autoOptimization', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Smart Bidding</Label>
                  <p className="text-sm text-muted-foreground">Enable intelligent bid adjustments</p>
                </div>
                <Switch
                  checked={settings.smartBidding}
                  onCheckedChange={(checked) => updateSetting('smartBidding', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Authentication & Access</CardTitle>
              <CardDescription className="text-muted-foreground">
                Security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Require Password Change</Label>
                  <p className="text-sm text-muted-foreground">Force password updates every 90 days</p>
                </div>
                <Switch
                  checked={settings.requirePasswordChange}
                  onCheckedChange={(checked) => updateSetting('requirePasswordChange', checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Session Timeout (hours)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">IP Allowlist</CardTitle>
              <CardDescription className="text-muted-foreground">
                Restrict access to specific IP addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Allowed IP Addresses</Label>
                <Textarea
                  placeholder="Enter IP addresses or ranges, one per line..."
                  value={settings.ipWhitelist}
                  onChange={(e) => updateSetting('ipWhitelist', e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Example: 192.168.1.0/24 or 203.0.113.42
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Alert Preferences</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => updateSetting('emailAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack</p>
                </div>
                <Switch
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) => updateSetting('slackNotifications', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-card-foreground">Webhook URL</Label>
                <Input
                  placeholder="https://hooks.slack.com/services/..."
                  value={settings.webhookUrl}
                  onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Schedule</CardTitle>
              <CardDescription className="text-muted-foreground">
                Automated report delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">Daily performance summaries</p>
                </div>
                <Switch
                  checked={settings.dailyReports}
                  onCheckedChange={(checked) => updateSetting('dailyReports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Weekly optimization reports</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Data Retention</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure how long data is stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Retention Period (days)</Label>
                  <Select value={settings.dataRetention.toString()} onValueChange={(value) => updateSetting('dataRetention', parseInt(value))}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                      <SelectItem value="-1">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Export Format</Label>
                  <Select value={settings.exportFormat} onValueChange={(value) => updateSetting('exportFormat', value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup data weekly</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Anonymize Data</Label>
                  <p className="text-sm text-muted-foreground">Remove personally identifiable information</p>
                </div>
                <Switch
                  checked={settings.anonymizeData}
                  onCheckedChange={(checked) => updateSetting('anonymizeData', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Data Export & Import</CardTitle>
              <CardDescription className="text-muted-foreground">
                Backup and restore your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button variant="outline" className="border-border text-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
                <Button variant="outline" className="border-border text-foreground">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">API Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage external service API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.apiKeys).map(([provider, key]) => (
                <div key={provider} className="space-y-2">
                  <Label className="text-card-foreground capitalize">{provider} API Key</Label>
                  <div className="relative">
                    <Input
                      type={showApiKeys[provider] ? 'text' : 'password'}
                      value={key}
                      className="bg-input border-border text-foreground pr-10"
                      readOnly
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-0"
                      onClick={() => toggleApiKeyVisibility(provider)}
                    >
                      {showApiKeys[provider] ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-border text-foreground">
                      Update Key
                    </Button>
                    <Button size="sm" variant="outline" className="border-border text-foreground">
                      Test Connection
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Feature Flags</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enable or disable experimental features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Beta AI Models</Label>
                  <p className="text-sm text-muted-foreground">Access to experimental AI capabilities</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Advanced Analytics</Label>
                  <p className="text-sm text-muted-foreground">Enhanced reporting and insights</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-card-foreground">Cross-Platform Sync</Label>
                  <p className="text-sm text-muted-foreground">Real-time data synchronization</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}