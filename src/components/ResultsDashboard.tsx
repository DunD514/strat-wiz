
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
  Search, MousePointer, ArrowLeft, Download 
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Marketing Strategy</h1>
            <p className="text-gray-600">AI-powered recommendations tailored to your business</p>
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
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">Weeks to full scale</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
              <CardDescription>Distribution of your marketing spend</CardDescription>
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
            <CardTitle>Campaign Strategies</CardTitle>
            <CardDescription>Detailed breakdown of your recommended campaigns</CardDescription>
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
                  
                  <div className="grid md:grid-cols-3 gap-4">
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Target Audience Segments</CardTitle>
            <CardDescription>Identified customer segments for your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {strategy.targetSegments.map((segment, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{segment.name}</h3>
                    <Badge variant="outline">{segment.size.toLocaleString()} people</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Key Characteristics:</p>
                    <div className="flex flex-wrap gap-2">
                      {segment.characteristics.map((char, charIndex) => (
                        <Badge key={charIndex} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
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
