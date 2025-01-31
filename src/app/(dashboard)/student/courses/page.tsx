"use client"
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { useSession } from "next-auth/react";

// Type definition for a student related course object
interface Course {
  id: string; // Unique course identifier
  name: string; // Course name
  types: string; // "Class | Tutorial | Lab"
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the courses for the student when the component mounts
  useEffect(() => {
    if (!userId) return;

    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/students/courses?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        // Parse courses JSON data into our Course type array
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  // Show a loading message until the fetch operation is complete
  if (loading) {
    return <p className="p-6 dark:text-dark-text">Loading courses...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500 dark:text-red-400">Error: {error}</p>;
  }

  return (
    <main className="bg-white dark:bg-dark-container text-black dark:text-dark-text p-6 rounded-md m-4">
      <h1 className="text-lg font-semibold mb-4 dark:text-dark-text">All Courses</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card
            key={course.id}
            title={`${course.id} / ${course.name}`}
            description={`Report on: ${course.types}`}
            href={`/student/courses/${course.id}/report`}
          />
        ))}
      </div>
    </main>
  );
}