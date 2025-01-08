import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    const lecturesCollection = db.collection("lectures");
    const usersCollection = db.collection("users");

    const lectures = await lecturesCollection.find({}).toArray();

    const enrichedLectures = await Promise.all(
      lectures.map(async (lecture) => {
        const lecturer = await usersCollection.findOne({
          id: lecture.lecturer_id,
        });

        const students = await usersCollection
          .find({ id: { $in: lecture.students_ids } })
          .toArray();

        return {
          ...lecture,
          lecturer_details: lecturer
            ? {
                id: lecturer.id,
                name: `${lecturer.first_name} ${lecturer.last_name}`,
              }
            : null,
          students_details: students.map((student) => ({
            id: student.id,
            name: `${student.first_name} ${student.last_name}`,
          })),
        };
      })
    );

    return NextResponse.json(enrichedLectures, { status: 200 });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return NextResponse.json(
      { message: "Failed to fetch lectures" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { course_id, type, day_of_week, start_time, end_time, lecturer_id, students_ids } = body;

    if (!course_id || !type || !day_of_week || !start_time || !end_time || !lecturer_id) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const lecturesCollection = db.collection("lectures");

    const result = await lecturesCollection.insertOne({
      course_id,
      type,
      day_of_week,
      start_time,
      end_time,
      lecturer_id,
      students_ids: students_ids || [],
    });

    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return NextResponse.json(
      { message: "Failed to create lecture" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { _id, course_id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
    }

    // Prevent updating course_id
    delete updateData.course_id;

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const lecturesCollection = db.collection("lectures");

    const result = await lecturesCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating lecture:", error);
    return NextResponse.json(
      { message: "Failed to update lecture" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const lecturesCollection = db.collection("lectures");

    const result = await lecturesCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return NextResponse.json(
      { message: "Failed to delete lecture" },
      { status: 500 }
    );
  }
}
