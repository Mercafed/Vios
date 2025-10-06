"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink } from "lucide-react"

interface ProductModalProps {
  product: any
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const statusLabels: Record<string, string> = {
    por_pedir: "Por Pedir",
    pedido: "Pedido",
    en_camino: "En Camino",
    entregado: "Entregado",
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Badge>{statusLabels[product.status]}</Badge>
          </div>

          {product.screenshot_url && (
            <div className="space-y-2">
              <h3 className="font-semibold">Captura del Producto</h3>
              <img
                src={product.screenshot_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full rounded-lg border"
              />
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Detalles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-medium">${product.total_value.toLocaleString("es-CO")} COP</span>
                </div>
                {product.estimated_arrival && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Llegada estimada:</span>
                    <span className="font-medium">
                      {new Date(product.estimated_arrival).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                )}
                {product.actual_arrival && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Llegada real:</span>
                    <span className="font-medium">{new Date(product.actual_arrival).toLocaleDateString("es-CO")}</span>
                  </div>
                )}
                {product.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking:</span>
                    <span className="font-medium">{product.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Información adicional</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solicitado:</span>
                  <span className="font-medium">{new Date(product.requested_at).toLocaleDateString("es-CO")}</span>
                </div>
                {product.requested_by && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Por:</span>
                    <span className="font-medium">{product.requested_by}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {product.product_url && (
            <>
              <Separator />
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Ver producto original
              </a>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
