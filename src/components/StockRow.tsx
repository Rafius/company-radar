import React from 'react'
import { TrendingUp, TrendingDown, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPriceDifference } from '@/utils/stockUtils'
import type { Stock } from '@/types'

interface StockRowProps {
  stock: Stock
  index: number
}

export const StockRow: React.FC<StockRowProps> = ({ stock, index }) => {
  const priceDiff = getPriceDifference(stock.price, stock.targetPrice)
  const isTargetReached = priceDiff !== null && priceDiff <= 0

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
        </div>
      </td>
      <td className="p-4 hidden md:table-cell">
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">{stock.name}</div>
      </td>
      <td className="p-4 text-right">
        <div className="font-semibold text-lg">${stock.price.toFixed(2)}</div>
      </td>
      <td className="p-4 text-right">
        {stock.targetPrice ? (
          <div className="font-medium text-lg">${stock.targetPrice.toFixed(2)}</div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
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
