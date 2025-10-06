"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PurchaseFormProps {
  useExistingItem: boolean
  balance: number
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PurchaseForm({ useExistingItem, balance, onSubmit, onCancel }: PurchaseFormProps) {
  const [stores, setStores] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [existingItems, setExistingItems] = useState<any[]>([])

  const [selectedItem, setSelectedItem] = useState<string>("")
  const [storeId, setStoreId] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [productUrl, setProductUrl] = useState("")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [addressId, setAddressId] = useState<string>("")
  const [estimatedArrival, setEstimatedArrival] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch form data
    Promise.all([
      fetch("/api/stores").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/addresses").then((r) => r.json()),
      useExistingItem ? fetch("/api/products?status=por_pedir").then((r) => r.json()) : Promise.resolve([]),
    ]).then(([storesData, categoriesData, addressesData, itemsData]) => {
      setStores(storesData)
      setCategories(categoriesData)
      setAddresses(addressesData)
      setExistingItems(itemsData)
    })
  }, [useExistingItem])

  const handleItemSelect = (itemId: string) => {
    const item = existingItems.find((i) => i.id.toString() === itemId)
    if (item) {
      setSelectedItem(itemId)
      setStoreId(item.store_id?.toString() || "")
      setCategoryId(item.category_id?.toString() || "")
      setProductUrl(item.product_url || "")
      setProductName(item.name || "")
      setDescription(item.description || "")
      setTotalValue(item.total_value?.toString() || "")
      setAddressId(item.address_id?.toString() || "")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const value = Number.parseFloat(totalValue)
    if (value > balance) {
      setError("El saldo no es suficiente para este pedido")
      return
    }

    onSubmit({
      storeId,
      categoryId,
      productUrl,
      productName,
      description,
      totalValue: value,
      addressId,
      estimatedArrival,
      existingItemId: selectedItem || null,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{useExistingItem ? "Seleccionar Item Existente" : "Nuevo Pedido"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {useExistingItem && (
            <div className="space-y-2">
              <Label htmlFor="existing-item">Item de "Por Pedir"</Label>
              <Select value={selectedItem} onValueChange={handleItemSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un item" />
                </SelectTrigger>
                <SelectContent>
                  {existingItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store">Tienda</Label>
              <Select value={storeId} onValueChange={setStoreId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tienda" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Link del Producto</Label>
            <Input
              id="url"
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del producto"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">Valor Total (COP)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección de Llegada</Label>
              <Select value={addressId} onValueChange={setAddressId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona dirección" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()}>
                      {address.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival">Día Estimado de Llegada (Opcional)</Label>
            <Input
              id="arrival"
              type="date"
              value={estimatedArrival}
              onChange={(e) => setEstimatedArrival(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Continuar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
