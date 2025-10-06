"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PurchaseInvoiceProps {
  data: any
  onConfirm: () => void
  onBack: () => void
}

export function PurchaseInvoice({ data, onConfirm, onBack }: PurchaseInvoiceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Factura Previa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Producto:</span>
            <span className="font-medium">{data.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Descripción:</span>
            <span className="font-medium text-right max-w-xs">{data.description || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">URL:</span>
            <a
              href={data.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Ver producto
            </a>
          </div>
          <Separator />
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-primary">${data.totalValue.toLocaleString("es-CO")} COP</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onConfirm} className="flex-1">
            Confirmar
          </Button>
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
