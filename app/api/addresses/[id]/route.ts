import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await sql`
      UPDATE vios.addresses
      SET name = ${body.name},
          address_line = ${body.addressLine},
          city = ${body.city || null},
          state = ${body.state || null},
          postal_code = ${body.postalCode || null},
          country = ${body.country || "Colombia"},
          updated_at = NOW()
      WHERE id = ${params.id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM vios.addresses WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
