"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface EmailFormModalProps {
  email?: any
  onClose: () => void
  onSuccess: () => void
}

export function EmailFormModal({ email, onClose, onSuccess }: EmailFormModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: email?.email || "",
    password: email?.password || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = email ? `/api/emails/${email.id}` : "/api/emails"
      const method = email ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      toast({
        title: email ? "Email actualizado" : "Email creado",
        description: `El email ha sido ${email ? "actualizado" : "creado"} exitosamente`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el email",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{email ? "Editar Email" : "Nuevo Email"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {email ? "Actualizar" : "Crear"}
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
