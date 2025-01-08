import { connectToDB } from "@/lib/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Get all users where role is "student"
    const students = await db
      .collection("users")
      .find({
        role: { $regex: /^student$/i }, // case insensitive match for "student"
      })
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
