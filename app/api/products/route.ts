import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let products
    if (status) {
      products = await sql`SELECT * FROM vios.products WHERE status = ${status} ORDER BY created_at DESC`
    } else {
      products = await sql`SELECT * FROM vios.products ORDER BY created_at DESC`
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
