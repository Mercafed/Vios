"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

interface AddItemModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddItemModal({ onClose, onSuccess }: AddItemModalProps) {
  const { toast } = useToast()
  const [stores, setStores] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productUrl: "",
    storeId: "",
    categoryId: "",
    totalValue: "",
  })

  useEffect(() => {
    Promise.all([fetch("/api/stores").then((r) => r.json()), fetch("/api/categories").then((r) => r.json())]).then(
      ([storesData, categoriesData]) => {
        setStores(storesData)
        setCategories(categoriesData)
      },
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let screenshotUrl = null

      if (screenshot) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", screenshot)
        formDataUpload.append("productName", formData.name)

        const uploadResponse = await fetch("/api/upload-screenshot", {
          method: "POST",
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          screenshotUrl = uploadData.url
        }
      }

      await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "por_pedir",
          screenshotUrl,
        }),
      })

      toast({
        title: "Item agregado",
        description: "El item ha sido agregado a 'Por Pedir'",
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el item",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Item a "Por Pedir"</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Captura del Producto</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                className="flex-1"
              />
              {screenshot && (
                <Button type="button" variant="outline" size="sm" onClick={() => setScreenshot(null)}>
                  Quitar
                </Button>
              )}
            </div>
            {screenshot && (
              <p className="text-sm text-muted-foreground">
                <Upload className="w-3 h-3 inline mr-1" />
                {screenshot.name}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store">Tienda</Label>
              <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
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
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
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
              value={formData.productUrl}
              onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor Estimado (COP)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.totalValue}
              onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? "Subiendo..." : "Agregar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
