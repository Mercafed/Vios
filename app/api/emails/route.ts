import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const available = searchParams.get("available")

    let emails
    if (available === "true") {
      emails = await sql`SELECT * FROM vios.emails WHERE is_available = true ORDER BY email`
    } else {
      emails = await sql`SELECT * FROM vios.emails ORDER BY email`
    }

    return NextResponse.json(emails)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO vios.emails (email, password)
      VALUES (${body.email}, ${body.password})
      RETURNING id
    `
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create email" }, { status: 500 })
  }
}
