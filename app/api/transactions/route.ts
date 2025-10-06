import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const transactions = await sql`
      SELECT 
        id,
        type,
        description,
        amount,
        created_at,
        TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as date
      FROM vios.transactions
      ORDER BY created_at DESC
    `
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[v0] Transactions API error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
