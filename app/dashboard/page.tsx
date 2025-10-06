"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Database,
  ShoppingBag,
  AlertCircle,
} from "lucide-react"

interface DashboardData {
  balance: number
  income: number
  expenses: number
  orders: number
  transactions: Array<{
    id: number
    type: string
    description: string
    amount: number
    date: string
  }>
  upcomingShipments: Array<{
    id: number
    product: string
    estimatedDate: string
    status: string
  }>
  setupComplete?: boolean
  setupError?: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null)
  const [data, setData] = useState<DashboardData>({
    balance: 0,
    income: 0,
    expenses: 0,
    orders: 0,
    transactions: [],
    upcomingShipments: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("vios_user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Fetch dashboard data
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData({
          balance: data.balance ?? 0,
          income: data.income ?? 0,
          expenses: data.expenses ?? 0,
          orders: data.orders ?? 0,
          transactions: data.transactions ?? [],
          upcomingShipments: data.upcomingShipments ?? [],
          setupComplete: data.setupComplete,
          setupError: data.setupError,
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Failed to fetch dashboard data:", error)
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

  const tiles = [
    {
      title: "Comprar",
      description: "Crear nuevos pedidos",
      icon: ShoppingBag,
      href: "/comprar",
      gradient: "from-primary/20 to-accent/20",
      adminOnly: false,
    },
    {
      title: "Inventario",
      description: "Gestionar productos",
      icon: Package,
      href: "/inventario",
      gradient: "from-blue-500/20 to-cyan-500/20",
      adminOnly: false,
    },
    {
      title: "Base de Datos",
      description: "Administrar datos del sistema",
      icon: Database,
      href: "/base-de-datos",
      gradient: "from-purple-500/20 to-pink-500/20",
      adminOnly: true,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader balance={data.balance} userName={user.username} isAdmin={user.isAdmin} />

      <div className="flex flex-1">
        <AppSidebar
          totalDeposit={data.balance}
          transactions={data.transactions}
          upcomingShipments={data.upcomingShipments}
        />

        <main className="flex-1 overflow-auto">
          <div className="container py-8 px-4 space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-lg">Bienvenido de vuelta, {user.username}</p>
            </div>

            {data.setupError && (
              <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Base de datos no configurada</AlertTitle>
                <AlertDescription>
                  Las tablas de la base de datos no existen. Por favor, ejecuta los scripts SQL desde la configuración
                  del proyecto:
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>scripts/001-create-tables.sql</li>
                    <li>scripts/002-seed-initial-data.sql</li>
                    <li>scripts/003-create-users-table.sql</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/finanzas")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Balance Total</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    ${(data.balance || 0).toLocaleString("es-CO")} COP
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Balance del proyecto</p>
                </CardContent>
              </Card>

              <Card
                className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/finanzas")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">
                    ${(data.income || 0).toLocaleString("es-CO")} COP
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total de ventas</p>
                </CardContent>
              </Card>

              <Card
                className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/finanzas")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gastos</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    ${(data.expenses || 0).toLocaleString("es-CO")} COP
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total de compras</p>
                </CardContent>
              </Card>

              <Card
                className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/inventario")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Órdenes</CardTitle>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-500">{data.orders || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total de órdenes</p>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Status & Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Estado del Inventario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Por Pedir", count: 0, color: "bg-gray-500" },
                    { label: "Pedido", count: 0, color: "bg-yellow-500" },
                    { label: "En Camino", count: 0, color: "bg-blue-500" },
                    { label: "Entregado", count: 0, color: "bg-green-500" },
                  ].map((status) => (
                    <div key={status.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{status.count} ítems</div>
                        <div className="text-xs text-muted-foreground">$0,00</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    No hay órdenes recientes
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Tiles */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Accesos Rápidos</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {tiles
                  .filter((tile) => !tile.adminOnly || user.isAdmin)
                  .map((tile) => (
                    <Card
                      key={tile.title}
                      className={`cursor-pointer border-border/50 bg-gradient-to-br ${tile.gradient} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group`}
                      onClick={() => router.push(tile.href)}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                          <tile.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{tile.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{tile.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
