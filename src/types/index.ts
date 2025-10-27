export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  pe: number
  trend: number[]
  targetPrice?: number
}

export type SortField = 'symbol' | 'name' | 'price' | 'targetPrice' | 'difference' | 'change' | 'volume' | 'marketCap' | 'pe'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export interface StockFormData {
  symbol: string
  targetPrice: string
}
