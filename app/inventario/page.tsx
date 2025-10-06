"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function InventarioPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("vios_user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

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
                <h1 className="text-3xl font-bold">Inventario</h1>
                <p className="text-muted-foreground">Gestiona el estado de tus productos</p>
              </div>
            </div>

            <KanbanBoard />
          </div>
        </main>
      </div>
    </div>
  )
}
