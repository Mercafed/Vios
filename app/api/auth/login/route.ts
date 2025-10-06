import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hashPassword, verifyPassword } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("🟢 Datos recibidos en /api/auth/login:", { username, password })

    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña son requeridos" }, { status: 400 })
    }

    // Query user from database
    const users = await sql`
      SELECT id, username, email, password_hash, role, is_active
      FROM vios.users
      WHERE username = ${username}
      LIMIT 1
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    const user = users[0]

    if (!user.is_active) {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 })
    }

    // Verify password
    console.log("Password recibido:", password)
    console.log("Hash esperado:", user.password_hash)

    const isValid = await verifyPassword(password, user.password_hash)

    console.log("¿Coinciden?:", isValid)

    if (!isValid) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin",
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
