import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const [balance, cards, emails, addresses] = await Promise.all([
      sql`SELECT balance FROM vios.project_balance ORDER BY id DESC LIMIT 1`,
      sql`SELECT COUNT(*) as count FROM vios.cards WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM vios.emails WHERE is_available = true`,
      sql`SELECT COUNT(*) as count FROM vios.addresses`,
    ])

    return NextResponse.json({
      balance: Number(balance[0]?.balance || 0),
      missing: {
        cards: Number(cards[0]?.count || 0) === 0,
        emails: Number(emails[0]?.count || 0) === 0,
        addresses: Number(addresses[0]?.count || 0) === 0,
      },
    })
  } catch (error) {
    console.error("[v0] Purchase validation error:", error)
    return NextResponse.json({ error: "Failed to validate" }, { status: 500 })
  }
}
