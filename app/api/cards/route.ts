import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")

    let cards
    if (active === "true") {
      cards = await sql`SELECT * FROM vios.cards WHERE is_active = true ORDER BY cardholder_name`
    } else {
      cards = await sql`SELECT * FROM vios.cards ORDER BY cardholder_name`
    }

    return NextResponse.json(cards)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO vios.cards (cardholder_name, last_four, expiration, is_active)
      VALUES (${body.cardholderName}, ${body.lastFour}, ${body.expiration}, ${body.isActive})
      RETURNING id
    `
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 })
  }
}
