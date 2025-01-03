import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

interface Lecturer {
  _id: mongoose.Types.ObjectId;
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  type: string;
}

interface Lecture {
  _id: mongoose.Types.ObjectId;
  course_id: string;
  lecturer_id: string;
}

interface Course {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Get collections
    const usersCollection = db.collection<Lecturer>("users");
    const lecturesCollection = db.collection<Lecture>("lectures");
    const coursesCollection = db.collection<Course>("courses");

    // Fetch lecturers
    const lecturers = await usersCollection.find({ role: "Lecturer" }).toArray();
    if (!lecturers.length) {
      return NextResponse.json({ message: "No lecturers found" }, { status: 404 });
    }

    // Fetch all lectures and courses
    const lectures = await lecturesCollection.find({}).toArray();
    const courses = await coursesCollection.find({}).toArray();

    // Create a map of course IDs to course names
    const courseMap = courses.reduce((map, course) => {
      // Handle both possible ID formats
      const courseId = course.id || course._id.toString();
      if (courseId && course.name) {
        map[courseId] = course.name;
      }
      return map;
    }, {} as Record<string, string>);

    // Construct lecturer objects with error handling
    const lecturersData = lecturers.map((lecturer) => {
      try {
        const assignedLectures = lectures.filter((lecture) => 
          lecture && lecture.lecturer_id === (lecturer.id || lecturer._id.toString())
        );

        const courseIds = Array.from(new Set(
            assignedLectures
              .filter(lec => lec && lec.course_id)
              .map(lec => lec.course_id)
          ));

        const courseNames = courseIds
          .map(id => courseMap[id])
          .filter(name => name); // Remove undefined/null course names

        return {
          _id: lecturer._id.toString(),
          lecturer_id: lecturer.id || lecturer._id.toString(),
          name: `${lecturer.first_name || ''} ${lecturer.last_name || ''}`.trim(),
          username: lecturer.username || '',
          courses: courseNames,
        };
      } catch (error) {
        console.error(`Error processing lecturer ${lecturer._id}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from failed processing

    if (!lecturersData.length) {
      return NextResponse.json(
        { message: "Failed to process lecturers data" },
        { status: 500 }
      );
    }

    return NextResponse.json(lecturersData, { status: 200 });
  } catch (error) {
    console.error("Error fetching lecturers data:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch lecturers data", 
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}