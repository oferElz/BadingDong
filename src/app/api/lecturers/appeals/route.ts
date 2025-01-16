import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/database"
import mongoose from "mongoose"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    await connectToDB()
    const db = mongoose.connection.useDb("BA-DINGDONG-DB")
    const appealsCollection = db.collection("appeals")

    // Optionally filter by status (e.g., "pending")
    const query: any = {}
    if (status) query.status = status

    const appeals = await appealsCollection.find(query).toArray()
    return NextResponse.json(appeals, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch appeals" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { _id, status } = body
    if (!_id || !status) {
      return NextResponse.json({ message: "Missing _id or status" }, { status: 400 })
    }
    await connectToDB()
    const db = mongoose.connection.useDb("BA-DINGDONG-DB")
    const appealsCollection = db.collection("appeals")
    await appealsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: { status } }
    )
    return NextResponse.json({ message: "Appeal updated" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to update appeal" }, { status: 500 })
  }
}
