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

    const query: any = {}
    if (status) query.status = status

    const appeals = await appealsCollection.find(query).toArray()
    return NextResponse.json(appeals, { status: 200 })
  } catch {
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
    const recordsCollection = db.collection("records")

    // 1) Fetch the appeal doc
    const appeal = await appealsCollection.findOne({ _id: new mongoose.Types.ObjectId(_id) })
    if (!appeal) {
      return NextResponse.json({ message: "Appeal not found" }, { status: 404 })
    }

    await appealsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: { status } }
    )

    if (status === "Approved") {
      await recordsCollection.updateOne(
        {
          date: new Date(appeal.lecture_date),
          start_time: appeal.lecture_time,
          type: appeal.lecture_type,
          lecturer_id: appeal.lecturer,
          student_id: appeal.student_id,
        },
        { $set: { status: "attended" } }
      )
    }

    return NextResponse.json({ message: "Appeal updated" }, { status: 200 })
  } catch (error) {
    console.error("Error updating appeal:", error)
    return NextResponse.json({ message: "Failed to update appeal" }, { status: 500 })
  }
}
