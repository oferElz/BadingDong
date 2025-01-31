import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// GET endpoint: Retrieves all courses from the "courses" collection.
export async function GET() {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 
    const coursesCollection = db.collection("courses");

    const courses = await coursesCollection.find({}).toArray();
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST endpoint: Creates a new course.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.id) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      );
    }

    // Connect and select the appropriate database/collection.
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const coursesCollection = db.collection("courses");
    const result = await coursesCollection.insertOne(body);

    const createdCourse = { _id: result.insertedId, ...body };
    return NextResponse.json(createdCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to create course", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT endpoint: Updates an existing course and also updates any related lectures.
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { _id, id: newCourseId, ...updateData } = body;

    if (!_id || !newCourseId) {
      return NextResponse.json({ message: "Missing _id or id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const coursesCollection = db.collection("courses");
    const lecturesCollection = db.collection("lectures");

    const course = await coursesCollection.findOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const oldCourseId = course.id;

    await coursesCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: { id: newCourseId, ...updateData } }
    );

    await lecturesCollection.updateMany(
      { course_id: oldCourseId },
      { $set: { course_id: newCourseId } }
    );

    return NextResponse.json({ message: "Course and lectures updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to update course", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE endpoint: Deletes a course and any lectures associated with that course.
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const coursesCollection = db.collection("courses");
    const lecturesCollection = db.collection("lectures");

    const course = await coursesCollection.findOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const courseId = course.id;

    await coursesCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    await lecturesCollection.deleteMany({ course_id: courseId });

    return NextResponse.json({ message: "Course and related lectures deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Failed to delete course", error: errorMessage },
      { status: 500 }
    );
  }
}
