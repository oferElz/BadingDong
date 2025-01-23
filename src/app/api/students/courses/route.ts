export const dynamic = 'force-dynamic'

import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { WithId } from "mongodb";

interface Lecture extends WithId<{
  course_id: string;
  type: string;
  students_ids: string[];
}> {}

interface Course extends WithId<{
  id: string;
  name: string;
}> {}

export const GET = async (request: Request) => {
  try {
    // Extract `userId` from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in the request" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Query the `lectures` collection for lectures where the student is enrolled
    const lectures: Lecture[] = await db
      .collection<Lecture>("lectures")
      .find({ students_ids: userId })
      .toArray();

    if (lectures.length === 0) {
      return NextResponse.json([]);
    }

    // Extract unique course IDs from the lectures
    const courseIds = Array.from(
      lectures.reduce((set, lecture) => {
        if (lecture.course_id) set.add(lecture.course_id);
        return set;
      }, new Set<string>())
    );

    // Query the `courses` collection for details of these courses
    const courses: Course[] = await db
      .collection<Course>("courses")
      .find({ id: { $in: courseIds } })
      .toArray();

    // Combine course data with lecture types
    const result = courses.map((course) => {
      const types = lectures
        .filter((lecture) => lecture.course_id === course.id)
        .map((lecture) => lecture.type);
      return {
        id: course.id,
        name: course.name,
        types: Array.from(new Set(types)).join(" | "), // Combine types into a string
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
};
