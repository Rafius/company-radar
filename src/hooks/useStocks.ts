import { useState, useCallback } from 'react'
import { stockApiService } from '@/services/stockApi'
import { mockStocks } from '@/lib/stock-data'
import type { Stock, StockFormData, ApiError } from '@/types'

interface UseStocksReturn {
  stocks: Stock[]
  addStock: (formData: StockFormData) => Promise<void>
  refreshStock: (symbol: string) => Promise<void>
  refreshAllStocks: () => Promise<void>
  updateTargetPrice: (symbol: string, targetPrice: number | undefined) => Promise<void>
  isLoading: boolean
  error: ApiError | null
}

export const useStocks = (): UseStocksReturn => {
  const [stocks, setStocks] = useState<Stock[]>([...mockStocks] as unknown as Stock[])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  const convertApiDataToStock = useCallback((symbol: string, quote: any, profile: any): Stock => {
    return {
      symbol: symbol.toUpperCase(),
      name: profile.name || `${symbol.toUpperCase()} Company`,
      price: quote.c || 0,
      change: quote.d || 0,
      changePercent: quote.dp || 0,
      volume: profile.shareOutstanding ? `${(profile.shareOutstanding / 1000000).toFixed(1)}M` : 'N/A',
      marketCap: profile.marketCapitalization ? `${(profile.marketCapitalization / 1000000000).toFixed(1)}B` : 'N/A',
      pe: 0, // PE ratio not available in free tier
      trend: [quote.pc || 0, quote.o || 0, quote.l || 0, quote.h || 0, quote.c || 0], // Mock trend data
      targetPrice: undefined
    }
  }, [])

  const fetchStockData = useCallback(async (symbol: string): Promise<Stock> => {
    try {
      const { quote, profile } = await stockApiService.getStockData(symbol)
      return convertApiDataToStock(symbol, quote, profile)
    } catch (error) {
      // Fallback to mock data if API fails
      const mockStock = mockStocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase())
      if (mockStock) {
        return mockStock as unknown as Stock
      }
      throw error
    }
  }, [convertApiDataToStock])

  const addStock = useCallback(async (formData: StockFormData): Promise<void> => {
    if (!formData.symbol.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const newStock = await fetchStockData(formData.symbol)
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
      const updatedStock = await fetchStockData(symbol)
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
  }, [fetchStockData])

  const refreshAllStocks = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const refreshPromises = stocks.map(async (stock) => {
        try {
          const updatedStock = await fetchStockData(stock.symbol)
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