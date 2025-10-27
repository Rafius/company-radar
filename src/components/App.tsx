import React from 'react'
import { StockForm } from '@/components/StockForm'
import { StockTable } from '@/components/StockTable'
import { useStocks } from '@/hooks/useStocks'
import { useSorting } from '@/hooks/useSorting'

export const App: React.FC = () => {
  const { stocks, addStock, refreshStock, refreshAllStocks, updateTargetPrice, isLoading, error } = useStocks()
  const { sortConfig, handleSort } = useSorting()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Radar de Precios</h1>
          <p className="text-muted-foreground mt-2">
            Monitorea cuando alcanzar tu precio objetivo
          </p>
        </header>

        <StockForm 
          onAddStock={addStock}
          onRefreshAll={refreshAllStocks}
          isLoading={isLoading}
          error={error}
        />
        
        <StockTable 
          stocks={stocks} 
          sortConfig={sortConfig} 
          onSort={handleSort}
          onRefreshStock={refreshStock}
          onUpdateTargetPrice={updateTargetPrice}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}
