import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Launch from "@/lib/models/Launch"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const launch = await Launch.findById(params.id)

    if (!launch) {
      return NextResponse.json({ error: "Launch not found" }, { status: 404 })
    }

    return NextResponse.json(launch)
  } catch (error) {
    console.error("Error fetching launch:", error)
    return NextResponse.json({ error: "Failed to fetch launch" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await request.json()

    const launch = await Launch.findByIdAndUpdate(params.id, body, { new: true })

    if (!launch) {
      return NextResponse.json({ error: "Launch not found" }, { status: 404 })
    }

    return NextResponse.json(launch)
  } catch (error) {
    console.error("Error updating launch:", error)
    return NextResponse.json({ error: "Failed to update launch" }, { status: 500 })
  }
}
