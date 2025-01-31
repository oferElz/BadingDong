import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// GET endpoint: Retrieves all missed attendance records for a given student
// along with information on whether an appeal has already been submitted.
export async function GET(request: Request) {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 
    const recordsCollection = db.collection("records");
    const appealsCollection = db.collection("appeals");

    const url = new URL(request.url);
    const studentId = url.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json(
        { message: "Missing studentId" },
        { status: 400 }
      );
    }

    const missedRecords = await recordsCollection
      .find({ student_id: studentId, status: "missed" })
      .toArray();

    const recordIds = missedRecords.map((r) => r._id.toString());
    const existingAppeals = await appealsCollection
      .find({
        $or: [
          { record_id: { $in: recordIds } },
          { student_record_id: { $in: recordIds } },
        ],
      })
      .toArray();

    const finalData = missedRecords.map((rec) => {
      const foundAppeal = existingAppeals.find(
        (a) => a.record_id === rec._id.toString()
      );
      return {
        ...rec,
        _id: rec._id.toString(),
        date: new Date(rec.date).toLocaleDateString("en-GB"),
        isAppealed: !!foundAppeal,
      };
    });

    return NextResponse.json(finalData, { status: 200 });
  } catch (error) {
    console.error("GET appeals error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST endpoint: Creates a new appeal record for a missed attendance.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lecture_date,
      lecture_time,
      lecture_type,
      lecturer,
      record_id,
      appeal_reason,
      student_id,
    } = body;

    if (
      !lecture_date ||
      !lecture_time ||
      !lecture_type ||
      !lecturer ||
      !record_id ||
      !appeal_reason
    ) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const appealsCollection = db.collection("appeals");

    // Ensure no existing appeal for this record
    const existing = await appealsCollection.findOne({ record_id });
    if (existing) {
      return NextResponse.json(
        { message: "Appeal already exists" },
        { status: 409 }
      );
    }

    // Convert lecture date from DD/MM/YYYY to a Date object
    const [day, month, year] = lecture_date.split("/");
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

    // Construct the appeal document
    const newAppeal = {
      lecture_date: parsedDate,
      lecture_time,
      lecture_type,
      lecturer,
      appeal_date: new Date().toISOString().slice(0, 10),
      student_id,
      record_id,
      appeal_reason,
      status: "Pending",
    };

    const result = await appealsCollection.insertOne(newAppeal);
    return NextResponse.json(
      { ...newAppeal, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST appeals error:", error);
    return NextResponse.json(
      { message: "Failed to create appeal" },
      { status: 500 }
    );
  }
}
