"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CategoryFormModal } from "@/components/database/category-form-modal"
import { useToast } from "@/hooks/use-toast"

export function CategoriesTable() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const fetchCategories = async () => {
    const response = await fetch("/api/categories")
    const data = await response.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      toast({ title: "Categoría eliminada", description: "La categoría ha sido eliminada exitosamente" })
      fetchCategories()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la categoría", variant: "destructive" })
    }
  }

  const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categorías</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Categoría
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar categorías..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No hay categorías registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCategory(category)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)}>
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
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false)
            setEditingCategory(null)
          }}
          onSuccess={() => {
            fetchCategories()
            setShowModal(false)
            setEditingCategory(null)
          }}
        />
      )}
    </Card>
  )
}
