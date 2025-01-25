// src/app/api/profile/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const client = mongoose.connection.getClient();
    const db = client.db("BA-DINGDONG-DB"); 

    const { userId, oldPassword, newPassword } = await request.json();

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");

    // First verify old password
    const user = await usersCollection.findOne({
      id: userId,
      password: oldPassword,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid current password" },
        { status: 400 }
      );
    }

    // Update password
    await usersCollection.updateOne(
      { id: userId },
      { $set: { password: newPassword } }
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error changing password:", error.message);
      return NextResponse.json(
        { message: "Failed to change password", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error changing password:", error);
      return NextResponse.json(
        { message: "Failed to change password" },
        { status: 500 }
      );
    }
  }
}
