// src/app/api/lectures/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

// GET endpoint: Retrieves all user data from the database.
export async function GET() {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 

    const usersCollection = db.collection("users");

    // Fetch lectures first
    const users = await usersCollection.find({}).toArray();
    return NextResponse.json(users, { status: 200 });
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
