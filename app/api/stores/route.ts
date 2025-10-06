import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const stores = await sql`SELECT * FROM vios.stores ORDER BY name`
    return NextResponse.json(stores)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO vios.stores (name, url_pattern, drive_folder)
      VALUES (${body.name}, ${body.urlPattern || null}, ${body.driveFolder || null})
      RETURNING id
    `
    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
  }
}
