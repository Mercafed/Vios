"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { StoresTable } from "@/components/database/stores-table"
import { CardsTable } from "@/components/database/cards-table"
import { EmailsTable } from "@/components/database/emails-table"
import { CategoriesTable } from "@/components/database/categories-table"
import { TransportersTable } from "@/components/database/transporters-table"
import { AddressesTable } from "@/components/database/addresses-table"

export default function BaseDeDatosPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("vios_user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (!parsedUser.isAdmin) {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader balance={balance} userName={user.username} isAdmin={user.isAdmin} />

      <div className="flex flex-1">
        <AppSidebar totalDeposit={balance} transactions={[]} upcomingShipments={[]} />

        <main className="flex-1 overflow-auto">
          <div className="container py-8 px-4 space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Base de Datos</h1>
                <p className="text-muted-foreground">Administra los datos del sistema</p>
              </div>
            </div>

            <Tabs defaultValue="tiendas" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="tiendas">Tiendas</TabsTrigger>
                <TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
                <TabsTrigger value="categorias">Categorías</TabsTrigger>
                <TabsTrigger value="transportadoras">Transportadoras</TabsTrigger>
              </TabsList>

              <TabsContent value="tiendas">
                <StoresTable />
              </TabsContent>

              <TabsContent value="tarjetas">
                <CardsTable />
              </TabsContent>

              <TabsContent value="emails">
                <EmailsTable />
              </TabsContent>

              <TabsContent value="direcciones">
                <AddressesTable />
              </TabsContent>

              <TabsContent value="categorias">
                <CategoriesTable />
              </TabsContent>

              <TabsContent value="transportadoras">
                <TransportersTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
