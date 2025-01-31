import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// Bulk create records
// Creates attendance records for all students in a given lecture on a specified date.
export async function POST(request: Request) {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 

    const body = await request.json();
    const { courseId, type, date } = body;

    if (!courseId || !type || !date) {
      return NextResponse.json(
        { message: "Course ID, type and date are required" },
        { status: 400 }
      );
    }

    // Get lecture data to get student_ids and lecturer_id
    const lecturesCollection = db.collection("lectures");
    const lectureData = await lecturesCollection.findOne({
      course_id: courseId,
      type: type,
    });

    if (!lectureData) {
      return NextResponse.json(
        { message: "Lecture not found" },
        { status: 404 }
      );
    }

    const recordsCollection = db.collection("records");

    // Create records array for bulk operation
    const recordsToCreate = lectureData.students_ids.map(
      (studentId: string) => ({
        course_id: courseId,
        type: type,
        day_of_week: lectureData.day_of_week,
        start_time: lectureData.start_time,
        date: new Date(date),
        lecturer_id: lectureData.lecturer_id,
        student_id: studentId,
        status: "missed",
      })
    );

    // Check for existing records for this date
    const existingRecords = await recordsCollection
      .find({
        course_id: courseId,
        type: type,
        date: new Date(date),
      })
      .toArray();

    // Filter out students who already have records
    const existingStudentIds = existingRecords.map(
      (record) => record.student_id
    );
    const newRecords = recordsToCreate.filter(
      (record: { student_id: any }) =>
        !existingStudentIds.includes(record.student_id)
    );

    if (newRecords.length === 0) {
      return NextResponse.json(
        { message: "Records already exist for all students" },
        { status: 200 }
      );
    }

    // Insert new records
    const result = await recordsCollection.insertMany(newRecords);

    return NextResponse.json(
      {
        message: "Records created successfully",
        created: result.insertedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating records:", error);
    return NextResponse.json(
      { message: "Failed to create records" },
      { status: 500 }
    );
  }
}

// Bulk delete records
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { courseId, type, date } = body;

    if (!courseId || !type || !date) {
      return NextResponse.json(
        { message: "Course ID, type and date are required" },
        { status: 400 }
      );
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    const recordsCollection = db.collection("records");

    // Delete all records for the specified date
    const result = await recordsCollection.deleteMany({
      course_id: courseId,
      type: type,
      date: new Date(date),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No records found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Records deleted successfully",
        deleted: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting records:", error);
    return NextResponse.json(
      { message: "Failed to delete records" },
      { status: 500 }
    );
  }
}
