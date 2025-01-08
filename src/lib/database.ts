// src/lib/database.ts
import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export async function connectToDB() {
  if (isConnected) {
    return; // If already connected, avoid creating multiple connections
  }

  try {
    // Replace <username>, <password>, and <dbName> with actual values
    // e.g., "mongodb+srv://admin:password@cluster0.mongodb.net/dbName"
    await mongoose.connect("mongodb+srv://Admin:Aa123456@ba-dingdong-cluster.czez0.mongodb.net/?retryWrites=true&w=majority&appName=BA-DINGDONG-Cluster");
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
