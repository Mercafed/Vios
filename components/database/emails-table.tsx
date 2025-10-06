"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { EmailFormModal } from "@/components/database/email-form-modal"
import { useToast } from "@/hooks/use-toast"

export function EmailsTable() {
  const { toast } = useToast()
  const [emails, setEmails] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingEmail, setEditingEmail] = useState<any>(null)

  const fetchEmails = async () => {
    const response = await fetch("/api/emails")
    const data = await response.json()
    setEmails(data)
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este email?")) return

    try {
      await fetch(`/api/emails/${id}`, { method: "DELETE" })
      toast({ title: "Email eliminado", description: "El email ha sido eliminado exitosamente" })
      fetchEmails()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el email", variant: "destructive" })
    }
  }

  const filteredEmails = emails.filter((email) => email.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Emails</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Email
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar emails..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No hay emails registrados
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.email}</TableCell>
                    <TableCell>
                      <Badge variant={email.is_available ? "default" : "secondary"}>
                        {email.is_available ? "Disponible" : "En uso"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingEmail(email)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(email.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {showModal && (
        <EmailFormModal
          email={editingEmail}
          onClose={() => {
            setShowModal(false)
            setEditingEmail(null)
          }}
          onSuccess={() => {
            fetchEmails()
            setShowModal(false)
            setEditingEmail(null)
          }}
        />
      )}
    </Card>
  )
}
