"use client"; // Required for handling client-side logic

import { useState } from "react";
import { useRouter } from "next/navigation";
let role = "";
let userId = "";
const Homepage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Fetch the users from the /api/users endpoint
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();

      // Check if username and password match any user
      const foundUser = users.find(
        (user: any) => user.username === username && user.password === password
      );

      if (foundUser) {
        // Redirect to /<role>, e.g., /Student, /Teacher, /Admin, etc.
        role = foundUser.role;
        userId = foundUser.id;
        router.push(`/${foundUser.role}`);
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-orange-200 to-red-100">
      <div className="w-full max-w-sm p-6 bg-gray-100 rounded shadow-md border-2 border-gray-300">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Homepage;
export { role };
export { userId };
