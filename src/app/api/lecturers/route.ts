import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// GET - Fetch all lecturers
export async function GET() {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 

    const lecturers = await db.collection("users").find({ role: "lecturer" }).toArray();
    const lectures = await db.collection("lectures").find({}).toArray();
    const courses = await db.collection("courses").find({}).toArray();

    const lecturersWithCourses = lecturers.map((lecturer) => {
      const lecturerLectures = lectures.filter((lecture) => lecture.lecturer_id === lecturer.id);
      const courseIds = lecturerLectures.map((lecture) => lecture.course_id);
      const lecturerCourses = courses.filter((course) => courseIds.includes(course.id)).map((course) => course.name);

      return {
        _id: lecturer._id,
        id: lecturer.id,
        first_name: lecturer.first_name,
        last_name: lecturer.last_name,
        username: lecturer.username,
        courses: lecturerCourses,
      };
    });

    return NextResponse.json(lecturersWithCourses, { status: 200 });
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json({ message: "Failed to fetch lecturers" }, { status: 500 });
  }
}

// PUT - Create a new lecturer
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, first_name, last_name, username, password } = body;

    if (!id || !first_name || !last_name || !username || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 
    const usersCollection = db.collection("users");

    const result = await usersCollection.insertOne({
      id,
      first_name,
      last_name,
      username,
      password, // Save password for new lecturers
      role: "lecturer",
    });

    return NextResponse.json({ message: "Lecturer created successfully", _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    return NextResponse.json({ message: "Failed to create lecturer" }, { status: 500 });
  }
}


// POST - Update an existing lecturer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { _id, password, ...updateData } = body;

    if (!_id || !updateData.id || !updateData.first_name || !updateData.last_name || !updateData.username) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: updateData } // Exclude password from updates
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Lecturer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lecturer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating lecturer:", error);
    return NextResponse.json({ message: "Failed to update lecturer" }, { status: 500 });
  }
}


// DELETE - Remove a lecturer
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
    }

    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const usersCollection = db.collection("users");
    const lecturesCollection = db.collection("lectures");

    const lecturer = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(_id) });
    if (!lecturer) {
      return NextResponse.json({ message: "Lecturer not found" }, { status: 404 });
    }

    const lecturerId = lecturer.id;

    // Delete lecturer
    await usersCollection.deleteOne({ _id: new mongoose.Types.ObjectId(_id) });

    // Remove associated lectures
    await lecturesCollection.deleteMany({ lecturer_id: lecturerId });

    return NextResponse.json({ message: "Lecturer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    return NextResponse.json({ message: "Failed to delete lecturer" }, { status: 500 });
  }
}
