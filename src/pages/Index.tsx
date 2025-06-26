
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, BarChart3, Target, ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
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
    description?: string;
    costBreakdown?: string;
  }>;
  budgetAllocation: Array<{
    category: string;
    amount: number;
    percentage: number;
    explanation?: string;
  }>;
  targetSegments: Array<{
    name: string;
    size: number;
    characteristics: string[];
    reasoning?: string;
  }>;
  actionableTips?: string[];
  strategyOptions?: Array<{
    name: string;
    description: string;
    pros: string[];
    cons: string[];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto mb-24">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-75"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Strategic AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketing Planner
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Transform your business data into <span className="font-semibold text-slate-800">actionable marketing strategies</span>. 
            Get personalized campaigns, budget allocation, and growth insights powered by AI.
          </p>
          
          <Button 
            onClick={handleStartPlanning}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl"
          >
            Start Planning <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Four simple steps to your personalized marketing strategy</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
              <CardHeader className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Answer Questions</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Tell us about your product, budget, customers, and growth goals through our AI chatbot.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50" />
              <CardHeader className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Upload Data</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Upload your CSV with product/customer data for deeper insights and personalized recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-50" />
              <CardHeader className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">AI Processing</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Our AI analyzes your data and generates detailed marketing strategies tailored to your business.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50" />
              <CardHeader className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Get Results</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Receive actionable plans with campaigns, budget allocation, timelines, and expected results.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">What You'll Get</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Comprehensive marketing insights tailored to your business</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">Targeted Campaigns</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Email, social media, SEO, and paid advertising campaigns tailored to your audience with realistic budgets and timelines.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">Smart Budget Allocation</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Intelligent distribution of your marketing budget across channels for maximum ROI with detailed cost breakdowns.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">AI-Powered Insights</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Data-driven recommendations based on your specific business context and industry benchmarks.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">Realistic Projections</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Accurate reach, engagement, and conversion rate projections based on real market data and industry standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
