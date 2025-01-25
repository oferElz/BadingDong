import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");
    const url = new URL(request.url);
    const lecturerId = url.searchParams.get("lecturerId");

    if (!lecturerId) {
      return NextResponse.json(
        { message: "Lecturer ID is required" },
        { status: 400 }
      );
    }

    const lecturesCollection = db.collection("lectures");

    const lecturerCourses = await lecturesCollection
      .find({ lecturer_id: lecturerId.toString() })
      .toArray();

    if (lecturerCourses.length === 0) {
      return NextResponse.json(
        { message: "No courses found for this lecturer" },
        { status: 200 }
      );
    }

    const courseIds = lecturerCourses
      .map((lc) => lc.course_id)
      .filter((value, index, self) => self.indexOf(value) === index);

    const coursesCollection = db.collection("courses");
    // Log the query we're about to make

    const coursesDetails = await coursesCollection
      .find({ id: { $in: courseIds } })
      .toArray();

    const combinedData = courseIds.map((courseId) => {
      const courseDetails = coursesDetails.find((c) => c.id === courseId);

      const courseClasses = lecturerCourses
        .filter((lc) => lc.course_id === courseId)
        .map((lc) => ({
          type: lc.type,
          day_of_week: lc.day_of_week,
          start_time: lc.start_time,
          end_time: lc.end_time,
          student_ids: lc.students_ids,
        }));

      return {
        courseId,
        courseName: courseDetails?.name || "Unknown Course",
        classes: courseClasses,
      };
    });

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error("Error in API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to fetch courses", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to fetch courses" },
        { status: 500 }
      );
    }
  }
}
