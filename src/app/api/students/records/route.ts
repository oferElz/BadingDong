import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Define all possible types of lectures
const ALL_LECTURE_TYPES = ["Class", "Tutorial", "Lab"];
// Define all possible statuses of appeals
const ALL_APPEAL_STATUSES = ["Pending", "Approved", "Rejected"];

export const GET = async (request: Request) => {
  try {
    // Extract `userId` and `courseId` from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId in the request" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Fetch attendance data from the `records` collection
    const attendancePipeline = [
      {
        $match: {
          student_id: userId,
          course_id: courseId,
        },
      },
      {
        $group: {
          _id: "$type", // Group by type (Class, Tutorial, Lab)
          attended: {
            $sum: {
              $cond: [{ $eq: ["$status", "attended"] }, 1, 0],
            },
          },
          missed: {
            $sum: {
              $cond: [{ $eq: ["$status", "missed"] }, 1, 0],
            },
          },
        },
      },
    ];

    const attendanceData = await db
      .collection("records")
      .aggregate(attendancePipeline)
      .toArray();

    // Ensure all lecture types are included with default values
    const attendance = ALL_LECTURE_TYPES.map((type) => {
      const record = attendanceData.find((item) => item._id === type);
      return {
        type,
        attended: record ? record.attended : 0,
        missed: record ? record.missed : 0,
      };
    });

    // Fetch appeals data from the `appeals` collection
    const appealsPipeline = [
      {
        $match: {
          student_id: userId,
          course_id: courseId,
        },
      },
      {
        $group: {
          _id: "$status", // Group by status (Pending, Approved, Declined)
          count: { $sum: 1 },
        },
      },
    ];

    const appealsData = await db
      .collection("appeals")
      .aggregate(appealsPipeline)
      .toArray();

      const appeals = ALL_APPEAL_STATUSES.reduce((acc, status) => {
        const key = status.toLowerCase() as keyof typeof acc; // Explicitly cast to keyof acc
        const record = appealsData.find((item) => item._id === status);
        acc[key] = record ? record.count : 0;
        return acc;
      }, { pending: 0, approved: 0, rejected: 0 }); 
      

    // Format the response
    const response = {
      attendance,
      appeals,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};
