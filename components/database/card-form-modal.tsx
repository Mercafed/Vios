"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface CardFormModalProps {
  card?: any
  onClose: () => void
  onSuccess: () => void
}

export function CardFormModal({ card, onClose, onSuccess }: CardFormModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    cardholderName: card?.cardholder_name || "",
    lastFour: card?.last_four || "",
    expiration: card?.expiration || "",
    isActive: card?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = card ? `/api/cards/${card.id}` : "/api/cards"
      const method = card ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      toast({
        title: card ? "Tarjeta actualizada" : "Tarjeta creada",
        description: `La tarjeta ha sido ${card ? "actualizada" : "creada"} exitosamente`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la tarjeta",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card ? "Editar Tarjeta" : "Nueva Tarjeta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Nombre del Titular</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastFour">Últimos 4 Dígitos</Label>
            <Input
              id="lastFour"
              value={formData.lastFour}
              onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
              maxLength={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Expiración (MM/YY)</Label>
            <Input
              id="expiration"
              value={formData.expiration}
              onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
              placeholder="12/25"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Tarjeta Activa</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {card ? "Actualizar" : "Crear"}
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
