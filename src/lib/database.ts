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
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds to connect to the database server
      socketTimeoutMS: 45000, // 45 seconds for socket operations
      connectTimeoutMS: 30000, // 30 seconds for the connection timeout
    });
    isConnected = true;
    console.log("Connected to database:", mongoose.connection.name);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
