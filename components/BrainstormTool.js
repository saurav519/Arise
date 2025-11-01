'use client';
import React, { useState } from 'react';
import { Lightbulb, Zap, Target, TrendingUp, Sparkles, Brain, CheckCircle2, ChevronDown, ChevronUp, FileText, Star, Clock, Rocket } from 'lucide-react';

export default function AIBrainstormTool() {
  const [formData, setFormData] = useState({
    companyName: '',
    product: '',
    timeline: '',
    goals: '',
    sessionType: 'product'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isUnderstandingOpen, setIsUnderstandingOpen] = useState(true);

  const sessionTypes = [
    { value: 'product', label: 'Product Development', icon: Lightbulb },
    { value: 'marketing', label: 'Marketing Campaign', icon: TrendingUp },
    { value: 'growth', label: 'Growth Strategy', icon: Zap },
    { value: 'operations', label: 'Operations & Efficiency', icon: Target }
  ];

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.product || !formData.timeline || !formData.goals) {
      setError('Please fill in all fields');
      return;
    }

    // Check for inappropriate content in Product/Service field
    const inappropriateTerms = ['test', 'testing', 'asdf', 'qwerty', '123', 'xxx', 'dummy', 'sample'];
    const productLower = formData.product.toLowerCase().trim();
    
    if (productLower.length < 3) {
      setError('Please provide a valid product/service description (at least 3 characters)');
      return;
    }
    
    if (inappropriateTerms.some(term => productLower === term || productLower.includes(term + ' '))) {
      setError('Please provide a meaningful product/service description, not placeholder text');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // YOUR API KEY HERE - Replace with your actual Anthropic API key
      const API_KEY = 'sk-ant-api03-pLh...wwAA';
      
      // Call Anthropic Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: `You are a strategic business consultant. Analyze the following company and generate 6 highly specific, actionable ideas for their ${formData.sessionType} strategy.

Company: ${formData.companyName}
Product/Service: ${formData.product}
Timeline: ${formData.timeline}
Goals: ${formData.goals}
Session Type: ${sessionTypes.find(t => t.value === formData.sessionType).label}

First, provide a brief understanding of their business context, competitive landscape, and key insights (2-3 sentences for context, 3-4 bullet points for insights, and if applicable, a competitive landscape analysis mentioning specific competitors and market data).

Then generate exactly 6 ideas. For each idea, provide:
1. Title (specific to their company/product)
2. Description (2-3 sentences, actionable)
3. Priority (High/Medium/Low)
4. Effort (High/Medium/Low)
5. Impact (High/Medium/Low)
6. Reasoning (1 sentence explaining why this matters for their specific goals)

Format your response as JSON:
{
  "understanding": {
    "context": "brief context",
    "insights": ["insight1", "insight2", "insight3"],
    "competitorInfo": "competitive analysis or null"
  },
  "ideas": [
    {
      "title": "Specific Idea Title",
      "description": "Detailed description",
      "priority": "High",
      "effort": "Medium",
      "impact": "High",
      "reasoning": "Why this matters"
    }
  ]
}`
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API error');
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const aiResult = JSON.parse(jsonMatch[0]);
      
      setResult({
        understanding: {
          company: formData.companyName,
          product: formData.product,
          insights: aiResult.understanding.insights,
          focus: sessionTypes.find(t => t.value === formData.sessionType).label,
          competitorInfo: aiResult.understanding.competitorInfo,
          context: aiResult.understanding.context
        },
        ideas: aiResult.ideas
      });
      
    } catch (err) {
      console.error('API Error:', err);
      
      // Fallback to local generation if API fails
      const understanding = generateUnderstanding(formData);
      const ideas = generateIdeas(formData, understanding);
      setResult({ understanding, ideas });
    } finally {
      setLoading(false);
    }
  };

  const generateUnderstanding = (data) => {
    const insights = [];
    let competitorInfo = null;
    
    // Add competitor analysis for well-known companies
    const companyLower = data.companyName.toLowerCase();
    const productLower = data.product.toLowerCase();
    
    if (companyLower.includes('slack') || (productLower.includes('messaging') && productLower.includes('team'))) {
      competitorInfo = 'Operating in a competitive space with Microsoft Teams, Discord, and Zoom Chat. Differentiation through superior integrations and developer-friendly APIs is crucial.';
    } else if (companyLower.includes('notion') || (productLower.includes('workspace') && productLower.includes('all-in-one'))) {
      competitorInfo = 'Competing against Confluence, Coda, and ClickUp. Success depends on balancing powerful features with user-friendly simplicity.';
    } else if (companyLower.includes('shopify') || (productLower.includes('e-commerce') && productLower.includes('platform'))) {
      competitorInfo = 'Market leaders include WooCommerce, BigCommerce, and Adobe Commerce. Key differentiator is ease-of-use for non-technical merchants.';
    } else if (companyLower.includes('zoom') || (productLower.includes('video') && productLower.includes('conferencing'))) {
      competitorInfo = 'Major competitors are Microsoft Teams, Google Meet, and Webex. Reliability and video quality remain the primary competitive factors.';
    } else if (companyLower.includes('salesforce') || (productLower.includes('crm') && productLower.includes('sales'))) {
      competitorInfo = 'Competing with HubSpot, Microsoft Dynamics, and Pipedrive. Enterprise features and customization capabilities are key differentiators.';
    } else if (companyLower.includes('figma') || (productLower.includes('design') && productLower.includes('collaborative'))) {
      competitorInfo = 'Adobe XD, Sketch, and Canva are primary competitors. Real-time collaboration and browser-based access provide strategic advantages.';
    } else if (companyLower.includes('stripe') || (productLower.includes('payment') && productLower.includes('processing'))) {
      competitorInfo = 'PayPal, Square, and Adyen dominate different segments. Developer experience and global payment support are critical differentiators.';
    } else if (companyLower.includes('hubspot') || (productLower.includes('marketing') && productLower.includes('automation'))) {
      competitorInfo = 'Competing with Marketo, Pardot, and ActiveCampaign. Inbound methodology and all-in-one platform approach drive market position.';
    } else if (companyLower.includes('asana') || companyLower.includes('monday') || (productLower.includes('project') && productLower.includes('management'))) {
      competitorInfo = 'Competing against Asana, Monday.com, Trello, and ClickUp. User experience and workflow flexibility are key competitive advantages.';
    } else if (productLower.includes('saas') || productLower.includes('software')) {
      competitorInfo = 'In the competitive SaaS landscape, focus on solving a specific pain point better than generalist solutions while building strong customer retention.';
    }
    
    if (data.product.toLowerCase().includes('saas') || data.product.toLowerCase().includes('software')) {
      insights.push('Software/SaaS business model with subscription revenue potential');
    } else if (data.product.toLowerCase().includes('e-commerce') || data.product.toLowerCase().includes('store')) {
      insights.push('E-commerce business requiring strong customer acquisition and retention');
    } else if (data.product.toLowerCase().includes('app') || data.product.toLowerCase().includes('mobile')) {
      insights.push('Mobile-first approach with focus on user engagement and retention');
    } else {
      insights.push(`${data.product} offering requiring targeted market positioning`);
    }

    if (data.timeline.toLowerCase().includes('month')) {
      insights.push('Short-term execution focus with quick wins prioritized');
    } else if (data.timeline.toLowerCase().includes('quarter')) {
      insights.push('Medium-term strategy allowing for iterative development');
    } else if (data.timeline.toLowerCase().includes('year')) {
      insights.push('Long-term vision enabling comprehensive transformation initiatives');
    }

    if (data.goals.toLowerCase().includes('revenue') || data.goals.toLowerCase().includes('sales')) {
      insights.push('Revenue growth as primary success metric');
    } else if (data.goals.toLowerCase().includes('user') || data.goals.toLowerCase().includes('customer')) {
      insights.push('Customer acquisition and satisfaction as key objectives');
    } else if (data.goals.toLowerCase().includes('market')) {
      insights.push('Market expansion and competitive positioning focus');
    }

    return {
      company: data.companyName,
      product: data.product,
      insights: insights,
      focus: sessionTypes.find(t => t.value === data.sessionType).label,
      competitorInfo: competitorInfo
    };
  };

  const generateIdeas = (data, understanding) => {
    const baseIdeas = {
      product: [
        {
          title: `${data.companyName} Feature Beta Program`,
          description: `Launch an exclusive beta program for power users to test and validate new ${data.product} features before full release. Build a feedback loop that accelerates product-market fit.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          reasoning: `Aligns with ${data.timeline} timeline and directly supports ${data.goals.substring(0, 50)}...`
        },
        {
          title: 'AI-Powered Personalization Engine',
          description: `Implement machine learning to customize the ${data.product} experience based on individual user behavior patterns and preferences.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'High',
          reasoning: 'Differentiates product in competitive market and increases user engagement'
        },
        {
          title: 'Modular Architecture Redesign',
          description: `Refactor ${data.product} into microservices to enable faster feature development and improved scalability.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'Medium',
          reasoning: 'Long-term technical foundation that supports rapid iteration'
        },
        {
          title: 'Strategic Integration Partnerships',
          description: `Build integrations with complementary tools in the ${data.product} ecosystem to increase product stickiness and user retention.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          reasoning: 'Creates network effects and reduces churn'
        },
        {
          title: 'Self-Service Onboarding Revamp',
          description: `Redesign the onboarding flow with interactive tutorials and contextual help to reduce time-to-value for new ${data.companyName} users.`,
          priority: 'High',
          effort: 'Low',
          impact: 'Medium',
          reasoning: 'Quick win that improves conversion and reduces support burden'
        },
        {
          title: 'Advanced Analytics Dashboard',
          description: `Create comprehensive analytics showing ROI and key metrics to help users quantify the value they get from ${data.product}.`,
          priority: 'Medium',
          effort: 'Medium',
          impact: 'Medium',
          reasoning: 'Increases perceived value and supports upsell opportunities'
        }
      ],
      marketing: [
        {
          title: `"${data.companyName} Stories" Content Series`,
          description: `Launch a customer success story campaign showcasing real results achieved with ${data.product}. Include video testimonials, case studies, and ROI metrics.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          reasoning: `Builds trust and directly addresses ${data.goals.substring(0, 50)}...`
        },
        {
          title: 'Industry Thought Leadership Initiative',
          description: `Position ${data.companyName} executives as industry experts through strategic content, speaking engagements, and original research.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'High',
          reasoning: 'Long-term brand building that attracts inbound leads'
        },
        {
          title: 'Referral Program with Incentives',
          description: `Create a viral referral program where existing users earn rewards for bringing new customers to ${data.product}.`,
          priority: 'High',
          effort: 'Low',
          impact: 'High',
          reasoning: 'Cost-effective acquisition channel with high conversion rates'
        },
        {
          title: 'Strategic Co-Marketing Partnerships',
          description: `Partner with non-competing brands in adjacent markets to cross-promote ${data.product} to each other's audiences.`,
          priority: 'Medium',
          effort: 'Medium',
          impact: 'Medium',
          reasoning: 'Expands reach without significant ad spend'
        },
        {
          title: 'Interactive Product Demos & Webinars',
          description: `Host weekly live demos and educational webinars that showcase ${data.product} capabilities while capturing qualified leads.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'Medium',
          reasoning: 'Shortens sales cycle by educating prospects pre-sale'
        },
        {
          title: 'Community-Driven User Forum',
          description: `Build an engaged community platform where ${data.companyName} users can share tips, templates, and best practices.`,
          priority: 'Medium',
          effort: 'Medium',
          impact: 'Medium',
          reasoning: 'Reduces support costs while increasing product stickiness'
        }
      ],
      growth: [
        {
          title: `${data.companyName} Enterprise Tier Launch`,
          description: `Develop an enterprise package for ${data.product} with advanced features, dedicated support, and custom SLAs to move upmarket.`,
          priority: 'High',
          effort: 'High',
          impact: 'High',
          reasoning: `Directly targets revenue expansion aligned with ${data.goals.substring(0, 50)}...`
        },
        {
          title: 'Strategic Market Expansion',
          description: `Enter adjacent verticals or geographies where ${data.product} solves similar problems but faces less competition.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'High',
          reasoning: 'Diversifies revenue streams and reduces market concentration risk'
        },
        {
          title: 'Usage-Based Pricing Experiment',
          description: `Test alternative pricing models for ${data.product} that better align with customer value and reduce purchase friction.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          reasoning: 'Can unlock new customer segments and increase ARPU'
        },
        {
          title: 'Automated Upsell Flows',
          description: `Implement data-driven triggers that identify expansion opportunities and automatically present relevant ${data.companyName} upgrades.`,
          priority: 'High',
          effort: 'Low',
          impact: 'Medium',
          reasoning: 'Quick win that monetizes existing user base'
        },
        {
          title: 'Strategic Acquisition Target Analysis',
          description: `Identify and evaluate potential acquisition targets that could accelerate ${data.companyName} growth or fill product gaps.`,
          priority: 'Low',
          effort: 'Medium',
          impact: 'High',
          reasoning: 'Long-term strategic planning for accelerated growth'
        },
        {
          title: 'Channel Partner Program',
          description: `Build a network of resellers, agencies, and implementation partners who sell and deploy ${data.product} on ${data.companyName}'s behalf.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'High',
          reasoning: 'Scales sales without proportional increase in headcount'
        }
      ],
      operations: [
        {
          title: `${data.companyName} Process Automation Initiative`,
          description: `Audit and automate repetitive workflows across customer support, sales operations, and product deployment for ${data.product}.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'High',
          reasoning: `Improves team efficiency within ${data.timeline} to support ${data.goals.substring(0, 50)}...`
        },
        {
          title: 'Cross-Functional Team Restructure',
          description: `Reorganize teams around customer outcomes rather than functions to improve ${data.product} delivery speed and quality.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'Medium',
          reasoning: 'Breaks down silos and accelerates decision-making'
        },
        {
          title: 'Data Infrastructure Modernization',
          description: `Upgrade ${data.companyName} analytics and data systems to enable real-time insights and better decision-making.`,
          priority: 'Medium',
          effort: 'High',
          impact: 'Medium',
          reasoning: 'Foundation for data-driven culture and faster iteration'
        },
        {
          title: 'Customer Success Playbook',
          description: `Document and systematize the customer journey for ${data.product} to ensure consistent, scalable support experiences.`,
          priority: 'High',
          effort: 'Low',
          impact: 'Medium',
          reasoning: 'Quick win that improves retention and reduces churn'
        },
        {
          title: 'Knowledge Base & Self-Service Portal',
          description: `Build comprehensive documentation and FAQs that enable ${data.product} users to solve problems independently.`,
          priority: 'High',
          effort: 'Medium',
          impact: 'Medium',
          reasoning: 'Reduces support volume while improving customer satisfaction'
        },
        {
          title: 'Operational Metrics Dashboard',
          description: `Create real-time dashboards tracking key ${data.companyName} operational metrics to identify bottlenecks and improvement opportunities.`,
          priority: 'Medium',
          effort: 'Low',
          impact: 'Medium',
          reasoning: 'Enables proactive problem-solving and continuous improvement'
        }
      ]
    };

    return baseIdeas[data.sessionType] || baseIdeas.product;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEffortColor = (effort) => {
    switch(effort) {
      case 'High': return 'bg-purple-100 text-purple-700';
      case 'Medium': return 'bg-indigo-100 text-indigo-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'High': return 'bg-emerald-100 text-emerald-700';
      case 'Medium': return 'bg-teal-100 text-teal-700';
      case 'Low': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Decorative blob shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto p-6 sm:p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-8 py-4 bg-white rounded-2xl mb-6 shadow-2xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Arise</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Let Us Think For You
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
            Get contextual, AI-powered ideas tailored specifically to your company and goals
          </p>
        </div>

        {!result ? (
          /* Input Form */
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50">
            <div className="mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Tell Us About Your Company</h3>
              <p className="text-gray-600">Share your details and we'll generate tailored strategic ideas</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="e.g., Abc Company"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Product/Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="e.g., Project management SaaS"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Timeline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="e.g., Next 6 months"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Team Goals <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition resize-none bg-gray-50 focus:bg-white"
                  placeholder="e.g., Increase user engagement by 40% and reduce churn to below 5%"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Brainstorming Session Type <span className="text-red-500">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {sessionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({...formData, sessionType: type.value})}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                          formData.sessionType === type.value
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${formData.sessionType === type.value ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                          <Icon className={`w-5 h-5 ${formData.sessionType === type.value ? 'text-indigo-600' : 'text-gray-500'}`} />
                        </div>
                        <span className={`font-semibold text-left ${formData.sessionType === type.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 flex items-start gap-3 animate-pulse">
                  <span className="text-red-500 font-bold text-xl">⚠</span>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-8"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing & Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate Strategic Ideas
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Input Details Summary */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your Input Summary</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                  <p className="text-gray-900 font-semibold text-lg bg-white px-4 py-3 rounded-lg border border-gray-200">{formData.companyName}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product/Service</label>
                  <p className="text-gray-900 font-semibold text-lg bg-white px-4 py-3 rounded-lg border border-gray-200">{formData.product}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timeline</label>
                  <p className="text-gray-900 font-semibold text-lg bg-white px-4 py-3 rounded-lg border border-gray-200">{formData.timeline}</p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session Type</label>
                  <p className="text-gray-900 font-semibold text-lg bg-white px-4 py-3 rounded-lg border border-gray-200">
                    {sessionTypes.find(t => t.value === formData.sessionType).label}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team Goals</label>
                  <p className="text-gray-900 font-semibold text-lg bg-white px-4 py-3 rounded-lg border border-gray-200 leading-relaxed">{formData.goals}</p>
                </div>
              </div>
            </div>

            {/* AI Understanding Accordion */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl overflow-hidden">
              <button
                onClick={() => setIsUnderstandingOpen(!isUnderstandingOpen)}
                className="w-full p-8 text-white flex items-center justify-between hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <Brain className="w-7 h-7" />
                  <h2 className="text-2xl font-bold">AI Understanding Summary</h2>
                </div>
                {isUnderstandingOpen ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>
              
              {isUnderstandingOpen && (
                <div className="px-8 pb-8">
                  <p className="text-indigo-100 mb-6">
                    Here's what I understand about your situation - these ideas are generated specifically for {result.understanding.company}, not generic templates:
                  </p>
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold mb-1 text-white">Company Context</div>
                        <div className="text-indigo-100">
                          {result.understanding.company} with focus on {result.understanding.product}
                        </div>
                      </div>
                    </div>
                    {result.understanding.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-300 mt-1 flex-shrink-0" />
                        <div className="text-indigo-100">{insight}</div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold mb-1 text-white">Session Focus</div>
                        <div className="text-indigo-100">{result.understanding.focus}</div>
                      </div>
                    </div>
                    {result.understanding.competitorInfo && (
                      <div className="flex items-start gap-3 mt-4 pt-4 border-t border-white/20">
                        <CheckCircle2 className="w-5 h-5 text-yellow-300 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1 text-white">Competitive Landscape</div>
                          <div className="text-indigo-100">{result.understanding.competitorInfo}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contextual Ideas</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.ideas.map((idea, idx) => (
                  <div key={idx} className="group bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:border-blue-300 transition-all duration-300">
                    {/* Card Header with gradient */}
                    <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-5 relative">
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          idea.priority === 'High' ? 'bg-red-100 text-red-700' : 
                          idea.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {idea.priority}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="inline-flex p-2 bg-white/20 rounded-lg mb-3">
                          {idea.priority === 'High' ? <Rocket className="w-6 h-6 text-white" /> : <Lightbulb className="w-6 h-6 text-white" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-white leading-tight">{idea.title}</h3>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-5">
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">{idea.description}</p>
                      
                      {/* Metrics Row */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-700">{idea.effort}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                          <Star className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">{idea.impact}</span>
                        </div>
                      </div>
                      
                      {/* Reasoning Section */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600 italic leading-relaxed">{idea.reasoning}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom New Session Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setResult(null);
                  setFormData({
                    companyName: '',
                    product: '',
                    timeline: '',
                    goals: '',
                    sessionType: 'product'
                  });
                  setIsUnderstandingOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition flex items-center gap-2 border border-blue-700/30"
              >
                <Sparkles className="w-5 h-5" />
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}