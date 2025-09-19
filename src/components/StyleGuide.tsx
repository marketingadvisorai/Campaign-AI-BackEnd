import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Settings 
} from 'lucide-react';

export function StyleGuide() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Campaign AI Style Guide</h1>
          <p className="text-gray-400">Design system components and patterns</p>
        </div>

        {/* Colors */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Color Palette</CardTitle>
            <CardDescription className="text-gray-400">
              Dark theme color system with high contrast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <h4 className="text-white font-medium">Background</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 border border-gray-600 rounded"></div>
                    <span className="text-gray-300">gray-900</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded"></div>
                    <span className="text-gray-300">gray-800</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 border border-gray-600 rounded"></div>
                    <span className="text-gray-300">gray-700</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium">Primary</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <span className="text-gray-300">blue-600</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">blue-500</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium">Success/Warning</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded"></div>
                    <span className="text-gray-300">green-600</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-600 rounded"></div>
                    <span className="text-gray-300">yellow-600</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-600 rounded"></div>
                    <span className="text-gray-300">red-600</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-medium">Text</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded border border-gray-600"></div>
                    <span className="text-gray-300">white</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <span className="text-gray-300">gray-300</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    <span className="text-gray-300">gray-400</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Typography</CardTitle>
            <CardDescription className="text-gray-400">
              Font styles and hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Heading 1 - Main Page Titles</h1>
              <h2 className="text-2xl font-bold text-white">Heading 2 - Section Titles</h2>
              <h3 className="text-xl font-semibold text-white">Heading 3 - Card Titles</h3>
              <h4 className="text-lg font-medium text-white">Heading 4 - Subsections</h4>
              <p className="text-gray-300">Body text - Regular content and descriptions</p>
              <p className="text-gray-400">Secondary text - Metadata and supporting information</p>
              <p className="text-sm text-gray-500">Small text - Labels and fine print</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Button Styles</CardTitle>
            <CardDescription className="text-gray-400">
              Primary and secondary button variations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Primary Button
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Secondary Button
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Ghost Button
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Small Button
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  Success Action
                </Button>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  Warning Action
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  Destructive Action
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Fields */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Input Fields</CardTitle>
            <CardDescription className="text-gray-400">
              Form input components and states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Default Input</label>
                  <Input 
                    placeholder="Enter text here..." 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Password Input</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Select Field</label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
                    <option>Choose an option...</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Search Input</label>
                  <div className="relative">
                    <Input 
                      placeholder="Search..." 
                      className="bg-gray-700 border-gray-600 text-white pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 text-gray-400">🔍</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Card Layouts</CardTitle>
            <CardDescription className="text-gray-400">
              Standard card components and layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Metric Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <div className="flex items-center space-x-1 text-xs text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Status Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">API Status</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <Progress value={85} className="mt-3 h-2 bg-gray-600" />
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Action Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">
                    Quick action card with button
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Take Action
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Badges & Indicators</CardTitle>
            <CardDescription className="text-gray-400">
              Status indicators and labels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-600">Active</Badge>
                <Badge className="bg-yellow-600">Pending</Badge>
                <Badge className="bg-red-600">Error</Badge>
                <Badge className="bg-blue-600">Info</Badge>
                <Badge className="bg-purple-600">Premium</Badge>
                <Badge className="bg-gray-600">Inactive</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-green-600 text-green-400">
                  +15% CTR
                </Badge>
                <Badge variant="outline" className="border-red-600 text-red-400">
                  High Priority
                </Badge>
                <Badge variant="outline" className="border-blue-600 text-blue-400">
                  New Feature
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icons */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Icon System</CardTitle>
            <CardDescription className="text-gray-400">
              Consistent iconography using Lucide React
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {[
                { icon: Zap, name: 'AI/Power' },
                { icon: Target, name: 'Campaigns' },
                { icon: TrendingUp, name: 'Performance' },
                { icon: Users, name: 'Team' },
                { icon: Settings, name: 'Settings' }
              ].map(({ icon: Icon, name }) => (
                <div key={name} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>Campaign AI Design System - Clean, modern, and accessible</p>
        </div>
      </div>
    </div>
  );
}