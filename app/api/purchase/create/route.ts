import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Create product
    const result = await sql`
      INSERT INTO vios.products (
        name, description, product_url, store_id, category_id,
        status, total_value, address_id, estimated_arrival,
        email_id, card_id, requested_by, tracking_number
      ) VALUES (
        ${body.productName}, ${body.description}, ${body.productUrl},
        ${body.storeId}, ${body.categoryId}, 'pedido', ${body.totalValue},
        ${body.addressId}, ${body.estimatedArrival || null},
        ${body.email.id}, ${body.card.id}, ${body.userId}, ${body.reference}
      ) RETURNING id
    `

    // Create transaction
    await sql`
      INSERT INTO vios.transactions (type, amount, description, product_id, user_id)
      VALUES ('purchase', ${body.totalValue}, ${`Compra: ${body.productName}`}, ${result[0].id}, ${body.userId})
    `

    // Update balance
    await sql`
      UPDATE vios.project_balance 
      SET balance = balance - ${body.totalValue}, updated_at = NOW()
    `

    // Mark email as unavailable
    await sql`UPDATE vios.emails SET is_available = false WHERE id = ${body.email.id}`

    return NextResponse.json({ success: true, productId: result[0].id })
  } catch (error) {
    console.error("[v0] Purchase creation error:", error)
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
