import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await sql`
      UPDATE vios.cards 
      SET cardholder_name = ${body.cardholderName},
          last_four = ${body.lastFour},
          expiration = ${body.expiration},
          is_active = ${body.isActive},
          updated_at = NOW()
      WHERE id = ${params.id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM vios.cards WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 })
  }
}
