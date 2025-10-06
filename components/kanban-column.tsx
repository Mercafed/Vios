"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Product {
  id: number
  name: string
  total_value: number
  estimated_arrival?: string
}

interface KanbanColumnProps {
  title: string
  color: "gray" | "yellow" | "blue" | "green"
  products: Product[]
  onProductClick: (product: any) => void
  onActionClick?: (product: any) => void
  actionLabel?: string
  headerAction?: React.ReactNode
}

const colorClasses = {
  gray: "bg-gray-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
}

export function KanbanColumn({
  title,
  color,
  products,
  onProductClick,
  onActionClick,
  actionLabel,
  headerAction,
}: KanbanColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", colorClasses[color])} />
            {title}
          </div>
          {headerAction}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay productos</p>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className="group relative hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">${product.total_value.toLocaleString("es-CO")}</p>
                {product.estimated_arrival && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(product.estimated_arrival).toLocaleDateString("es-CO")}
                  </p>
                )}

                {onActionClick && actionLabel && (
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onActionClick(product)
                    }}
                  >
                    {actionLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
