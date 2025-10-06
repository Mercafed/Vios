"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PurchaseConfirmationProps {
  data: any
  onComplete: (email: any, card: any, reference: string) => void
  onBack: () => void
}

export function PurchaseConfirmation({ data, onComplete, onBack }: PurchaseConfirmationProps) {
  const [emails, setEmails] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [selectedEmail, setSelectedEmail] = useState<string>("")
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [reference, setReference] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/emails?available=true").then((r) => r.json()),
      fetch("/api/cards?active=true").then((r) => r.json()),
    ]).then(([emailsData, cardsData]) => {
      setEmails(emailsData)
      setCards(cardsData)
      if (emailsData.length > 0) setSelectedEmail(emailsData[0].id.toString())
      if (cardsData.length > 0) setSelectedCard(cardsData[0].id.toString())
    })
  }, [])

  const handleComplete = () => {
    const email = emails.find((e) => e.id.toString() === selectedEmail)
    const card = cards.find((c) => c.id.toString() === selectedCard)
    onComplete(email, card, reference)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmación de Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo a Usar</Label>
          <Select value={selectedEmail} onValueChange={setSelectedEmail}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona correo" />
            </SelectTrigger>
            <SelectContent>
              {emails.map((email) => (
                <SelectItem key={email.id} value={email.id.toString()}>
                  {email.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="card">Tarjeta a Usar</Label>
          <Select value={selectedCard} onValueChange={setSelectedCard}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tarjeta" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id.toString()}>
                  **** {card.last_four} - {card.cardholder_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Referencia del Pedido</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ingresa la referencia"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleComplete} disabled={!reference} className="flex-1">
            Pedido Correctamente
          </Button>
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
