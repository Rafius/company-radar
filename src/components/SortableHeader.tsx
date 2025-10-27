import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { SortField, SortConfig } from '@/types'

interface SortableHeaderProps {
  field: SortField
  sortConfig: SortConfig
  onSort: (field: SortField) => void
  children: React.ReactNode
  className?: string
}

const getSortIcon = (field: SortField, sortConfig: SortConfig) => {
  if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4" />
  if (sortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4" />
  return <ArrowDown className="w-4 h-4" />
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  sortConfig,
  onSort,
  children,
  className = ""
}) => {
  return (
    <th 
      className={`cursor-pointer hover:bg-muted/70 transition-colors ${className}`}
      onClick={() => onSort(field)}
      role="columnheader"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSort(field)
        }
      }}
    >
      <div className="flex items-center gap-2">
        {children} {getSortIcon(field, sortConfig)}
      </div>
    </th>
  )
}
