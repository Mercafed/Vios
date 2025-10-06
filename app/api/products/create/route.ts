import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await sql`
      INSERT INTO vios.products (
        name, description, product_url, store_id, category_id,
        status, total_value
      ) VALUES (
        ${body.name}, ${body.description || null}, ${body.productUrl || null},
        ${body.storeId || null}, ${body.categoryId || null}, ${body.status},
        ${body.totalValue || 0}
      ) RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("[v0] Product creation error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
