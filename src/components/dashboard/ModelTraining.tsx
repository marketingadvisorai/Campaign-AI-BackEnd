import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Brain,
  Database,
  Cpu,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Settings,
  Eye,
  Trash2,
  Copy,
  RefreshCw,
  Rocket,
  FlaskConical,
  GitBranch,
  Activity,
  Layers,
  Globe,
  Building2,
  Plus,
  Gauge,
  LineChart,
  Users,
  ShoppingCart,
  MousePointer,
  DollarSign,
  Calendar,
  Filter,
  Sliders,
  Info,
  HelpCircle,
  Save,
  Wand2
} from 'lucide-react';

export function ModelTraining() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedBaseModel, setSelectedBaseModel] = useState('');
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState('datasets');

  // Mock data for training datasets
  const datasets = [
    {
      id: 'dataset-1',
      name: 'E-commerce Campaign Data',
      description: 'High-performing search ads for retail and e-commerce',
      size: '45.2K',
      records: 45234,
      type: 'Search Ads',
      quality: 92,
      lastUpdated: '2 hours ago',
      status: 'ready'
    },
    {
      id: 'dataset-2',
      name: 'B2B Lead Generation',
      description: 'LinkedIn and Google Ads for B2B software companies',
      size: '28.7K',
      records: 28756,
      type: 'B2B Campaigns',
      quality: 88,
      lastUpdated: '1 day ago',
      status: 'ready'
    },
    {
      id: 'dataset-3',
      name: 'Social Media Campaigns',
      description: 'Facebook and Instagram ads across multiple verticals',
      size: '67.1K',
      records: 67142,
      type: 'Social Media',
      quality: 85,
      lastUpdated: '3 days ago',
      status: 'processing'
    },
    {
      id: 'dataset-4',
      name: 'Local Services Data',
      description: 'Location-based campaigns for service businesses',
      size: '15.3K',
      records: 15378,
      type: 'Local Campaigns',
      quality: 90,
      lastUpdated: '1 week ago',
      status: 'ready'
    }
  ];

  // Mock data for trained models
  const trainedModels = [
    {
      id: 'model-1',
      name: 'E-commerce Optimizer v2.1',
      baseModel: 'GPT-4 Turbo',
      specialty: 'E-commerce Search Ads',
      accuracy: 94.5,
      performance: '+23% CTR improvement',
      status: 'deployed',
      trainingDate: '2024-03-10',
      version: 'v2.1',
      deployedClients: 12
    },
    {
      id: 'model-2',
      name: 'B2B Lead Generator',
      baseModel: 'Claude 3.5 Sonnet',
      specialty: 'B2B Campaign Optimization',
      accuracy: 91.2,
      performance: '+18% conversion rate',
      status: 'testing',
      trainingDate: '2024-03-08',
      version: 'v1.3',
      deployedClients: 5
    },
    {
      id: 'model-3',
      name: 'Social Media Expert',
      baseModel: 'Gemini Pro',
      specialty: 'Social Media Campaigns',
      accuracy: 89.8,
      performance: '+15% engagement',
      status: 'training',
      trainingDate: '2024-03-12',
      version: 'v1.0',
      deployedClients: 0
    }
  ];

  // Mock data for training jobs
  const trainingJobs = [
    {
      id: 'job-1',
      name: 'E-commerce Optimizer v2.2',
      dataset: 'E-commerce Campaign Data',
      baseModel: 'GPT-4 Turbo',
      status: 'running',
      progress: 68,
      timeRemaining: '2h 34m',
      startTime: '2024-03-12 14:30',
      currentEpoch: 17,
      totalEpochs: 25,
      loss: 0.234,
      accuracy: 92.1
    },
    {
      id: 'job-2',
      name: 'Local Services Specialist',
      dataset: 'Local Services Data',
      baseModel: 'Claude 3.5 Sonnet',
      status: 'queued',
      progress: 0,
      timeRemaining: 'Pending',
      startTime: 'Queued',
      currentEpoch: 0,
      totalEpochs: 20,
      loss: null,
      accuracy: null
    }
  ];

  const baseModels = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'Latest GPT-4 model with improved reasoning',
      contextLength: '128K tokens',
      trainingCost: '$0.08/1K tokens',
      logo: '🤖'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      description: 'Advanced reasoning and code generation',
      contextLength: '200K tokens',
      trainingCost: '$0.06/1K tokens',
      logo: '🧠'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Multimodal AI with strong performance',
      contextLength: '32K tokens',
      trainingCost: '$0.05/1K tokens',
      logo: '🔍'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      ready: { className: 'bg-green-600 text-white', text: 'Ready' },
      processing: { className: 'bg-yellow-600 text-white', text: 'Processing' },
      training: { className: 'bg-blue-600 text-white', text: 'Training' },
      deployed: { className: 'bg-green-600 text-white', text: 'Deployed' },
      testing: { className: 'bg-orange-600 text-white', text: 'Testing' },
      running: { className: 'bg-blue-600 text-white', text: 'Running' },
      queued: { className: 'bg-gray-600 text-white', text: 'Queued' },
      completed: { className: 'bg-green-600 text-white', text: 'Completed' },
      failed: { className: 'bg-red-600 text-white', text: 'Failed' }
    };
    
    const config = variants[status] || variants.ready;
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getQualityColor = (quality) => {
    if (quality >= 90) return 'text-green-500';
    if (quality >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">AI Model Training</h1>
          <p className="text-muted-foreground mt-1">
            Train and fine-tune LLM models for campaign-specific optimization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-border text-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Models
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
            <Rocket className="mr-2 h-4 w-4" />
            Start Training
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl text-card-foreground">7</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">3 deployed</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Training Jobs</p>
                <p className="text-2xl text-card-foreground">2</p>
                <div className="flex items-center mt-1">
                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">1 running</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Training Data</p>
                <p className="text-2xl text-card-foreground">156.3K</p>
                <div className="flex items-center mt-1">
                  <Database className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">records ready</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl text-card-foreground">91.8%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">accuracy</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="datasets">Training Datasets</TabsTrigger>
          <TabsTrigger value="models">Trained Models</TabsTrigger>
          <TabsTrigger value="training">Training Jobs</TabsTrigger>
          <TabsTrigger value="create">Create New Model</TabsTrigger>
          <TabsTrigger value="configure">Configure Training</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-6">
          {/* Dataset Upload Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-card-foreground mb-2">Upload Training Dataset</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload campaign performance data to train specialized models for specific verticals
                  </p>
                  <div className="flex space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CSV/JSON
                    </Button>
                    <Button variant="outline" className="border-border text-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      Data Format Guide
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datasets List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Database className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-card-foreground">{dataset.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {dataset.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(dataset.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Records</p>
                      <p className="text-lg text-card-foreground">{dataset.records.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="text-lg text-card-foreground">{dataset.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="text-sm text-card-foreground">{dataset.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quality Score</p>
                      <p className={`text-lg ${getQualityColor(dataset.quality)}`}>{dataset.quality}%</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last updated: {dataset.lastUpdated}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-border text-foreground">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="border-border text-foreground">
                          <Download className="mr-1 h-3 w-3" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="space-y-4">
            {trainedModels.map((model) => (
              <Card key={model.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Brain className="h-6 w-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg text-card-foreground">{model.name}</h3>
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            {model.version}
                          </Badge>
                          {getStatusBadge(model.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Base Model</p>
                            <p className="text-sm text-card-foreground">{model.baseModel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Specialty</p>
                            <p className="text-sm text-card-foreground">{model.specialty}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="text-sm text-green-600 dark:text-green-400">{model.accuracy}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Performance</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{model.performance}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Trained: {model.trainingDate}</span>
                          <span>•</span>
                          <span>Deployed to {model.deployedClients} clients</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Rocket className="mr-1 h-3 w-3" />
                        Deploy
                      </Button>
                      <Button size="sm" variant="outline" className="border-border text-foreground">
                        <FlaskConical className="mr-1 h-3 w-3" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline" className="border-border text-foreground">
                        <Copy className="mr-1 h-3 w-3" />
                        Clone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="space-y-4">
            {trainingJobs.map((job) => (
              <Card key={job.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        job.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-900/20'
                      }`}>
                        <Cpu className={`h-6 w-6 ${
                          job.status === 'running' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg text-card-foreground">{job.name}</h3>
                          {getStatusBadge(job.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Dataset</p>
                            <p className="text-sm text-card-foreground">{job.dataset}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Base Model</p>
                            <p className="text-sm text-card-foreground">{job.baseModel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-sm text-card-foreground">{job.progress}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Time Remaining</p>
                            <p className="text-sm text-card-foreground">{job.timeRemaining}</p>
                          </div>
                        </div>
                        
                        {job.status === 'running' && (
                          <div className="space-y-2">
                            <Progress value={job.progress} className="h-2" />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Epoch {job.currentEpoch}/{job.totalEpochs}</span>
                              <span>Loss: {job.loss} | Accuracy: {job.accuracy}%</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
                          <span>Started: {job.startTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {job.status === 'running' && (
                        <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                          <Square className="mr-1 h-3 w-3" />
                          Stop
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-border text-foreground">
                        <Eye className="mr-1 h-3 w-3" />
                        Logs
                      </Button>
                      <Button size="sm" variant="outline" className="border-border text-foreground">
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Metrics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          {/* Model Creation Wizard */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-card-foreground mb-2">Create New AI Model</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build a custom campaign optimization model tailored to your specific needs and data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Model Foundation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                  <div>
                    <CardTitle className="text-card-foreground">Model Foundation</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Choose base model and architecture
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Model Name</Label>
                  <Input 
                    placeholder="e.g., Custom E-commerce Optimizer"
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Base Model Architecture</Label>
                  <RadioGroup defaultValue="llm-tuning" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="llm-tuning" id="llm-tuning" />
                      <Label htmlFor="llm-tuning" className="text-card-foreground cursor-pointer">
                        <div>
                          <div className="font-medium">LLM Fine-tuning</div>
                          <div className="text-xs text-muted-foreground">Fine-tune GPT/Claude/Gemini</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neural-network" id="neural-network" />
                      <Label htmlFor="neural-network" className="text-card-foreground cursor-pointer">
                        <div>
                          <div className="font-medium">Neural Network</div>
                          <div className="text-xs text-muted-foreground">Custom deep learning model</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reinforcement" id="reinforcement" />
                      <Label htmlFor="reinforcement" className="text-card-foreground cursor-pointer">
                        <div>
                          <div className="font-medium">Reinforcement Learning</div>
                          <div className="text-xs text-muted-foreground">Multi-armed bandit optimization</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Base LLM (if applicable)</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select base model..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {baseModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-3">
                            <span>{model.logo}</span>
                            <div>
                              <div className="text-sm">{model.name}</div>
                              <div className="text-xs text-muted-foreground">{model.provider} • {model.trainingCost}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Campaign Targeting */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                  <div>
                    <CardTitle className="text-card-foreground">Campaign Targeting</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Define specialization and objectives
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Campaign Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="search-campaigns" />
                      <Label htmlFor="search-campaigns" className="text-card-foreground text-sm">Search</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="display-campaigns" />
                      <Label htmlFor="display-campaigns" className="text-card-foreground text-sm">Display</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="social-campaigns" />
                      <Label htmlFor="social-campaigns" className="text-card-foreground text-sm">Social</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="shopping-campaigns" />
                      <Label htmlFor="shopping-campaigns" className="text-card-foreground text-sm">Shopping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="video-campaigns" />
                      <Label htmlFor="video-campaigns" className="text-card-foreground text-sm">Video</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="local-campaigns" />
                      <Label htmlFor="local-campaigns" className="text-card-foreground text-sm">Local</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Industry Focus</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="ecommerce">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>E-commerce & Retail</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="b2b">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span>B2B Software & Services</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="healthcare">
                        <div className="flex items-center space-x-2">
                          <Plus className="h-4 w-4" />
                          <span>Healthcare & Medical</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="finance">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Finance & Insurance</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="education">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Education & Training</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Primary Optimization Goals</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="maximize-conversions" />
                      <Label htmlFor="maximize-conversions" className="text-card-foreground text-sm">Maximize Conversions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="improve-ctr" />
                      <Label htmlFor="improve-ctr" className="text-card-foreground text-sm">Improve CTR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="optimize-roas" />
                      <Label htmlFor="optimize-roas" className="text-card-foreground text-sm">Optimize ROAS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reduce-cpa" />
                      <Label htmlFor="reduce-cpa" className="text-card-foreground text-sm">Reduce CPA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="increase-reach" />
                      <Label htmlFor="increase-reach" className="text-card-foreground text-sm">Increase Reach</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Target Platforms</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="google-platform" />
                      <Label htmlFor="google-platform" className="text-card-foreground text-sm">Google Ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="meta-platform" />
                      <Label htmlFor="meta-platform" className="text-card-foreground text-sm">Meta Ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="linkedin-platform" />
                      <Label htmlFor="linkedin-platform" className="text-card-foreground text-sm">LinkedIn Ads</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Training Configuration */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
                  <div>
                    <CardTitle className="text-card-foreground">Training Setup</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure training parameters
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Training Dataset</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select dataset..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {datasets.filter(d => d.status === 'ready').map((dataset) => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          <div>
                            <div className="text-sm">{dataset.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {dataset.records.toLocaleString()} records • Quality: {dataset.quality}%
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Training Mode</Label>
                  <RadioGroup defaultValue="fine-tuning" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fine-tuning" id="fine-tuning" />
                      <Label htmlFor="fine-tuning" className="text-card-foreground cursor-pointer text-sm">
                        Fine-tuning (Recommended)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-training" id="full-training" />
                      <Label htmlFor="full-training" className="text-card-foreground cursor-pointer text-sm">
                        Full Training (Advanced)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer-learning" id="transfer-learning" />
                      <Label htmlFor="transfer-learning" className="text-card-foreground cursor-pointer text-sm">
                        Transfer Learning
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Learning Rate</Label>
                  <div className="px-3">
                    <Slider
                      defaultValue={[0.001]}
                      max={0.01}
                      min={0.0001}
                      step={0.0001}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.0001</span>
                      <span>0.001</span>
                      <span>0.01</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Epochs</Label>
                    <Input 
                      type="number"
                      defaultValue="20"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Batch Size</Label>
                    <Select defaultValue="16">
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                        <SelectItem value="64">64</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Validation Split</Label>
                  <div className="px-3">
                    <Slider
                      defaultValue={[20]}
                      max={30}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10%</span>
                      <span>20%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Advanced Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="early-stopping-create" defaultChecked />
                      <Label htmlFor="early-stopping-create" className="text-card-foreground text-sm">Early Stopping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="data-aug-create" />
                      <Label htmlFor="data-aug-create" className="text-card-foreground text-sm">Data Augmentation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-tune" />
                      <Label htmlFor="auto-tune" className="text-card-foreground text-sm">Auto Hyperparameter Tuning</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Selection */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Feature Selection & Engineering
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose which data features to include in your model training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Campaign Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="impressions" defaultChecked />
                      <Label htmlFor="impressions" className="text-card-foreground text-sm">Impressions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="clicks" defaultChecked />
                      <Label htmlFor="clicks" className="text-card-foreground text-sm">Clicks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="conversions" defaultChecked />
                      <Label htmlFor="conversions" className="text-card-foreground text-sm">Conversions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ctr" defaultChecked />
                      <Label htmlFor="ctr" className="text-card-foreground text-sm">CTR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cpc" defaultChecked />
                      <Label htmlFor="cpc" className="text-card-foreground text-sm">CPC</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Temporal Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="day-of-week" defaultChecked />
                      <Label htmlFor="day-of-week" className="text-card-foreground text-sm">Day of Week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hour-of-day" defaultChecked />
                      <Label htmlFor="hour-of-day" className="text-card-foreground text-sm">Hour of Day</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="seasonality" />
                      <Label htmlFor="seasonality" className="text-card-foreground text-sm">Seasonality</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="holidays" />
                      <Label htmlFor="holidays" className="text-card-foreground text-sm">Holidays</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Audience & Targeting</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="demographics" />
                      <Label htmlFor="demographics" className="text-card-foreground text-sm">Demographics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interests" />
                      <Label htmlFor="interests" className="text-card-foreground text-sm">Interests</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="geographic" defaultChecked />
                      <Label htmlFor="geographic" className="text-card-foreground text-sm">Geographic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="device-type" defaultChecked />
                      <Label htmlFor="device-type" className="text-card-foreground text-sm">Device Type</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation & Testing */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center">
                <FlaskConical className="mr-2 h-5 w-5" />
                Validation & Testing Configuration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Set up validation methodology and testing parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Validation Method</Label>
                    <RadioGroup defaultValue="time-series" className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="time-series" id="time-series" />
                        <Label htmlFor="time-series" className="text-card-foreground cursor-pointer">
                          <div>
                            <div className="font-medium">Time Series Split</div>
                            <div className="text-xs text-muted-foreground">Chronological validation (recommended)</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="k-fold" id="k-fold" />
                        <Label htmlFor="k-fold" className="text-card-foreground cursor-pointer">
                          <div>
                            <div className="font-medium">K-Fold Cross Validation</div>
                            <div className="text-xs text-muted-foreground">Standard cross validation</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Performance Metrics</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mae" defaultChecked />
                        <Label htmlFor="mae" className="text-card-foreground text-sm">Mean Absolute Error</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mape" defaultChecked />
                        <Label htmlFor="mape" className="text-card-foreground text-sm">Mean Absolute Percentage Error</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="r2" defaultChecked />
                        <Label htmlFor="r2" className="text-card-foreground text-sm">R² Score</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">A/B Testing Setup</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="enable-ab-testing" defaultChecked />
                        <Label htmlFor="enable-ab-testing" className="text-card-foreground text-sm">Enable A/B Testing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="gradual-rollout" defaultChecked />
                        <Label htmlFor="gradual-rollout" className="text-card-foreground text-sm">Gradual Rollout</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Test Traffic Allocation</Label>
                    <div className="px-3">
                      <Slider
                        defaultValue={[10]}
                        max={50}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>10% (recommended)</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimation & Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-card-foreground mb-1">Training Cost Estimation</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your configuration and selected options
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-card rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-muted-foreground">Training Time</div>
                  <div className="text-lg text-card-foreground">3-4 hours</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-card rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-muted-foreground">Training Cost</div>
                  <div className="text-lg text-card-foreground">$32.50</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-card rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-muted-foreground">Monthly Runtime</div>
                  <div className="text-lg text-card-foreground">$12.00</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-card rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-muted-foreground">Expected ROI</div>
                  <div className="text-lg text-green-600">+15-25%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Ready to create your custom AI model?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All configurations are saved and can be modified before training starts
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="border-border text-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Rocket className="mr-2 h-4 w-4" />
                    Create & Start Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Configuration */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Training Configuration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure parameters for your model training job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Model Name</Label>
                  <Input 
                    placeholder="e.g., E-commerce Optimizer v3.0"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Base Model</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select base model..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {baseModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-3">
                            <span>{model.logo}</span>
                            <div>
                              <div className="text-sm">{model.name}</div>
                              <div className="text-xs text-muted-foreground">{model.provider}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Training Dataset</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select dataset..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {datasets.filter(d => d.status === 'ready').map((dataset) => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          <div>
                            <div className="text-sm">{dataset.name}</div>
                            <div className="text-xs text-muted-foreground">{dataset.records.toLocaleString()} records</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Learning Rate</Label>
                  <div className="px-3">
                    <Slider
                      defaultValue={[0.001]}
                      max={0.01}
                      min={0.0001}
                      step={0.0001}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.0001</span>
                      <span>0.001 (recommended)</span>
                      <span>0.01</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Epochs</Label>
                  <Input 
                    type="number"
                    defaultValue="20"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Batch Size</Label>
                  <Select defaultValue="16">
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16 (recommended)</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="64">64</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Specialization */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Campaign Specialization</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure model for specific campaign types and objectives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Campaign Type</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select campaign type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="search">Search Campaigns</SelectItem>
                      <SelectItem value="display">Display Campaigns</SelectItem>
                      <SelectItem value="social">Social Media Campaigns</SelectItem>
                      <SelectItem value="shopping">Shopping Campaigns</SelectItem>
                      <SelectItem value="video">Video Campaigns</SelectItem>
                      <SelectItem value="local">Local Campaigns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Industry Vertical</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                      <SelectItem value="b2b">B2B Software & Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare & Medical</SelectItem>
                      <SelectItem value="finance">Finance & Insurance</SelectItem>
                      <SelectItem value="education">Education & Training</SelectItem>
                      <SelectItem value="travel">Travel & Hospitality</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Primary Objective</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select objective..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="conversions">Maximize Conversions</SelectItem>
                      <SelectItem value="ctr">Improve Click-Through Rate</SelectItem>
                      <SelectItem value="roas">Optimize ROAS</SelectItem>
                      <SelectItem value="reach">Increase Reach</SelectItem>
                      <SelectItem value="engagement">Boost Engagement</SelectItem>
                      <SelectItem value="leads">Generate Leads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Target Platforms</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="google-ads" />
                      <Label htmlFor="google-ads" className="text-card-foreground">Google Ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="meta-ads" />
                      <Label htmlFor="meta-ads" className="text-card-foreground">Meta Ads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="linkedin-ads" />
                      <Label htmlFor="linkedin-ads" className="text-card-foreground">LinkedIn Ads</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-card-foreground">Advanced Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-deploy" />
                      <Label htmlFor="auto-deploy" className="text-card-foreground">Auto-deploy after validation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="early-stopping" />
                      <Label htmlFor="early-stopping" className="text-card-foreground">Enable early stopping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="data-augmentation" />
                      <Label htmlFor="data-augmentation" className="text-card-foreground">Data augmentation</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Summary & Start Button */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-card-foreground mb-1">Ready to Start Training</h3>
                    <p className="text-sm text-muted-foreground">
                      Estimated training time: 3-4 hours • Estimated cost: $24.50
                    </p>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Play className="mr-2 h-4 w-4" />
                  Start Training Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}