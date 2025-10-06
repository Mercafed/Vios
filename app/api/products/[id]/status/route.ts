import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, transporterId, trackingNumber, actualArrival } = body

    let query
    if (status === "en_camino") {
      query = sql`
        UPDATE vios.products 
        SET status = ${status}, 
            transporter_id = ${transporterId},
            tracking_number = ${trackingNumber},
            updated_at = NOW()
        WHERE id = ${params.id}
      `
    } else if (status === "entregado") {
      query = sql`
        UPDATE vios.products 
        SET status = ${status}, 
            actual_arrival = ${actualArrival},
            updated_at = NOW()
        WHERE id = ${params.id}
      `
    } else {
      query = sql`
        UPDATE vios.products 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${params.id}
      `
    }

    await query

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Product status update error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
