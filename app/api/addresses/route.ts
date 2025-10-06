import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const addresses = await sql`SELECT * FROM vios.addresses ORDER BY name`
    return NextResponse.json(addresses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO vios.addresses (name, address_line, city, state, postal_code, country)
      VALUES (${body.name}, ${body.addressLine}, ${body.city || null}, ${body.state || null}, ${body.postalCode || null}, ${body.country || "Colombia"})
      RETURNING id
    `
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
