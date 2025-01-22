import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/database"
import mongoose from "mongoose"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const studentId = url.searchParams.get("studentId")
    if (!studentId) {
      return NextResponse.json({ message: "Missing studentId" }, { status: 400 })
    }
    await connectToDB()
    const db = mongoose.connection.useDb("BA-DINGDONG-DB")
    const recordsCollection = db.collection("records")
    const appealsCollection = db.collection("appeals")

    const missedRecords = await recordsCollection
      .find({ student_id: studentId, status: "missed" })
      .toArray()

    const recordIds = missedRecords.map(r => r._id.toString())
    const existingAppeals = await appealsCollection.find({
      $or: [
        { record_id: { $in: recordIds } },
        { student_record_id: { $in: recordIds } }
      ]
    }).toArray();
    

    const finalData = missedRecords.map(rec => {
      const foundAppeal = existingAppeals.find(a =>
        a.record_id === rec._id.toString()
      )
      return {
        ...rec,
        _id: rec._id.toString(),
        date: rec.date?.toISOString?.() || rec.date,
        isAppealed: !!foundAppeal
      }
    })

    return NextResponse.json(finalData, { status: 200 })
  } catch (error) {
    console.error("GET appeals error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      lecture_date,
      lecture_time,
      lecture_type,
      lecturer,
      record_id,
      appeal_reason,
      student_id
    } = body

    if (!lecture_date || !lecture_time || !lecture_type || !lecturer || !record_id || !appeal_reason) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    await connectToDB()
    const db = mongoose.connection.useDb("BA-DINGDONG-DB")
    const appealsCollection = db.collection("appeals")

    const existing = await appealsCollection.findOne({ record_id })
    if (existing) {
      return NextResponse.json({ message: "Appeal already exists" }, { status: 409 })
    }

    const newAppeal = {
      lecture_date: new Date(lecture_date),
      lecture_time,
      lecture_type,
      lecturer,
      appeal_date: new Date().toISOString().slice(0,10),
      student_id, 
      record_id,
      appeal_reason,
      status: "Pending"
    }

    const result = await appealsCollection.insertOne(newAppeal)
    return NextResponse.json({ ...newAppeal, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("POST appeals error:", error)
    return NextResponse.json({ message: "Failed to create appeal" }, { status: 500 })
  }
}
