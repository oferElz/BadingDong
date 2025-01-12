"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // We'll handle redirect ourselves
      });

      if (result?.error) {
        alert("Invalid username or password");
      } else {
        // Get the session data
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session?.user?.role) {
          router.push(`/${session.user.role.toLowerCase()}`);
        }
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
