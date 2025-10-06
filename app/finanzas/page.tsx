"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface Transaction {
  id: number
  type: string
  description: string
  amount: number
  date: string
  created_at: string
}

export default function FinanzasPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null)
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("vios_user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    Promise.all([
      fetch("/api/dashboard").then((res) => res.json()),
      fetch("/api/transactions").then((res) => res.json()),
    ]).then(([dashboardData, transactionsData]) => {
      setBalance(dashboardData.balance || 0)
      setIncome(dashboardData.income || 0)
      setExpenses(dashboardData.expenses || 0)
      setTransactions(transactionsData || [])
      setLoading(false)
    })
  }, [router])

  if (!user || loading) {
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
                <h1 className="text-3xl font-bold">Finanzas</h1>
                <p className="text-muted-foreground">Resumen financiero y movimientos</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">${balance.toLocaleString("es-CO")} COP</div>
                  <p className="text-xs text-muted-foreground mt-1">Balance del proyecto</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">${income.toLocaleString("es-CO")} COP</div>
                  <p className="text-xs text-muted-foreground mt-1">Total de ventas</p>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gastos</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">${expenses.toLocaleString("es-CO")} COP</div>
                  <p className="text-xs text-muted-foreground mt-1">Total de compras</p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Todos los Movimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No hay movimientos registrados</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === "sale" ? "bg-green-500/10" : "bg-red-500/10"
                              }`}
                            >
                              {transaction.type === "sale" ? (
                                <TrendingUp className="w-5 h-5 text-green-500" />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              transaction.type === "sale" ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {transaction.type === "sale" ? "+" : "-"}$
                            {Math.abs(transaction.amount).toLocaleString("es-CO")} COP
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
