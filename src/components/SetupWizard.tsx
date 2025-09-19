import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, ExternalLink, Zap } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { getSupabaseFunctionUrl } from '../utils/supabase/info';

const steps = [
  { id: 1, title: 'Connect AI Models', description: 'Setup LLM integrations' },
  { id: 2, title: 'Connect Ad Platforms', description: 'Link your advertising accounts' },
  { id: 3, title: 'Analytics Setup', description: 'Connect tracking and analytics' },
  { id: 4, title: 'Billing & Plans', description: 'Choose your subscription plan' },
  { id: 5, title: 'Data Sync', description: 'Initial data synchronization' }
];

export function SetupWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    llms: {},
    adPlatforms: {},
    analytics: {},
    billing: null,
    syncProgress: 0
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSetup();
    }
  };

  const completeSetup = async () => {
    setLoading(true);
    try {
      const accessToken = await supabase.auth.getSession().then(s => s.data.session?.access_token);
      const response = await fetch(getSupabaseFunctionUrl('make-server-5efafb23/user/complete-setup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(setupData)
      });

      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Setup completion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl text-foreground mb-2">Welcome to Campaign AI</h1>
          <p className="text-muted-foreground">Let's get your account set up in just a few steps</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                  currentStep > step.id ? 'bg-green-600' : 
                  currentStep === step.id ? 'bg-blue-600' : 'bg-muted'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-white text-sm">{step.id}</span>
                  )}
                </div>
                <span className={`text-xs text-center ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <LLMSetupStep setupData={setupData} setSetupData={setSetupData} />}
            {currentStep === 2 && <AdPlatformsStep setupData={setupData} setSetupData={setSetupData} />}
            {currentStep === 3 && <AnalyticsStep setupData={setupData} setSetupData={setSetupData} />}
            {currentStep === 4 && <BillingStep setupData={setupData} setSetupData={setSetupData} />}
            {currentStep === 5 && <DataSyncStep setupData={setupData} setSetupData={setSetupData} />}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-border text-foreground"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === steps.length ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LLMSetupStep({ setupData, setSetupData }) {
  const llmProviders = [
    { 
      id: 'openai', 
      name: 'OpenAI', 
      description: 'GPT-4, GPT-3.5 Turbo',
      docs: 'https://platform.openai.com/api-keys'
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic', 
      description: 'Claude 3.5 Sonnet, Claude 3 Haiku',
      docs: 'https://console.anthropic.com/'
    },
    { 
      id: 'google', 
      name: 'Google AI', 
      description: 'Gemini Pro, Gemini Flash',
      docs: 'https://aistudio.google.com/app/apikey'
    }
  ];

  const updateLLMKey = (provider, key) => {
    setSetupData(prev => ({
      ...prev,
      llms: { ...prev.llms, [provider]: key }
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Connect your AI model providers to enable intelligent campaign optimization.
      </p>
      
      {llmProviders.map((provider) => (
        <Card key={provider.id} className="bg-accent border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-accent-foreground">{provider.name}</h4>
                <p className="text-muted-foreground text-sm">{provider.description}</p>
              </div>
              <a
                href={provider.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="space-y-2">
              <Label className="text-accent-foreground">API Key</Label>
              <Input
                type="password"
                placeholder={`Enter your ${provider.name} API key`}
                value={setupData.llms[provider.id] || ''}
                onChange={(e) => updateLLMKey(provider.id, e.target.value)}
                className="bg-input border-border text-card-foreground"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdPlatformsStep({ setupData, setSetupData }) {
  const adPlatforms = [
    {
      id: 'google_ads',
      name: 'Google Ads',
      description: 'Search, Display, Shopping, YouTube campaigns',
      status: 'oauth_required',
      docs: 'https://developers.google.com/google-ads/api'
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      description: 'Facebook and Instagram advertising',
      status: 'oauth_required',
      docs: 'https://developers.facebook.com/docs/marketing-apis'
    },
    {
      id: 'linkedin_ads',
      name: 'LinkedIn Ads',
      description: 'Professional B2B advertising platform',
      status: 'oauth_required',
      docs: 'https://docs.microsoft.com/en-us/linkedin/marketing/'
    }
  ];

  const connectPlatform = async (platformId) => {
    // Simulate OAuth flow - in real implementation, this would redirect to OAuth provider
    setSetupData(prev => ({
      ...prev,
      adPlatforms: { ...prev.adPlatforms, [platformId]: 'connected' }
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-300 mb-6">
        Connect your advertising platforms to manage and optimize campaigns.
      </p>
      
      {adPlatforms.map((platform) => (
        <Card key={platform.id} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-white font-medium">{platform.name}</h4>
                  <Badge variant={setupData.adPlatforms[platform.id] ? 'default' : 'secondary'}>
                    {setupData.adPlatforms[platform.id] ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">{platform.description}</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={platform.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                  size="sm"
                  onClick={() => connectPlatform(platform.id)}
                  disabled={setupData.adPlatforms[platform.id]}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {setupData.adPlatforms[platform.id] ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AnalyticsStep({ setupData, setSetupData }) {
  const updateAnalytics = (key, value) => {
    setSetupData(prev => ({
      ...prev,
      analytics: { ...prev.analytics, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-300 mb-6">
        Connect your analytics tools to track campaign performance and conversions.
      </p>
      
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-4">Google Analytics 4</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Property ID</Label>
              <Input
                placeholder="G-XXXXXXXXXX"
                value={setupData.analytics.ga4_property_id || ''}
                onChange={(e) => updateAnalytics('ga4_property_id', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-4">Google Tag Manager</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Container ID</Label>
              <Input
                placeholder="GTM-XXXXXXX"
                value={setupData.analytics.gtm_container_id || ''}
                onChange={(e) => updateAnalytics('gtm_container_id', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingStep({ setupData, setSetupData }) {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      period: '/month',
      tokens: '10,000',
      features: ['Basic AI optimization', 'Google Ads only', 'Email support']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$149',
      period: '/month',
      tokens: '50,000',
      features: ['Advanced AI optimization', 'All ad platforms', 'Priority support', 'Custom reporting'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$499',
      period: '/month',
      tokens: 'Unlimited',
      features: ['Enterprise AI models', 'White-label options', 'Dedicated support', 'Custom integrations']
    }
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-300 mb-6">
        Choose a plan that fits your needs. You can upgrade or downgrade at any time.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`bg-gray-700 border-gray-600 cursor-pointer transition-all ${
              setupData.billing === plan.id ? 'ring-2 ring-blue-500' : ''
            } ${plan.popular ? 'border-blue-500' : ''}`}
            onClick={() => setSetupData(prev => ({ ...prev, billing: plan.id }))}
          >
            <CardContent className="p-6">
              {plan.popular && (
                <Badge className="mb-4 bg-blue-600">Most Popular</Badge>
              )}
              <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-300 mb-4">{plan.tokens} AI tokens/month</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DataSyncStep({ setupData, setSetupData }) {
  const [syncStarted, setSyncStarted] = React.useState(false);
  
  React.useEffect(() => {
    if (!syncStarted) {
      setSyncStarted(true);
      // Simulate data sync progress
      const interval = setInterval(() => {
        setSetupData(prev => ({
          ...prev,
          syncProgress: Math.min(prev.syncProgress + 10, 100)
        }));
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [syncStarted, setSetupData]);

  const syncItems = [
    { name: 'Historical campaign data', status: setupData.syncProgress > 20 ? 'complete' : 'pending' },
    { name: 'Performance metrics', status: setupData.syncProgress > 40 ? 'complete' : 'pending' },
    { name: 'Audience insights', status: setupData.syncProgress > 60 ? 'complete' : 'pending' },
    { name: 'Keyword research', status: setupData.syncProgress > 80 ? 'complete' : 'pending' },
    { name: 'Initial recommendations', status: setupData.syncProgress === 100 ? 'complete' : 'pending' }
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-300 mb-6">
        We're synchronizing your data and generating initial insights. This may take a few minutes.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Sync Progress</span>
          <span className="text-gray-300">{setupData.syncProgress}%</span>
        </div>
        <Progress value={setupData.syncProgress} className="h-3 bg-gray-700" />
      </div>

      <div className="space-y-3">
        {syncItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            {item.status === 'complete' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
            <span className={`${
              item.status === 'complete' ? 'text-white' : 'text-gray-400'
            }`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {setupData.syncProgress === 100 && (
        <Card className="bg-green-900/20 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="text-white font-medium">Setup Complete!</h4>
                <p className="text-green-300 text-sm">
                  Your Campaign AI account is ready to optimize your campaigns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}