import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// GET endpoint: Retrieves attendance records for a specific date, course, and class type.
// Returns an array of students (ID, name, and current attendance status)
export async function GET(request: Request) {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 

    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId");
    const type = url.searchParams.get("type");
    const date = url.searchParams.get("date");

    if (!courseId || !type) {
      return NextResponse.json(
        { message: "Course ID and type are required" },
        { status: 400 }
      );
    }

    // If no date is selected, return empty array
    if (!date) {
      return NextResponse.json([], { status: 200 });
    }

    // First get the lecture data to ensure we have the correct lecture
    const lecturesCollection = db.collection("lectures");
    const lectureData = await lecturesCollection.findOne({
      course_id: courseId,
      type: type,
    });

    if (!lectureData) {
      return NextResponse.json([], { status: 200 });
    }

    const recordsCollection = db.collection("records");
    const attendanceRecords = await recordsCollection
      .find({
        course_id: courseId,
        type: type,
        lecturer_id: lectureData.lecturer_id,
        date: new Date(date),
      })
      .toArray();

    // If no records found for this date, return empty array
    if (attendanceRecords.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Get students who are both in attendance records AND enrolled in this class
    const studentIds = attendanceRecords
      .map((record) => record.student_id)
      .filter((id) => lectureData.students_ids.includes(id));

    const usersCollection = db.collection("users");
    const students = await usersCollection
      .find({
        id: { $in: studentIds },
      })
      .toArray();

    const combinedData = students.map((student) => {
      // Find the attendance record for this student
      const attendanceRecord = attendanceRecords.find(
        (record) => record.student_id === student.id
      );

      return {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        status: attendanceRecord ? attendanceRecord.status : "missed",
      };
    });

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching records:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch records", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error fetching records:", error);
      return NextResponse.json(
        { message: "Failed to fetch records" },
        { status: 500 }
      );
    }
  }
}

// Handle updating attendance status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, type, studentId, date, status } = body;

    if (!courseId || !type || !studentId || !date) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const recordsCollection = db.collection("records");

    // First get the lecture data to get lecturer_id
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

    // Find and update only existing records
    const result = await recordsCollection.updateOne(
      {
        course_id: courseId,
        type: type,
        student_id: studentId,
        lecturer_id: lectureData.lecturer_id,
        date: new Date(date),
      },
      {
        $set: {
          status: status, // Update only the status field
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Attendance updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { message: "Failed to update attendance" },
      { status: 500 }
    );
  }
}
