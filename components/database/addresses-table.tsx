"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { AddressFormModal } from "@/components/database/address-form-modal"
import { useToast } from "@/hooks/use-toast"

export function AddressesTable() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)

  const fetchAddresses = async () => {
    const response = await fetch("/api/addresses")
    const data = await response.json()
    setAddresses(data)
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return

    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      toast({ title: "Dirección eliminada", description: "La dirección ha sido eliminada exitosamente" })
      fetchAddresses()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la dirección", variant: "destructive" })
    }
  }

  const filteredAddresses = addresses.filter((address) => address.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Direcciones</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Dirección
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar direcciones..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>País</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddresses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay direcciones registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">{address.name}</TableCell>
                    <TableCell>{address.address_line}</TableCell>
                    <TableCell>{address.city || "N/A"}</TableCell>
                    <TableCell>{address.country || "Colombia"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingAddress(address)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(address.id)}>
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
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setShowModal(false)
            setEditingAddress(null)
          }}
          onSuccess={() => {
            fetchAddresses()
            setShowModal(false)
            setEditingAddress(null)
          }}
        />
      )}
    </Card>
  )
}
