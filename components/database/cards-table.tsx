"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CardFormModal } from "@/components/database/card-form-modal"
import { useToast } from "@/hooks/use-toast"

export function CardsTable() {
  const { toast } = useToast()
  const [cards, setCards] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCard, setEditingCard] = useState<any>(null)

  const fetchCards = async () => {
    const response = await fetch("/api/cards")
    const data = await response.json()
    setCards(data)
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tarjeta?")) return

    try {
      await fetch(`/api/cards/${id}`, { method: "DELETE" })
      toast({ title: "Tarjeta eliminada", description: "La tarjeta ha sido eliminada exitosamente" })
      fetchCards()
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la tarjeta", variant: "destructive" })
    }
  }

  const filteredCards = cards.filter((card) => card.cardholder_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tarjetas</CardTitle>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tarjeta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Buscar tarjetas..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titular</TableHead>
                <TableHead>Últimos 4 dígitos</TableHead>
                <TableHead>Expiración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay tarjetas registradas
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.cardholder_name}</TableCell>
                    <TableCell>**** {card.last_four}</TableCell>
                    <TableCell>{card.expiration}</TableCell>
                    <TableCell>
                      <Badge variant={card.is_active ? "default" : "secondary"}>
                        {card.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCard(card)
                            setShowModal(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(card.id)}>
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
        <CardFormModal
          card={editingCard}
          onClose={() => {
            setShowModal(false)
            setEditingCard(null)
          }}
          onSuccess={() => {
            fetchCards()
            setShowModal(false)
            setEditingCard(null)
          }}
        />
      )}
    </Card>
  )
}
