"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { StoreFormModal } from "@/components/database/store-form-modal"
import { useToast } from "@/hooks/use-toast"

export function StoresTable() {
  const { toast } = useToast()
  const [stores, setStores] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState<any>(null)

  const fetchStores = async () => {
    const response = await fetch("/api/stores")
    const data = await response.json()
    setStores(data)
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tienda?")) return

    try {
      await fetch(`/api/stores/${id}`, { method: "DELETE" })
      toast({ title: "Tienda eliminada", description: "La tienda ha sido eliminada exitosamente" })
      fetchStores()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la tienda", variant: "destructive" })
    }
  }

  const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tiendas</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tienda
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar tiendas..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Patrón URL</TableHead>
                <TableHead>Carpeta Drive</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay tiendas registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.url_pattern || "N/A"}</TableCell>
                    <TableCell>{store.drive_folder || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingStore(store)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(store.id)}>
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
        <StoreFormModal
          store={editingStore}
          onClose={() => {
            setShowModal(false)
            setEditingStore(null)
          }}
          onSuccess={() => {
            fetchStores()
            setShowModal(false)
            setEditingStore(null)
          }}
        />
      )}
    </Card>
  )
}
