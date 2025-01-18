// src/app/(dashboard)/lecturer/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Profile from "@/components/Profile";

export default function LecturerProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      console.log("Attempting password change..."); // Debug log
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      return data.message;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to change password");
    }
  };

  if (!session) return <div>Please log in</div>;
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Failed to load profile</div>;

  return <Profile user={user} onPasswordChange={handlePasswordChange} />;
}
