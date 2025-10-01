import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { walletAddress } = await request.json()

    let user = await User.findOne({ walletAddress })

    if (!user) {
      user = await User.create({ walletAddress })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching/creating user:", error)
    return NextResponse.json({ error: "Failed to fetch/create user" }, { status: 500 })
  }
}
