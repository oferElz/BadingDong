import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const lecturerId = url.searchParams.get("lecturerId");

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const appealsCollection = db.collection("appeals");

    const query: any = {};
    if (status) query.status = status;
    if (lecturerId) query.lecturer = lecturerId;

    const appeals = await appealsCollection.find(query).toArray();

    const mapped = appeals.map((appeal) => {
      if (appeal.lecture_date) {
        const d = new Date(appeal.lecture_date);
        appeal.lecture_date = d.toLocaleDateString("en-GB");
      }
      if (appeal.appeal_date) {
        const d = new Date(appeal.appeal_date);
        appeal.appeal_date = d.toLocaleDateString("en-GB");
      }
      return appeal;
    });

    return NextResponse.json(mapped, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch appeals" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const body = await request.json();
    const { _id, status } = body;
    if (!_id || !status) {
      return NextResponse.json(
        { message: "Missing _id or status" },
        { status: 400 }
      );
    }

    const appealsCollection = db.collection("appeals");
    const recordsCollection = db.collection("records");

    // 1) Fetch the appeal doc
    const appeal = await appealsCollection.findOne({
      _id: new mongoose.Types.ObjectId(_id),
    });
    if (!appeal) {
      return NextResponse.json(
        { message: "Appeal not found" },
        { status: 404 }
      );
    }

    await appealsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: { status } }
    );

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
      );
    }

    return NextResponse.json({ message: "Appeal updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating appeal:", error);
    return NextResponse.json(
      { message: "Failed to update appeal" },
      { status: 500 }
    );
  }
}
