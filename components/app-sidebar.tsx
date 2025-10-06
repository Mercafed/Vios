"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: number
  type: "deposit" | "purchase" | "sale"
  description: string
  amount: number
  date: string
}

interface UpcomingShipment {
  id: number
  product: string
  estimatedDate: string
  status: string
}

interface AppSidebarProps {
  totalDeposit: number
  transactions: Transaction[]
  upcomingShipments: UpcomingShipment[]
}

export function AppSidebar({ totalDeposit, transactions, upcomingShipments }: AppSidebarProps) {
  return (
    <aside className="w-80 border-r border-border/50 bg-sidebar hidden lg:flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Total Deposit Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Depósito Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${totalDeposit.toLocaleString("es-CO")}</div>
              <p className="text-xs text-muted-foreground mt-1">Balance del proyecto</p>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Últimas Transacciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay transacciones recientes</p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          transaction.type === "deposit" && "bg-green-500/10",
                          transaction.type === "purchase" && "bg-red-500/10",
                          transaction.type === "sale" && "bg-blue-500/10",
                        )}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold flex-shrink-0 ml-2",
                        transaction.type === "deposit" && "text-green-500",
                        transaction.type === "purchase" && "text-red-500",
                        transaction.type === "sale" && "text-blue-500",
                      )}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString("es-CO")}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Shipments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Envíos Próximos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingShipments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay envíos próximos</p>
              ) : (
                upcomingShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <p className="text-sm font-medium">{shipment.product}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{shipment.estimatedDate}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {shipment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  )
}
