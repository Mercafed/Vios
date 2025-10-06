"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { PurchaseForm } from "@/components/purchase-form"
import { PurchaseInvoice } from "@/components/purchase-invoice"
import { PurchaseConfirmation } from "@/components/purchase-confirmation"

type PurchaseStep = "validation" | "question" | "form" | "invoice" | "confirmation" | "success"

interface MissingResources {
  cards: boolean
  emails: boolean
  addresses: boolean
}

export default function ComprarPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null)
  const [balance, setBalance] = useState(0)
  const [step, setStep] = useState<PurchaseStep>("validation")
  const [missingResources, setMissingResources] = useState<MissingResources>({
    cards: false,
    emails: false,
    addresses: false,
  })
  const [useExistingItem, setUseExistingItem] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("vios_user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Validate resources
    fetch("/api/purchase/validate")
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance)
        setMissingResources(data.missing)
        if (data.missing.cards || data.missing.emails || data.missing.addresses) {
          setStep("validation")
        } else {
          setStep("question")
        }
      })
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasMissingResources = missingResources.cards || missingResources.emails || missingResources.addresses

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader balance={balance} userName={user.username} isAdmin={user.isAdmin} />

      <div className="flex flex-1">
        <AppSidebar totalDeposit={balance} transactions={[]} upcomingShipments={[]} />

        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8 px-4 space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Crear Pedido</h1>
                <p className="text-muted-foreground">Gestiona tus compras y pedidos</p>
              </div>
            </div>

            {/* Validation Step */}
            {step === "validation" && hasMissingResources && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Faltan recursos esenciales para crear un pedido:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {missingResources.cards && <li>No hay tarjetas registradas</li>}
                      {missingResources.emails && <li>No hay correos disponibles</li>}
                      {missingResources.addresses && <li>No hay direcciones registradas</li>}
                    </ul>
                    <Button onClick={() => router.push("/base-de-datos")} className="mt-4">
                      Ir a Base de Datos
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Question Step */}
            {step === "question" && (
              <Card>
                <CardHeader>
                  <CardTitle>¿Deseas pedir un artículo de la lista "Por Pedir"?</CardTitle>
                  <CardDescription>Selecciona si quieres usar un item existente o crear uno nuevo</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button
                    onClick={() => {
                      setUseExistingItem(true)
                      setStep("form")
                    }}
                    className="flex-1"
                  >
                    Sí, usar item existente
                  </Button>
                  <Button
                    onClick={() => {
                      setUseExistingItem(false)
                      setStep("form")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    No, crear nuevo
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Form Step */}
            {step === "form" && (
              <PurchaseForm
                useExistingItem={useExistingItem}
                balance={balance}
                onSubmit={(data) => {
                  setFormData(data)
                  setStep("invoice")
                }}
                onCancel={() => setStep("question")}
              />
            )}

            {/* Invoice Step */}
            {step === "invoice" && formData && (
              <PurchaseInvoice
                data={formData}
                onConfirm={() => setStep("confirmation")}
                onBack={() => setStep("form")}
              />
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && formData && (
              <PurchaseConfirmation
                data={formData}
                onComplete={(email, card, reference) => {
                  setSelectedEmail(email)
                  setSelectedCard(card)
                  // Save to database
                  fetch("/api/purchase/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, email, card, reference, userId: user.username }),
                  }).then(() => {
                    setStep("success")
                  })
                }}
                onBack={() => setStep("invoice")}
              />
            )}

            {/* Success Step */}
            {step === "success" && (
              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-green-500">¡Pedido creado exitosamente!</CardTitle>
                  <CardDescription>Tu pedido ha sido registrado en el sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={() => router.push("/inventario")}>Ver en Inventario</Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>
                      Volver al Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
