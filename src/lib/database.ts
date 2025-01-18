// src/lib/database.ts
import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export async function connectToDB() {
  if (isConnected) {
    return; // If already connected, avoid creating multiple connections
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    // Replace <username>, <password>, and <dbName> with actual values
    // e.g., "mongodb+srv://admin:password@cluster0.mongodb.net/dbName"
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to database:", mongoose.connection.name);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
