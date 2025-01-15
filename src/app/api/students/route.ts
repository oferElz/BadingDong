import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    const students = await db
      .collection("users")
      .find({ role: { $regex: /^student$/i } }) // Match role as "student"
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    const { id, first_name, last_name, username, password } = body;

    if (!id || !first_name || !last_name || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    const result = await db.collection("users").insertOne({
      id,
      first_name,
      last_name,
      username,
      password,
      role: "student",
    });

    const createdStudent = { _id: result.insertedId, ...body, role: "student" };

    return NextResponse.json(createdStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id" },
        { status: 400 }
      );
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Ensure the student exists
    const student = await db.collection("users").findOne({
      _id: new mongoose.Types.ObjectId(_id),
      role: { $regex: /^student$/i },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Update student details
    await db.collection("users").updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: updateData } // Do not modify `_id` or `id`
    );

    return NextResponse.json(
      { message: "Student updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    const student = await db.collection("users").findOne({
      _id: new mongoose.Types.ObjectId(_id),
      role: { $regex: /^student$/i },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    await db.collection("users").deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
};
