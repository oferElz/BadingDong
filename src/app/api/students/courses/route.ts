export const dynamic = "force-dynamic";

import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    // Extract `userId` from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in the request" },
        { status: 400 }
      );
    }

    // 1) Query the lectures collection where the user is enrolled
    const lecturesCollection = db.collection("lectures");
    const lectures = await lecturesCollection
      .find({ students_ids: userId })
      .toArray();

    // If no lectures found for this user, we can return an empty array
    if (!lectures.length) {
      return NextResponse.json([]);
    }

    // 2) Extract unique course_ids
    const uniqueCourseIds = new Set(
      lectures.map((lecture) => lecture.course_id).filter(Boolean)
    );
    const courseIds = Array.from(uniqueCourseIds);

    // 3) Query the courses collection for these courseIds
    const coursesCollection = db.collection("courses");
    const courses = await coursesCollection
      .find({ id: { $in: courseIds } })
      .toArray();

    // 4) Build a result array by combining each course with the lecture "type" values
    const result = courses.map((course) => {
      // Find all lectures for this course
      const courseLectures = lectures.filter(
        (lecture) => lecture.course_id === course.id
      );

      // Extract distinct "type" values for these lectures
      const uniqueTypes = new Set(courseLectures.map((lec) => lec.type));
      const types = Array.from(uniqueTypes);

      return {
        id: course.id,
        name: course.name,
        types: types.join(" | "),
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
};
