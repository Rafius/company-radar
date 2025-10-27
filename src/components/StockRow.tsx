import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Target, RefreshCw, Pencil, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPriceDifference } from '@/utils/stockUtils'
import type { Stock } from '@/types'

interface StockRowProps {
  stock: Stock
  index: number
  onRefresh?: (symbol: string) => Promise<void>
  onUpdateTargetPrice?: (symbol: string, targetPrice: number | undefined) => Promise<void>
  isLoading?: boolean
}

export const StockRow: React.FC<StockRowProps> = ({ 
  stock, 
  index, 
  onRefresh, 
  onUpdateTargetPrice,
  isLoading = false 
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [editValue, setEditValue] = useState<string>(stock.targetPrice?.toFixed(2) || '')

  const priceDiff = getPriceDifference(stock.price, stock.targetPrice)
  const isTargetReached = priceDiff !== null && priceDiff <= 0

  const handleRefresh = async (): Promise<void> => {
    if (onRefresh && !isLoading) {
      await onRefresh(stock.symbol)
    }
  }

  const handleEdit = (): void => {
    setIsEditingTarget(true)
    setEditValue(stock.targetPrice?.toFixed(2) || '')
  }

  const handleSave = async (): Promise<void> => {
    if (onUpdateTargetPrice) {
      const value = editValue.trim()
      const targetPrice = value ? Number.parseFloat(value) : undefined
      await onUpdateTargetPrice(stock.symbol, targetPrice)
    }
    setIsEditingTarget(false)
  }

  const handleCancel = (): void => {
    setIsEditingTarget(false)
    setEditValue(stock.targetPrice?.toFixed(2) || '')
  }

  return (
    <tr
      className={`border-b hover:bg-muted/30 transition-colors ${
        isTargetReached ? "bg-success/10" : index % 2 === 0 ? "bg-card" : "bg-muted/10"
      }`}
    >
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg">{stock.symbol}</div>
          {isTargetReached && <Target className="w-5 h-5 text-success" aria-label="Target reached" />}
          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-6 w-6 p-0"
              aria-label={`Refresh ${stock.symbol} price`}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </td>
      <td className="p-4 hidden md:table-cell">
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">{stock.name}</div>
      </td>
      <td className="p-4 text-right">
        <div className="font-semibold text-lg">${stock.price.toFixed(2)}</div>
      </td>
      <td className="p-4 text-right">
        {isEditingTarget ? (
          <div className="flex items-center justify-end gap-2">
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-24 text-right"
              step="0.01"
              placeholder="0.00"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-6 w-6 p-0"
              aria-label="Save"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
              aria-label="Cancel"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            {stock.targetPrice ? (
              <div className="font-medium text-lg">${stock.targetPrice.toFixed(2)}</div>
            ) : (
              <div className="text-sm text-muted-foreground">-</div>
            )}
            {onUpdateTargetPrice && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="h-6 w-6 p-0"
                aria-label="Edit target price"
              >
                <Pencil className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </td>
      <td className="p-4 text-right">
        {priceDiff !== null ? (
          <div className="flex flex-col items-end">
            <div
              className={`font-semibold text-base ${
                isTargetReached ? "text-success" : "text-muted-foreground"
              }`}
            >
              {priceDiff > 0 ? "+" : ""}${priceDiff.toFixed(2)}
            </div>
            {isTargetReached ? (
              <Badge variant="default" className="mt-1 bg-success text-success-foreground">
                ¡COMPRAR!
              </Badge>
            ) : (
              <div className="text-xs text-muted-foreground mt-1">
                Faltan ${Math.abs(priceDiff).toFixed(2)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )}
      </td>
      <td className="p-4 text-right">
        <div
          className={`flex items-center justify-end gap-1 ${
            stock.change >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {stock.change >= 0 ? (
            <TrendingUp className="w-4 h-4" aria-label="Price up" />
          ) : (
            <TrendingDown className="w-4 h-4" aria-label="Price down" />
          )}
          <div>
            <div className="font-medium">
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}
            </div>
            <div className="text-xs">
              ({stock.changePercent >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-right hidden lg:table-cell">
        <div className="text-sm">{stock.volume}</div>
      </td>
      <td className="p-4 text-right hidden lg:table-cell">
        <div className="text-sm">{stock.marketCap}</div>
      </td>
      <td className="p-4 text-right hidden xl:table-cell">
        <div className="text-sm">{stock.pe}</div>
      </td>
    </tr>
  )
}