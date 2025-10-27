import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import type { StockFormData } from '@/types'

interface StockFormProps {
  onAddStock: (formData: StockFormData) => void
}

export const StockForm: React.FC<StockFormProps> = ({ onAddStock }) => {
  const [formData, setFormData] = useState<StockFormData>({
    symbol: "",
    targetPrice: ""
  })

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onAddStock(formData)
    setFormData({ symbol: "", targetPrice: "" })
  }

  const handleInputChange = (field: keyof StockFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Añadir Nueva Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Símbolo (ej: AAPL)"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                className="uppercase"
                aria-label="Stock symbol"
                required
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Precio objetivo"
                value={formData.targetPrice}
                onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                step="0.01"
                aria-label="Target price"
              />
            </div>
            <Button type="submit" className="sm:w-auto">
              <Plus className="mr-2 w-4 h-4" />
              Añadir
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
