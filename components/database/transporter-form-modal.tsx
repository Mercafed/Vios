"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface TransporterFormModalProps {
  transporter?: any
  onClose: () => void
  onSuccess: () => void
}

export function TransporterFormModal({ transporter, onClose, onSuccess }: TransporterFormModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState(transporter?.name || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = transporter ? `/api/transporters/${transporter.id}` : "/api/transporters"
      const method = transporter ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      toast({
        title: transporter ? "Transportadora actualizada" : "Transportadora creada",
        description: `La transportadora ha sido ${transporter ? "actualizada" : "creada"} exitosamente`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la transportadora",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transporter ? "Editar Transportadora" : "Nueva Transportadora"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {transporter ? "Actualizar" : "Crear"}
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
