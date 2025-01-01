// src/app/api/lectures/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    
    // Get both collections
    const lecturesCollection = db.collection("lectures");
    const usersCollection = db.collection("users");
    
    // Fetch lectures first
    const lectures = await lecturesCollection.find({}).toArray();
    
    // For each lecture, fetch lecturer and student details
    const enrichedLectures = await Promise.all(lectures.map(async (lecture) => {
      // Fetch lecturer details
      const lecturer = await usersCollection.findOne({ id: lecture.lecturer_id });
      
      // Fetch all students details
      const students = await usersCollection.find({
        id: { $in: lecture.students_ids }
      }).toArray();
      
      return {
        ...lecture,
        lecturer_details: lecturer ? {
          id: lecturer.id,
          name: `${lecturer.first_name} ${lecturer.last_name}`
        } : null,
        students_details: students.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`
        }))
      };
    }));

    return NextResponse.json(enrichedLectures, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching lectures:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch lectures", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error fetching lectures:", error);
      return NextResponse.json(
        { message: "Failed to fetch lectures" },
        { status: 500 }
      );
    }
  }
}