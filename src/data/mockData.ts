import { Company } from '../types/Company';

export const companies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    ticker: 'TECH',
    currentPrice: 145.50,
    targetPrice: 180.00,
    dividendYield: 2.5,
    peRatio: 22.5,
    ebitda: 5200000000,
    marketCap: 85000000000,
    revenueGrowth: 15.2,
    profitMargin: 18.5,
    debtToEquity: 0.45,
    sector: 'Technology'
  },
  {
    id: '2',
    name: 'Global Finance Bank',
    ticker: 'GFB',
    currentPrice: 78.20,
    targetPrice: 95.00,
    dividendYield: 4.2,
    peRatio: 12.8,
    ebitda: 8500000000,
    marketCap: 120000000000,
    revenueGrowth: 8.5,
    profitMargin: 25.3,
    debtToEquity: 1.2,
    sector: 'Finance'
  },
  {
    id: '3',
    name: 'HealthMed Inc',
    ticker: 'HLTH',
    currentPrice: 210.00,
    targetPrice: 240.00,
    dividendYield: 1.8,
    peRatio: 28.5,
    ebitda: 3200000000,
    marketCap: 65000000000,
    revenueGrowth: 12.8,
    profitMargin: 15.2,
    debtToEquity: 0.35,
    sector: 'Healthcare'
  },
  {
    id: '4',
    name: 'EnergyPower Co',
    ticker: 'ENRG',
    currentPrice: 65.30,
    targetPrice: 55.00,
    dividendYield: 5.5,
    peRatio: 9.2,
    ebitda: 12000000000,
    marketCap: 95000000000,
    revenueGrowth: -2.5,
    profitMargin: 22.8,
    debtToEquity: 0.8,
    sector: 'Energy'
  },
  {
    id: '5',
    name: 'Consumer Goods Ltd',
    ticker: 'CONG',
    currentPrice: 42.80,
    targetPrice: 58.00,
    dividendYield: 3.2,
    peRatio: 18.5,
    ebitda: 2800000000,
    marketCap: 38000000000,
    revenueGrowth: 6.5,
    profitMargin: 12.5,
    debtToEquity: 0.55,
    sector: 'Consumer Goods'
  },
  {
    id: '6',
    name: 'Industrial Motors',
    ticker: 'IMOT',
    currentPrice: 95.60,
    targetPrice: 110.00,
    dividendYield: 2.8,
    peRatio: 15.2,
    ebitda: 4500000000,
    marketCap: 52000000000,
    revenueGrowth: 9.2,
    profitMargin: 14.8,
    debtToEquity: 0.65,
    sector: 'Industrial'
  },
  {
    id: '7',
    name: 'Retail Global Chain',
    ticker: 'RETL',
    currentPrice: 28.50,
    targetPrice: 42.00,
    dividendYield: 1.5,
    peRatio: 24.5,
    ebitda: 1800000000,
    marketCap: 25000000000,
    revenueGrowth: 18.5,
    profitMargin: 8.5,
    debtToEquity: 0.92,
    sector: 'Retail'
  },
  {
    id: '8',
    name: 'Telecom Network',
    ticker: 'TLCM',
    currentPrice: 52.30,
    targetPrice: 48.00,
    dividendYield: 6.2,
    peRatio: 11.5,
    ebitda: 9200000000,
    marketCap: 78000000000,
    revenueGrowth: 3.2,
    profitMargin: 28.5,
    debtToEquity: 1.45,
    sector: 'Telecommunications'
  },
  {
    id: '9',
    name: 'Biotech Innovations',
    ticker: 'BIOT',
    currentPrice: 185.20,
    targetPrice: 250.00,
    dividendYield: 0.0,
    peRatio: 35.5,
    ebitda: 1200000000,
    marketCap: 42000000000,
    revenueGrowth: 28.5,
    profitMargin: 8.2,
    debtToEquity: 0.15,
    sector: 'Biotechnology'
  },
  {
    id: '10',
    name: 'Real Estate Trust',
    ticker: 'REIT',
    currentPrice: 88.90,
    targetPrice: 105.00,
    dividendYield: 4.8,
    peRatio: 16.8,
    ebitda: 3500000000,
    marketCap: 48000000000,
    revenueGrowth: 5.8,
    profitMargin: 32.5,
    debtToEquity: 2.1,
    sector: 'Real Estate'
  },
  {
    id: '11',
    name: 'Software Systems',
    ticker: 'SOFT',
    currentPrice: 125.40,
    targetPrice: 165.00,
    dividendYield: 0.5,
    peRatio: 42.5,
    ebitda: 2200000000,
    marketCap: 58000000000,
    revenueGrowth: 32.5,
    profitMargin: 22.8,
    debtToEquity: 0.12,
    sector: 'Technology'
  },
  {
    id: '12',
    name: 'Mining Resources',
    ticker: 'MINE',
    currentPrice: 38.20,
    targetPrice: 52.00,
    dividendYield: 3.8,
    peRatio: 8.5,
    ebitda: 6800000000,
    marketCap: 32000000000,
    revenueGrowth: 4.2,
    profitMargin: 18.5,
    debtToEquity: 0.72,
    sector: 'Materials'
  }
];

export const calculateMetrics = (company: Company): {
  distanceToTarget: number;
  potentialReturn: number;
  score: number;
} => {
  const distanceToTarget = ((company.targetPrice - company.currentPrice) / company.currentPrice) * 100;
  const potentialReturn = distanceToTarget;
  
  const priceScore = distanceToTarget > 0 ? Math.min(distanceToTarget / 50 * 100, 100) : 0;
  const dividendScore = (company.dividendYield / 7) * 100;
  const growthScore = Math.max(0, (company.revenueGrowth / 35) * 100);
  const profitScore = (company.profitMargin / 35) * 100;
  
  const score = (priceScore * 0.4 + dividendScore * 0.2 + growthScore * 0.2 + profitScore * 0.2);
  
  return {
    distanceToTarget,
    potentialReturn,
    score: Math.min(100, Math.max(0, score))
  };
};

