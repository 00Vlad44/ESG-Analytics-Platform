import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Globe, Users, Shield, AlertCircle, Leaf, Building, ChevronRight, BarChart3, PieChart, Activity, Newspaper, Calendar, Moon, Sun } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';

const ESGScoringPlatform = () => {
  const [searchTicker, setSearchTicker] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [esgData, setEsgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [esgNews, setEsgNews] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Company database for auto-population
  const companyDatabase = {
    'AAPL': { name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
    'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
    'MS': { name: 'Morgan Stanley', sector: 'Financial Services', industry: 'Investment Banking' },
    'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services' },
    'GOOG': { name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services' },
    'TSLA': { name: 'Tesla Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles' },
    'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Financial Services', industry: 'Banking' },
    'BAC': { name: 'Bank of America Corp.', sector: 'Financial Services', industry: 'Banking' },
    'WFC': { name: 'Wells Fargo & Co.', sector: 'Financial Services', industry: 'Banking' },
    'GS': { name: 'Goldman Sachs Group', sector: 'Financial Services', industry: 'Investment Banking' },
    'C': { name: 'Citigroup Inc.', sector: 'Financial Services', industry: 'Banking' },
    'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', industry: 'E-commerce' },
    'META': { name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media' },
    'NFLX': { name: 'Netflix Inc.', sector: 'Communication Services', industry: 'Streaming' },
    'DIS': { name: 'Walt Disney Co.', sector: 'Communication Services', industry: 'Entertainment' },
    'V': { name: 'Visa Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
    'MA': { name: 'Mastercard Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
    'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
    'AMD': { name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors' },
    'INTC': { name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors' },
    'PFE': { name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    'UNH': { name: 'UnitedHealth Group', sector: 'Healthcare', industry: 'Health Insurance' },
    'CVS': { name: 'CVS Health Corp.', sector: 'Healthcare', industry: 'Healthcare Services' },
    'WMT': { name: 'Walmart Inc.', sector: 'Consumer Staples', industry: 'Retail' },
    'TGT': { name: 'Target Corporation', sector: 'Consumer Staples', industry: 'Retail' },
    'HD': { name: 'Home Depot Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement' },
    'NKE': { name: 'Nike Inc.', sector: 'Consumer Discretionary', industry: 'Apparel' },
    'SBUX': { name: 'Starbucks Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants' },
    'MCD': { name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants' },
    'KO': { name: 'Coca-Cola Company', sector: 'Consumer Staples', industry: 'Beverages' },
    'PEP': { name: 'PepsiCo Inc.', sector: 'Consumer Staples', industry: 'Beverages' },
    'XOM': { name: 'Exxon Mobil Corp.', sector: 'Energy', industry: 'Oil & Gas' },
    'CVX': { name: 'Chevron Corporation', sector: 'Energy', industry: 'Oil & Gas' },
    'BP': { name: 'BP plc', sector: 'Energy', industry: 'Oil & Gas' },
    'SHEL': { name: 'Shell plc', sector: 'Energy', industry: 'Oil & Gas' },
    // Adding 60 more stocks
    'BRK.B': { name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', industry: 'Conglomerate' },
    'LLY': { name: 'Eli Lilly and Company', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    'AVGO': { name: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors' },
    'TSM': { name: 'Taiwan Semiconductor', sector: 'Technology', industry: 'Semiconductors' },
    'ORCL': { name: 'Oracle Corporation', sector: 'Technology', industry: 'Software' },
    'CRM': { name: 'Salesforce Inc.', sector: 'Technology', industry: 'Software' },
    'ADBE': { name: 'Adobe Inc.', sector: 'Technology', industry: 'Software' },
    'CSCO': { name: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Networking' },
    'ACN': { name: 'Accenture plc', sector: 'Technology', industry: 'IT Services' },
    'COST': { name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', industry: 'Retail' },
    'PG': { name: 'Procter & Gamble Co.', sector: 'Consumer Staples', industry: 'Consumer Products' },
    'ABT': { name: 'Abbott Laboratories', sector: 'Healthcare', industry: 'Medical Devices' },
    'MRK': { name: 'Merck & Co. Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    'ABBV': { name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals' },
    'TMO': { name: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Life Sciences' },
    'DHR': { name: 'Danaher Corporation', sector: 'Healthcare', industry: 'Life Sciences' },
    'VRTX': { name: 'Vertex Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology' },
    'AMGN': { name: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology' },
    'GILD': { name: 'Gilead Sciences Inc.', sector: 'Healthcare', industry: 'Biotechnology' },
    'MDT': { name: 'Medtronic plc', sector: 'Healthcare', industry: 'Medical Devices' },
    'BA': { name: 'Boeing Company', sector: 'Industrials', industry: 'Aerospace & Defense' },
    'HON': { name: 'Honeywell International', sector: 'Industrials', industry: 'Conglomerate' },
    'UPS': { name: 'United Parcel Service', sector: 'Industrials', industry: 'Logistics' },
    'FDX': { name: 'FedEx Corporation', sector: 'Industrials', industry: 'Logistics' },
    'CAT': { name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Machinery' },
    'DE': { name: 'Deere & Company', sector: 'Industrials', industry: 'Machinery' },
    'RTX': { name: 'Raytheon Technologies', sector: 'Industrials', industry: 'Aerospace & Defense' },
    'LMT': { name: 'Lockheed Martin Corp.', sector: 'Industrials', industry: 'Aerospace & Defense' },
    'GE': { name: 'General Electric Co.', sector: 'Industrials', industry: 'Conglomerate' },
    'MMM': { name: '3M Company', sector: 'Industrials', industry: 'Conglomerate' },
    'IBM': { name: 'IBM Corporation', sector: 'Technology', industry: 'IT Services' },
    'QCOM': { name: 'Qualcomm Inc.', sector: 'Technology', industry: 'Semiconductors' },
    'NOW': { name: 'ServiceNow Inc.', sector: 'Technology', industry: 'Software' },
    'UBER': { name: 'Uber Technologies Inc.', sector: 'Technology', industry: 'Ridesharing' },
    'ABNB': { name: 'Airbnb Inc.', sector: 'Consumer Discretionary', industry: 'Travel' },
    'BKNG': { name: 'Booking Holdings Inc.', sector: 'Consumer Discretionary', industry: 'Travel' },
    'PYPL': { name: 'PayPal Holdings Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
    'SQ': { name: 'Block Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
    'COIN': { name: 'Coinbase Global Inc.', sector: 'Financial Services', industry: 'Cryptocurrency' },
    'SCHW': { name: 'Charles Schwab Corp.', sector: 'Financial Services', industry: 'Brokerage' },
    'BLK': { name: 'BlackRock Inc.', sector: 'Financial Services', industry: 'Asset Management' },
    'AXP': { name: 'American Express Co.', sector: 'Financial Services', industry: 'Credit Services' },
    'SPGI': { name: 'S&P Global Inc.', sector: 'Financial Services', industry: 'Financial Data' },
    'CME': { name: 'CME Group Inc.', sector: 'Financial Services', industry: 'Exchanges' },
    'ICE': { name: 'Intercontinental Exchange', sector: 'Financial Services', industry: 'Exchanges' },
    'USB': { name: 'U.S. Bancorp', sector: 'Financial Services', industry: 'Banking' },
    'PNC': { name: 'PNC Financial Services', sector: 'Financial Services', industry: 'Banking' },
    'T': { name: 'AT&T Inc.', sector: 'Communication Services', industry: 'Telecom' },
    'VZ': { name: 'Verizon Communications', sector: 'Communication Services', industry: 'Telecom' },
    'TMUS': { name: 'T-Mobile US Inc.', sector: 'Communication Services', industry: 'Telecom' },
    'CMCSA': { name: 'Comcast Corporation', sector: 'Communication Services', industry: 'Media' },
    'NEE': { name: 'NextEra Energy Inc.', sector: 'Utilities', industry: 'Electric Utilities' },
    'DUK': { name: 'Duke Energy Corp.', sector: 'Utilities', industry: 'Electric Utilities' },
    'SO': { name: 'Southern Company', sector: 'Utilities', industry: 'Electric Utilities' },
    'D': { name: 'Dominion Energy Inc.', sector: 'Utilities', industry: 'Electric Utilities' },
    'EXC': { name: 'Exelon Corporation', sector: 'Utilities', industry: 'Electric Utilities' },
    'AEP': { name: 'American Electric Power', sector: 'Utilities', industry: 'Electric Utilities' },
    'SPG': { name: 'Simon Property Group', sector: 'Real Estate', industry: 'Retail REITs' },
    'PLD': { name: 'Prologis Inc.', sector: 'Real Estate', industry: 'Industrial REITs' },
    'AMT': { name: 'American Tower Corp.', sector: 'Real Estate', industry: 'Infrastructure REITs' },
    'EQIX': { name: 'Equinix Inc.', sector: 'Real Estate', industry: 'Data Center REITs' },
    'PSA': { name: 'Public Storage', sector: 'Real Estate', industry: 'Storage REITs' },
    'CCI': { name: 'Crown Castle Inc.', sector: 'Real Estate', industry: 'Infrastructure REITs' },
    'O': { name: 'Realty Income Corp.', sector: 'Real Estate', industry: 'Retail REITs' },
    'WELL': { name: 'Welltower Inc.', sector: 'Real Estate', industry: 'Healthcare REITs' },
    'AVB': { name: 'AvalonBay Communities', sector: 'Real Estate', industry: 'Residential REITs' },
    'EQR': { name: 'Equity Residential', sector: 'Real Estate', industry: 'Residential REITs' },
    'DLR': { name: 'Digital Realty Trust', sector: 'Real Estate', industry: 'Data Center REITs' },
    'NDAQ': { name: 'Nasdaq Inc.', sector: 'Financial Services', industry: 'Exchanges' },
    'AMAT': { name: 'Applied Materials Inc.', sector: 'Technology', industry: 'Semiconductor Equipment' },
    'LRCX': { name: 'Lam Research Corp.', sector: 'Technology', industry: 'Semiconductor Equipment' },
    'KLAC': { name: 'KLA Corporation', sector: 'Technology', industry: 'Semiconductor Equipment' },
    'MU': { name: 'Micron Technology Inc.', sector: 'Technology', industry: 'Memory Chips' },
    'SNPS': { name: 'Synopsys Inc.', sector: 'Technology', industry: 'Software' },
    'CDNS': { name: 'Cadence Design Systems', sector: 'Technology', industry: 'Software' },
    'ADI': { name: 'Analog Devices Inc.', sector: 'Technology', industry: 'Semiconductors' },
    'NXPI': { name: 'NXP Semiconductors', sector: 'Technology', industry: 'Semiconductors' },
    'TXN': { name: 'Texas Instruments Inc.', sector: 'Technology', industry: 'Semiconductors' },
    'MRVL': { name: 'Marvell Technology Inc.', sector: 'Technology', industry: 'Semiconductors' },
    'SNOW': { name: 'Snowflake Inc.', sector: 'Technology', industry: 'Cloud Computing' },
    'DDOG': { name: 'Datadog Inc.', sector: 'Technology', industry: 'Software' },
    'CRWD': { name: 'CrowdStrike Holdings', sector: 'Technology', industry: 'Cybersecurity' },
    'ZS': { name: 'Zscaler Inc.', sector: 'Technology', industry: 'Cybersecurity' },
    'PANW': { name: 'Palo Alto Networks', sector: 'Technology', industry: 'Cybersecurity' },
    'MSCI': { name: 'MSCI Inc.', sector: 'Financial Services', industry: 'Financial Data' },
    'FTNT': { name: 'Fortinet Inc.', sector: 'Technology', industry: 'Cybersecurity' },
    'NET': { name: 'Cloudflare Inc.', sector: 'Technology', industry: 'Cloud Services' },
    'TEAM': { name: 'Atlassian Corp.', sector: 'Technology', industry: 'Software' },
    'SHOP': { name: 'Shopify Inc.', sector: 'Technology', industry: 'E-commerce Software' },
    'SLB': { name: 'Schlumberger NV', sector: 'Energy', industry: 'Oil Services' },
    'HAL': { name: 'Halliburton Company', sector: 'Energy', industry: 'Oil Services' },
    'BKR': { name: 'Baker Hughes Company', sector: 'Energy', industry: 'Oil Services' },
    'OXY': { name: 'Occidental Petroleum', sector: 'Energy', industry: 'Oil & Gas' },
    'COP': { name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas' },
    'EOG': { name: 'EOG Resources Inc.', sector: 'Energy', industry: 'Oil & Gas' },
    'MPC': { name: 'Marathon Petroleum', sector: 'Energy', industry: 'Oil Refining' },
    'PSX': { name: 'Phillips 66', sector: 'Energy', industry: 'Oil Refining' },
    'VLO': { name: 'Valero Energy Corp.', sector: 'Energy', industry: 'Oil Refining' },
    'LNG': { name: 'Cheniere Energy Inc.', sector: 'Energy', industry: 'Natural Gas' }
  };

  // Seeded random number generator for consistent scores
  const seededRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate consistent scores based on ticker
  const generateConsistentScore = (ticker, category) => {
    // Special predefined scores for well-known companies
    const predefinedScores = {
      'MSFT': { env: 89.2, soc: 86.7, gov: 91.4 }, // Microsoft - known for strong ESG
      'TSLA': { env: 93.1, soc: 72.4, gov: 68.9 }, // Tesla - high environmental, lower governance
      'XOM': { env: 52.3, soc: 64.7, gov: 75.2 },  // Exxon - lower environmental
      'AAPL': { env: 85.6, soc: 81.3, gov: 88.9 }, // Apple - strong across the board
      'META': { env: 78.4, soc: 65.2, gov: 71.8 }, // Meta - moderate scores
      'JNJ': { env: 82.1, soc: 87.9, gov: 84.5 },  // J&J - balanced high scores
      'NEE': { env: 94.7, soc: 78.3, gov: 82.1 },  // NextEra - renewable energy leader
      'CVX': { env: 58.9, soc: 67.2, gov: 73.4 },  // Chevron - oil & gas challenges
      'PFE': { env: 76.8, soc: 88.4, gov: 82.7 },  // Pfizer - strong social score
      'WMT': { env: 71.3, soc: 74.6, gov: 79.8 }   // Walmart - improving scores
    };
    
    if (predefinedScores[ticker]) {
      if (category === 1) return predefinedScores[ticker].env;
      if (category === 2) return predefinedScores[ticker].soc;
      if (category === 3) return predefinedScores[ticker].gov;
    }
    
    // For other tickers, use seeded random
    const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + category;
    const baseScore = 50 + seededRandom(seed) * 50; // Score between 50-100
    return Math.round(baseScore * 10) / 10; // Round to 1 decimal place
  };

  // Generate mock ESG news
  const generateESGNews = (companyName, ticker) => {
    const newsTemplates = [
      {
        title: `${companyName} Announces New Carbon Neutrality Target for 2030`,
        summary: 'Company commits to reducing greenhouse gas emissions by 50% and achieving net-zero operations.',
        sentiment: 'positive',
        category: 'Environmental'
      },
      {
        title: `${companyName} Improves Board Diversity with New Appointments`,
        summary: 'Three new independent directors join the board, increasing gender and ethnic diversity to 40%.',
        sentiment: 'positive',
        category: 'Governance'
      },
      {
        title: `Labor Practices Under Review at ${companyName} Supply Chain`,
        summary: 'Company launches comprehensive audit of supplier working conditions following NGO report.',
        sentiment: 'neutral',
        category: 'Social'
      },
      {
        title: `${companyName} Receives Top ESG Rating from Sustainalytics`,
        summary: 'Company achieves "Low Risk" rating with significant improvements in environmental metrics.',
        sentiment: 'positive',
        category: 'Overall'
      },
      {
        title: `${companyName} Invests $500M in Renewable Energy Infrastructure`,
        summary: 'New solar and wind projects expected to power 30% of operations by 2025.',
        sentiment: 'positive',
        category: 'Environmental'
      },
      {
        title: `${companyName} Faces Scrutiny Over Executive Compensation`,
        summary: 'Shareholders question CEO pay package amid calls for better alignment with ESG goals.',
        sentiment: 'negative',
        category: 'Governance'
      },
      {
        title: `${companyName} Launches Employee Wellness Initiative`,
        summary: 'New program includes mental health support and flexible work arrangements.',
        sentiment: 'positive',
        category: 'Social'
      }
    ];

    // Use seeded random to consistently select the same news for each ticker
    const tickerSeed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedIndices = [];
    const newsCount = 3 + Math.floor(seededRandom(tickerSeed) * 2); // 3-4 news items
    
    // Select consistent news items for this ticker
    for (let i = 0; i < newsCount; i++) {
      const index = Math.floor(seededRandom(tickerSeed + i * 100) * newsTemplates.length);
      if (!selectedIndices.includes(index)) {
        selectedIndices.push(index);
      }
    }
    
    // Generate consistent dates for the news
    const selectedNews = selectedIndices.map((index, i) => {
      const template = newsTemplates[index];
      const dayOffset = Math.floor(seededRandom(tickerSeed + index + 1000) * 20) + 1;
      const newsDate = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
      
      return {
        ...template,
        date: newsDate.toLocaleDateString()
      };
    });

    // Sort by date (most recent first)
    return selectedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Risk level calculation based on ESG score
  const getRiskLevel = (score) => {
    if (score >= 70) return { level: 'Low', color: darkMode ? 'text-green-400' : 'text-green-600', bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-100', icon: '🟢' };
    if (score >= 50) return { level: 'Medium', color: darkMode ? 'text-yellow-400' : 'text-yellow-600', bgColor: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100', icon: '🟡' };
    if (score >= 30) return { level: 'High', color: darkMode ? 'text-orange-400' : 'text-orange-600', bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-100', icon: '🟠' };
    return { level: 'Severe', color: darkMode ? 'text-red-400' : 'text-red-600', bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-100', icon: '🔴' };
  };

  // Calculate unmanaged risk (Sustainalytics style)
  const calculateUnmanagedRisk = (score) => {
    return (100 - score).toFixed(1);
  };

  // Fetch ESG data
  const fetchESGData = async (ticker) => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, replace with actual API calls
      // For demo, using consistent mock data based on ticker
      const upperTicker = ticker.toUpperCase();
      const companyInfo = companyDatabase[upperTicker] || {
        name: `${upperTicker} Corporation`,
        sector: 'Technology',
        industry: 'Software'
      };
      
      // Generate consistent scores for this ticker
      const environmentalScore = generateConsistentScore(upperTicker, 1);
      const socialScore = generateConsistentScore(upperTicker, 2);
      const governanceScore = generateConsistentScore(upperTicker, 3);
      
      const mockData = {
        symbol: upperTicker,
        companyName: companyInfo.name,
        environmentalScore: environmentalScore,
        socialScore: socialScore,
        governanceScore: governanceScore,
        ESGScore: 0,
        formattedDate: new Date().toLocaleDateString(),
        year: new Date().getFullYear()
      };
      
      // Calculate overall ESG score
      mockData.ESGScore = (mockData.environmentalScore + mockData.socialScore + mockData.governanceScore) / 3;
      
      // Generate historical data with consistent base scores
      const historical = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        // Add small variations to historical data but keep it consistent
        const monthSeed = i + upperTicker.charCodeAt(0);
        const variation = (seededRandom(monthSeed) - 0.5) * 5; // ±2.5 variation
        
        historical.push({
          date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          environmental: Math.round(environmentalScore + variation),
          social: Math.round(socialScore + variation),
          governance: Math.round(governanceScore + variation),
          overall: Math.round(mockData.ESGScore + variation)
        });
      }
      
      setEsgData(mockData);
      setHistoricalData(historical);
      setSelectedCompany(mockData);
      
      // Mock company profile with consistent data
      const profileSeed = upperTicker.charCodeAt(0) + upperTicker.charCodeAt(upperTicker.length - 1);
      setCompanyProfile({
        sector: companyInfo.sector,
        industry: companyInfo.industry,
        employees: Math.floor(seededRandom(profileSeed) * 90000) + 10000,
        marketCap: (seededRandom(profileSeed + 1) * 1900 + 100).toFixed(2) + 'B'
      });
      
      // Generate ESG news
      setEsgNews(generateESGNews(companyInfo.name, upperTicker));
      
    } catch (err) {
      setError('Failed to fetch ESG data. Please try again.');
      console.error('Error fetching ESG data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      fetchESGData(searchTicker.trim());
    }
  };

  // Gauge chart component
  const GaugeChart = ({ score, title, color, icon }) => {
    const angle = (score / 100) * 180 - 90;
    const riskLevel = getRiskLevel(score);
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-20 mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={darkMode ? "#374151" : "#e5e7eb"}
              strokeWidth="8"
            />
            <path
              d={`M 10 50 A 40 40 0 0 1 ${50 + 40 * Math.cos((angle * Math.PI) / 180)} ${50 - 40 * Math.sin((angle * Math.PI) / 180)}`}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="4" fill={color} />
            <line
              x1="50"
              y1="50"
              x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
              y2={50 - 35 * Math.sin((angle * Math.PI) / 180)}
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</span>
          </div>
          <div className="text-2xl font-bold" style={{ color }}>
            {score.toFixed(1)}
          </div>
          <div className={`text-xs font-medium ${riskLevel.color}`}>
            {riskLevel.level} Risk
          </div>
        </div>
      </div>
    );
  };

  // Radar chart data
  const getRadarData = () => {
    if (!esgData) return [];
    
    return [
      { metric: 'Environmental', score: esgData.environmentalScore, fullMark: 100 },
      { metric: 'Social', score: esgData.socialScore, fullMark: 100 },
      { metric: 'Governance', score: esgData.governanceScore, fullMark: 100 },
    ];
  };

  // Material ESG Issues component
  const MaterialESGIssues = () => {
    const issues = [
      { category: 'Environmental', issues: ['Carbon Emissions', 'Resource Use', 'Pollution & Waste'], score: esgData?.environmentalScore || 0 },
      { category: 'Social', issues: ['Human Capital', 'Product Liability', 'Social Opportunities'], score: esgData?.socialScore || 0 },
      { category: 'Governance', issues: ['Corporate Governance', 'Business Ethics', 'Corporate Behavior'], score: esgData?.governanceScore || 0 }
    ];

    return (
      <div className="space-y-4">
        {issues.map((category, idx) => (
          <div key={idx} className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'} transition-all`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.category}</h4>
              <span className={`text-sm font-medium ${getRiskLevel(category.score).color}`}>
                {getRiskLevel(category.score).icon} {getRiskLevel(category.score).level}
              </span>
            </div>
            <div className="space-y-2">
              {category.issues.map((issue, issueIdx) => {
                // Generate consistent score for each issue based on category score and issue index
                const tickerSeed = selectedCompany?.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
                const issueSeed = tickerSeed + idx * 10 + issueIdx;
                const issueVariation = (seededRandom(issueSeed) - 0.5) * 10;
                const issueScore = Math.min(100, Math.max(0, category.score + issueVariation));
                
                return (
                  <div key={issueIdx} className="flex justify-between items-center text-sm">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{issue}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${issueScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ESG News component
  const ESGNewsSection = () => {
    const getSentimentColor = (sentiment) => {
      switch(sentiment) {
        case 'positive': return darkMode ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50';
        case 'negative': return darkMode ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50';
        default: return darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-50';
      }
    };

    const getCategoryIcon = (category) => {
      switch(category) {
        case 'Environmental': return <Leaf className="w-4 h-4" />;
        case 'Social': return <Users className="w-4 h-4" />;
        case 'Governance': return <Shield className="w-4 h-4" />;
        default: return <Globe className="w-4 h-4" />;
      }
    };

    return (
      <div className="space-y-4">
        {esgNews.map((news, idx) => (
          <div key={idx} className={`border-l-4 border-blue-500 p-4 rounded-r-lg ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} transition-all`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-semibold flex-1 pr-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{news.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(news.sentiment)}`}>
                {news.sentiment}
              </span>
            </div>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{news.summary}</p>
            <div className={`flex items-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {news.date}
              </span>
              <span className="flex items-center gap-1">
                {getCategoryIcon(news.category)}
                {news.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80'} backdrop-blur-md shadow-lg border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  ESG Analytics Platform
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sustainable Investment Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter stock ticker (e.g., AAPL, MS, JPM)"
                    className={`pl-10 pr-4 py-2 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20 w-72 transition-all`}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Loading...' : 'Analyze'}
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${darkMode ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!selectedCompany && !loading && (
          <div className="text-center py-16">
            <div className="mb-8 flex justify-center">
              <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                <Globe className="w-20 h-20 text-white" />
              </div>
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome to ESG Analytics Platform
            </h2>
            <p className={`max-w-lg mx-auto mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter a stock ticker above to analyze comprehensive Environmental, Social, and Governance metrics for sustainable investment decisions.
            </p>
            <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Try: AAPL, MS, JPM, GOOGL, TSLA, META, AMZN, and many more...
            </div>
          </div>
        )}

        {selectedCompany && esgData && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 backdrop-blur-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCompany.companyName}</h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 text-lg`}>{selectedCompany.symbol}</p>
                  {companyProfile && (
                    <div className={`flex gap-4 mt-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">{companyProfile.sector}</span>
                      <span>•</span>
                      <span>{companyProfile.industry}</span>
                      <span>•</span>
                      <span>Market Cap: ${companyProfile.marketCap}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overall ESG Score</div>
                  <div className={`text-5xl font-bold ${getRiskLevel(esgData.ESGScore).color}`}>
                    {esgData.ESGScore.toFixed(1)}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium mt-3 ${getRiskLevel(esgData.ESGScore).bgColor} ${getRiskLevel(esgData.ESGScore).color}`}>
                    {getRiskLevel(esgData.ESGScore).icon} {getRiskLevel(esgData.ESGScore).level} Risk
                  </div>
                </div>
              </div>
            </div>

            {/* ESG Pillars Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all`}>
                <GaugeChart
                  score={esgData.environmentalScore}
                  title="Environmental"
                  color="#10b981"
                  icon={<Leaf className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />}
                />
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unmanaged Risk: <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{calculateUnmanagedRisk(esgData.environmentalScore)}</span>
                  </p>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all`}>
                <GaugeChart
                  score={esgData.socialScore}
                  title="Social"
                  color="#3b82f6"
                  icon={<Users className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                />
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unmanaged Risk: <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{calculateUnmanagedRisk(esgData.socialScore)}</span>
                  </p>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all`}>
                <GaugeChart
                  score={esgData.governanceScore}
                  title="Governance"
                  color="#8b5cf6"
                  icon={<Shield className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
                />
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unmanaged Risk: <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{calculateUnmanagedRisk(esgData.governanceScore)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Historical Trend */}
              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <Activity className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  ESG Score Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="environmental" stroke="#10b981" strokeWidth={2} name="Environmental" dot={false} />
                    <Line type="monotone" dataKey="social" stroke="#3b82f6" strokeWidth={2} name="Social" dot={false} />
                    <Line type="monotone" dataKey="governance" stroke="#8b5cf6" strokeWidth={2} name="Governance" dot={false} />
                    <Line type="monotone" dataKey="overall" stroke="#f59e0b" strokeWidth={3} name="Overall" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <PieChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  ESG Balance Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                    <Radar name="ESG Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ESG News Section */}
            <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <Newspaper className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                Recent ESG News & Updates
              </h3>
              <ESGNewsSection />
            </div>

            {/* Material ESG Issues */}
            <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                Material ESG Issues
              </h3>
              <MaterialESGIssues />
            </div>

            {/* Risk Summary */}
            <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>ESG Risk Summary</h3>
              <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert text-gray-300' : 'text-gray-600'}`}>
                <p>
                  {selectedCompany.companyName} demonstrates {getRiskLevel(esgData.ESGScore).level.toLowerCase()} ESG risk 
                  with an overall score of {esgData.ESGScore.toFixed(1)}. The company shows particular strength in 
                  {esgData.environmentalScore > esgData.socialScore && esgData.environmentalScore > esgData.governanceScore ? ' environmental' :
                   esgData.socialScore > esgData.governanceScore ? ' social' : ' governance'} practices.
                </p>
                <p className="mt-3">
                  Key areas for improvement include addressing unmanaged risks in 
                  {esgData.environmentalScore < esgData.socialScore && esgData.environmentalScore < esgData.governanceScore ? ' environmental' :
                   esgData.socialScore < esgData.governanceScore ? ' social' : ' governance'} dimensions. 
                  Continuous monitoring and strategic ESG initiatives are recommended to maintain competitive positioning 
                  in sustainable finance markets.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900/50 border-t border-gray-800' : 'bg-gray-100'} mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>ESG data is for demonstration purposes. In production, integrate with Financial Modeling Prep API or other ESG data providers.</p>
            <p className="mt-2">© 2025 ESG Analytics Platform. Built for sustainable investment decisions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ESGScoringPlatform;
