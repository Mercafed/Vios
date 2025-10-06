"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { TransporterFormModal } from "@/components/database/transporter-form-modal"
import { useToast } from "@/hooks/use-toast"

export function TransportersTable() {
  const { toast } = useToast()
  const [transporters, setTransporters] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingTransporter, setEditingTransporter] = useState<any>(null)

  const fetchTransporters = async () => {
    const response = await fetch("/api/transporters")
    const data = await response.json()
    setTransporters(data)
  }

  useEffect(() => {
    fetchTransporters()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta transportadora?")) return

    try {
      await fetch(`/api/transporters/${id}`, { method: "DELETE" })
      toast({ title: "Transportadora eliminada", description: "La transportadora ha sido eliminada exitosamente" })
      fetchTransporters()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la transportadora", variant: "destructive" })
    }
  }

  const filteredTransporters = transporters.filter((transporter) =>
    transporter.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transportadoras</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Transportadora
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar transportadoras..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransporters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No hay transportadoras registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransporters.map((transporter) => (
                  <TableRow key={transporter.id}>
                    <TableCell className="font-medium">{transporter.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTransporter(transporter)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(transporter.id)}>
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
        <TransporterFormModal
          transporter={editingTransporter}
          onClose={() => {
            setShowModal(false)
            setEditingTransporter(null)
          }}
          onSuccess={() => {
            fetchTransporters()
            setShowModal(false)
            setEditingTransporter(null)
          }}
        />
      )}
    </Card>
  )
}
