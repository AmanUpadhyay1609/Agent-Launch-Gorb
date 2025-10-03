import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Launch from "@/lib/models/Launch"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get("creator")

    const query = creator ? { creatorWallet: creator } : {}
    const launches = await Launch.find(query).sort({ createdAt: -1 })

    return NextResponse.json(launches)
  } catch (error) {
    console.error("Error fetching launches:", error)
    return NextResponse.json({ error: "Failed to fetch launches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    // console.log("[API] Received launch data:", body)
    console.log("[API] TokenUri field:", body.tokenUri)

    const launch = await Launch.create(body)
    // console.log("[API] Created launch:", launch)
    return NextResponse.json(launch, { status: 201 })
  } catch (error) {
    console.error("Error creating launch:", error)
    return NextResponse.json({ error: "Failed to create launch" }, { status: 500 })
  }
}
