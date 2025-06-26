
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, BarChart3, Target, ArrowRight, Sparkles } from "lucide-react";
import OnboardingFlow from "@/components/OnboardingFlow";
import ResultsDashboard from "@/components/ResultsDashboard";

export interface UserAnswers {
  product: string;
  budget: string;
  customers: string;
  growthGoal: string;
}

export interface StrategyData {
  campaigns: Array<{
    name: string;
    channel: string;
    budget: number;
    timeline: string;
    expectedReach: number;
  }>;
  budgetAllocation: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  targetSegments: Array<{
    name: string;
    size: number;
    characteristics: string[];
  }>;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'onboarding' | 'results'>('landing');
  const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);

  const handleStartPlanning = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (answers: UserAnswers, csvData: any[], strategy: StrategyData) => {
    setUserAnswers(answers);
    setCsvData(csvData);
    setStrategyData(strategy);
    setCurrentStep('results');
  };

  const handleStartOver = () => {
    setCurrentStep('landing');
    setUserAnswers(null);
    setCsvData(null);
    setStrategyData(null);
  };

  if (currentStep === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentStep === 'results' && strategyData) {
    return <ResultsDashboard strategy={strategyData} onStartOver={handleStartOver} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Strategic AI Marketing Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your business data into actionable marketing strategies. Get personalized campaigns, 
            budget allocation, and growth insights powered by AI.
          </p>
          <Button 
            onClick={handleStartPlanning}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Planning <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Answer Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Tell us about your product, budget, customers, and growth goals through our AI chatbot.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Upload Data</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Upload your CSV with product/customer data for deeper insights and personalized recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">AI Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Our AI analyzes your data and generates detailed marketing strategies tailored to your business.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Receive actionable plans with campaigns, budget allocation, timelines, and expected results.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What You'll Get</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Targeted Campaigns</h3>
                <p className="text-gray-600">Email, social media, SEO, and paid advertising campaigns tailored to your audience.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BarChart3 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Budget Allocation</h3>
                <p className="text-gray-600">Smart distribution of your marketing budget across channels for maximum ROI.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Brain className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">Data-driven recommendations based on your specific business context.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Sparkles className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Expected Results</h3>
                <p className="text-gray-600">Projected reach, engagement, and conversion rates for each campaign.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
