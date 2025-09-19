import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { getSupabaseFunctionUrl } from '../../utils/supabase/info';

// Company Logos as SVG Components
const OpenAILogo = () => (
  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944z"/>
    </svg>
  </div>
);

const AnthropicLogo = () => (
  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  </div>
);

const GoogleLogo = () => (
  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  </div>
);

const MetaLogo = () => (
  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </div>
);

const LinkedInLogo = () => (
  <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </div>
);

const GoogleAnalyticsLogo = () => (
  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12.5 6.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S10 10.38 10 9s1.12-2.5 2.5-2.5zm4-4C18.36 2.5 20 4.14 20 6s-1.64 3.5-3.5 3.5S13 7.86 13 6s1.64-3.5 3.5-3.5zM6 12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
    </svg>
  </div>
);

export function Integrations() {
  const [integrations, setIntegrations] = useState({});
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState({});

  const llmProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 for campaign optimization',
      logo: <OpenAILogo />,
      status: 'connected',
      docs: 'https://platform.openai.com/docs',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'organization', label: 'Organization ID', type: 'text', required: false }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3.5 for advanced analysis',
      logo: <AnthropicLogo />,
      status: 'disconnected',
      docs: 'https://console.anthropic.com/',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true }
      ]
    },
    {
      id: 'google_ai',
      name: 'Google AI',
      description: 'Gemini Pro for content generation',
      logo: <GoogleLogo />,
      status: 'connected',
      docs: 'https://aistudio.google.com/',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true }
      ]
    }
  ];

  const adPlatforms = [
    {
      id: 'google_ads',
      name: 'Google Ads',
      description: 'Search, Display, Shopping campaigns',
      logo: <GoogleLogo />,
      status: 'connected',
      oauth: true,
      docs: 'https://developers.google.com/google-ads/api',
      accounts: ['Account 1 (123-456-7890)', 'Account 2 (098-765-4321)']
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      description: 'Facebook and Instagram advertising',
      logo: <MetaLogo />,
      status: 'error',
      oauth: true,
      docs: 'https://developers.facebook.com/docs/marketing-apis',
      accounts: []
    },
    {
      id: 'linkedin_ads',
      name: 'LinkedIn Ads',
      description: 'Professional B2B advertising',
      logo: <LinkedInLogo />,
      status: 'disconnected',
      oauth: true,
      docs: 'https://docs.microsoft.com/linkedin/marketing/',
      accounts: []
    }
  ];

  const analyticsTools = [
    {
      id: 'google_analytics',
      name: 'Google Analytics 4',
      description: 'Web analytics and conversion tracking',
      logo: <GoogleAnalyticsLogo />,
      status: 'connected',
      fields: [
        { key: 'property_id', label: 'Property ID', type: 'text', required: true },
        { key: 'measurement_id', label: 'Measurement ID', type: 'text', required: false }
      ]
    },
    {
      id: 'google_tag_manager',
      name: 'Google Tag Manager',
      description: 'Tag management and tracking',
      logo: <GoogleLogo />,
      status: 'disconnected',
      fields: [
        { key: 'container_id', label: 'Container ID', type: 'text', required: true }
      ]
    }
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const accessToken = await supabase.auth.getSession().then(s => s.data.session?.access_token);
      const response = await fetch(getSupabaseFunctionUrl('make-server-5efafb23/integrations'), {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const saveIntegration = async (category, providerId, data) => {
    setLoading(true);
    try {
      const accessToken = await supabase.auth.getSession().then(s => s.data.session?.access_token);
      const response = await fetch(
        getSupabaseFunctionUrl(`make-server-5efafb23/integrations/${category}/${providerId}`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(data)
        }
      );

      if (response.ok) {
        await loadIntegrations();
      }
    } catch (error) {
      console.error('Error saving integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (category, providerId) => {
    setLoading(true);
    try {
      const accessToken = await supabase.auth.getSession().then(s => s.data.session?.access_token);
      const response = await fetch(
        getSupabaseFunctionUrl(`make-server-5efafb23/integrations/${category}/${providerId}/test`),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const result = await response.json();
      // Handle test result
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectIntegration = async (category, providerId) => {
    setLoading(true);
    try {
      const accessToken = await supabase.auth.getSession().then(s => s.data.session?.access_token);
      const response = await fetch(
        getSupabaseFunctionUrl(`make-server-5efafb23/integrations/${category}/${providerId}`),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        await loadIntegrations();
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      connected: { variant: 'default', className: 'bg-green-600 text-white', text: 'Connected' },
      disconnected: { variant: 'secondary', className: 'bg-muted text-muted-foreground', text: 'Not Connected' },
      error: { variant: 'destructive', className: 'bg-red-600 text-white', text: 'Error' }
    };
    
    const config = variants[status] || variants.disconnected;
    return (
      <Badge className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Plug className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const IntegrationCard = ({ integration, category, children }) => (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {integration.logo}
            <div>
              <CardTitle className="text-card-foreground">{integration.name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {integration.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(integration.status)}
            {getStatusBadge(integration.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <a
            href={integration.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Documentation
          </a>
          
          <div className="flex space-x-2">
            {integration.status === 'connected' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testConnection(category, integration.id)}
                  disabled={loading}
                  className="border-border text-foreground"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Test
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disconnectIntegration(category, integration.id)}
                  disabled={loading}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect and manage your advertising platforms and AI services</p>
      </div>

      <Tabs defaultValue="llm" className="space-y-6">
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="llm">
            AI Models
          </TabsTrigger>
          <TabsTrigger value="ads">
            Ad Platforms
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="llm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {llmProviders.map((provider) => (
              <IntegrationCard 
                key={provider.id} 
                integration={provider} 
                category="llm"
              >
                {provider.fields?.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-card-foreground">{field.label}</Label>
                    <div className="relative">
                      <Input
                        type={field.type === 'password' && !showKeys[`${provider.id}_${field.key}`] ? 'password' : 'text'}
                        placeholder={`Enter ${field.label}`}
                        className="bg-input border-border text-foreground pr-10"
                      />
                      {field.type === 'password' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-0"
                          onClick={() => setShowKeys(prev => ({
                            ...prev,
                            [`${provider.id}_${field.key}`]: !prev[`${provider.id}_${field.key}`]
                          }))}
                        >
                          {showKeys[`${provider.id}_${field.key}`] ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {provider.status === 'connected' ? 'Update' : 'Connect'} {provider.name}
                </Button>
              </IntegrationCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adPlatforms.map((platform) => (
              <IntegrationCard 
                key={platform.id} 
                integration={platform} 
                category="ads"
              >
                {platform.oauth ? (
                  <div className="space-y-4">
                    {platform.accounts && platform.accounts.length > 0 && (
                      <div>
                        <Label className="text-card-foreground">Connected Accounts</Label>
                        <div className="space-y-2 mt-2">
                          {platform.accounts.map((account, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-card-foreground text-sm">{account}</span>
                              <Switch />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {platform.status === 'connected' ? 'Reconnect' : 'Connect'} via OAuth
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Manual configuration required</p>
                )}
              </IntegrationCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsTools.map((tool) => (
              <IntegrationCard 
                key={tool.id} 
                integration={tool} 
                category="analytics"
              >
                {tool.fields?.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-card-foreground">{field.label}</Label>
                    <Input
                      type={field.type}
                      placeholder={`Enter ${field.label}`}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                ))}
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {tool.status === 'connected' ? 'Update' : 'Connect'} {tool.name}
                </Button>
              </IntegrationCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}