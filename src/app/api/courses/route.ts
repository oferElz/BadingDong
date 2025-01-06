import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
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

export async function POST(request: Request) {
    try {
      const body = await request.json();
      if (!body.name || !body.id) {
        return NextResponse.json(
          { message: "Invalid input" },
          { status: 400 }
        );
      }
  
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
  

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const coursesCollection = db.collection("courses");

    const result = await coursesCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json(result, { status: 200 });
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

    const result = await coursesCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    return NextResponse.json(result, { status: 200 });
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
