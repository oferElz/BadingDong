export const dynamic = 'force-dynamic'

// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const db = mongoose.connection.useDb("BA-DINGDONG-DB");

    // Get userId from query params
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch user", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { message: "Failed to fetch user" },
        { status: 500 }
      );
    }
  }
}
