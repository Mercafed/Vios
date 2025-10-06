import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const transporters = await sql`SELECT * FROM vios.transporters ORDER BY name`
    return NextResponse.json(transporters)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transporters" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO vios.transporters (name)
      VALUES (${body.name})
      RETURNING id
    `
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transporter" }, { status: 500 })
  }
}
