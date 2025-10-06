import { NextResponse } from "next/server"
import { getDashboardMetrics, getTransactions, getUpcomingShipments } from "@/lib/db"

export async function GET() {
  try {
    const [metrics, transactions, upcomingShipments] = await Promise.all([
      getDashboardMetrics(),
      getTransactions(10),
      getUpcomingShipments(),
    ])

    return NextResponse.json({
      ...metrics,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        description: t.description,
        amount: Number(t.amount),
        date: new Date(t.created_at).toLocaleDateString("es-CO"),
      })),
      upcomingShipments: upcomingShipments.map((s) => ({
        id: s.id,
        product: s.product,
        estimatedDate: s.estimatedDate ? new Date(s.estimatedDate).toLocaleDateString("es-CO") : "Por definir",
        status: s.status === "pedido" ? "Pedido" : "En Camino",
      })),
      setupComplete: true,
    })
  } catch (error: any) {
    console.error("[v0] Dashboard API error:", error)

    const isSetupError = error?.message?.includes("does not exist") || error?.code === "42P01"

    return NextResponse.json({
      balance: 0,
      income: 0,
      expenses: 0,
      orders: 0,
      transactions: [],
      upcomingShipments: [],
      setupComplete: !isSetupError,
      setupError: isSetupError,
    })
  }
}
