
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  DollarSign, Users, TrendingUp, Calendar, Mail, Share2, 
  Search, MousePointer, ArrowLeft, Download, Lightbulb, Target
} from "lucide-react";
import { StrategyData } from "@/pages/Index";

interface ResultsDashboardProps {
  strategy: StrategyData;
  onStartOver: () => void;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

const ResultsDashboard = ({ strategy, onStartOver }: ResultsDashboardProps) => {
  const totalBudget = strategy.budgetAllocation.reduce((sum, item) => sum + item.amount, 0);
  const totalReach = strategy.campaigns.reduce((sum, campaign) => sum + campaign.expectedReach, 0);

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      case 'seo': return <Search className="h-4 w-4" />;
      case 'ppc': return <MousePointer className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email': return 'bg-blue-500';
      case 'social': return 'bg-purple-500';
      case 'seo': return 'bg-green-500';
      case 'ppc': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your AI-Generated Marketing Strategy</h1>
            <p className="text-gray-600">Personalized recommendations based on your business data</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onStartOver}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Plan
            </Button>
          </div>
        </div>

        {/* Actionable Tips Section */}
        {strategy.actionableTips && strategy.actionableTips.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-orange-500" />
                Actionable Tips to Get Started
              </CardTitle>
              <CardDescription>Follow these recommendations for the best results</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strategy.actionableTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Strategy Options */}
        {strategy.strategyOptions && strategy.strategyOptions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-500" />
                Strategy Options to Consider
              </CardTitle>
              <CardDescription>Choose the approach that best fits your business goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategy.strategyOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-green-700 mb-1">Pros:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {option.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-700 mb-1">Cons:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {option.cons.map((con, conIndex) => (
                            <li key={conIndex} className="flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly allocation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">People per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategy.campaigns.length}</div>
              <p className="text-xs text-muted-foreground">Active strategies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Timeline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(strategy.campaigns.reduce((acc, campaign) => 
                  acc + parseInt(campaign.timeline.split(' ')[0]), 0) / strategy.campaigns.length)}
              </div>
              <p className="text-xs text-muted-foreground">Weeks average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation & Reasoning</CardTitle>
              <CardDescription>How your marketing budget will be distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={strategy.budgetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percentage}) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {strategy.budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Budget']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Budget Explanations */}
              <div className="mt-4 space-y-2">
                {strategy.budgetAllocation.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <span className="font-medium">{item.category}:</span>
                    <span className="text-gray-600 max-w-xs text-right">{item.explanation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expected Reach Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Reach by Campaign</CardTitle>
              <CardDescription>Projected audience reach per channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strategy.campaigns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Reach']} />
                  <Bar dataKey="expectedReach" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Campaign Breakdown</CardTitle>
            <CardDescription>Comprehensive analysis of each recommended campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {strategy.campaigns.map((campaign, index) => (
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getChannelColor(campaign.channel)} text-white`}>
                        {getChannelIcon(campaign.channel)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <Badge variant="secondary">{campaign.channel}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${campaign.budget.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Budget</p>
                    </div>
                  </div>
                  
                  {campaign.description && (
                    <p className="text-gray-700 mb-4">{campaign.description}</p>
                  )}
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Timeline</p>
                      <p className="text-lg">{campaign.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expected Reach</p>
                      <p className="text-lg">{campaign.expectedReach.toLocaleString()} people</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cost per Reach</p>
                      <p className="text-lg">${(campaign.budget / campaign.expectedReach).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROI Potential</p>
                      <p className="text-lg">
                        {(campaign.expectedReach / campaign.budget * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  
                  {campaign.costBreakdown && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">How Your Money Will Be Spent:</h4>
                      <p className="text-gray-700">{campaign.costBreakdown}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Target Audience Analysis</CardTitle>
            <CardDescription>AI-identified customer segments based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {strategy.targetSegments.map((segment, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{segment.name}</h3>
                    <Badge variant="outline">{segment.size.toLocaleString()} people</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Key Characteristics:</p>
                      <div className="flex flex-wrap gap-2">
                        {segment.characteristics.map((char, charIndex) => (
                          <Badge key={charIndex} variant="secondary" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {segment.reasoning && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Why This Segment Matters:</p>
                        <p className="text-sm text-gray-700">{segment.reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDashboard;
