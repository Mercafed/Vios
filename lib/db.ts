import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getProjectBalance() {
  const result = await sql`SELECT balance FROM vios.project_balance ORDER BY id DESC LIMIT 1`
  return result[0]?.balance || 0
}

export async function getTransactions(limit = 10) {
  const result = await sql`
    SELECT * FROM vios.transactions 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `
  return result
}

export async function getUpcomingShipments() {
  const result = await sql`
    SELECT 
      p.id,
      p.name as product,
      p.estimated_arrival as "estimatedDate",
      p.status
    FROM vios.products p
    WHERE p.status IN ('pedido', 'en_camino')
    ORDER BY p.estimated_arrival ASC
    LIMIT 5
  `
  return result
}

export async function getProductsByStatus(status: string) {
  const result = await sql`
    SELECT * FROM vios.products 
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
  return result
}

export async function getDashboardMetrics() {
  const [balanceResult, incomeResult, expensesResult, ordersResult] = await Promise.all([
    sql`SELECT balance FROM vios.project_balance ORDER BY id DESC LIMIT 1`,
    sql`SELECT COALESCE(SUM(amount), 0) as total FROM vios.transactions WHERE type = 'sale'`,
    sql`SELECT COALESCE(SUM(amount), 0) as total FROM vios.transactions WHERE type = 'purchase'`,
    sql`SELECT COUNT(*) as total FROM vios.products`,
  ])

  return {
    balance: Number(balanceResult[0]?.balance || 0),
    income: Number(incomeResult[0]?.total || 0),
    expenses: Number(expensesResult[0]?.total || 0),
    orders: Number(ordersResult[0]?.total || 0),
  }
}
