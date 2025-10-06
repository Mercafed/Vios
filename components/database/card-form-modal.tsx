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
    cardNumber: card?.card_number || "",
    lastFour: card?.last_four || "",
    expiration: card?.expiration || "",
    ccv: card?.ccv || "",
    nequiNumber: card?.nequi_number || "",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{card ? "Editar Tarjeta" : "Nueva Tarjeta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Titular</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              placeholder="Nombre completo del titular"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "")
                  setFormData({
                    ...formData,
                    cardNumber: value,
                    lastFour: value.slice(-4),
                  })
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
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
                maxLength={5}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ccv">CCV</Label>
              <Input
                id="ccv"
                value={formData.ccv}
                onChange={(e) => setFormData({ ...formData, ccv: e.target.value })}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nequiNumber">Número de Nequi para Recargar</Label>
              <Input
                id="nequiNumber"
                value={formData.nequiNumber}
                onChange={(e) => setFormData({ ...formData, nequiNumber: e.target.value })}
                placeholder="3001234567"
              />
            </div>
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
