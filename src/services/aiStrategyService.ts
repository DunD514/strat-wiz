
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserAnswers, StrategyData } from '@/pages/Index';

const genAI = new GoogleGenerativeAI('AIzaSyCvBXZg1LPI9XRbwA5ksWnvqKXcYIlkT1U');

interface CSVInsight {
  totalRows: number;
  columns: string[];
  sampleData: any[];
  insights: string[];
}

export const analyzeCSVData = (csvData: any[]): CSVInsight => {
  if (!csvData || csvData.length === 0) {
    return {
      totalRows: 0,
      columns: [],
      sampleData: [],
      insights: []
    };
  }

  const columns = Object.keys(csvData[0]);
  const insights: string[] = [];

  // Analyze numeric columns for insights
  columns.forEach(column => {
    const values = csvData.map(row => row[column]).filter(val => val && !isNaN(parseFloat(val)));
    if (values.length > 0) {
      const numericValues = values.map(val => parseFloat(val));
      const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      insights.push(`${column}: Average value is ${avg.toFixed(2)}`);
    }
  });

  // Count unique values in categorical columns
  columns.forEach(column => {
    const uniqueValues = [...new Set(csvData.map(row => row[column]))].filter(val => val);
    if (uniqueValues.length < csvData.length && uniqueValues.length > 1) {
      insights.push(`${column}: Found ${uniqueValues.length} unique categories`);
    }
  });

  return {
    totalRows: csvData.length,
    columns,
    sampleData: csvData.slice(0, 3),
    insights
  };
};

export const generateRealisticStrategy = async (
  answers: UserAnswers,
  csvInsight: CSVInsight
): Promise<StrategyData> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const csvContext = csvInsight.totalRows > 0 
    ? `CSV Data Analysis:
       - Total records: ${csvInsight.totalRows}
       - Data columns: ${csvInsight.columns.join(', ')}
       - Key insights: ${csvInsight.insights.join('; ')}
       - Sample data: ${JSON.stringify(csvInsight.sampleData)}`
    : 'No CSV data provided';

  const prompt = `As a marketing strategy expert, create a detailed, realistic marketing plan based on:

BUSINESS DETAILS:
- Product/Service: ${answers.product}
- Monthly Budget: $${answers.budget}
- Target Customers: ${answers.customers}
- Growth Goal: ${answers.growthGoal}

${csvContext}

Please provide a comprehensive marketing strategy with:

1. REALISTIC CAMPAIGNS (4-6 campaigns):
   - Specific campaign names and descriptions
   - Appropriate channels (Email, Social Media, SEO, PPC, Content Marketing, Influencer Marketing)
   - Realistic budget allocation based on the total budget
   - Achievable timelines (in weeks)
   - Expected reach based on industry benchmarks and budget

2. DETAILED BUDGET BREAKDOWN:
   - Explain how each dollar will be spent
   - Include setup costs, ongoing costs, tools, and management fees
   - Provide percentage allocation with reasoning

3. TARGET SEGMENTS (2-4 segments):
   - Based on the customer description and CSV data insights
   - Realistic audience sizes
   - Specific characteristics and behaviors

4. ACTIONABLE TIPS:
   - What the business should do first
   - How to measure success
   - Common pitfalls to avoid
   - Timeline recommendations

5. STRATEGY PREFERENCES:
   - Suggest 2-3 different strategic approaches (e.g., Growth-focused, Brand-building, Performance-driven)
   - Explain the pros/cons of each approach

Please make all numbers realistic based on the budget size and industry standards. Be specific about costs, timelines, and expected results.

Return the response in valid JSON format matching this structure:
{
  "campaigns": [
    {
      "name": "Campaign Name",
      "channel": "Channel Type",
      "budget": number,
      "timeline": "X weeks",
      "expectedReach": number,
      "description": "Detailed description",
      "costBreakdown": "How the budget is spent"
    }
  ],
  "budgetAllocation": [
    {
      "category": "Category Name",
      "amount": number,
      "percentage": number,
      "explanation": "Why this allocation"
    }
  ],
  "targetSegments": [
    {
      "name": "Segment Name",
      "size": number,
      "characteristics": ["trait1", "trait2"],
      "reasoning": "Why this segment matters"
    }
  ],
  "actionableTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "strategyOptions": [
    {
      "name": "Strategy Name",
      "description": "What this strategy focuses on",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const aiResponse = JSON.parse(jsonMatch[0]);
    
    // Transform AI response to our StrategyData format
    const strategyData: StrategyData = {
      campaigns: aiResponse.campaigns || [],
      budgetAllocation: aiResponse.budgetAllocation || [],
      targetSegments: aiResponse.targetSegments || [],
      actionableTips: aiResponse.actionableTips || [],
      strategyOptions: aiResponse.strategyOptions || []
    };

    return strategyData;
  } catch (error) {
    console.error('Error generating strategy:', error);
    
    // Fallback strategy if API fails
    const budget = parseFloat(answers.budget) || 5000;
    return {
      campaigns: [
        {
          name: "Digital Advertising Campaign",
          channel: "PPC",
          budget: Math.floor(budget * 0.4),
          timeline: "8 weeks",
          expectedReach: Math.floor(budget * 0.4 * 2),
          description: "Targeted Google and Facebook ads",
          costBreakdown: "Ad spend (80%), management (20%)"
        }
      ],
      budgetAllocation: [
        { category: "Digital Ads", amount: Math.floor(budget * 0.6), percentage: 60, explanation: "Primary customer acquisition" },
        { category: "Content Creation", amount: Math.floor(budget * 0.25), percentage: 25, explanation: "Supporting content and creative" },
        { category: "Tools & Analytics", amount: Math.floor(budget * 0.15), percentage: 15, explanation: "Marketing tools and tracking" }
      ],
      targetSegments: [
        {
          name: "Primary Audience",
          size: 10000,
          characteristics: ["Interested in your product category"],
          reasoning: "Based on your customer description"
        }
      ],
      actionableTips: [
        "Start with a small test budget to validate your audience",
        "Set up proper tracking before launching campaigns",
        "Focus on one channel initially, then expand"
      ],
      strategyOptions: [
        {
          name: "Growth-Focused",
          description: "Prioritize rapid customer acquisition",
          pros: ["Fast results", "Scalable"],
          cons: ["Higher risk", "Requires ongoing investment"]
        }
      ]
    };
  }
};
