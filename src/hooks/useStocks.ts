import { useState, useCallback, useEffect } from 'react'
import { stockApiService } from '@/services/stockApi'
import { mockStocks } from '@/lib/stock-data'
import type { Stock, StockFormData, ApiError } from '@/types'

interface CacheEntry {
  data: Stock
  timestamp: number
}

interface UseStocksReturn {
  stocks: Stock[]
  addStock: (formData: StockFormData) => Promise<void>
  refreshStock: (symbol: string) => Promise<void>
  refreshAllStocks: () => Promise<void>
  updateTargetPrice: (symbol: string, targetPrice: number | undefined) => Promise<void>
  isLoading: boolean
  error: ApiError | null
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds
const stockCache = new Map<string, CacheEntry>()

export const useStocks = (): UseStocksReturn => {
  const [stocks, setStocks] = useState<Stock[]>([...mockStocks] as unknown as Stock[])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  const isCacheValid = useCallback((symbol: string): boolean => {
    const cached = stockCache.get(symbol)
    if (!cached) return false
    return Date.now() - cached.timestamp < CACHE_DURATION
  }, [])

  const getCachedStock = useCallback((symbol: string): Stock | null => {
    const cached = stockCache.get(symbol)
    if (!cached) return null
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }, [])

  const setCachedStock = useCallback((symbol: string, data: Stock): void => {
    stockCache.set(symbol, {
      data,
      timestamp: Date.now()
    })
  }, [])

  const convertApiDataToStock = useCallback((symbol: string, quote: any, profile: any, existingStock: Stock): Stock => {
    return {
      symbol: symbol.toUpperCase(),
      name: profile.name || existingStock.name,
      price: quote.c || 0,
      change: quote.d || 0,
      changePercent: quote.dp || 0,
      volume: profile.shareOutstanding ? `${(profile.shareOutstanding / 1000000).toFixed(1)}M` : existingStock.volume,
      marketCap: profile.marketCapitalization ? `${(profile.marketCapitalization / 1000000000).toFixed(1)}B` : existingStock.marketCap,
      pe: existingStock.pe,
      trend: [quote.pc || 0, quote.o || 0, quote.l || 0, quote.h || 0, quote.c || 0],
      targetPrice: existingStock.targetPrice
    }
  }, [])

  const fetchStockData = useCallback(async (symbol: string, existingStock: Stock): Promise<Stock> => {
    // Check cache first
    const cached = getCachedStock(symbol)
    if (cached) {
      return { ...cached, targetPrice: existingStock.targetPrice }
    }

    try {
      const { quote, profile } = await stockApiService.getStockData(symbol)
      const newStock = convertApiDataToStock(symbol, quote, profile, existingStock)
      setCachedStock(symbol, newStock)
      return newStock
    } catch (error) {
      // If API fails, return existing stock data
      console.warn(`Failed to fetch data for ${symbol}:`, error)
      return existingStock
    }
  }, [getCachedStock, setCachedStock, convertApiDataToStock])

  const loadAllStocks = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const refreshPromises = stocks.map(async (stock) => {
        const cached = getCachedStock(stock.symbol)
        if (cached && isCacheValid(stock.symbol)) {
          return { ...cached, targetPrice: stock.targetPrice }
        }
        return fetchStockData(stock.symbol, stock)
      })

      const updatedStocks = await Promise.all(refreshPromises)
      setStocks(updatedStocks)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [stocks, getCachedStock, isCacheValid, fetchStockData])

  useEffect(() => {
    loadAllStocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Load once on mount

  const addStock = useCallback(async (formData: StockFormData): Promise<void> => {
    if (!formData.symbol.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const newStock = await fetchStockData(formData.symbol, {
        symbol: formData.symbol.toUpperCase(),
        name: `${formData.symbol.toUpperCase()} Company`,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: "0",
        marketCap: "N/A",
        pe: 0,
        trend: [0, 0, 0, 0, 0, 0, 0],
        targetPrice: formData.targetPrice ? Number.parseFloat(formData.targetPrice) : undefined,
      })
      newStock.targetPrice = formData.targetPrice ? Number.parseFloat(formData.targetPrice) : undefined
      
      setStocks(prevStocks => {
        // Check if stock already exists
        const exists = prevStocks.some(s => s.symbol === newStock.symbol)
        if (exists) {
          return prevStocks.map(s => 
            s.symbol === newStock.symbol 
              ? { ...newStock, targetPrice: s.targetPrice || newStock.targetPrice }
              : s
          )
        }
        return [...prevStocks, newStock]
      })
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [fetchStockData])

  const refreshStock = useCallback(async (symbol: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const stock = stocks.find(s => s.symbol === symbol)
      if (!stock) return

      const updatedStock = await fetchStockData(symbol, stock)
      setStocks(prevStocks => 
        prevStocks.map(s => 
          s.symbol === symbol 
            ? { ...updatedStock, targetPrice: s.targetPrice }
            : s
        )
      )
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [stocks, fetchStockData])

  const refreshAllStocks = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const refreshPromises = stocks.map(async (stock) => {
        try {
          const updatedStock = await fetchStockData(stock.symbol, stock)
          return { ...updatedStock, targetPrice: stock.targetPrice }
        } catch {
          return stock // Keep original if refresh fails
        }
      })

      const updatedStocks = await Promise.all(refreshPromises)
      setStocks(updatedStocks)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
    }
  }, [stocks, fetchStockData])

  const updateTargetPrice = useCallback(async (symbol: string, targetPrice: number | undefined): Promise<void> => {
    setStocks(prevStocks => 
      prevStocks.map(s => 
        s.symbol === symbol 
          ? { ...s, targetPrice }
          : s
      )
    )
  }, [])

  return {
    stocks,
    addStock,
    refreshStock,
    refreshAllStocks,
    updateTargetPrice,
    isLoading,
    error
  }
}