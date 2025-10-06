"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface StoreFormModalProps {
  store?: any
  onClose: () => void
  onSuccess: () => void
}

export function StoreFormModal({ store, onClose, onSuccess }: StoreFormModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: store?.name || "",
    urlPattern: store?.url_pattern || "",
    driveFolder: store?.drive_folder || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = store ? `/api/stores/${store.id}` : "/api/stores"
      const method = store ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      toast({
        title: store ? "Tienda actualizada" : "Tienda creada",
        description: `La tienda ha sido ${store ? "actualizada" : "creada"} exitosamente`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la tienda",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{store ? "Editar Tienda" : "Nueva Tienda"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlPattern">Patrón URL</Label>
            <Input
              id="urlPattern"
              value={formData.urlPattern}
              onChange={(e) => setFormData({ ...formData, urlPattern: e.target.value })}
              placeholder="amazon.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driveFolder">Carpeta Drive</Label>
            <Input
              id="driveFolder"
              value={formData.driveFolder}
              onChange={(e) => setFormData({ ...formData, driveFolder: e.target.value })}
              placeholder="Ruta de carpeta"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {store ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
