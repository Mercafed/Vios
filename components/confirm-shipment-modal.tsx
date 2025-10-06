"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConfirmShipmentModalProps {
  product: any
  onClose: () => void
  onConfirm: (transporterId: number, trackingNumber: string) => void
}

export function ConfirmShipmentModal({ product, onClose, onConfirm }: ConfirmShipmentModalProps) {
  const [transporters, setTransporters] = useState<any[]>([])
  const [transporterId, setTransporterId] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")

  useEffect(() => {
    fetch("/api/transporters")
      .then((r) => r.json())
      .then(setTransporters)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(Number.parseInt(transporterId), trackingNumber)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Envío</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">Producto: {product.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transporter">Transportadora</Label>
            <Select value={transporterId} onValueChange={setTransporterId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona transportadora" />
              </SelectTrigger>
              <SelectContent>
                {transporters.map((transporter) => (
                  <SelectItem key={transporter.id} value={transporter.id.toString()}>
                    {transporter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracking">Número de Referencia</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ingresa el número de tracking"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Confirmar
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
