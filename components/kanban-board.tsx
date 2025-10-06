"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KanbanColumn } from "@/components/kanban-column"
import { ProductModal } from "@/components/product-modal"
import { AddItemModal } from "@/components/add-item-modal"
import { ConfirmShipmentModal } from "@/components/confirm-shipment-modal"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  description: string
  product_url: string
  total_value: number
  status: string
  estimated_arrival: string
  tracking_number: string
  store_id: number
  category_id: number
}

export function KanbanBoard() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Record<string, Product[]>>({
    por_pedir: [],
    pedido: [],
    en_camino: [],
    entregado: [],
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const [productToShip, setProductToShip] = useState<Product | null>(null)

  const fetchProducts = async () => {
    const response = await fetch("/api/products")
    const data = await response.json()

    const grouped: Record<string, Product[]> = {
      por_pedir: [],
      pedido: [],
      en_camino: [],
      entregado: [],
    }

    data.forEach((product: Product) => {
      if (grouped[product.status]) {
        grouped[product.status].push(product)
      }
    })

    setProducts(grouped)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleBuyItem = (product: Product) => {
    // Redirect to purchase page with pre-filled data
    window.location.href = `/comprar?itemId=${product.id}`
  }

  const handleConfirmShipment = (product: Product) => {
    setProductToShip(product)
    setShowShipmentModal(true)
  }

  const handleMarkDelivered = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "entregado", actualArrival: new Date().toISOString() }),
      })

      toast({
        title: "Producto entregado",
        description: `${product.name} ha sido marcado como entregado`,
      })

      fetchProducts()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del producto",
        variant: "destructive",
      })
    }
  }

  const handleShipmentConfirmed = async (transporterId: number, trackingNumber: string) => {
    if (!productToShip) return

    try {
      await fetch(`/api/products/${productToShip.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "en_camino",
          transporterId,
          trackingNumber,
        }),
      })

      toast({
        title: "Envío confirmado",
        description: `${productToShip.name} está en camino`,
      })

      setShowShipmentModal(false)
      setProductToShip(null)
      fetchProducts()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar el envío",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Ordering Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <KanbanColumn
          title="Por Pedir"
          color="gray"
          products={products.por_pedir}
          onProductClick={setSelectedProduct}
          onActionClick={handleBuyItem}
          actionLabel="Comprar"
          headerAction={
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
        <KanbanColumn
          title="Pedido"
          color="yellow"
          products={products.pedido}
          onProductClick={setSelectedProduct}
          onActionClick={handleConfirmShipment}
          actionLabel="Confirmar envío"
        />
        <KanbanColumn
          title="En Camino"
          color="blue"
          products={products.en_camino}
          onProductClick={setSelectedProduct}
          onActionClick={handleMarkDelivered}
          actionLabel="Entregado"
        />
      </div>

      {/* Inventory Section */}
      <Card className="border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            En Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.entregado.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-8">No hay productos en inventario</p>
            ) : (
              products.entregado.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">${product.total_value.toLocaleString("es-CO")}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSuccess={fetchProducts} />}
      {showShipmentModal && productToShip && (
        <ConfirmShipmentModal
          product={productToShip}
          onClose={() => {
            setShowShipmentModal(false)
            setProductToShip(null)
          }}
          onConfirm={handleShipmentConfirmed}
        />
      )}
    </div>
  )
}
