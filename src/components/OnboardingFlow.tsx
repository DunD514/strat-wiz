
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, MessageSquare, DollarSign, Users, TrendingUp, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserAnswers, StrategyData } from "@/pages/Index";

interface OnboardingFlowProps {
  onComplete: (answers: UserAnswers, csvData: any[], strategy: StrategyData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<UserAnswers>({
    product: "",
    budget: "",
    customers: "",
    growthGoal: ""
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      
      // Parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val !== ''));
        
        setCsvData(data);
        toast({
          title: "File uploaded successfully!",
          description: `Parsed ${data.length} rows of data.`,
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const generateStrategy = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing with a delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock strategy data based on user inputs
    const mockStrategy: StrategyData = {
      campaigns: [
        {
          name: "Email Marketing Campaign",
          channel: "Email",
          budget: Math.floor(parseFloat(answers.budget) * 0.3) || 1000,
          timeline: "8 weeks",
          expectedReach: 15000
        },
        {
          name: "Social Media Advertising",
          channel: "Social",
          budget: Math.floor(parseFloat(answers.budget) * 0.4) || 1500,
          timeline: "12 weeks",
          expectedReach: 25000
        },
        {
          name: "SEO Content Strategy",
          channel: "SEO",
          budget: Math.floor(parseFloat(answers.budget) * 0.2) || 800,
          timeline: "16 weeks",
          expectedReach: 10000
        },
        {
          name: "PPC Advertising",
          channel: "PPC",
          budget: Math.floor(parseFloat(answers.budget) * 0.1) || 500,
          timeline: "4 weeks",
          expectedReach: 8000
        }
      ],
      budgetAllocation: [
        { category: "Social Media", amount: Math.floor(parseFloat(answers.budget) * 0.4) || 1500, percentage: 40 },
        { category: "Email Marketing", amount: Math.floor(parseFloat(answers.budget) * 0.3) || 1000, percentage: 30 },
        { category: "SEO", amount: Math.floor(parseFloat(answers.budget) * 0.2) || 800, percentage: 20 },
        { category: "PPC", amount: Math.floor(parseFloat(answers.budget) * 0.1) || 500, percentage: 10 }
      ],
      targetSegments: [
        {
          name: "Primary Segment",
          size: 5000,
          characteristics: ["Age 25-40", "Tech-savvy", "High income"]
        },
        {
          name: "Secondary Segment", 
          size: 3000,
          characteristics: ["Age 30-55", "Budget-conscious", "Quality-focused"]
        }
      ]
    };

    setIsProcessing(false);
    onComplete(answers, csvData || [], mockStrategy);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return answers.product.length > 0;
      case 2: return answers.budget.length > 0;
      case 3: return answers.customers.length > 0;
      case 4: return answers.growthGoal.length > 0;
      case 5: return csvFile !== null;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">What is your product?</CardTitle>
              <CardDescription>Tell us about what you're selling or the service you provide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product/Service Description</Label>
                <Textarea
                  id="product"
                  placeholder="e.g., SaaS project management tool for small teams, handmade jewelry for eco-conscious consumers..."
                  value={answers.product}
                  onChange={(e) => setAnswers({...answers, product: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">What's your monthly marketing budget?</CardTitle>
              <CardDescription>This helps us recommend the right mix of channels and strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 5000"
                  value={answers.budget}
                  onChange={(e) => setAnswers({...answers, budget: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Who are your ideal customers?</CardTitle>
              <CardDescription>Describe your target audience demographics and characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customers">Target Customer Profile</Label>
                <Textarea
                  id="customers"
                  placeholder="e.g., Small business owners, age 30-50, tech-savvy, looking for efficiency tools..."
                  value={answers.customers}
                  onChange={(e) => setAnswers({...answers, customers: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">What's your growth goal?</CardTitle>
              <CardDescription>What do you want to achieve with your marketing efforts?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="growthGoal">Growth Objective</Label>
                <Textarea
                  id="growthGoal"
                  placeholder="e.g., Increase monthly recurring revenue by 50% in 6 months, acquire 1000 new customers..."
                  value={answers.growthGoal}
                  onChange={(e) => setAnswers({...answers, growthGoal: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Upload Your Data (Optional)</CardTitle>
              <CardDescription>Upload a CSV file with your product or customer data for deeper insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="csvFile" className="cursor-pointer">
                    <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                  </Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">CSV files only</p>
                </div>
              </div>
              {csvFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ File uploaded: {csvFile.name}</p>
                  {csvData && <p className="text-green-600 text-sm">Processed {csvData.length} rows</p>}
                </div>
              )}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(6)}
                  className="w-40"
                >
                  Skip Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Generate Your Strategy!</CardTitle>
              <CardDescription>
                We'll analyze your information and create a personalized marketing plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div><strong>Product:</strong> {answers.product.substring(0, 100)}...</div>
                <div><strong>Budget:</strong> ${answers.budget}/month</div>
                <div><strong>Target Customers:</strong> {answers.customers.substring(0, 100)}...</div>
                <div><strong>Growth Goal:</strong> {answers.growthGoal.substring(0, 100)}...</div>
                {csvFile && <div><strong>Data File:</strong> {csvFile.name}</div>}
              </div>
              <Button 
                onClick={generateStrategy}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  "Generate My Marketing Strategy"
                )}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="flex justify-center space-x-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === 5 ? "Continue" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
