
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
      const max = Math.max(...numericValues);
      const min = Math.min(...numericValues);
      insights.push(`${column}: Average ${avg.toFixed(2)} (Range: ${min}-${max})`);
    }
  });

  // Count unique values in categorical columns
  columns.forEach(column => {
    const uniqueValues = [...new Set(csvData.map(row => row[column]))].filter(val => val);
    if (uniqueValues.length < csvData.length && uniqueValues.length > 1) {
      insights.push(`${column}: ${uniqueValues.length} unique categories - Top: ${uniqueValues.slice(0, 3).join(', ')}`);
    }
  });

  // Identify trends and patterns
  if (csvData.length > 10) {
    insights.push(`Dataset size: ${csvData.length} records - suitable for segmentation analysis`);
  }

  return {
    totalRows: csvData.length,
    columns,
    sampleData: csvData.slice(0, 5),
    insights
  };
};

export const generateRealisticStrategy = async (
  answers: UserAnswers,
  csvInsight: CSVInsight
): Promise<StrategyData> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const budget = parseFloat(answers.budget) || 5000;
  
  const csvContext = csvInsight.totalRows > 0 
    ? `DETAILED CSV DATA ANALYSIS:
       - Total records analyzed: ${csvInsight.totalRows}
       - Available data columns: ${csvInsight.columns.join(', ')}
       - Key data insights: ${csvInsight.insights.join('; ')}
       - Sample records: ${JSON.stringify(csvInsight.sampleData)}
       
       Use this data to create targeted segments and realistic projections.`
    : 'No CSV data provided - base recommendations on industry standards and provided business information.';

  const prompt = `You are a seasoned marketing strategist with 15+ years of experience. Create a comprehensive, realistic marketing strategy for this business:

BUSINESS PROFILE:
- Product/Service: ${answers.product}
- Monthly Marketing Budget: $${budget}
- Target Customers: ${answers.customers}
- Growth Objective: ${answers.growthGoal}

${csvContext}

CRITICAL REQUIREMENTS - BE REALISTIC AND SPECIFIC:

1. CAMPAIGN STRATEGY (4-6 campaigns):
   - Use REAL industry benchmarks for costs and performance
   - For budget under $2000: Focus on organic + low-cost paid
   - For budget $2000-$10000: Mix of paid social, Google Ads, email
   - For budget $10000+: Include influencer marketing, premium tools
   - Calculate realistic CTR, conversion rates, and CAC for each channel
   - Base reach calculations on actual ad spend formulas

2. DETAILED BUDGET BREAKDOWN:
   - Account for setup costs, monthly fees, creative costs, management time
   - Include specific tool costs (Canva Pro $15/month, Mailchimp $20-$300/month, etc.)
   - Factor in 15-20% buffer for testing and optimization
   - Show exactly where every dollar goes

3. REALISTIC AUDIENCE TARGETING:
   - Use CSV data to create specific customer personas
   - Calculate addressable market size based on demographics
   - Include lookalike audience sizing
   - Factor in competition and market saturation

4. ACTIONABLE IMPLEMENTATION ROADMAP:
   - Week-by-week action plan for first 12 weeks
   - Specific KPIs to track and realistic targets
   - Required tools, accounts, and setup tasks
   - Team requirements or outsourcing needs

5. STRATEGIC OPTIONS:
   - Growth-focused vs Brand-building vs Performance-driven approaches
   - Include realistic timelines to see results (usually 3-6 months)
   - Honest pros/cons based on budget constraints

IMPORTANT CALCULATION GUIDELINES:
- Google Ads: Average CPC $1-$5, CTR 2-5%, Conversion rate 2-4%
- Facebook Ads: CPC $0.50-$3, CTR 1-2%, Conversion rate 1-3%
- Email Marketing: Open rate 15-25%, CTR 2-5%, Lists grow 10-25% monthly
- SEO: Takes 3-6 months, can drive 20-40% of traffic long-term
- Influencer Marketing: Micro-influencers $100-$500 per 10k followers

Make all numbers realistic and defensible. Avoid inflated projections.

Return ONLY valid JSON in this exact structure:
{
  "campaigns": [
    {
      "name": "Specific Campaign Name",
      "channel": "Email|Social Media|SEO|PPC|Content Marketing|Influencer Marketing",
      "budget": number,
      "timeline": "X weeks",
      "expectedReach": number,
      "description": "Detailed 2-3 sentence description",
      "costBreakdown": "Specific breakdown: Ad spend $X, Tools $Y, Creative $Z"
    }
  ],
  "budgetAllocation": [
    {
      "category": "Category Name",
      "amount": number,
      "percentage": number,
      "explanation": "Detailed justification with specific costs"
    }
  ],
  "targetSegments": [
    {
      "name": "Specific Segment Name",
      "size": number,
      "characteristics": ["specific trait 1", "specific trait 2", "specific trait 3"],
      "reasoning": "Why this segment is valuable and how CSV data supports it"
    }
  ],
  "actionableTips": [
    "Week 1-2: Specific action with expected outcome",
    "Week 3-4: Next specific action with timeline",
    "Month 2: Specific milestone and optimization",
    "Month 3: Scaling action based on results"
  ],
  "strategyOptions": [
    {
      "name": "Strategy Approach Name",
      "description": "What this strategy prioritizes and why",
      "pros": ["specific advantage 1", "specific advantage 2", "specific advantage 3"],
      "cons": ["realistic limitation 1", "realistic limitation 2"]
    }
  ]
}`;

  try {
    console.log('Sending prompt to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No valid JSON found in response');
      throw new Error('No valid JSON found in response');
    }
    
    const aiResponse = JSON.parse(jsonMatch[0]);
    console.log('Parsed AI response:', aiResponse);
    
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
    
    // Enhanced fallback strategy with more realistic numbers
    const budgetTiers = {
      low: budget < 2000,
      medium: budget >= 2000 && budget < 10000,
      high: budget >= 10000
    };

    let campaigns = [];
    let budgetAllocation = [];

    if (budgetTiers.low) {
      campaigns = [
        {
          name: "Organic Social Media Strategy",
          channel: "Social Media",
          budget: Math.floor(budget * 0.3),
          timeline: "12 weeks",
          expectedReach: Math.floor(budget * 0.5),
          description: "Focus on consistent posting, community engagement, and user-generated content to build organic following.",
          costBreakdown: `Content creation tools $50/month, scheduling tool $15/month, remaining for boosted posts`
        },
        {
          name: "Google My Business & Local SEO",
          channel: "SEO",
          budget: Math.floor(budget * 0.4),
          timeline: "16 weeks",
          expectedReach: Math.floor(budget * 0.3),
          description: "Optimize for local search, gather reviews, and create location-based content.",
          costBreakdown: "SEO tools $99/month, content creation $200/month, local citations $100"
        }
      ];
      
      budgetAllocation = [
        { category: "Content Creation", amount: Math.floor(budget * 0.4), percentage: 40, explanation: "Essential for organic growth - includes graphics, copywriting, and video content" },
        { category: "Marketing Tools", amount: Math.floor(budget * 0.25), percentage: 25, explanation: "Canva Pro, Buffer, Google Workspace, basic analytics tools" },
        { category: "Paid Promotion", amount: Math.floor(budget * 0.25), percentage: 25, explanation: "Small budget for boosting best-performing organic content" },
        { category: "Testing & Optimization", amount: Math.floor(budget * 0.1), percentage: 10, explanation: "A/B testing different content types and posting times" }
      ];
    } else if (budgetTiers.medium) {
      campaigns = [
        {
          name: "Facebook & Instagram Ads Campaign",
          channel: "Social Media",
          budget: Math.floor(budget * 0.35),
          timeline: "10 weeks",
          expectedReach: Math.floor((budget * 0.35) * 15),
          description: "Targeted social media advertising focusing on lookalike audiences and interest-based targeting.",
          costBreakdown: "Ad spend 80% ($" + Math.floor(budget * 0.35 * 0.8) + "), creative production 15%, management 5%"
        },
        {
          name: "Google Ads Search Campaign",
          channel: "PPC",
          budget: Math.floor(budget * 0.3),
          timeline: "8 weeks",
          expectedReach: Math.floor((budget * 0.3) * 8),
          description: "Target high-intent keywords related to your product with optimized landing pages.",
          costBreakdown: "Ad spend 85% ($" + Math.floor(budget * 0.3 * 0.85) + "), landing page optimization $200, keyword research tools $100"
        }
      ];
    }

    return {
      campaigns,
      budgetAllocation,
      targetSegments: [
        {
          name: "Primary Target Audience",
          size: budget < 5000 ? 5000 : Math.floor(budget * 2),
          characteristics: ["Based on your customer description", "Budget-conscious decision makers", "Active on digital platforms"],
          reasoning: "Sized according to your budget reach and typical market penetration rates"
        }
      ],
      actionableTips: [
        "Week 1-2: Set up tracking (Google Analytics, Facebook Pixel) and create branded social media profiles",
        "Week 3-4: Launch first campaign with 20% of budget to test audience response and optimize",
        "Month 2: Double down on best-performing channels and creative formats based on data",
        "Month 3: Scale successful campaigns while maintaining target cost-per-acquisition"
      ],
      strategyOptions: [
        {
          name: budget < 3000 ? "Organic Growth Focus" : "Balanced Growth Strategy",
          description: "Prioritize sustainable growth within budget constraints using proven channels",
          pros: ["Cost-effective", "Builds long-term assets", "Lower risk"],
          cons: ["Slower initial results", "Requires consistent effort", "Limited reach without paid amplification"]
        }
      ]
    };
  }
};
